import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/components/Home.vue"
import Login from "@/components/Login.vue"
import Welcome from "@/components/Welcome.vue"
import User from "@/components/user/user.vue"
import Rights from "@/components/power/Rights.vue"
import Roles from "@/components/power/Roles"
import cate from "@/components/goods/cate.vue"
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    {
      path: '/home', component: Home,
      redirect:'/welcome',
      children: [
        {path:'/welcome',component:Welcome},
        { path: '/users', component: User },
        { path: '/rights', component: Rights },
        {path:"/roles",component:Roles},
        {path:"/categories",component:cate}
      ]
    }
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
