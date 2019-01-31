<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height:40px">
      <el-input placeholder="请输入内容" v-model="query" @input="changesarch" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" @click="dialogVisible4Add=true" plain>添加用户</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed type="index" label="#" width="150"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column prop="role_name" label="角色" width="300"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态" width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="skyblue" inactive-color="#ccc"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="handleClick(scope)"
            icon="el-icon-edit"
            size="small"
            plain
          ></el-button>
          <el-button type="warning" icon="el-icon-delete" size="small" plain></el-button>
          <el-button type="warning" icon="el-icon-check" size="small" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible4Add" width="30%">
      <span>
        <el-form
          :model="adduser"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="adduser.name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Add = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    return {
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 5,
      total: 0,
      adduser: {
        name: ""
      },
      rules:{
         name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
      },
      dialogVisible4Add: false
    };
  },
  methods: {
    handleClick(e) {
      console.log(e);
    },
    changesarch() {
      this.gettable();
    },
    gettable() {
      this.$axios
        .get("users", {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        .then(res => {
          this.total = res.data.data.total;
          this.tableData = res.data.data.users;
        });
    },
    handleSizeChange(size) {
      this.pagesize = size;
      this.pagenum = 1;
      this.gettable();
    },
    handleCurrentChange(num) {
      this.pagenum = num;
      this.gettable();
    }
  },
  created() {
    this.gettable();
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
.input-with-select {
  width: 400px;
}
</style>
