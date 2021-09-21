import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const router = new VueRouter({
  routes
})
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
  return  next()
  }
  const token = window.sessionStorage.getItem('token');
  if (!token) {
    //没有token强制跳转到登录页
    return next('/login')
  }
  next()
})
export default router
