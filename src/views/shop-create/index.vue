<style lang="scss" scoped>
.shop-create-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.main-header {
  padding: 30px 60px;
  color: #333;
  background: #f5f5f5;
    border-bottom: 1px solid #f1f1f1;
    display: flex;
    align-items: center;
  .title {
    margin-left: 10px;
    font-size: 20px;
  }
}
.main-wrap {
  flex: 1;
  margin: 0;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 100px;
  overflow: hidden;
  // background:linear-gradient(110.85446deg, #f75171 26%, #e04488 100%);

  .tip{
    text-align:center;margin-bottom:20px;
    font-size: 14px;
  }

  .shop-create-wrap {
    margin: 0 auto;
    width: 500px;
    background: #fff;
    color: #333;
    padding: 31px;
    border-radius: 2px;
    border:1px solid #eee;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .title {
      font-size: 20px;
          margin-bottom: 25px;
    }
  }
}
.main-footer {
  padding: 20px;
  background: #fff;
  text-align: center;
  font-size: 14px;

  .link-wrap {
    color: #333;
    padding: 10px;
  }

  .copyright {
    font-size: 12px;
    color: #777;
  }
}
</style>

<template>
  <div class="shop-create-page">
    <div class="main-header">
      <img  style="width:30px;" :src="require('@/assets/logo.png')" alt="">
      <span class="title">VShop</span>
    </div>
    
    <div class="main-wrap">
      
        <p class="tip">你还没有店铺，请先创建</p>

      <div class="shop-create-wrap">
        <h2 class="title">创建店铺</h2>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          autocomplete="on"
          label-position="left"
          @submit.native.prevent="createShop"
        >
          <el-form-item label="店铺名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入店铺名称"/>
          </el-form-item>
          <el-form-item>
              <el-button native-type="submit" type="primary">创建</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main-footer">
      <div class="link-wrap">
        <a href="javascript:;">帮助中心</a> |
        <a href="javascript:;">交易条款</a> |
        <a href="javascript:;">诚征英才</a> |
        <a href="javascript:;">网站地图</a>
      </div>
      <div class="copyright">Copyright@2019-2020 VShop 版权所有站长统计</div>
    </div>
  </div>
</template>

<script>
import { services } from "@/api/http";
export default {
  data() {
    return {
      form: {
        name: "",
      },
      rules: {}
    };
  },
  created() {

  },
  methods: {
    createShop() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;

        const res = await this.$api.createShop(this.form);

        this.$message.success(res.message);

        this.$router.push('/dashboard');
      });
    }
  }
};
</script>


