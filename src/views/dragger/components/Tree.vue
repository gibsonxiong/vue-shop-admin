<style lang="scss" scoped>
.tree {
  padding: 6px;
}
</style>

<template>
  <Draggable :value="value" @input="$emit('input',value)" :options="{groupName:'tree'}">
    <div class="tree">
      <TreeNode
        :nodeClass="nodeClass"
        v-for="child in value"
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
  </Draggable>
</template>

<script>
import Draggable from "./Draggable";
import TreeNode from "./TreeNode";
export default {
  name: "Tree",
  components: {
    Draggable,
    TreeNode
  },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    nodeClass: {
        type: Function
    }
  },
  methods: {
    handleChildChange(id, child) {
      let index = this.value.findIndex(item => item.id == id);
      let value = [...this.value];
      value[index] = child;
      this.$emit("input", value);
    },

    handleNodeClick(...args) {
      this.$emit("node-click", ...args);
    }
  }
};
</script>