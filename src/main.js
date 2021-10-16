import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
/* 导入element-ui的css */
import 'element-ui/lib/theme-chalk/index.css';
/* 导入iconfont的css */
import  '@/assets/iconfont/iconfont.css'
import axios from 'axios'
import 'default-passive-events'
/* 导入插件 */
import TreeTable from 'vue-table-with-tree-grid'
/* 配置请求根路径 */
axios.defaults.baseURL = `https://lianghj.top:8888/api/private/v1/`;
axios.interceptors.request.use(config => {
  /* 为请求头对象添加Token验证的Authorization字段 */
  config.headers.Authorization=window.sessionStorage.getItem('token')
  /* 最后必须return config */
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
