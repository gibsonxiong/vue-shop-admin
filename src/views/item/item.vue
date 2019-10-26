<style lang="scss">
</style>

<template>
  <div class="app-container">
    <!-- <query-container @query="handleQuery" @reset="handleReset">
      <query-item label="phone">
        <el-input v-model="query.phone" @keyup.enter.native="handleQuery" clearable />
      </query-item>
    </query-container> -->

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
      <el-table-column label="#" prop="id" width="40" />

      <el-table-column label="商品图片" align="center" width="90px">
        <template slot-scope="{row}">
          <img style="width:60px;" :src="row.imgList[0]">
        </template>
      </el-table-column>

      <el-table-column label="商品名称" prop="name" width="300px" />

      <el-table-column label="商品分类" prop="category.name" />

      <el-table-column label="状态">
        <template slot-scope="{row}">
          <el-tag v-if="row.disabled" type="danger">禁用</el-tag>
          <el-tag v-else type="success">正常</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="简介" prop="desc" />

      <el-table-column label="创建时间" prop="createTime">
        <template slot-scope="{row}">{{ row.createTime | parseTime }}</template>
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
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

  </div>
</template>

<script>
import * as utils from '@/utils'

class Query {
  // phone = "";
}

export default {

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
      const res = await this.$api.item.list({
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

    handleCreate() {
      this.$router.push('/item/item-create')
    },
    handleCreated() {
      this.loadList()
    },

    handleUpdate(row) {
      this.$router.push(`/item/item-update/${row.id}`)
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
      const res = await this.$api.item.delete({ id: row.id })
      this.loadList()
      this.$message.success('删除成功！')
    }
  }
}
</script>
