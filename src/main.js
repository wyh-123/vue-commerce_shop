import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
/* 导入element-ui的css */
import 'element-ui/lib/theme-chalk/index.css';
/* 导入iconfont的css */
import '@/assets/iconfont/iconfont.css'
/* 导入全局样式表 */
import "@/assets/css/global.css"
import axios from 'axios'
import 'default-passive-events'
/* 导入插件 */
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入css
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
/* 配置请求根路径 */
/* 地址1 */
/* `http://127.0.0.1:8888/api/private/v1/` */
/* 地址2 */
/* https://lianghj.top:8888/api/private/v1/ */
axios.defaults.baseURL = `https://lianghj.top:8888/api/private/v1/`;
axios.interceptors.request.use(config => {
  /* 为请求头对象添加Token验证的Authorization字段 */
  config.headers.Authorization = window.sessionStorage.getItem('token')
  /* 最后必须return config */
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueQuillEditor);
//定义一个全局过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  //padStart是月份不足两位用0填充
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');
  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');
  return `${y}-${m}-${d}-${hh}:${mm}:${ss}`
})
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
