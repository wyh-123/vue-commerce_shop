<template>
  <div class="container">
    <div class="login">
      <div class="imglogo">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <!-- 登录 -->
      <el-form
        ref="form_ref"
        label-width="0px"
        class="login_form"
        :model="loginform"
        :rules="loginrules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <!-- 使用iconfont -->
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginform.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginform.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      /* 绑定的数据对象 */
      loginform: {
        username: "admin",
        password: "123456",
      },
      /* 表单的验证规则 */
      loginrules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码名称", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    reset() {
      /* element-ui提供的重置方法 */
      this.$refs.form_ref.resetFields();
    },
    login() {
      /* element-ui提供的校验方法，返回布尔值 */
      this.$refs.form_ref.validate(async (result) => {
        if (!result) return;
        /* 利用await简化promise对象 */
        const { data: res } = await this.$http.post("login", this.loginform);
        if (res.meta.status !== 200) {
          console.log(1);
          return this.$message.error("登录失败");
        }
        this.$message.success("登录成功");
        //1.将登录成功的token保存到客户端的sessionStorge中
        //1.1为什么不保存到localStorge，因为token只应在当前网站打开期间生效
        window.sessionStorage.setItem("token", res.data.token);
        //通过编程式导航跳转到后台页面
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
}
.login {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.imglogo {
  height: 130px;
  width: 130px;
  border: 1px solid #fff;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  /* left50%是按照父级盒子大小 */
  left: 50%;
  /* -50%是根据当前130px盒子大小 */
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.imglogo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
}
</style>