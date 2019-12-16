<style lang="scss" scoped>
</style>

<template>
  <div class="header">
    <el-button @click="preview">preview</el-button>
  </div>
</template>

<script>
export default {
  name: "Header",
  methods: {
    async preview() {
        console.log('preview')
    }
  }
};
</script>