<style scoped lang="scss">
.main-body {
  display: flex;
  height: 100vh;
}

.side {
  width: 300px;
  // background: #eee;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ddd;
}

.component-wrap {
  flex: 4;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .component-list {
    height: 100%;
    overflow: auto;
    border: 1px solid #eee;

    .component-item {
      font-size: 14px;
      padding: 10px 15px;
      border-bottom: 1px solid #eee;
    }
  }
}

.tree-wrap {
  flex: 3;
  display: flex;
  flex-direction: column;
  .title {
    font-size: 14px;
    padding: 10px;
  }

  .tree {
    height: 100%;
    flex: 1;
    background: transparent;
    overflow: hidden;
  }
}

.my-tab {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  /deep/ .el-tabs__header {
    margin-bottom: -1px;
  }

  /deep/ .el-tabs__content {
    height: 100%;
  }

  /deep/ .el-tab-pane {
    height: 100%;
  }

  /deep/ .el-tabs__item {
    height: 30px;
    line-height: 30px;
  }
}

.main {
  flex: 1;
  // padding: 30px 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.viewer {
  width: 275px;
  height: 667px;
  border: 1px solid #d6d6d6;
}

.right {
  width: 300px;
  // background: #eee;
  border-left: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.css-js-wrap {
  width: 400px;
  border-left: 1px solid #eee;
}

.box {
  margin: 0;
  padding: 20px 10px;
  list-style: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;

  & > div {
    overflow: hidden;
    min-height: 40px;
    border: 1px solid #f44;
  }
}

.active {
  outline: 1px solid #f00;
}

.attr-item {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  .attr-label {
    width: 70px;
  }
  .attr-value {
    flex: 1;

    > * {
      width: 100%;
    }
  }
}

.class-input {
  /deep/ .el-input__suffix {
    display: none;
  }
}
.templatecode-input {
  font-size: 12px;
  height: 100%;
  /deep/ textarea {
    height: 100%;
    overflow: auto;
  }
}

.node-class-name{
  color: #999;
  font-size: 12px;
}

</style>
<style lang="scss">
.class-input-popper {
  display: none !important;
}

.has-placeholder{
  // background: #aaaaaa25;
  // text-align: center;
}

.component-placeholder {
  color: #ddd;
  display: inline-block;
  pointer-events: none;
}
</style>

<template>
  <div class="c-container">
    <div>

    </div>
    <div class="main-body">
      <div class="side">
        <div class="component-wrap">
          <!-- <h2>组件</h2> -->
          <el-tabs class="my-tab" v-model="componentTabName" type="card">
            <el-tab-pane label="原生" name="native">
              <Draggable
                v-model="nativeComponents"
                :options="{sortable:false,groupName:'side', moveGroupNames:['tree'], cloneTo:handleCloneTo}"
              >
                <div class="component-list">
                  <div
                    v-for="(component,index) in nativeComponents"
                    :key="index"
                    class="component-item"
                    @dblclick="handleComponentDblclick(component)"
                  >
                    <div class="name">{{component.displayName}}</div>
                  </div>
                </div>
              </Draggable>
            </el-tab-pane>
            <el-tab-pane label="Element" name="elementui">
              <Draggable
                v-model="components"
                :options="{sortable:false,groupName:'side', moveGroupNames:['tree'], cloneTo:handleCloneTo}"
              >
                <div class="component-list">
                  <div v-for="(component,index) in components" :key="index" class="component-item">
                    <div class="name">{{component.displayName}}</div>
                  </div>
                </div>
              </Draggable>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="tree-wrap">
          <el-tabs class="my-tab" v-model="treeTabName" type="card">
            <el-tab-pane label="Tree" name="tree">
              <!-- <el-tree
                class="tree"
                :data="selectedComponents"
                :props="{
                  children: 'children',
                  label: 'componentName'
                }"
                node-key="id"
                draggable
              ></el-tree> -->
              <Tree v-model="selectedComponents" :nodeClass="nodeClass" @node-click="handleTreeNodeClick">
                <div slot-scope="{node}">{{node.componentName}} <span class="node-class-name">{{node.class | className}}</span> </div>
              </Tree>
            </el-tab-pane>
            <el-tab-pane label="Template" name="template">
              <el-input type="textarea" v-model="templateCode" size="mini" :rows="20" readonly></el-input>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div class="main">
        <Draggable
          v-model="selectedComponents"
          :options="{groupName:'main'}"
        >
          <div id="div1" class="viewer">
            <Item v-for="component in selectedComponents" :key="component.id" :component="component">
            </Item>
          </div>
        </Draggable>
      </div>

      <div class="right">
        <Split style="flex:1" :direction="'vertical'">
          <SplitArea :size="75">
            <h2>Inspect</h2>
            <div v-if="activeComponent">
              <div class="style-wrap">
                <h3>Style</h3>
                <div class="attr-item">
                  <div class="attr-label">width:</div>
                  <div class="attr-value">
                    <el-input size="mini" v-model="activeComponent.style.width" />
                  </div>
                </div>
                <div class="attr-item">
                  <div class="attr-label">height:</div>
                  <div class="attr-value">
                    <el-input size="mini" v-model="activeComponent.style.height" />
                  </div>
                </div>
                <div class="attr-item">
                  <div class="attr-label">padding:</div>
                  <div class="attr-value">
                    <el-input size="mini" v-model="activeComponent.style.padding" />
                  </div>
                </div>
                <div class="attr-item">
                  <div class="attr-label">margin:</div>
                  <div class="attr-value">
                    <el-input size="mini" v-model="activeComponent.style.margin" />
                  </div>
                </div>
                <div class="attr-item">
                  <div class="attr-label">color:</div>
                  <div class="attr-value">
                    <el-color-picker v-model="activeComponent.style.color"></el-color-picker>
                  </div>
                </div>
                <div class="attr-item">
                  <div class="attr-label">background:</div>
                  <div class="attr-value">
                    <el-color-picker v-model="activeComponent.style.background"></el-color-picker>
                  </div>
                </div>
              </div>
              <div class="class-wrap">
                <h3>Class</h3>
                <div>
                  <div class="attr-item">
                    <div class="attr-label">class:</div>
                    <div class="attr-value">
                      <el-select
                        class="class-input"
                        v-model="activeComponent.class"
                        multiple
                        allow-create
                        popper-class="class-input-popper"
                        placeholder
                        default-first-option
                        filterable
                      ></el-select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="props-wrap">
                <h3>Props</h3>
                
                <!-- <div class="attr-item">
                  <div class="attr-label">width:</div>
                  <div class="attr-value">
                    <el-input size="mini" v-model="activeComponent.style.width"/>
                  </div>
                </div>-->
              </div>
            </div>
          </SplitArea>
          <SplitArea :size="25">
            <iframe v-if="iframeVisible" style="height:100%" src="http://localhost:9000" frameborder="0"></iframe>
          </SplitArea>
        </Split>
      </div>

      <div class="css-js-wrap">
        <el-tabs style="height:100%;" class="my-tab" v-model="cssTabName" type="card">
          <el-tab-pane label="CSS" name="css">
            <!-- <c-code-editor mode="sass" v-model="cssCode" style="height:100%;"></c-code-editor>
             -->

             <el-input type="textarea" v-model="cssCode" :rows="20"></el-input>
          </el-tab-pane>
          <el-tab-pane label="JS" name="js">
            <el-input type="textarea" v-model="jsCode" :rows="20"></el-input>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>



<script>
import Draggable from "./components/Draggable";
import Tree from "./components/Tree";
import Item from './components/Item';
import Vue from "vue";
import ElementUI from "element-ui";
import _ from "lodash";
import format_html from "@/utils/format_html";

function clone(obj) {
  if(!obj) return null;
  return JSON.parse(JSON.stringify(obj));
}

let installer = {
  "element-ui": {
    getAllComponent() {
      return Object.keys(ElementUI)
        .filter(name => {
          return (
            ElementUI[name] &&
            ElementUI[name].name &&
            ElementUI[name].name.indexOf("El") !== -1
          );
        })
        .map(name => {
          return {
            ...ElementUI[name],
            componentName: ElementUI[name].name,
            displayName: name
          };
        });
    },
    getComponentProps(componentName) {}
  }
};

let initData = {
  css: '',
  js:
` export default {
    data(){
      return {

      };
    }
  }
`
}

function findItem(arr = [], childrenKey, condition){
  let findedItem; 
  arr.some(item=>{
    let result = condition(item);

    if(result){
      findedItem = item;
      return true;
    }

    let children = item[childrenKey];

    findedItem = findItem(children, childrenKey, condition);

    if(findedItem){
      return true;
    }
  });

  return findedItem;
}

let id = 0;
export default {
  components: {
    Draggable,
    Tree,
    Item
  },
  filters:{
    className(value){
      return value.map(item=> `.${item}`).join('');
    }
  },
  watch:{
    allCode(value){
      // console.log(value)

      // this.edit(value);
    },
  },
  computed: {
    activeComponent() {
      return findItem(this.selectedComponents, 'children', component => component.id == this.activeId);
    },
    templateCode() {
      let code = format_html(
        this.genCode(this.selectedComponents),
        1,
        "  ",
        80
      );
      return code;
    },
    allCode() {
      let cssCode  = `<style>${this.cssCode}</style>`;
      let templateCode  = `<template><div>${this.templateCode}</div></template>`;
      let jsCode  = `<script>${this.jsCode}<\/script>`;

      return cssCode + templateCode + jsCode;
    }
  },
  data() {
    return {
      activeId: null,
      components: [],
      nativeComponents: [],
      selectedComponents: [],
      componentTabName: "native",
      treeTabName: "tree",
      cssTabName: "css",

      cssCode: initData.css,
      jsCode: initData.js,

      iframeVisible:false,

      nodeClass:(value)=>{
        console.log(value);

        return value.id === this.activeId ? 'active': undefined;
      }
    };
  },
  methods: {
    loadComponents() {
      let components = installer["element-ui"].getAllComponent();

      this.components = components;
    },
    loadNativeComponents() {
      let components = require("./native-components").default;

      this.nativeComponents = components;
    },
    handleCloneTo(data, groupName) {
      let component = {
        id: id++,
        componentName: data.componentName,
        isNative: data.isNative,
        props: {
          ...clone(data.props)
        },
        style: {
          ...clone(data.style)
        },
        class: [],
        children: []
      };

      this.activeId = component.id;

      return component;
    },
    genCode(components) {
      // let code = [];

      // components.forEach(component => {
      //   let codeForClass =
      //     component.class.length > 0
      //       ? `class="${component.class.join(" ")}"`
      //       : "";
      //   let codeForStyle =
      //     Object.keys(component.style).length > 0
      //       ? `style="${_.toPairs(component.style)
      //           .filter(pair => !!pair[1])
      //           .map(pair => `${pair[0]}:${pair[1]}`)
      //           .join(";")}"`
      //       : "";
      //   let codeForChildren = this.genCode(component.children);

      //   code.push(
      //     `<${component.componentName} ${codeForClass} ${codeForStyle}>`
      //   );
      //   code.push(codeForChildren);
      //   code.push(`</${component.componentName}>`);
      // });

      // return code.join("");
      return ''
    },
    async edit(code){
      // let res = await this.$api.edit({code});

      // this.iframeVisible = false;

      // this.$nextTick(()=>{
      //   this.iframeVisible = true;
      // })

      // console.log('success')
    },
    handleTreeNodeClick(nodeValue,nodeElem, component){
      console.log(nodeValue, nodeElem, component);

      this.activeId = nodeValue.id;
    },
    handleComponentDblclick(data){
      let component = this.handleCloneTo(data);

      this.selectedComponents.push(component);
    }
  },
  created() {
    this.loadComponents();
    this.loadNativeComponents();

  //   let div = this.handleCloneTo({
  //     componentName:'div',
  //     displayName:'div',
  //     isNative:true
  //   })

  //   let span1 = this.handleCloneTo({
  //     componentName:'span',
  //     displayName:'span',
  //     isNative:true
  //   })

  // span1.style.display="inline-block"
  //   span1.style.height = '40px';
  //   span1.style.margin = '40px 0 ';

  //   let span2 = this.handleCloneTo({
  //     componentName:'span',
  //     displayName:'span',
  //     isNative:true
  //   })

  //   let span3 = this.handleCloneTo({
  //     componentName:'span',
  //     displayName:'span',
  //     isNative:true
  //   })

  //   span3.style.display="inline-block"
  //   span3.style.height = '50px';

  //   let span4 = this.handleCloneTo({
  //     componentName:'span',
  //     displayName:'span',
  //     isNative:true
  //   })

  //   this.selectedComponents.push(div,span1,span2, span3,span4)
  },
  mounted(){
    $('#accordion').collapse()
  }
};
</script>
