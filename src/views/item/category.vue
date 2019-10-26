<style lang="scss">
</style>

<template>
  <div class="app-container">
    <!-- <query-container @query="handleQuery">
      <query-item label="name">
        <el-input v-model="query.name" @keyup.enter.native="handleQuery" />
      </query-item>
    </query-container>-->

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
      <el-table-column label="id" prop="id" width="150" />
      <el-table-column label="name" prop="name" />
      <el-table-column label="img" width="150">
        <template slot-scope="{row}">
          <img v-if="row.img" :src="row.img" :alt="row.name" style="width:80px;">
        </template>
      </el-table-column>
      <el-table-column label="sort" prop="sort" />
      <el-table-column label="操作" width="250">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleCreate(row.id)">新增下级</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <c-pagination
      :total="pagination.total"
      :page.sync="pagination.page"
      @pagination="loadList"
    />

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
import FormDialog from './components/category-dialog'

export default {
  components: {
    FormDialog
  },
  data() {
    return {
      list: [],

      loading: false,
      // query
      query: {
        page: 1,
        limit: 20,

        name: '',
        desc: ''
      },

      pagination: {
        total: 0,
        page: 0
      },

      // dialog
      dialog: {
        data: null,
        visible: false,
        type: '',
        disableParantId: false
      }
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    async loadList() {
      this.loading = true
      const res = await this.$api.category.list()

      this.loading = false

      this.list = utils.flatToTree(res.data)
    },
    handleQuery() {
      this.pagination.page = 1
      this.loadList()
    },

    handleCreate(parentId) {
      this.dialog.type = 'create'
      this.dialog.visible = true
      if (parentId) {
        this.dialog.data = { parentId }
        this.dialog.disableParantId = true
      } else {
        this.dialog.data = { }
        this.dialog.disableParantId = false
      }
    },

    handleCreated() {
      this.loadList()
      this.$store.dispatch('category/loadList', true)
    },

    handleUpdate(row) {
      this.dialog.type = 'update'
      this.dialog.visible = true
      this.dialog.data = row
      this.dialog.disableParantId = true
    },

    handleUpdated() {
      this.loadList()
      this.$store.dispatch('category/loadList', true)
    },

    async handleDelete(row) {
      try {
        const res = await this.$confirm('确定要删除该条数据吗？', '提示')
        this.deleteData(row)
      } catch (err) {}
    },

    async deleteData(row) {
      const res = await this.$api.category.delete({ id: row.id })
      this.loadList()
      this.$message.success('删除成功！')
    }
  }
}
</script>
