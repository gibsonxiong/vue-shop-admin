<style lang="scss" scoped>
.tree-node-content {
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #f5f7fa;
  }

  .expand-icon {
    color: #c0c4cc;
    padding: 4px 4px;
    transition: transform 0.3s ease-in-out;

    &.expanded {
      transform: rotate(90deg);
    }
  }
}
.subtree-wrap {
  padding-left: 15px;
}
</style>

<template>
  <Draggable
    :value="value.children"
    @input="handleChange"
    :options="{groupName:'tree',sortContainerSelector:'.subtree-wrap'}"
  >
    <div class="tree-node" :class="typeof nodeClass === 'function' &&  nodeClass(value)">
      <div class="tree-node-content" @click.stop="handleClick(true)">
        <i
          class="expand-icon el-icon-caret-right"
          :style="{visibility:`${hasChild ? '':'hidden'}`}"
          :class="{expanded: expanded}"
          @click.stop="handleClick(false)"
        ></i>
        <div>
          <slot :node="value">
            {{value.componentName}}
          </slot>
        </div>
      </div>
      <el-collapse-transition>
        <div class="subtree-wrap" v-show="expanded">
          <TreeNode
            :nodeClass="nodeClass"
            v-for="child in value.children"
            :key="child.id"
            :value="child"
            @input="handleChildChange(child.id,$event)"
            @node-click="handleNodeClick"
          >
            <template slot-scope="{node}">
              <slot :node="node"></slot>
            </template>
          </TreeNode>
        </div>
      </el-collapse-transition>
    </div>
  </Draggable>
</template>

<script>
import Draggable from "./Draggable";
export default {
  name: "TreeNode",
  components: {
    Draggable
  },
  computed: {
    hasChild() {
      return this.value.children.length > 0;
    }
  },
  props: {
    value: {
      type: Object
    },
    nodeClass: {
      type: Function
    }
  },
  data() {
    return {
      expanded: false
    };
  },
  methods: {
    handleClick(emitClick) {
      if (this.hasChild) {
        this.expanded = !this.expanded;
      }

      if (emitClick) {
        this.$emit("node-click", this.value, this.$el, this);
      }
    },

    handleNodeClick(value, node, nodeComponent){
      this.$emit("node-click", value, node, nodeComponent);
    },

    handleChange(children) {
      let value = { ...this.value };
      value.children = children;
      this.$emit("input", value);
    },
    handleChildChange(id, child) {
      let index = this.value.children.findIndex(item => item.id == id);
      let value = { ...this.value };
      value.children[index] = child;
      this.$emit("input", value);
    }
  },
  created() {}
};
</script>

