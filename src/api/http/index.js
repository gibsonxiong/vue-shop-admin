import Axios from 'axios'
import { Message, Loading } from 'element-ui'
import * as config from '../../config'
import router from '@/router'
// import i18n from '../../i18n';

// 暂时这样暴露对象
export const services = {
  $setToken(token) {
    localStorage.setItem('shop-admin/token', token)
  },

  $getToken() {
    return localStorage.getItem('shop-admin/token')
  },

  $removeToken() {
    return localStorage.removeItem('shop-admin/token')
  },

  // refreshToken
  $setRefreshToken(refreshToken) {
    localStorage.setItem('shop-admin/refreshToken', refreshToken)
  },

  $getRefreshToken() {
    return localStorage.getItem('shop-admin/refreshToken')
  },

  $removeRefreshToken() {
    return localStorage.removeItem('shop-admin/refreshToken')
  },

  $isLogin() {
    return this.$getToken() !== '' && this.$getToken() !== null
  },

  $isError(res) {
    return res.code !== 0
  },

  async refreshToken(refreshToken) {
    const res = (await request.post('/token/refresh', {
      refreshToken
    }, {
      skipCheckToken: true
    })).data

    if (res.code === 0) {
      services.$setToken(res.data.token)
      services.$setRefreshToken(res.data.refreshToken)
    }

    return res
  }
}

function showMessage(message) {
  Message.error(message)
}

let loadingInstance
function showLoading() {
  loadingInstance = Loading.service({ fullscreen: true })
}

function hideLoading() {
  if (!loadingInstance) return

  loadingInstance.close()
  loadingInstance = null
}

function isErrorRes(res) {
  return res.code != 0
}

function createTask() {
  let resolve
  let reject
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  return {
    resolve,
    reject,
    promise
  }
}

let refreshTask

// 创建axios实例
const instance = Axios.create({
  baseURL: `${config.ip}/admin`,
  timeout: 1000 * 8,

  showLoading: false, // 是否显示loading状态
  catchErrorResponse: true // 是否捕获错误响应
})

/**
  * 请求拦截器
  */
instance.interceptors.request.use((config) => {
  console.log(config, 'req.config')
  if (config.showLoading) {
    showLoading()
  }

  // 添加token
  const token = services.$getToken()
  config.headers['Authorization'] = token || ''

  return config
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(async(axiosRes) => {
  const config = axiosRes.config
  const res = axiosRes.data

  console.log(axiosRes)

  if (config.showLoading) {
    hideLoading()
  }

  // 校验token逻辑 start
  // token过期，需要刷新token
  if (res.code == 99) {
    // 如果没有发起请求
    if (!refreshTask) {
      refreshTask = createTask()

      // 刷新token
      const refreshToken = services.$getRefreshToken()
      services.refreshToken(refreshToken)
        .then(res => {
          if (res.code !== 0) throw new Error('刷新token失败')

          refreshTask.resolve()
        }).catch(err => {
          refreshTask.reject()
        }).finally(() => {
          refreshTask = null
        })
    }

    try {
      await refreshTask.promise

      console.log('刷新token成功,正在重新请求')
      return await _request(axiosRes.config)
    } catch (err) {
      console.log('刷新token失败')
      // 把状态码改成认证失败
      res.code = 97
    }
  }

  const needLoginCodes = [96, 97, 98]
  if ((needLoginCodes.indexOf(res.code) !== -1)) {
    router.push('/home')
    services.$removeToken()
  }
  // 校验token逻辑 end

  if (config.catchErrorResponse && isErrorRes(res)) {
    showMessage(res.message)
    throw new Error(res.message)
  }

  return axiosRes
}, error => {
  const config = error.config
  console.log(config, 'res.config')
  if (config.showLoading) {
    hideLoading()
  }

  if (error.code === 'ECONNABORTED') {
    // showMessage(i18n.t('jsContent.networkTimeout'));
    showMessage('jsContent.networkTimeout')
  } else if (error.message === 'Network Error') {
    // showMessage(i18n.t('jsContent.networkError'));
    showMessage('jsContent.networkError')
  } else {
    // showMessage(error.messsage || i18n.t('jsContent.OperationFailed'));
    showMessage(error.messsage || 'jsContent.OperationFailed')
  }

  return Promise.reject(error)
})
export default instance

