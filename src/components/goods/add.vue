<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        :closable="false"
        title="添加商品信息"
        type="info"
        center
        show-icon
      >
      </el-alert>
      <!-- 步骤条 -->
      <!-- activeindex-0是将字符串转为数字 -->
      <el-steps
        :space="200"
        :active="activeindex - 0"
        finish-status="success"
        align-center
      >
        <el-step title=""></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs内部只允许包含el-tab-pane -->
      <!-- v-model绑定的是当前被激活的el-tab-pane的name值 -->
      <el-form
        :model="addForm"
        :rules="addrules"
        ref="ruleFormref"
        label-width="100px"
        label-position="top"
      >
        <!-- tab栏区域 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeindex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input
            ></el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_num">
              <el-input v-model="addForm.goods_num" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateprop"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabledata"
              :key="item.attr_id"
            ></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabledata"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action是图片要上传到后台的api地址,on-preview是预览事件,
            on-remove是移除图片的操作,list-type是呈现方式，on-success是上传成功触发的回调函数
            on-preview是预览事件 -->
            <!-- 因为upload发请求没有用axios，所以这次请求没有带token，所以要用headers属性配置请求头 -->
            <el-upload
              :headers="headerobj"
              action="https://lianghj.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handlesuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 上传图片的对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewimg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "add",

  data() {
    return {
      activeindex: "0",
      //添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_num: "",
        //商品所属分类id数组
        goods_cat: [],
        //图片的数组
        pics: [],
        //商品的详情描述
        goods_introduce: "",
        attrs: [],
      },
      /* 验证规则 */
      addrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_num: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      //级联选择框的数据
      catelist: [],
      cateprop: {
        //展示的名称
        label: "cat_name",
        //选中的值
        value: "cat_id",
        children: "children",
        expandTrigger: "hover",
      },
      //动态参数
      manyTabledata: [],
      //静态属性
      onlyTabledata: [],
      headerobj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //预览的路径
      previewPath: "",
      //对话框显示隐藏
      previewVisible: false,
    };
  },

  created() {
    this.getCatelist();
  },

  methods: {
    async getCatelist() {
      //获取所有商品分类数据
      const { data: res } = await this.$http.get("categories");
      this.catelist = res.data;
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        return (this.addForm.goods_cat = []);
      }
    },
    //这个是tab-pane发送切换调用的函数,如果return false那么就不会切换,这个函数有两个参数
    beforeTabLeave(activeName, oldactiveName) {
      console.log("即将离开的标签页是" + oldactiveName);
      console.log("即将进入的标签页是" + activeName);
      if (oldactiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    //tab-pane点击触发的函数
    async tabClick() {
      if (this.activeindex == "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        this.manyTabledata = res.data;
      } else if (this.activeindex == "2") {
        const { data: res1 } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        this.onlyTabledata = res1.data;
      }
    },
    //移除图片,file包含了接口返回的数据以及一些图片的基本数据
    handleRemove(file) {
      console.log(file);
      //1.获取将要删除的路径
      const filepath = file.response.data.tmp_path;
      //2.从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filepath);
      //3.调用数组的splice方法，把图片信息对象从pics数组中移除
      this.addForm.pics.splice(i, 1);
    },
    //上传成功的回调函数,response是上传图片返回的数据
    handlesuccess(response) {
      console.log(response);
      //1.先拼接一个图片信息对象
      const picnfo = {
        pic: response.data.tmp_path,
      };
      //2.将图片信息对象push到pics数组中
      this.addForm.pics.push(picnfo);
      console.log(this.addForm.pics);
    },
    //处理图片预览
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    //添加商品的按钮
    add() {
      this.$refs.ruleFormref.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        }
        /* 但这样改了级联选择器要绑定的数组成字符串，会报错，所以进行深拷贝 */
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        this.manyTabledata.forEach((item) => {
          const newinfo = {
            sttr_id: item.attr_id,
            attr_value: item.attr_vals.join(","),
          };
          this.addForm.attrs.push(newinfo);
        });
        this.onlyTabledata.forEach((item) => {
          const newinfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
          this.addForm.attrs.push(newinfo);
        });
        form.attrs = this.addForm.attrs;
        //发起添加商品api
        const { data: res } = await this.$http.post("goods", form);
        console.log(res);
        this.$message.success("添加成功");
        this.$router.push("/goods");
      });
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2];
      } else {
        return null;
      }
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.el-steps {
  margin: 20px 0px;
}
.previewimg {
  width: 100%;
}
.el-button {
  margin-top: 10px;
}
</style>