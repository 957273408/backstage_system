<template>
  <div>
    <breadcrumb lazy1="商品管理" lazy2="商品分类"></breadcrumb>
    <div style="height:40px">
      <el-button type="success" @click="addbtn" plain>添加分类</el-button>
    </div>
    <dzh-tree-grid :columns="columns" :loading="loading" :dataSource="dataSource">
      <template slot-scope="scope">
        <el-button
          plain
          title="修改商品分类"
          @click="showEditBtn(scope.row)"
          type="primary"
          size="small"
          icon="el-icon-edit"
        ></el-button>
        <el-button
          plain
          title="删除商品分类"
          @click="delectthis(scope)"
          type="danger"
          size="small"
          icon="el-icon-delete"
        ></el-button>
      </template>
    </dzh-tree-grid>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="param.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="param.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="showAddbtn" width="50%" :before-close="closeEdit">
      <span>
        <el-form :model="addobj" status-icon :rules="rules" ref="addRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addobj.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父类名称">
            <el-cascader
              placeholder="默认创建一级"
              expand-trigger="hover"
              :options="options"
              @change="handleChange"
              change-on-select
              :props="props"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeadd">取 消</el-button>
        <el-button type="primary" @click="addtospl">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类 -->
    <el-dialog title="修改分类" :visible.sync="showEdit" width="50%" :before-close="closeadd">
      <span>
        <el-form :model="editObj" status-icon :rules="rules" ref="editRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editObj.cat_name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEdit">取 消</el-button>
        <el-button type="primary" @click="editTospl">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DZHTreeGrid from "dzh-tree-grid";
export default {
  components: {
    "dzh-tree-grid": DZHTreeGrid
  },
  data() {
    return {
      showAddbtn: false,
      loading: true,
      showEdit: false,
      selectedOptions2: "",
      options: [],
      dataSource: [],
      columns: [
        // 需要展示的列
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "级别",
          prop: "cat_level_name",
          width: 500 // 可选
        }
      ],
      param: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      addobj: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0
      },
      rules: {
        cat_name: [{ required: true, message: "请输入用户名", trigger: "blur" }]
      },
      props: {
        label: "cat_name",
        children: "children",
        value: "cat_id"
      },
      editObj: {
        cat_id: "",
        cat_name: ""
      }
    };
  },
  created() {
    this.gettreelist();
  },
  methods: {
    showEditBtn(e) {
      this.editObj.cat_id = e.cat_id;
      this.editObj.cat_name = e.cat_name;
      this.showEdit = true;
    },
    async addbtn() {
      let res = await this.$axios.get("categories", {
        params: {
          type: 2
        }
      });
      this.options = res.data.data;
      this.showAddbtn = true;
    },
    async gettreelist() {
      let res = await this.$axios.get("categories", {
        params: this.param
      });
      this.total = res.data.data.total;
      this.dataSource = res.data.data.result;
      this.loading = false;
    },
    handleSizeChange(e) {
      this.param.pagesize = e;
      this.gettreelist();
    },
    handleCurrentChange(e) {
      this.param.pagenum = e;
      this.gettreelist();
    },
    handleChange(e) {
      this.addobj.cat_pid = e[e.length - 1];
      this.addobj.cat_level = e.length;
    },
    closeadd() {
      this.$refs.addRef.resetFields();
      Object.keys(this.addobj).forEach(e => {
        this.addobj[e] = e == "cat_name" ? "" : 0;
      });
      this.showAddbtn = false;
    },
    closeEdit() {
      this.$refs.editRef.resetFields();
      this.showEdit = false;
    },
    editTospl() {
      this.$refs.editRef.validate(async b => {
        if (b) {
          let res = await this.$axios.put(
            `categories/${this.editObj.cat_id}`,
            this.editObj
          );
          console.log(res);
          if (res.data.meta.status == 200) {
            this.$message({
              type: "success",
              message: res.data.meta.msg
            });
          }
          this.closeEdit();
          this.gettreelist();
        }
      });
    },
    addtospl() {
      this.$refs.addRef.validate(async b => {
        if (b) {
          let res = await this.$axios.post("categories", this.addobj);
          if (res.data.meta.status == 201) {
            this.$message({
              type: "success",
              message: res.data.meta.msg
            });
          }
          this.closeadd();
          if (this.dataSource.toString().indexOf(this.addobj.cat_pid) == -1) {
            this.gettreelist();
          }
        }
      });
    },
    async delectthis(scope) {
      this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let res = await this.$axios.delete(`categories/${scope.row.cat_id}`);
        console.log(res);
        if (res.data.meta.status == 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg
          });
        }
        this.gettreelist();
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
