<style lang="scss" scoped>
.home-page {
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

  .kouhao{
    letter-spacing: 10px;
    margin-top: 20px;
    float: left;
    font-size: 40px;
    color: #222;
    text-shadow: 0 4px 10px #464444;
  }

  .login-wrap {
    float: right;
    width: 350px;
    background: #fff;
    color: #333;
    padding: 31px;
    border-radius: 2px;
    border:1px solid #eee;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .login-title {
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
  <div class="home-page">
    <div class="main-header">
      <img  style="width:30px;" :src="require('@/assets/logo.png')" alt="">
      <span class="title">VShop</span>
    </div>
    
    <div class="main-wrap">
      <div class="kouhao">
        限时0元开店，马上体验
        <div style="margin-top:30px;">
          <el-button native-type="submit" size="large" type="primary" style="font-weight:600" round @click="$router.push('/register')">注册体验</el-button>
        </div>
      </div>

      <div class="login-wrap">
        <h2 class="login-title">登录</h2>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="login-form"
          autocomplete="on"
          label-position="left"
          @submit.native.prevent="login"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码"/>
          </el-form-item>
          <el-form-item>
            

            <div style="overflow:hidden;">
              <el-button native-type="submit" type="primary">登录</el-button>
              <span style="float:right">还没账号？去<router-link to="/register" style="color:#1890ff;">注册</router-link></span>
            </div>
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
        phone: "13686004518",
        password: "123456"
      },
      rules: {}
    };
  },
  created() {
    // 清除登录状态
    services.$removeToken();
    this.$store.commit("user/SET_USER_INFO", {});
  },
  methods: {
    login() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;

        const res = await this.$api.login(this.form);

        // this.$message.success(res.message);

        services.$setToken(res.data.token);
        services.$setRefreshToken(res.data.refreshToken);

        if(res.data.shopId){
          this.$router.push("/dashboard");
        }else{
          this.$router.push('/shop-create')
        }
      });
    }
  }
};
</script>


