<template>
  <div>
    <breadcrumb lazy1='权限管理' lazy2='权限列表'></breadcrumb>
    <el-table :data="rightslist" border style="width: 100%">
      <el-table-column align='center' type="index" width="140"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级" width="140" :formatter="formatter"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightslist: []
    };
  },
  methods: {
    formatter(row, column) {
      let arr = ["一级", "二级", "三级", "四级", "五级", "六级", "七级"];
      return arr[row.level];
    }
  },
  created() {
    this.$axios.get("rights/list").then(res => {
      this.rightslist = res.data.data;
    });
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
