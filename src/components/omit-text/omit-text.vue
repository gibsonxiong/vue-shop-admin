
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
.tippy-popper{
  .tippy-content{
    word-break: break-all;
  }
}
</style>

<template>
  <span class="omit-text">
    <tippy :content="content" placement="top" :delay="[300,0]" animation="fade" :animateFill="false" :maxWidth="250" :interactive="true">
      <template v-slot:trigger >
        <span class="omit-text-content">{{ content }}</span> 
      </template>
    </tippy>
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



