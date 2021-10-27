<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="注意:只允许为第三级设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectcatekeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activename" @tab-click="handletabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many"
          ><el-button
            type="primary"
            :disabled="isBtnDisabled"
            class="margin"
            @click="adddialogvisible = true"
            >添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close='handleClose(i,scope.row)'
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框,得要key -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"> </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showeditdialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="remove(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            :disabled="isBtnDisabled"
            class="margin"
            @click="adddialogvisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
              <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close='handleClose(i,scope.row)'
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框,得要key -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showeditdialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="remove(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="adddialogvisible"
      width="50%"
      @close="adddialogclose"
    >
      <el-form
        ref="addformRef"
        :model="addform"
        label-width="100px"
        :rules="addfromRules"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addform.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="addparams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editdialogvisible"
      width="50%"
      @close="editdialogclose"
    >
      <el-form
        ref="editformRef"
        :model="editform"
        label-width="100px"
        :rules="editfromRules"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editform.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="editparams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      catelist: [],
      /* 级联选择框的配置对象 */
      cateProps: {
        expandTrigger: "hover",
        /* 这个value实现了绑定分类id的功能 */
        value: "cat_id",
        /* 这个是级联选择框要展示的内容 */
        label: "cat_name",
        children: "children",
      },
      /* 级联选择框双向绑定到的数组 */
      selectcatekeys: [],
      /* 被激活的页签的名称 */
      activename: "many",
      /* 动态参数数据 */
      manyTableData: [],
      /* 静态属性数据 */
      onlyTableData: [],
      adddialogvisible: false,
      //添加参数的表单数据对象
      addform: {
        attr_name: "",
      },
      /* 验证规则 */
      addfromRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      editdialogvisible: false,
      editform: {
        attr_name: "",
      },
      editfromRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    /* 获取商品分类 */
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        this.$message.error("获取失败");
      }
      this.catelist = res.data;
    },
    /* 级联选择框变化会触发 */
    handleChange() {
      this.getParamsdata();

    },
    /* 获取参数的列表数据 */
    async getParamsdata() {
      if (this.selectcatekeys.length !== 3) {
        /* 只能选中三级数据 */
        this.selectcatekeys = [];
        this.manyTableData=[];
        this.onlyTableData=[];
        this.$message.warning("只能选择三级分类");
        return;
      }
      /* 根据id和当前面板发请求 */
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activename,
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        /* 控制文本框的显示隐藏，每个newtag都要有对应的key，不然修改一个会修改全部 */
        item.inputVisible = false;
        item.inputValue = "";
      });

      /* 判断是静态数据还是动态分类 */
      if (this.activename === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    /* tab页签点击事件处理函数 */
    handletabClick() {
      this.getParamsdata();
    },
    adddialogclose() {
      this.$refs.addformRef.resetFields();
    },
    addparams() {
      this.$refs.addformRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addform.attr_name,
            attr_sel: this.activename,
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this.getParamsdata();
      });
      this.adddialogvisible = false;
    },
    editdialogclose() {
      this.$refs.editformRef.resetFields();
    },
    async showeditdialog(id) {
      /* 查询当前参数的信息 */
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activename },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("查询失败");
      }
      this.editform = res.data;
      this.editdialogvisible = true;
    },
    editparams() {
      this.$refs.editformRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editform.attr_id}`,
          {
            attr_name: this.editform.attr_name,
            attr_sel: this.activename,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("失败");
        }
        this.$message.success("修改成功");
        this.getParamsdata();
        this.editdialogvisible = false;
      });
    },
    /* 根据id删除 */
    async remove(attr_id) {
      const res = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        console.log(err);
      });
      if (res !== "confirm") {
        return this.$message.error("取消删除");
      }
      const { data: result } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (result.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getParamsdata();
    },
    /* 文本框失去焦点或摁下了enter都会触发 */
    async handleInputConfirm(scope) {
      //把value放进被双向绑定的attr_vals数组里面
      scope.attr_vals.push(scope.inputValue);
      scope.inputValue = "";
      /* 实现文本框失去焦点变为按钮 */
      scope.inputVisible = false;
      console.log(scope.attr_vals.join(' '));
       console.log(scope.attr_vals.join(','));
      /* 发起请求保存到数据库中 */
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${scope.attr_id}`,
        {
          attr_mame: scope.attr_mame,
          attr_sel: scope.attr_sel,
          attr_vals:scope.attr_vals.join(',')
        }
      );
      if (res.meta.status !== 200) {
        console.log(res);
        return this.$message.success("修改成功");
      }
      return 1;
    },
    /* 点击按钮，展示输入框 */
    showInput(scope) {
      scope.inputVisible = true;
      /* 让文本框自动聚焦 */
      /* nextTick是当页面上元素被重新渲染后执行里面的代码 */
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除对应参数
    handleClose(i,scope){
      scope.attr_vals.splice(i,1)
      this.$message.success('删除成功')
    }
  },
  computed: {
    //如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled() {
      if (this.selectcatekeys.length !== 3) {
        return true;
      }
      return false;
    },
    //返回当前选中的三级分类id
    cateId() {
      if (this.selectcatekeys.length === 3) {
        return this.selectcatekeys[2];
      }
      return null;
    },
    /* 两个面板共用一个对话框 */
    /* 动态计算标题文本 */
    titleText() {
      if (this.activename === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
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
.cat_opt {
  margin: 15px 0px;
}
.margin {
  margin-bottom: 15px;
}
.el-tag {
  margin-left: 10px;
}
.input-new-tag {
  width: 135px;
}
.el-button--small {
  margin: 15px;
}
</style>