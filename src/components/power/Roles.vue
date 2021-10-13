<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="add">添加角色</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addclose"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormref"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色列表区域 -->
    <el-table :data="rolelist" border stripe>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 栅格布局 -->
          <el-row
            v-for="(item1, i1) in scope.row.children"
            :key="item1.id"
            :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
          >
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="removeRightById(scope.row, item1.id)">{{
                item1.authName
              }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二三级权限 -->
            <el-col :span="19">
              <!-- 二级权限 -->
              <el-row
                :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                v-for="(item2, i2) in item1.children"
                :key="item2.id"
              >
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="removeRightById(scope.row, item2.id)"
                    >{{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="18">
                  <el-tag
                    v-for="(item3, i3) in item2.children"
                    :key="item3.id"
                    type="warning"
                    closable
                    @close="removeRightById(scope.row, item3.id)"
                  >
                    {{ item3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="
              edituser(scope.row.id, scope.row.roleName, scope.row.roleDesc)
            "
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="removeuser(scope.row.id)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-setting"
            @click="showsetRightDialog(scope.row)"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editdialogVisible"
      width="50%"
      close="editclosed"
    >
      <el-form
        :model="editForm"
        :rules="addFormrules"
        ref="editFormref"
        label-width="100px"
      >
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName" disabled></el-input>
        </el-form-item>
        <!-- prop是校验规则 -->
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituserinfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close='setdefkeys'
    >
    <!-- 树形控件 -->
    <!-- :data是数据源,：prop是树形控件对象 -->
    <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key='id' default-expand-all :default-checked-keys='defkeys' ref='treeref'></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      /* 所有角色列表数据 */
      rolelist: [],
      dialogVisible: false,
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      addFormrules: {
        roleName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3到10位之间",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入用户描述", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "用户名描述在2到15位之间",
            trigger: "blur",
          },
        ],
      },
      editForm: {
        roleName: "",
        roleDesc: "",
      },
      editdialogVisible: false,
      setRightDialogVisible: false,
      /* 所有权限的数据 */
      rightslist: [],
      /* 树形控件的属性绑定对象,label是需要展示的键值对的键，children是循环的值 */
      treeProps:{
        label:'authName',
        children:'children'
      },
      /* 默认选中的数组id值 */
      defkeys:[],
      roleId:''
      
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolelist = res.data;
    },
    addclose() {
      this.$refs.addFormref.resetFields();
    },
    add() {
      this.dialogVisible = true;
    },
    async adduser() {
      const { data: res } = await this.$http.post("roles", this.addForm);
      if (res.meta.status !== 201) {
        this.dialogVisible = false;
        return this.$message.error("添加角色失败");
      }
      this.$message.success("添加角色成功");
      this.getRolesList();
      this.dialogVisible = false;
    },
    async edituser(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("编辑失败");
      }
      this.editdialogVisible = true;
      this.editForm = res.data;
      console.log(this.editForm);
    },
    editclosed() {
      this.$refs.editFormref.resetFields();
    },
    edituserinfo() {
      this.$refs.editFormref.validate(async (vaild) => {
        if (!vaild) {
          return;
        }
        /* 发起请求 */
        const { data: res } = await this.$http.put(
          "roles/" + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("更新失败");
        }
        /* 关闭对话框，刷新数据列表，提示修改成功 */
        this.editdialogVisible = false;
        this.getRolesList();
        this.$message.success("更新角色信息成功");
      });
    },
    async removeuser(id) {
      const confirmresult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmresult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.getRolesList();
      return this.$message.success("删除角色成功");
    },
    /* 根据id删除对应权限 */
    /* 这两个参数代表角色id和权限id */
    async removeRightById(role, rightId) {
      /* 弹框提示用户是否删除 */
      const confirmresult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmresult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      /* 不能重新调用这个函数，不然会重新渲染页面
       this.getRolesList() */
      role.children = res.data;
      return this.$message.success("确认了删除");
    },
    /* 展示分配权限的对话框 */
    async showsetRightDialog(role) {
      /* 角色id */
      this.roleId=role.id
      /* 获取所有权限的数据 */
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限失败");
      }
      this.rightslist = res.data;
      /* 递归获取三级权限id */
      this.getLeafKeys(role,this.defkeys)
      this.setRightDialogVisible = true;
    },
    /* 通过递归的形式获取三级权限的id并保存到defKeys数组 */
    getLeafKeys(node,arr){
      /* 如果node节点不包含children属性，那么就是三级权限 */
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item,arr)
      });
    },
    /* 监听分配权限的关闭事件 */
    setdefkeys(){
      this.defkeys=[]
    },
    /* 点击分配权限 */
  async  allotRights(){
      const keys=[
         ...this.$refs.treeref.getCheckedKeys(),
          ...this.$refs.treeref.getHalfCheckedKeys()
      ];
      const idStr=keys.join(',');
  const{data:res}=  await  this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});
  if(res.meta.status!==200){
    return this.$message.error('分配权限失败')
  }
  this.$message.success('分配权限成功')
  this.getRolesList();
  this.setRightDialogVisible=false

    } 
  },
};
</script>

<style  scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 14px;
}
.el-card {
  border: 0 1px 1px rgb(0, 0, 0, 0.15) !important;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>