import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css

import Vue from 'vue'
import Cookies from 'js-cookie'

import Element from 'element-ui'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
// import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import api from '@/api'

Vue.prototype.$api = api

//element Tooptip没有延迟选项，所以用其他的
import VueTippy, { TippyComponent } from 'vue-tippy'
Vue.use(VueTippy);
Vue.component("tippy", TippyComponent);

import '@/components'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

Vue.use(Element, {
  size: 'small', // set element-ui default size
  locale: zhLocale
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
