<template>
  <div class="container">
    <!-- 头部区域 -->
    <el-container class="home-el-container">
      <el-header>
        <div>
          <img src="@/assets/img/heima.png" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="clearout">退出</el-button></el-header
      >
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="iscollapse ? '64px' :'200px'">
          <div class="toggle-button" @click="toggle">|||</div>
          <!-- 侧边栏菜单 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            :collapse='iscollapse'
            :collapse-transition='false'
            router
            :default-active='activepath'
          >
            <!-- index不能相同，而且要为字符串 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menulist"
              :key="item.id"
            >
              <!-- 一级菜单的模板区 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsobj[item.id]"></i>
                <!-- 文本 -->
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+twoitem.path"
                v-for="twoitem in item.children"
                :key="twoitem.id"
                @click="changepath('/'+twoitem.path)"
              >
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{ twoitem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      /* 左侧菜单数据 */
      menulist: [],
      iconsobj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      iscollapse:false,
      /* 菜单的激活数据 */
      activepath:'/user'
    };
  },
  created() {
    this.Getmenulist();
    /* 高亮效果保持 */
    this.activepath=window.sessionStorage.getItem('activepath') 
  },
  methods: {
    async Getmenulist() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$messsge.error(res.meta.msg);
      this.menulist = res.data;
    },
    clearout() {
      //清空token
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //点击切换折叠展开
    toggle(){
      this.iscollapse=!this.iscollapse;
    },
    changepath(apath){
      window.sessionStorage.setItem('activepath',apath);
      this.activepath=apath;
    }
  },
};
</script>

<style scoped>
/* element-ui的组件名就是类名 */
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
  margin-left: 15px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.container {
  height: 100%;
}
.home-el-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
  font-size: 20px;
}
.el-menu {
  border-right: none;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
}
</style>