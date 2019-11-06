<style scoped lang="scss">
.c-container {
  display: flex;
  justify-content: center;
  align-items: stretch;

  .left {
    width: 300px;
    background-color: #f3f3f3;
  }

  .main {
    flex: 1;
    display: flex;

    .view {
      width: 375px;
      height: 667px;
      margin: 0 auto;
      border: 1px solid #eee;
    }
  }
  .right {
    width: 300px;

    textarea {
      height: 100%;
      width: 100%;
    }
  }
}

img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.option-item{
  width:100%;
  padding: 10px;
  margin-bottom: -1px;
  background: #fff;
  border: 1px solid #ccc;

  .name{
    font-size: 12px;
    color: #333;
  }
}
</style>

<style lang="scss">
.active {
  border: 1px solid #f00;
}
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

</style>


<template>
  <div class="c-container">
    <div class="left">
      <h2>组件</h2>
      <draggable
        :list="components"
        :group="{ name: 'dragger', pull: 'clone', put: false }"
        :clone="cloneComponent"
        :sort="false"
      >
        <div v-for="component in components" :key="component.id" class="option-item">
          <div class="name">{{component.componentName}}</div> 
        </div>
      </draggable>
    </div>

    <div class="main">
      <div class="view">
        <DraggerView
          :group="{ name: 'dragger' }"
          :list="selectedComponents"
          style="position: relative;height:100%;"
        >
        </DraggerView>
      </div>
    </div>
    <div class="right">
      <textarea v-model="modelValue"></textarea>
    </div>
  </div>
</template>



<script>
import Draggable from "vuedraggable";
import DraggerView from "./components/dragger-view";
import Vue from "vue";

function clone(obj){
  return JSON.parse(JSON.stringify(obj))
}

let editorConfig = {
  'el-button':{
    children:[
      'text'
    ]
  },
  'el-input':{
    bihe:true
  },
  'el-row':{
    children:[
      { 
        componentName: 'el-col',
        props:{
          span:12
        },
        children:[
         'left'
        ]
      },
      { 
        componentName: 'el-col',
        props:{
          span:12
        },
        children:[
         'right'
        ]
      }
    ]
  }
}

let id = 0;
export default {
  components: {
    Draggable,
    DraggerView
  },
  computed: {
    modelValue: {
      get() {
        return JSON.stringify(this.selectedComponents,null, 2);
      },
      set(value) {
        this.selectedComponents = JSON.parse(value);
      }
    }
  },
  data() {
    return {
      activeId: null,
      components: [
        { componentName: "el-button" },
        { componentName: "el-input" },
        { componentName: "el-row" },
        { componentName: "el-col" },
      ],
      selectedComponents: [
      ],
      drag: false
    };
  },
  methods: {
    cloneComponent(component ) {
      let config = clone(editorConfig[component.componentName] || {});

      let c = {
        id: id++,
        componentName:component.componentName,
        bihe:config.bihe,
        props: config.props,
        children: config.children || []

      }

      console.log(c)
      return c;
    }
  }
};
</script>
