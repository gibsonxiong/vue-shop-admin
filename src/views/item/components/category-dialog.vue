<style>
</style>

<template>
  <el-dialog :title="textMap[type]" :visible="visible" @update:visible="setVisible">
    <el-form
      ref="form"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="70px"
      style="width: 400px; margin-left:50px;"
    >

      <el-form-item label="name" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>

      <el-form-item label="parentId" prop="parentId">
        <el-cascader
          v-model="temp.parentId"
          :disabled="disableParantId"
          style="width:100%"
          :options="categoryTree"
          :props="{checkStrictly: true,emitPath:false, value:'id', label:'name'}"
          clearable
        />
      </el-form-item>

      <el-form-item label="img" prop="img">
        <c-single-upload v-model="temp.img" />
      </el-form-item>

      <el-form-item label="sort" prop="sort">
        <el-input-number v-model="temp.sort" style="width:100%" controls-position="right" :min="0" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="setVisible(false)">取消</el-button>
      <el-button type="primary" @click="type==='create'?createData():updateData()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BaseModel from '@/utils/BaseModel'
import * as utils from '@/utils'

class Model extends BaseModel {
  name = null;
  img = null;
  parentId = null;
  sort = null;
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
    },

    disableParantId: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('category', {
      categoryList: 'list'
    }),
    categoryTree() {
      return utils.flatToTree(this.categoryList)
    }
  },
  watch: {
    visible(value) {
      if (value) {
        this.temp = new Model()
        this.temp.set(this.data)
        this.$nextTick(() => {
          this.$refs['form'].clearValidate()
        })
      }
    }
  },
  data() {
    return {
      temp: new Model(),
      textMap: {
        create: '新增',
        update: '修改'
      },
      rules: {
        name: [
          {
            required: true
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions('category', {
      loadCategoryList: 'loadList'
    }),

    createData() {
      this.$refs['form'].validate(async valid => {
        debugger;
        if (!valid) return

        const res = await this.$api.category.create(this.temp.get())

        this.$emit('dataCreated')
        this.$message.success('新增成功！')
        this.setVisible(false)
      })
    },

    updateData() {
      this.$refs['form'].validate(async valid => {
        debugger;
        if (!valid) return

        const res = await this.$api.category.update(this.temp.get())

        this.$emit('dataUpdated')
        this.$message.success('更新成功！')
        this.setVisible(false)
      })
    },

    setVisible(visible) {
      this.$emit('update:visible', visible)
    }
  },
  created() {
    this.loadCategoryList()
  }
}
</script>

