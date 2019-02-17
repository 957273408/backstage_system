<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{lazy1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{lazy2}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    lazy1: String,
    lazy2: String
  }
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  height: 50px;
  line-height: 50px;
  background-color: #d3dce6;
  padding: 0px 20px;
}
</style>
