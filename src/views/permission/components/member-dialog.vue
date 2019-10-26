<style>
</style>

<template>
  <el-dialog :title="textMap[type]" :visible="visible" @update:visible="setVisible">
    <el-form
      ref="form"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="100px"
      style="width: 400px; margin-left:50px;"
    >
      <el-form-item label="phone" prop="phone">
        <el-input v-model="temp.phone" />
      </el-form-item>

      <el-form-item label="password" prop="password">
        <el-input v-model="temp.password" type="password" />
      </el-form-item>

      <el-form-item label="nickname" prop="nickname">
        <el-input v-model="temp.nickname" />
      </el-form-item>

      <el-form-item label="avatar" prop="avatar">
        <c-single-upload v-model="temp.avatar" />
      </el-form-item>

      <el-form-item label="shopRoleId" prop="shopRoleId">
        <el-select v-model="temp.shopRoleId">
          <el-option
            v-for="item in shopRoleList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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

class Model extends BaseModel {
  phone = null;
  password = null;
  shopRoleId = null;
  avatar = null;
  nickname = null;
}

const rules = {
  // phone: [
  //   {
  //     required: true
  //   }
  // ],
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
  computed: {
    ...mapState('shop_role', {
      shopRoleList: 'list'
    })
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
      rules
    }
  },
  methods: {
    ...mapActions('shop_role', {
      loadShopRoleList: 'loadList'
    }),
    createData() {
      this.$refs['form'].validate(async valid => {
        if (!valid) return

        const res = await this.$api.shop_user.create(this.temp.get())

        this.$emit('dataCreated')
        this.$message.success('新增成功！')
        this.setVisible(false)
      })
    },

    updateData() {
      this.$refs['form'].validate(async valid => {
        if (!valid) return

        const res = await this.$api.shop_user.update(this.temp.get())

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
    this.loadShopRoleList()
  }
}
</script>

