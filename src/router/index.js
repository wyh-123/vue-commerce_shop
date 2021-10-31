import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/components/Home.vue"
import Login from "@/components/Login.vue"
import Welcome from "@/components/Welcome.vue"
import User from "@/components/user/user.vue"
import Rights from "@/components/power/Rights.vue"
import Roles from "@/components/power/Roles"
import cate from "@/components/goods/cate.vue"
import params from "@/components/goods/params.vue"
import List from "@/components/goods/List.vue"
import add from "@/components/goods/add.vue"
import order from "@/components/order/order.vue"
import report from '@/components/report/report.vue'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    {
      path: '/home', component: Home,
      redirect: '/welcome',
      /* 因为home页面里有routerview，所以这些路由要写在children里面 */
      children: [
        {path:'/welcome',component:Welcome},
        { path: '/users', component: User }, 
        { path: '/rights', component: Rights },
        {path:"/roles",component:Roles},
        {path:"/categories",component:cate},
        {path:"/params",component:params},
        { path: "/goods", component: List },
        { path: "/goods/add", component: add },
        { path: "/orders", component: order },
        {path:"/reports",component:report}
      ]
    },

  ]
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
