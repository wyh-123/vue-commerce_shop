<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <!-- el-row和el-col是栅格布局 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="userinfo.query"
            clearable
            @clear="getueserlist"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 作用域插槽自定义内容,el-switch用v-model双向绑定数据 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userstatechange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <!-- 通过scope.row能拿到数据 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edituser(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeuser(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button
            ></el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userinfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="userinfo.pagesize"
        layout=" sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addclose"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormref"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" type="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input> </el-form-item
      ></el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editdialogVisible" width="50%" close='editclosed'>
      <el-form
        :model="editForm"
        :rules="addFormrules"
        ref="editFormref"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <!-- prop是校验规则 -->
         <el-form-item label="邮箱" prop='email'>
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
         <el-form-item label="手机号" prop='mobile'>
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituserinfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      /* 获取用户的参数信息 */
      userinfo: {
        query: "",
        /* 当前的页码 */
        pagenum: 1,
        /* 当前每页显示的数据条数 */
        pagesize: 2,
      },
      /* 接收后台的数据 */
      userlist: [],
      /* 总共的数据条数 */
      total: 0,
      /* 对话框的显示与隐藏 */
      dialogVisible: false,
      /* 添加用户的表单数据对象 */
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      /* 添加验证规则 */
      addFormrules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3到10位之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的密码长度在3到10位之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: " 请输入邮箱", trigger: "blur" },
          {
            pattern:
              /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)+$/,
            message: "邮箱格式不对",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,])|(19[7]))\d{8}$/,
            message: "手机号格式不对",
            trigger: "blur",
          },
        ],
      },
      editdialogVisible: false,
      /* 查询到的用户信息 */
      editForm: {},
      /* 修改表单的验证规则对象 */
      addFormrules:{
        email:[
           { required: true, message: " 请输入邮箱", trigger: "blur" },
          {
            pattern:
              /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)+$/,
            message: "邮箱格式不对",
            trigger: "blur",
          },
        ],
        mobile:[
           { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,])|(19[7]))\d{8}$/,
            message: "手机号格式不对",
            trigger: "blur",
          },
        ]
      }
    };
  },
  created() {
    this.getueserlist();
  },
  methods: {
    async getueserlist() {
      const { data: res } = await this.$http.get("users", {
        params: this.userinfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
      console.log(res);
    },
    /* 监听页码值改变 */
    handleSizeChange(newpagesize) {
      this.userinfo.pagesize = newpagesize;
      this.getueserlist();
    },
    handleCurrentChange(newcurrrentpage) {
      this.userinfo.pagenum = newcurrrentpage;
      this.getueserlist();
    },
    /* 监听用户状态改变 */
    async userstatechange(user) {
      const { data: res } = await this.$http.put(
        `users/:${user.id}/state/:${user.mg_state}`
      );
      if (res.meta.status == 200) {
        user.mg_state = !user.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },
    search() {
      this.getueserlist();
    },
    /* 对话框关闭后重置内容 */
    addclose() {
      this.$refs.addFormref.resetFields();
    },
    adduser() {
      this.$refs.addFormref.validate(async (valid) => {
        if (!valid) {
          return;
        }
        /* 发送添加用户的请求 */
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功！");
        this.dialogVisible = false;
        /* 重新获取用户列表 */
        this.getueserlist();
      });
    },
    /* 修改用户 */
    async edituser(id) {
      const { data: res } = await this.$http.get("user/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询失败");
      }
      this.editForm = res.data;
      this.editdialogVisible = true;
    },
   async edituser(id){
      const {data:res}=await this.$http.get('users/'+id);
      if(res.meta.status!==200){
      return  this.$message.error('查询失败');
      }
      this.editdialogVisible=true;
      this.editForm=res.data;
      console.log(this.editForm);
    },
    /* 兼容修改对话框的关闭 */
    editclosed(){
      this.$refs.editFormref.resetFields()
    },
    /* 修改用户信息并提交 */
    edituserinfo(){
      this.$refs.editFormref.validate(async vaild=>{
        if(!vaild){
          return 
        }
        /* 发起请求 */
     const{data:res}=  await this.$http.put('users/'+this.editForm.id,{
         email: this.editForm.email,
         mobile:this.editForm.mobile
        })
        if(res.meta.status!==200){
         return  this.$message.error('更新失败')
        }
        /* 关闭对话框，刷新数据列表，提示修改成功 */
        this.editdialogVisible=false;
        this.getueserlist();
        this.$message.success('更新用户信息成功')
      })
    },
    /* 根据id删除用户 */
  async  removeuser(id){
      /* 询问用户是否删除 */
    const confirmresult=  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        //如果确认删除返回confirm字符串
        //如果取消删除返回字符串cancel
        if(confirmresult!=='confirm'){
          return this.$message.info('已取消删除')
        }
     const {data:res} =await this.$http.delete('users/'+id);
     if(res.meta.status!==200){
       return this.$message.error('删除失败')
     }
     this.getueserlist();
    return this.$message.success('删除用户成功')

    }
  },
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 14px;
}
.el-card {
  border: 0 1px 1px rgb(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
  font-size: 14px;
}
.el-pagination {
  margin-top: 15px;
}
</style>