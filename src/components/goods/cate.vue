<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" class="buttons" @click="showadddialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-eror" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 按钮 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editcate(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
          @click="editdelete(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addcartdialogVisible"
      width="50%"
      @close="addcatedialog"
    >
      <el-form
        ref="addcartform"
        :model="addcartform"
        label-width="100px"
        :rules="addcartformrules"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addcartform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options是数据源 -->
          <!-- props用来指定配置对象 -->
          <!-- v-model必须绑定数组 -->
          <el-cascader
            props.expandTrigger="hover"
            v-model="selectedKeys"
            :options="parentcatelist"
            :props="castaderProps"
            @change="parentCateChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addcartdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCart">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑的对话框 -->
    <el-dialog title="修改分类" :visible.sync="editdialogVisible" width="50%" @close="editclosed">
      <el-form
        ref="editcartform"
        :model="editcartform"
        label-width="100px"
        :rules="editcartformrules"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editcartform.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editconfig">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      /* 商品分类的数据列表 */
      cateList: [],
      /* 查询条件 */
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      /* 总的数据条数 */
      total: 0,
      /* 为table指定列的定义，每个对象就是一列 */
      columns: [
        {
          label: "分类名称",
          /* 需要展示的数据名 */
          prop: "cat_name",
        },
        {
          label: "是否有效",
          /* 表示将当前列定义为模板列 */
          type: "template",
          /* 表示当前这一列使用的模板名称 */
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "标题",
          type: "template",
          template: "opt",
        },
      ],
      /* 对话框显示隐藏 */
      addcartdialogVisible: false,
      /* 添加表单的数据对象 */
      addcartform: {
        /* 要添加的分类 */
        cat_name: "",
        /* 父级分类的id */
        cat_pid: 0,
        /* 分类的等级 */
        cat_level: 1,
      },
      /* 添加表单的验证对象,prop属性的值必须和v-model绑定的值一样 */
      addcartformrules: {
        cat_name: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
      },
      /* 父级分类的列表 */
      parentcatelist: [],
      /* 级联选择器配置对象 */
      castaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      /* 选中的父级分类id数组 */
      selectedKeys: [],
      /* 编辑对话框的显示隐藏 */
      editdialogVisible: false,
      /* 修改表单的数据对象 */
      editcartform: {
        cat_id: 0,
        cat_name: "",
      },
      /* 修改的规则 */
      editcartformrules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
         
        ],
      },
    };
  },
  created() {
    this.getCatelist();
  },
  methods: {
    /* 获取商品分类列表 */
    async getCatelist() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品失败");
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    /* 监听pagesize改变 */
    handleSizeChange(newsize) {
      this.querInfo.pagesize = newsize;
      this.getCatelist();
    },
    /* 监听pagenum改变 */
    handleCurrentChange(newpagenum) {
      this.querInfo.pagenum = newpagenum;
      this.getCatelist();
    },
    /* 展示对话框 */
    showadddialog() {
      this.getparentcatelist();
      this.addcartdialogVisible = true;
    },
    /* 添加对话框的获取父级分类 */
    async getparentcatelist() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类失败");
      }
      this.parentcatelist = res.data;
    },
    /* 选择项发生变化触发 */
    parentCateChanged() {
      /* 如果selectedKeys数组的length大于0，证明选中了父级分类 */
      if (this.selectedKeys.length > 0) {
        /* 父级分类的id */
        this.addcartform.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        /* 为当前分类的等级赋值 */
        this.addcartform.cat_level = this.selectedKeys.length;
      } else {
        this.addcartform.cat_pid = 0;
        this.addcartform.cat_level = 0;
      }
    },
    /* close事件,重置表单 */
    addcatedialog() {
      this.$refs.addcartform.resetFields();
      this.selectedKeys = [];
      this.addcartform.cat_pid = 0;
      this.addcartform.cat_level = 0;
    },
    /* 添加分类的确定按钮事件 */
    addCart() {
      this.$refs.addcartform.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addcartform
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.getCatelist();
        this.addcartdialogVisible = false;
      });
    },
    /* 编辑分类 */
    /* 先查询出分类名 */
    async editcate(id) {
      const { data: res } = await this.$http.get(`categories/` + id);
      if (res.meta.status !== 200) {
        this.$message.error("查询失败");
      }
      this.editcartform.cat_id = res.data.cat_id;
      this.editdialogVisible = true;
    },
    /* 提交分类 */
    async editconfig() {
      const { data: res } = await this.$http.put(
        "categories/" + this.editcartform.cat_id,
        {
          cat_name: this.editcartform.cat_name,
        }
      );
      if(res.meta.status!==200){
        return this.$message.error('失败')
      }
      this.$message.success('编辑成功');
      this.getCatelist()
      this.editdialogVisible = false;
    },
    /* close事件 */
    editclosed(){
      this.editcartform.cat_name='';
      this.editcartform.id=0
    },
     /* 根据id删除用户 */
    async editdelete(id) {
      /* 询问用户是否删除 */
      const confirmresult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //如果确认删除返回confirm字符串
      //如果取消删除返回字符串cancel
      if (confirmresult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.getCatelist();
      return this.$message.success("删除用户成功");
    },
  },
};
</script>

<style  scoped>
.el-card {
  border: 0 1px 1px rgb(0, 0, 0, 0.15) !important;
  margin-top: 15px;
}
.buttons {
  margin-bottom: 10px;
}
</style>