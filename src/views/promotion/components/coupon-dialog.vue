<style>
</style>

<template>
  <el-dialog :title="textMap[type]" :visible="visible" @update:visible="setVisible">
    <el-form
      ref="form"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="120px"
      style="width: 400px; margin-left:50px;"
    >
      <el-form-item label="name" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>

      <el-form-item label="desc" prop="desc">
        <el-input v-model="temp.desc" type="textarea" />
      </el-form-item>

      <el-form-item label="limitPrice" prop="limitPrice">
        <el-input v-model="temp.limitPrice" />
      </el-form-item>

      <el-form-item label="deductPrice" prop="deductPrice">
        <el-input v-model="temp.deductPrice" />
      </el-form-item>

      <el-form-item label="quantity" prop="quantity">
        <el-input v-model="temp.quantity" />
      </el-form-item>

      <el-form-item label="startTime" prop="startTime">
        <el-date-picker
          v-model="temp.startTime"
          type="datetime"
        />
      </el-form-item>

      <el-form-item label="endTime" prop="endTime">
        <el-date-picker
          v-model="temp.endTime"
          type="datetime"
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

class Model extends BaseModel {
  name = null;
  desc=null;
  limitPrice=null;
  deductPrice=null;
  quantity=null;
  startTime=null;
  endTime=null;
}

const rules = {
  name: [
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
      rules
    }
  },
  computed: {},
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
  created() {},
  methods: {
    createData() {
      this.$refs['form'].validate(async valid => {
        if (!valid) return

        const res = await this.$api.coupon.create(this.temp.get())

        this.$emit('dataCreated')
        this.$message.success('新增成功！')
        this.setVisible(false)
      })
    },

    updateData() {
      this.$refs['form'].validate(async valid => {
        if (!valid) return

        const res = await this.$api.coupon.update(this.temp.get())

        this.$emit('dataUpdated')
        this.$message.success('更新成功！')
        this.setVisible(false)
      })
    },

    setVisible(visible) {
      this.$emit('update:visible', visible)
    }
  }
}
</script>

