<template>
  <span class="omit-text">
    <el-tooltip v-model="visible" effect="dark" :content="content" placement="top" popper-class="omit-text-popper">
      <span class="omit-text-content">{{ content }}</span>
    </el-tooltip>
  </span>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false
    }
  }
}
</script>

<style lang="scss" scoped>
.omit-text {
  display: block;
}

.omit-text-content {
  width: 100%;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>

<style lang="scss">
.omit-text-popper{
    max-width: 250px;
}
</style>
