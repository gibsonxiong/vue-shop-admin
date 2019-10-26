<style lang="scss" scoped>
.tag-input {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;

  .propvalue-tag {
    height: 32px;
    line-height: 30px;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 10px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .new-input {
    width: 90px;
    vertical-align: bottom;
  }
}
.propvalue-wrap {
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  padding: 5px 10px 10px;

  .propvalue-item{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px 0;
  }

  .add-btn{
    border: none;
    margin-bottom: 5px;
  }

  .remove-btn{
    border: none;
    margin-left: 10px;
  }

}
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
      <el-form-item label="属性名称" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>
      <el-form-item label="属性值">
        <!-- <div class="tag-input">
          <el-tag
            class="propvalue-tag"
            :key="index"
            v-for="(item,index) in temp.propvalues"
            closable
            :disable-transitions="true"
            @close="handleClose(item)"
          >{{item.name}}</el-tag>
          <el-input
            class="new-input"
            v-if="inputVisible"
            v-model="inputValue"
            ref="newInput"
            size="small"
            st
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">新增</el-button>
        </div>-->
        <div class="propvalue-wrap">
          <el-button icon="el-icon-plus" size="mini" class="add-btn" circle @click="addPropvalue" />

          <div v-for="(item,index) in temp.propvalues" :key="index" class="propvalue-item">
            <el-input v-model="item.name" />
            <el-button icon="el-icon-minus" size="mini" class="remove-btn" circle @click="removePropvalue(index)" />
          </div>
        </div>
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
  propvalues = [];
}

const rules = {
  // name: [
  //   {
  //     required: true
  //   }
  // ]
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

      inputVisible: false,
      inputValue: ''
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

        const res = await this.$api.prop.create(this.temp.get())

        this.$emit('dataCreated')
        this.$message.success('新增成功！')
        this.setVisible(false)
      })
    },

    updateData() {
      this.$refs['form'].validate(async valid => {
        if (!valid) return

        const res = await this.$api.prop.update(this.temp.get())

        this.$emit('dataUpdated')
        this.$message.success('更新成功！')
        this.setVisible(false)
      })
    },

    setVisible(visible) {
      this.$emit('update:visible', visible)
    },

    // handleClose(item) {
    //   this.temp.propvalues.splice(this.temp.propvalues.indexOf(item), 1);
    // },

    // showInput() {
    //   this.inputVisible = true;
    //   this.$nextTick(_ => {
    //     this.$refs.newInput.$refs.input.focus();
    //   });
    // },

    // handleInputConfirm() {
    //   let inputValue = this.inputValue;
    //   if (inputValue) {
    //     this.temp.propvalues.push({ name: inputValue });
    //   }
    //   this.inputVisible = false;
    //   this.inputValue = "";
    // }

    addPropvalue() {
      this.temp.propvalues.push({ name: null })
    },

    removePropvalue(index) {
      this.temp.propvalues.splice(index, 1)
    }
  }
}
</script>

