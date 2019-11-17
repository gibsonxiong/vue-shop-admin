<style lang="scss" scoped>

</style>

<template>
    <Draggable v-model="data" :options="{groupName:'main'}">
        <div class="tree">
            <TreeNode v-for="(node,index) in data" :key="index" :node="node"></TreeNode>
        </div>
    </Draggable>
</template>

<script>
import Draggable from "./Draggable";
import TreeNode from "./TreeNode";
export default {
    name:'Tree',
    components:{
        Draggable,
        TreeNode
    },
    props:{
        data:{
            type:Array,
            default(){
                return [];
            }
        }
    }
}
</script>