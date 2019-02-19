<template>
  <div>
    <breadcrumb lazy1="商品管理" lazy2="分类参数"></breadcrumb>
    <el-cascader
      v-model="selectedOptions3"
      expand-trigger="hover"
      :show-all-levels="false"
      :options="options"
      @change="handleChange"
      :props="props"
    ></el-cascader>
    <el-tabs @tab-click="changeTabs" type="border-card">
      <el-tab-pane label="动态参数">
        <div style="height:40px">
          <el-button type="success" @click="showAddBtn=true" plain>添加动态参数</el-button>
        </div>
        <el-table :data="tablelist" border style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-tag
                :key="index"
                v-for="(tag,index) in props.row.attr_array"
                closable
                :disable-transitions="false"
                @close="handleClose(props.row,index)"
              >{{tag}}</el-tag>
              <el-input
                placeholder="请输入按回车添加"
                class="input-new-tag"
                v-if="props.row.inputVisible"
                v-model="props.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(props.row)"
                @blur="clearinput(props.row)"
              ></el-input>
              <el-button
                v-else
                ref="123"
                class="button-new-tag"
                size="small"
                @click="showInput(props.row)"
              >+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" type="index" width="140"></el-table-column>
          <el-table-column prop="attr_name" label="参数名称" width="180"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scopet">
              <el-button
                type="success"
                @click="showEdit(scopet.row)"
                icon="el-icon-edit"
                size="small"
                plain
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="delectUser(scopet.row)"
                plain
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性">
        <div style="height:40px">
          <el-button type="success" @click="showAddBtn=true" plain>添加静态参数</el-button>
        </div>
        <el-table :data="tablelist" border style="width: 100%">
          <el-table-column align="center" type="index" width="140"></el-table-column>
          <el-table-column prop="attr_name" label="参数名称" width="180"></el-table-column>
          <el-table-column prop="attr_vals" label="属性名" width="180"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scopet">
              <el-button
                type="success"
                @click="showEdit2(scopet.row)"
                icon="el-icon-edit"
                size="small"
                plain
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="delectUser(scopet.row)"
                plain
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加动态参数 -->
    <el-dialog
      :title="AllObj.attr_sel==='only'?'添加属性':'添加参数'"
      :visible.sync="showAddBtn"
      width="50%"
    >
      <span>
        <el-form :model="AllObj" status-icon :rules="rules" ref="addRef" label-width="100px">
          <el-form-item label="参数名称" prop="attr_name">
            <el-input v-model="AllObj.attr_name"></el-input>
          </el-form-item>
          <el-form-item v-if="AllObj.attr_sel==='only'" label="属性值" prop="attr_vals">
            <el-input v-model="AllObj.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button type="primary" @click="addToSql">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改动态参数 -->
    <el-dialog title="修改参数" :visible.sync="showEditBtn" width="50%">
      <span>
        <el-form :model="AllObj" status-icon :rules="rules" ref="editRef" label-width="100px">
          <el-form-item label="参数名称" prop="attr_name">
            <el-input v-model="AllObj.attr_name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEdit">取 消</el-button>
        <el-button type="primary" @click="EditToSql">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改静态参数 -->
    <el-dialog title="修改参数" :visible.sync="showEditBtn2" width="50%">
      <span>
        <el-form :model="AllObj" status-icon :rules="rules" ref="editRef" label-width="100px">
          <el-form-item label="属性名称" prop="attr_name">
            <el-input v-model="AllObj.attr_name"></el-input>
          </el-form-item>
          <el-form-item label="属性值" prop="attr_vals">
            <el-input v-model="AllObj.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEdit">取 消</el-button>
        <el-button type="primary" @click="EditToSql">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAddBtn: false,
      showEditBtn: false,
      showEditBtn2: false,
      options: [],
      selectedOptions3: [],
      tablelist: [],
      props: {
        label: "cat_name",
        children: "children",
        value: "cat_id"
      },
      AllObj: {
        attr_name: "",
        attr_sel: "many",
        attr_vals: ""
      },
      rules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ],

        attr_vals: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    changeTabs(e) {
      this.AllObj.attr_sel = e.label === "静态属性" ? "only" : "many";
      this.gettablelist();
    },
    delectUser(e) {
      this.AllObj=JSON.parse(JSON.stringify(e))
      this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$axios.delete(
            `categories/${this.AllObj.cat_id}/attributes/${
              this.AllObj.attr_id
            }`,
            this.AllObj
          );
          if (res.status === 200) {
            this.$message({
              type: "success",
              message: res.data.meta.msg
            });
          }
          this.gettablelist();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    EditToSql(e) {
      this.$refs.editRef.validate(async b => {
        if (b) {
          let res = await this.$axios.put(
            `categories/${
              this.selectedOptions3[this.selectedOptions3.length - 1]
            }/attributes/${this.AllObj.attr_id}`,
            this.AllObj
          );
          if (res.status === 200) {
            this.$message({
              type: "success",
              message: res.data.meta.msg
            });
            this.closeEdit();
            this.gettablelist();
          }
        }
      });
    },
    closeEdit() {
      this.$refs.editRef.resetFields();
      if (this.AllObj.attr_sel == "only") {
        this.showEditBtn2 = false;
      } else {
        this.showEditBtn = false;
      }
    },
    showEdit(e) {
      this.AllObj=JSON.parse(JSON.stringify(e))
      this.showEditBtn = true;
    },
    showEdit2(e) {
      this.AllObj=JSON.parse(JSON.stringify(e))
      this.showEditBtn2 = true;
    },
    addToSql() {
      this.$refs.addRef.validate(async b => {
        if (b) {
          let res = await this.$axios.post(
            `categories/${
              this.selectedOptions3[this.selectedOptions3.length - 1]
            }/attributes`,
            this.AllObj
          );
          if (res.status === 200) {
            this.$message({
              type: "success",
              message: res.data.meta.msg
            });
            this.closeAdd();
            this.gettablelist();
          }
        }
      });
    },
    closeAdd() {
      this.$refs.addRef.resetFields();

      this.showAddBtn = false;
    },
    async handleChange(e) {
      this.gettablelist();
    },
    async getoptions() {
      let res = await this.$axios.get("categories", {
        params: {
          type: 3
        }
      });
      this.options = res.data.data;
      this.selectedOptions3 = [
        this.options[0].cat_id,
        this.options[0].children[0].cat_id,
        this.options[0].children[0].children[0].cat_id
      ];
      this.gettablelist();
    },
    async gettablelist() {
      let res2 = await this.$axios.get(
        `categories/${
          this.selectedOptions3[this.selectedOptions3.length - 1]
        }/attributes`,
        {
          params: {
            sel: this.AllObj.attr_sel
          }
        }
      );
      res2.data.data.forEach(e => {
        e.attr_array =
          e.attr_vals.trim().length == 0 ? [] : e.attr_vals.split(",");
        e.inputValue = "";
        e.inputVisible = false;
      });
      this.tablelist = res2.data.data;
    },
    // tag功能
    showInput(e) {
      e.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus();
      });
    },
    async handleClose(e, i) {
      e.attr_array.splice(i, 1);
      let res = await this.$axios.put(
        `categories/${e.cat_id}/attributes/${e.attr_id}`,
        {
          attr_name: e.attr_name,
          attr_sel: "many",
          attr_vals: e.attr_array.toString()
        }
      );
      if (res.status == 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg
        });
      }
    },
    async handleInputConfirm(e) {
      if (!e.inputValue) {
        this.$message({
          message: "请输入内容哦",
          type: "warning"
        });
        return;
      }
      console.log(e.attr_vals + "," + e.inputValue);
      e.attr_array.push(e.inputValue);
      let res = await this.$axios.put(
        `categories/${e.cat_id}/attributes/${e.attr_id}`,
        {
          attr_name: e.attr_name,
          attr_sel: "many",
          attr_vals: e.attr_array.toString()
        }
      );
      if (res.status == 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg
        });
      }
      e.inputVisible = false;
      e.inputValue = "";
    },
    clearinput(e) {
      e.inputValue = "";
      e.inputVisible = false;
    }
  },
  created() {
    this.getoptions();
  }
};
</script>

<style lang="less" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
