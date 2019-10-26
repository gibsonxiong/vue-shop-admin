<style lang="scss" scoped>
/deep/ .dialog {
  width: 500px;
  padding: 15px;
  .el-dialog__body {
    // padding: 10px 40px;
  }
}
</style>

<template>
  <el-dialog
    :title="textMap[type]"
    :visible="visible"
    custom-class="dialog"
    @update:visible="setVisible"
  >
    <el-form ref="form" :rules="rules" :model="temp" label-position="left" label-width="100px">
      <el-form-item label="name" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>

      <el-form-item label="desc" prop="desc">
        <el-input v-model="temp.desc" />
      </el-form-item>

      <el-form-item label="isAdmin" prop="isAdmin">
        <el-checkbox v-model="temp.isAdmin" />
      </el-form-item>

      <el-form-item v-show="!temp.isAdmin" label="Menus">
        <el-tree
          ref="tree"
          :check-strictly="checkStrictly"
          :data="routesData"
          :props="{
            children: 'children',
            label: 'title'
          }"
          show-checkbox
          node-key="name"
          class="permission-tree"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="setVisible(false)">取消</el-button>
      <el-button type="primary" @click="type==='create'?createData():updateData()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import BaseModel from '@/utils/BaseModel'
import { routes, generateTreeOptions } from '@/router'

class Model extends BaseModel {
  name = null;
  desc = null;
  permissions = null;
  isAdmin = false;
}

const rules = {
  name: [
    {
      required: true
    }
  ],
  desc: [
    {
      required: true
    }
  ]
}

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'create'
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      temp: new Model(),
      textMap: {
        create: '新增',
        update: '修改'
      },
      rules,
      checkStrictly: false
    }
  },
  computed: {
    routesData() {
      return generateTreeOptions(routes, null, true)
    }
  },
  watch: {
    visible(value) {
      if (value) {
        this.temp = new Model()
        this.temp.set(this.data)

        this.$nextTick(() => {
          if (this.type === 'create') {
            this.$refs.tree.setCheckedKeys([])
          } else {
            this.$refs.tree.setCheckedKeys([])
            this.$refs.tree.setCheckedKeys(this.temp.permissions)
          }
          this.$refs['form'].clearValidate()
        })
      }
    }
  },
  created() {},
  methods: {
    createData() {
      this.$refs['form'].validate(async valid => {
        if (!valid) return

        let permissions
        if (this.temp.isAdmin) {
          permissions = null
        } else {
          permissions = this.$refs.tree.getCheckedKeys(true)
        }

        this.temp.set({
          permissions
        })

        const res = await this.$api.shop_role.create(this.temp.get())

        this.$emit('dataCreated')
        this.$message.success('新增成功！')
        this.setVisible(false)
      })
    },

    updateData() {
      this.$refs['form'].validate(async valid => {
        if (!valid) return

        let permissions
        if (this.temp.isAdmin) {
          permissions = null
        } else {
          permissions = this.$refs.tree.getCheckedKeys(true)
        }

        this.temp.set({
          permissions
        })

        const res = await this.$api.shop_role.update(this.temp.get())

        this.$emit('dataUpdated')
        this.$message.success('更新成功！')
        this.setVisible(false)
      })
    },

    setVisible(visible) {
      this.$emit('update:visible', visible)
    },

    generateRoutes(routes) {
      const res = []

      routes.forEach(route => {
        if (route.hidden) return

        const item = {
          title: route.meta && route.meta.title,
          name: route.name
        }

        if (route.children && route.children.length > 0) {
          item.children = this.generateRoutes(route.children)
        }

        res.push(item)
      })
      console.log(res)
      return res
    }
  }
}
</script>

