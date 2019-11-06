<style lang="scss" scoped>
.dragger-view{
  overflow: hidden;
} 
.dragger-item{
  width:100%;
  padding: 15px;
  margin: 5px 0;
  background-color: rgba(19, 111, 248, 0.35);

  .name{
    color: #555;
    font-size: 14px;
    font-weight: 600;
  }
}

.active-component{
  // outline: 1px dashed #f00!important;
}
</style>

<style lang="scss">
.ghost{
  // color: #00f!important;
}
.chosen{
  // background: #f00!important;
}
.drag{
  background: #0f0!important;
}
</style>

<template>
  <draggable
    ghostClass="ghost"
    chosenClass="chosen"
    dragClass="drag"
    v-bind="$attrs"
    :group="group"
    class="dragger-view"
    :list="list"
    :animation="200"
    :fallbackOnBody="true"
    :invertSwap="true"

		:swapThreshold="0.1"
  >

      <!-- @start="log('start',$event)"
    @add="log('add',$event)"
    @remove="log('remove',$event)"
    @change="log('change',$event)"
    @update="log('update',$event)"
    @end="log('end',$event)"
    @choose="log('choose',$event)"
    @unchoose="log('unchoose',$event)"
    @sort="log('sort',$event)"
    @filter="log('filter',$event)"
    @clone="log('clone',$event)" -->
        
        <template v-for="item in list" >
          <template v-if="isString(item)">
            {{item}}
          </template>
          <component v-else-if="item.bihe" :is="item.componentName" :key="item.id" v-bind="item.props" class="active-component" />
          <component v-else :is="item.componentName" :key="item.id" v-bind="item.props"  class="active-component">
            <dragger-view  :list="item.children" :group="group"/>
          </component>
        </template>   
  </draggable>
</template>

<script>
import Draggable from "vuedraggable";

export default {
  name:'dragger-view',
  components:{
    Draggable
  },
  props:{
    list:{
      type:Array,
      default(){
        return [];
      }
    },
    group:{}
  },
  data() {
    return {
      drag:false
    };
  },
  methods:{
    isString(str){
      return typeof str === 'string';
    },
    log(){
      console.log(...arguments)
    }
  },
};
</script>
