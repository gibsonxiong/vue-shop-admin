<style lang="scss" scoped>
.register-page {
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

  .register-wrap {
    margin: 0 auto;
    width: 500px;
    background: #fff;
    color: #333;
    padding: 31px;
    border-radius: 2px;
    border: 1px solid #eee;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .register-title {
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
  <div class="register-page">
    <div class="main-header">
      <img style="width:30px;" :src="require('@/assets/logo.png')" alt />
      <span class="title">VShop</span>
    </div>

    <div class="main-wrap">
      <div class="register-wrap">
        <h2 class="register-title">注册</h2>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="register-form"
          autocomplete="on"
          label-position="left"
          @submit.native.prevent="register"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="验证码" prop="smsCode">
            <div style="display:flex;width:100%;">
              <el-input v-model="form.smsCode" placeholder="请输入验证码" style="flex:1;" />
              <el-button
                v-if="timer>0"
                type="primary"
                style="margin-left:10px;"
                disabled
              >{{timer}}s后重发</el-button>
              <el-button v-else type="primary" style="margin-left:10px;" @click="getSmsCode">发送</el-button>
            </div>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" placeholder="请输入重复密码" />
          </el-form-item>
          <el-form-item>
            <el-button native-type="submit" type="primary">注册</el-button>
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
      timer: 0,

      form: {
        phone: "13686004519",
        smsCode: "",
        password: "",
        confirmPassword: ""
      },

      rules: {
        phone: [
          { required: true },
          {
            validator: (rule, value, callback) => {
              if (!/\d{11}/.test(value)) {
                callback(new Error("手机号不正确"));
              }else{
                callback();
              }
            }
          }
        ],
        smsCode: [{ required: true }],
        password: [{ required: true }],
        confirmPassword: [
          { required: true },
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.password) {
                callback(new Error("两次输入的密码不相同"));
              }else{
                callback();
              }
            }
          }
        ]
      }
    };
  },

  methods: {
     getSmsCode() {
        let valid = true;
        this.$refs.form.validateField(["phone"], async (error) => {
          if(error) return;

          const res = await this.$api.getSmsCode({
            phone: this.form.phone,
            type: "register"
          });
    
          this.$message.success(res.message);
          this.countdown(60);
        });
    },

    register() {
      this.$refs.form.validate(async valid => {

        if (!valid) return;

        const res = await this.$api.register(this.form);

        this.$message.success(res.message);

        this.$router.back();
      });
    },

    countdown(num) {
      if (num) {
        this.timer = num;
      }

      setTimeout(() => {
        if (this.timer > 0) {
          this.timer--;
          this.countdown();
        }
      }, 1000);
    }
  },
  created() {}
};
</script>


