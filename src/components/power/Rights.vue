<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-table :data='rightslist' border stripe>
            <el-table-column type='index'></el-table-column>
            <el-table-column label='权限名称' prop='authName'></el-table-column>
            <el-table-column label='路径' prop='path'></el-table-column>
            <!-- 如果想要自定义内部格式要用作用域插槽 -->
            <el-table-column label='权限等级' prop='level'>
                <template slot-scope="scope">
                   <el-tag v-if="scope.row.level==='0'">一级</el-tag>
                   <el-tag type='success' v-else-if="scope.row.level==='1'">二级</el-tag>
                   <el-tag type='warning' v-else>三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    </div>
</template>

<script>
export default {
    name: 'Rights',
    data() {
        return {
            /* 所有的权限列表 */
            rightslist:[]
        }
    },
    created() {
        //获取权限
        this.getRightsList()
    },
    methods: {
       async getRightsList(){
           const {data:res}=await this.$http.get('rights/list');
           if(res.meta.status!==200){
               return this.$message.error('获取权限失败')
           }
           this.rightslist=res.data;
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
</style>