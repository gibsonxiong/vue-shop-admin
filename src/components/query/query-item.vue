<template>
  <div class="query-item">
    <div class="query-item-label">{{ label }}</div>
    <div class="query-item-ctrl">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.query-item {
  display: inline-block;
  margin-right: 35px;
  margin-bottom: 15px;

  .query-item-label{
    font-size: 14px;
    display: inline-block;
    width: 75px;
  }
  .query-item-ctrl {
    display: inline-block;
    width: 210px;
  }
}
</style>
