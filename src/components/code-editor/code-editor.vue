
<style lang="scss" scoped>
// @import '~@/utils/codemirror-5.49.2/lib/codemirror.css';
// @import '~@/utils/codemirror-5.49.2/addon/hint/show-hint.css';
.code-editor {
  display: block;
}

/deep/ .CodeMirror{
  height: 100%;
}

</style>

<template>
  <div class="code-editor" ref="editor"></div>
</template>

<script>
// import CodeMirror from '@/utils/codemirror-5.49.2/lib/codemirror';
// import '@/utils/codemirror-5.49.2/mode/htmlmixed/htmlmixed';
// import '@/utils/codemirror-5.49.2/mode/xml/xml';
// import '@/utils/codemirror-5.49.2/mode/javascript/javascript';
// import '@/utils/codemirror-5.49.2/mode/css/css';
// import '@/utils/codemirror-5.49.2/mode/sass/sass';
// import '@/utils/codemirror-5.49.2/addon/hint/show-hint';
// import '@/utils/codemirror-5.49.2/addon/hint/html-hint';

export default {
  // props: {
  //   value: {
  //     type: String,
  //     default: ''
  //   },
  //   mode:{
  //     type: String,
  //     default: 'javascript'
  //   }
  // },
  // computed:{
  // },
  // watch:{
  //   value(value){
  //     this.editor.setValue(value);
  //   }
  // },
  // data() {
  //   return {
  //    editor:null
  //   }
  // },
  // mounted(){
  //   this.editor = CodeMirror(this.$refs.editor, {
  //     mode: this.mode,
  //     value: this.value
  //   });
  //   this.editor.on('change',cm=>{
  //     let value = cm.getValue()
  //     this.$emit('input',value);
  //   })
  // }
}
</script>



