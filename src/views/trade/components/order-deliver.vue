<style>
</style>

<template>
  <el-dialog :title="'发货'" :visible="visible" @update:visible="setVisible">
    <el-form
      ref="form"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="70px"
      style="width: 400px; margin-left:50px;"
    >
      <el-form-item label="快递公司" prop="deliverCompanyId">
        <el-select v-model="temp.deliverCompanyId">
          <el-option v-for="deliver in deliverList" :key="deliver.id" :label="deliver.name" :value="deliver.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="快递单号" prop="deliverPostNo">
        <el-input v-model="temp.deliverPostNo" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="setVisible(false)">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import BaseModel from "@/utils/BaseModel";

class Model extends BaseModel {
  deliverCompanyId = null;
  deliverPostNo = null;
}

const rules = {

};

export default {
  props: {
    id:{
      type: [String,Number],
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      temp: new Model(),
      rules
    };
  },
  computed: {
    ...mapState("deliver", {
      deliverList: "list"
    })
  },
  watch: {
    visible(value) {
      if (value) {
        this.temp = new Model();

        this.$nextTick(() => {
          this.$refs["form"].clearValidate();
        });
      }
    }
  },

  methods: {
    ...mapActions("deliver", {
      loadDeliverList: "loadList"
    }),
    submit() {
      this.$refs["form"].validate(async valid => {
        if (!valid) return;

        const res = await this.$api.order.deliver(this.id, this.temp.get());

        this.$emit("dataSubmited");
        this.$message.success("发货成功！");
        this.setVisible(false);
      });
    },

    setVisible(visible) {
      this.$emit("update:visible", visible);
    }
  },
  created() {
    this.loadDeliverList();
  }
};
</script>

