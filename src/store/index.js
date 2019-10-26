import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

const files = require.context('./modules', true, /\.js$/)
const modules = files.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  modules[moduleName] = files(modulePath).default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters
})

export default store
