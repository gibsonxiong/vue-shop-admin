import http from './http'

const files = require.context('./modules', true, /\.js$/)
const modules = files.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  modules[moduleName] = files(modulePath).default
  return modules
}, {})

const api = {
  ...modules,

  // 上传图片
  async upload(formData, onUploadProgress, config) {
    return (await http.put(`/upload`, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    })).data
  },

  // 登录
  async login(args, config) {
    return (await http.post('/login', args, config)).data
  },

  // 个人信息
  async loadUserInfo(args, config) {
    return (await http.get('/userInfo', args, config)).data
  }
}

export default api
