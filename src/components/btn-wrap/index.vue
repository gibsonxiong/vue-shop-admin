<template>
  <div class="btn-wrap">
    <el-button type="primary" @click="$emit('add')">新增</el-button>
    <slot />
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.btn-wrap {
  margin-bottom: 10px;
}
</style>
