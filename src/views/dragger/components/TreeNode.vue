<style lang="scss" scoped>
.subtree-wrap{
    padding-left:20px;
}
</style>

<template>
    <Draggable v-model="node.children" :options="{groupName:'main'}">
        <div class="tree-node">
            <div>{{node.componentName}}</div>
            <div class="subtree-wrap">
                <TreeNode v-for="(subNode,index) in node.children" :key="index" :node="subNode"></TreeNode>
            </div>
        </div>
    </Draggable>
</template>

<script>
import Draggable from "./Draggable";
export default {
    name:'TreeNode',
    components:{
        Draggable
    },
    props:{
        node:{
            type:Object
        }
    }
}
</script>

