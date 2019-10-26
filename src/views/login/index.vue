<template>
  <div class="login-wrap">
    <h2 class="login-title">登录</h2>
    <el-form ref="form" :model="form" :rules="rules" class="login-form" autocomplete="on" label-position="left" @submit.native.prevent="login">
      <el-form-item label="phone" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="password" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button native-type="submit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { services } from '@/api/http'
export default {
  data() {
    return {
      form: {
        phone: '13686004518',
        password: '123456'
      },
      rules: {}
    }
  },
  created() {
    // 清除登录状态
    services.$removeToken()
    this.$store.commit('user/SET_USER_INFO', {})
  },
  methods: {
    login() {
      this.$refs.form.validate(async valid => {
        if (!valid) return

        const res = await this.$api.login(this.form)

        this.$message.success(res.message)

        services.$setToken(res.data.token)
        services.$setRefreshToken(res.data.refreshToken)

        this.$router.push('/')
      })
    }
  }
}
</script>

<style lang="scss">
.login-wrap{
  width: 350px;
  border: 1px solid #eee;
  padding: 10px;

  .login-title{
    font-size: 16px;
  }
}
</style>
