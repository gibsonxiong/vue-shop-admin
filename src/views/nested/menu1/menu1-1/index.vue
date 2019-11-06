<style lang="scss" scoped>
.box{
  
}
</style>

<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="menu 1-1" type="success">
      <router-view />
    </el-alert>

    <c-flexbox>
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </c-flexbox>
  </div>
</template>

<script>
export default {
  
}
</script>