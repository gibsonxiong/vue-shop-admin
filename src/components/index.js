import Vue from 'vue'

Vue.component('query-container', require('./query/query-container').default)
Vue.component('query-item', require('./query/query-item').default)
Vue.component('c-upload', require('./upload/index').default)
Vue.component('c-single-upload', require('./upload/single').default)
Vue.component('c-btn-wrap', require('./btn-wrap/index').default)
Vue.component('c-pagination', require('./Pagination').default)
Vue.component('c-omit-text', require('./omit-text/omit-text').default)
Vue.component('c-flexbox', require('./flexbox/flexbox').default)
Vue.component('c-code-editor', require('./code-editor/code-editor').default)