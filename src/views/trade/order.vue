<style lang="scss">
</style>

<template>
  <div class="app-container">
    <!-- <query-container @query="handleQuery" @reset="handleReset">
      <query-item label="phone">
        <el-input v-model="query.phone" @keyup.enter.native="handleQuery" clearable />
      </query-item>
    </query-container> -->

    <!-- <c-btn-wrap @add="handleCreate()" /> -->

    <el-table
      v-loading="loading"
      row-key="id"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="id" prop="id" width="40" />

      <el-table-column label="订单号" prop="orderNo" />

      <el-table-column label="收货人" prop="receiverName"/>

      <el-table-column label="订单总金额" prop="orderFee"/>

       <el-table-column label="下单时间" prop="createTime">
         <template slot-scope="{row}">
           {{row.createTime | parseTime}}
         </template>
       </el-table-column>

        <el-table-column label="订单状态" prop="status">
          <template slot-scope="{row}">
            <span v-if="row.status == 1">待付款</span>
            <span v-else-if="row.status == 2">待发货</span>
            <span v-else-if="row.status == 3">待收货</span>
            <span style="color:#909399" v-else-if="row.status == 4">已完成</span>
            <span style="color:#909399" v-else-if="row.status == 5">已完成</span>
            <span style="color:#F56C6C" v-else-if="row.status == 9">已取消</span>
         </template>
        </el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="goDetail(row)">详情</el-button>
          <el-button v-if="row.status == '2'" type="primary" size="mini" @click="handleDeliver(row)">发货</el-button>
        </template>
      </el-table-column>
    </el-table>

    <c-pagination
      :total="pagination.total"
      :page.sync="pagination.pageIndex"
      :limit.sync="pagination.pageSize"
      @pagination="loadList"
    />

    <el-backtop />

    <DeliverDialog
      v-bind="dialog"
      :visible.sync="dialog.visible"
      @dataSubmited="handleDeliverSubmited"
    />
  </div>
</template>

<script>
import * as utils from '@/utils'
import DeliverDialog from './components/order-deliver'

class Query {
  // phone = "";
}

export default {
  components: {
    DeliverDialog
  },
  data() {
    return {
      list: [],
      loading: false,

      // query
      query: new Query(),

      // 分页
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 20
      },

      // dialog
      dialog: {
        id:'',
        visible: false,
      }
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    async loadList() {
      this.loading = true
      const res = await this.$api.order.list({
        ...this.query,
        ...this.pagination
      })

      this.loading = false

      this.list = res.data.rows
      this.pagination.total = res.data.count
    },
    handleQuery() {
      this.pagination.pageIndex = 1
      this.loadList()
    },
    handleReset() {
      this.query = new Query()
      this.pagination.pageIndex = 1
      this.loadList()
    },

    //发货
    handleDeliver(row) {
      this.dialog.id=row.id;
      this.dialog.visible = true
    },

    handleDeliverSubmited() {
      this.loadList()
    },

    goDetail(row){
      this.$router.push(`/trade/order-detail/${row.id}`)
    }
  }
}
</script>
