<style lang="scss">
</style>

<template>
  <div class="app-container">
    <query-container @query="handleQuery" @reset="handleReset">
      <query-item label="phone">
        <el-input v-model="query.phone" clearable @keyup.enter.native="handleQuery" />
      </query-item>
    </query-container>

    <c-btn-wrap @add="handleCreate()" />

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
      <el-table-column label="id" prop="id" width="60" />

      <el-table-column label="phone" prop="phone" />

      <el-table-column label="password" prop="password" />

      <el-table-column label="nickname" prop="nickname" />

      <el-table-column label="shopRoleId" prop="shopRoleId" />

      <el-table-column label="avatar">
        <template slot-scope="{row}">
          <img :src="row.avatar" alt="">
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <c-pagination
      :total="pagination.total"
      :page.sync="pagination.pageIndex"
      :limit.sync="pagination.pageSize"
      @pagination="loadList"
    /> -->

    <el-backtop />

    <form-dialog
      v-bind="dialog"
      :visible.sync="dialog.visible"
      @dataCreated="handleCreated"
      @dataUpdated="handleUpdated"
    />
  </div>
</template>

<script>
import * as utils from '@/utils'
import FormDialog from './components/member-dialog'

class Query {
  phone = '';
}

export default {
  components: {
    FormDialog
  },
  data() {
    return {
      list: [],
      loading: false,

      // query
      query: new Query(),

      // 分页
      // pagination: {
      //   total: 0,
      //   pageIndex: 1,
      //   pageSize: 20
      // },

      // dialog
      dialog: {
        data: null,
        visible: false,
        type: ''
      }
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    async loadList() {
      this.loading = true
      const res = await this.$api.shop_user.list({
        ...this.query
        // ...this.pagination
      })

      this.loading = false

      this.list = res.data
      // this.pagination.total = res.data.count;
    },
    handleQuery() {
      // this.pagination.pageIndex = 1;
      this.loadList()
    },
    handleReset() {
      this.query = new Query()
      // this.pagination.pageIndex = 1;
      this.loadList()
    },

    handleCreate() {
      this.dialog.type = 'create'
      this.dialog.visible = true
      this.dialog.data = {}
    },

    handleCreated() {
      this.loadList()
    },

    handleUpdate(row) {
      this.dialog.type = 'update'
      this.dialog.visible = true
      this.dialog.data = row
    },

    handleUpdated() {
      this.loadList()
    },

    async handleDelete(row) {
      try {
        const res = await this.$confirm('确定要删除该条数据吗？', '提示')
        this.deleteData(row)
      } catch (err) {}
    },

    async deleteData(row) {
      const res = await this.$api.shop_user.delete({ id: row.id })
      this.loadList()
      this.$message.success('删除成功！')
    }
  }
}
</script>
