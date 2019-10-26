<style lang="scss" scoped>
.sku-wrap {
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  padding: 10px 10px;
}

.header-tool {
  display: flex;
  align-items: center;

  .header-title {
    flex: 1;
  }

  .header-input {
    width: 100px;
  }

  .header-btn {
    border: none;
  }
}
</style>

<template>
  <div class="app-container">
    <el-form
      ref="form"
      :rules="rules"
      :model="temp"
      label-position="right"
      label-width="70px"
      style="margin-left:50px;"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>

      <el-form-item label="分类" prop="categoryId">
        <el-cascader
          v-model="temp.categoryId"
          style="width:100%"
          :options="categoryTree"
          :props="{emitPath:false, value:'id', label:'name'}"
          clearable
          :disabled="!isCreate"
        />
      </el-form-item>

      <el-form-item label="商品图片" prop="imgList">
        <c-upload :data="temp.imgList" @add="addImage" @remove="removeImage" />
      </el-form-item>

      <el-form-item label="SKU" prop="skus">
        <div class="sku-wrap">
          <el-button type="primary" :disabled="!isCreate" @click="showPropSelect">添加属性</el-button>
          <div
            v-for="(propname,index) in selectPropnameModels"
            :key="propname.id"
            class
            style="margin-top:20px;"
          >
            <h4 style="margin-bottom:5px">
              {{ propname.name }}
              <el-button
                v-if="isCreate"
                class="header-btn"
                icon="el-icon-close"
                circle
                size="mini"
                style="border:none;"
                @click="removePropname(index)"
              />
            </h4>
            <div>
              <el-checkbox-group v-model="temp.propvalues[index]" size="large" :disabled="!isCreate">
                <el-checkbox
                  v-for="propvalue in propname.propvalues"
                  :key="propvalue.id"
                  :label="propvalue.id"
                  border
                  style="margin-right:5px;"
                >{{ propvalue.name }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <el-table
            v-if="temp.skus.length > 0"
            size="mini"
            row-key="id"
            :data="temp.skus"
            border
            fit
            highlight-current-row
            style="width: 100%; margin-top: 30px;"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column label="属性" prop="propvalueTextList" />

            <el-table-column>
              <template slot="header" slot-scope="{row}" style="width:30px">
                <div class="header-tool">
                  <span class="header-title">价格</span>
                  <el-input
                    v-model="allPrice"
                    class="header-input"
                    size="mini"
                    placeholder="全部"
                    @keypress.native.enter="setAllPrice"
                  />
                  <el-button class="header-btn" icon="el-icon-edit" circle @click="setAllPrice" />
                </div>
              </template>
              <template slot-scope="{row}">
                <el-input v-model="row.price" />
              </template>
            </el-table-column>

            <el-table-column>
              <template slot="header" slot-scope="{row}" style="width:30px">
                <div class="header-tool">
                  <span class="header-title">库存</span>
                  <el-input
                    v-model="allQuantity"
                    class="header-input"
                    size="mini"
                    placeholder="全部"
                    @keypress.native.enter="setAllQuantity"
                  />
                  <el-button class="header-btn" icon="el-icon-edit" circle @click="setAllQuantity" />
                </div>
              </template>
              <template slot-scope="{row}">
                <el-input v-model="row.quantity" :disabled="!isCreate" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>

      <el-form-item label="是否禁用" prop="disabled">
        <el-switch v-model="temp.disabled" />
      </el-form-item>

      <el-form-item label="简介" prop="desc">
        <el-input v-model="temp.desc" type="textarea" />
      </el-form-item>

      <el-form-item label="商品详情" prop="detail">
        <Tinymce ref="editor" v-model="temp.detail" :height="400" />
      </el-form-item>

      <el-form-item label>
        <el-button>取消</el-button>
        <el-button type="primary" @click="isCreate ?createData():updateData()">确定</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="添加属性" :visible.sync="propSelectVisible">
      <el-select v-model="propSelectValue" multiple style="width:300px;">
        <el-option
          v-for="item in filteredPropnameList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button @click="addPropname">添加</el-button>
    </el-dialog>

    <el-backtop />
  </div>
</template>

<script>
import Vue from 'vue'
import Tinymce from '@/components/Tinymce'
import BaseModel from '@/utils/BaseModel'
import { mapState, mapActions } from 'vuex'
import * as utils from '@/utils'

// 笛卡尔积乘
function dikaer(data = []) {
  var wrapped = false

  var result = data.reduce((prev, current) => {
    if (prev.length == 0) return current

    var temp = prev
    var result = []

    temp.forEach(item1 => {
      if (!wrapped) {
        item1 = [item1]
      }

      if (current.length === 0) {
        result.push(item1)
      } else {
        current.forEach(item2 => {
          result.push(item1.concat(item2))
        })
      }
    })
    wrapped = true
    return result
  }, [])

  // 处理 只有最后项有数据 返回的数据没有包装成数组
  if (!wrapped) {
    result = result.map(item => [item])
  }

  return result
}

class Model extends BaseModel {
  name = null;
  desc = null;
  imgList = [];
  categoryId = null;
  disabled = false;

  propnames = [];
  propvalues = [];
  skus = [];
}

const rules = {}

export default {
  components: {
    Tinymce
  },
  data() {
    return {
      itemId: null,
      temp: new Model(),
      rules,

      propSelectValue: [],
      propSelectVisible: false,

      allPrice: '',
      allQuantity: ''
    }
  },
  watch: {
    // 库存表格生成
    'temp.propvalues'() {
      let result = dikaer(this.temp.propvalues)

      result = result.map(arr => {
        arr = arr.map(propvalueId => this.allPropvalueList.find(item => item.id === propvalueId))
        return {
          id: null,
          propvalueList: arr.map(item => item.propnameId + ':' + item.id).join('|'),
          propvalueTextList: arr.map(item2 => item2.name).join(';'),
          price: '',
          quantity: ''
        }
      })

      // 之前填写过的自动填写
      const oldSkus = this.temp.skus
      if (oldSkus && oldSkus.length > 0) {
        result.forEach(item => {
          const old = oldSkus.find(
            oldItem => oldItem.propvalueList === item.propvalueList
          )

          if (old) {
            item.id = old.id
            item.price = old.price
            item.quantity = old.quantity
          }
        })
      }

      this.temp.skus = result
    }
  },
  computed: {
    ...mapState('category', {
      categoryList: 'list'
    }),
    ...mapState('prop', {
      allPropnameList: 'list'
    }),
    allPropvalueList() {
      const result = []

      this.allPropnameList.forEach(propname => {
        propname.propvalues.forEach(propvalue => {
          result.push(propvalue)
        })
      })
      return result
    },
    categoryTree() {
      return utils.flatToTree(this.categoryList)
    },
    isCreate() {
      return !this.itemId
    },
    selectPropnameModels() {
      return this.temp.propnames.map(id => {
        return this.allPropnameList.find(item => item.id == id)
      }).filter(item => !!item)
    },
    filteredPropnameList() {
      return this.allPropnameList.filter(item => {
        return this.temp.propnames.indexOf(item.id) === -1
      })
    }
  },
  methods: {
    ...mapActions('category', {
      loadCategoryList: 'loadList'
    }),
    ...mapActions('prop', {
      loadPropnameList: 'loadList'
    }),
    async loadInfo() {
      const res = await this.$api.item.info({ id: this.itemId })

      this.temp.set(res.data)
    },
    createData() {
      this.$refs['form'].validate(async valid => {
        if (!valid) return

        const res = await this.$api.item.create(this.temp.get())

        this.$router.push('/item/item')
        this.$message.success('新增成功！')
      })
    },

    updateData() {
      this.$refs['form'].validate(async valid => {
        if (!valid) return

        this.temp.set({ id: this.itemId })

        const res = await this.$api.item.update(this.temp.get())

        this.$router.push('/item/item')
        this.$message.success('更新成功！')
      })
    },

    addImage(src) {
      this.temp.imgList.push(src)
    },

    removeImage(index) {
      this.temp.imgList.splice(index, 1)
    },

    addPropname() {
      this.propSelectValue.forEach(item => {
        this.temp.propnames.push(item)
        this.temp.propvalues.push([])
      })
      this.propSelectVisible = false
    },
    removePropname(index) {
      this.temp.propnames.splice(index, 1)
      this.temp.propvalues.splice(index, 1)
    },

    setAllPrice() {
      this.temp.skus.forEach(item => {
        item.price = this.allPrice
      })
      this.allPrice = ''
    },

    setAllQuantity() {
      this.temp.skus.forEach(item => {
        item.quantity = this.allQuantity
      })
      this.allQuantity = ''
    },
    showPropSelect() {
      this.propSelectVisible = true
      this.propSelectValue = []
    }
  },
  async created() {
    this.itemId = this.$route.params.itemId

    this.loadCategoryList()

    await this.loadPropnameList()

    if (this.itemId != null) {
      this.loadInfo()
    }
  }
}
</script>
