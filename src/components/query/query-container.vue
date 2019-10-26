<template>
  <div class="query-container">
    <div class="dropdown-wrap">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link"><i class="el-icon-arrow-down" />
        </span>
        <el-dropdown-menu slot="dropdown" style="padding:10px;">
          <el-button type="primary" @click="$emit('query')">查询</el-button>
          <div style="padding-top:10px;" />
          <el-button @click="$emit('reset')">重置</el-button>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <slot />
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">

.query-container{
    position: relative;
    margin-bottom: 10px;

    .dropdown-wrap{
        position: absolute;
        top:0;
        right: 0;
    }

    .el-dropdown-link{
        background-color: #eee;
        width: 40px;
        text-align: center;
        display: inline-block;
    }
}
</style>
