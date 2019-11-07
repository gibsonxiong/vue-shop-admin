<style scoped lang="scss">
ul {
  margin: 0;
  padding: 10px;
  list-style: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

li {
  cursor: move;
  // margin: 5px;
  padding: 2px 5px;
  font-size: 14px;
  /* margin: 30px 0; */
  /* margin-top:30px; */
  background-color: #ccc;
  border: 1px solid #aaa;
}
</style>


<template>
  <div class="c-container">
    <Draggable id="ul1" tag="ul" style="background:#ff0">
        <Draggable  id="ul2" tag="ul" style="background:#0f0">
          <li>item1-1</li>
          <li>item1-2</li>
          <Draggable  id="ul2" tag="ul" style="background:#4a8">
              <li>item1-3-1</li>
              <li>item1-3-2</li>
          </Draggable>
        </Draggable>
      <div id="dd">
        <button>test1</button>
        <button>test2</button>
      </div>
      <li>item 2 prevent</li>
      <li>item 3</li>
      <li>item 4</li>
      <li>item 5</li>
    </Draggable>

    <Draggable id="ul3"  tag="ul" style="background:#0ff;margin-top:50px">
    </Draggable>
  </div>
</template>



<script>
import Draggable from "./components/Draggable";
import DraggerView from "./components/dragger-view";
import Vue from "vue";

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

let editorConfig = {
  "el-button": {
    children: ["text"]
  },
  "el-input": {
    bihe: true
  },
  "el-row": {
    children: [
      {
        componentName: "el-col",
        props: {
          span: 12
        },
        children: ["left"]
      },
      {
        componentName: "el-col",
        props: {
          span: 12
        },
        children: ["right"]
      }
    ]
  }
};

let id = 0;
export default {
  components: {
    Draggable,
    DraggerView
  },
  computed: {
    modelValue: {
      get() {
        return JSON.stringify(this.selectedComponents, null, 2);
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
        { componentName: "el-col" }
      ],
      selectedComponents: [],
      drag: false
    };
  },
  methods: {
    cloneComponent(component) {
      let config = clone(editorConfig[component.componentName] || {});

      let c = {
        id: id++,
        componentName: component.componentName,
        bihe: config.bihe,
        props: config.props,
        children: config.children || []
      };

      console.log(c);
      return c;
    }
  }
};
</script>
