<template>
  <div>
    <breadcrumb lazy1='用户管理' lazy2='用户列表'></breadcrumb>
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
          <el-switch
            v-model="scope.row.mg_state"
            @change="changestate(scope.row)"
            active-color="skyblue"
            inactive-color="#ccc"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="hasshowupdata(scope.row)"
            icon="el-icon-edit"
            size="small"
            plain
          ></el-button>
          <el-button
            type="warning"
            @click="delectuser(scope.row.id)"
            icon="el-icon-delete"
            size="small"
            plain
          ></el-button>
          <el-button
            type="warning"
            @click="editUser(scope.row)"
            icon="el-icon-check"
            size="small"
            plain
          ></el-button>
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
    <el-dialog title="添加用户" :visible.sync="dialogVisible4Add" width="50%">
      <span>
        <el-form
          :model="adduserobj"
          status-icon
          :rules="rules"
          ref="addUserRef"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="adduserobj.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="adduserobj.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="adduserobj.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="adduserobj.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeuseradd">取 消</el-button>
        <el-button type="primary" @click="addusertosql">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="dialogVisibleupdata" width="50%">
      <span>
        <el-form :model="updataobj" status-icon :rules="rules" ref="upDataRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-button type="info" v-text="updataobj.username" disabled></el-button>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="updataobj.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="updataobj.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeupdata">取 消</el-button>
        <el-button type="primary" @click="updatatosql">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配用户 -->
    <el-dialog title="分配用户" :visible.sync="dialogVisibleedit" width="50%">
      <span>
        <el-form :model="roleobj" status-icon ref="editUserRef" label-width="100px">
          <el-form-item label="当前用户名">{{roleobj.username}}</el-form-item>
          <el-form-item label="请选择角色">
            <el-select v-model="roleobj.rid">
              <el-option
                v-for="val in roleslist"
                :key="val.id"
                :label="val.roleName"
                :value="val.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleedit=false">取 消</el-button>
        <el-button type="primary" @click="edittosql">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    let checkemail = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入邮箱"));
      } else {
        let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("邮箱不合法"));
        }
      }
    };
    let checkemobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话"));
      } else {
        let reg = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("电话不合法"));
        }
      }
    };
    return {
      tableData: [],
      roleslist: [],
      query: "",
      pagenum: 1,
      pagesize: 5,
      total: 0,
      dialogVisible4Add: false,
      dialogVisibleupdata: false,
      dialogVisibleedit: false,
      adduserobj: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      updataobj: {
        username: "",
        id: "",
        email: "",
        mobile: ""
      },
      roleobj: {
        username: "",
        roleName: "",
        id: "",
        rid: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [{ validator: checkemail, trigger: "blur" }],
        mobile: [{ validator: checkemobile, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 分配角色
    edittosql() {
      this.$axios
        .put(`users/${this.roleobj.id}/role`, { rid: this.roleobj.rid })
        .then(res => {
          res = res.data;
          if (res.meta.status === 200) {
            this.$message({
              message: res.meta.msg,
              type: "success"
            });
          } else {
            this.$message.error(res.meta.msg);
          }
          this.closeEdit();
          this.gettable();
        });
    },
    changestate(e) {
      this.$axios.put(`users/${e.id}/state/${e.mg_state}`).then(res => {
        res = res.data;
        if (res.meta.status === 200) {
          this.$message({
            message: res.meta.msg,
            type: "success"
          });
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    hasshowupdata(e) {
      [
        this.updataobj.username,
        this.updataobj.id,
        this.updataobj.mobile,
        this.updataobj.email
      ] = [e.username, e.id, e.mobile, e.email];
      this.dialogVisibleupdata = true;
    },
    editUser(e) {
      this.roleobj.roleName = e.role_name;
      this.roleobj.id = e.id;
      this.roleobj.rid = e.role_id;
      this.roleobj.username = e.username;
      this.dialogVisibleedit = true;
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
    },
    closeEdit() {
      this.dialogVisibleedit = false;
      this.$refs.editUserRef.resetFields();
    },
    closeuseradd() {
      this.dialogVisible4Add = false;
      this.$refs.addUserRef.resetFields();
    },
    closeupdata() {
      this.dialogVisibleupdata = false;
      this.$refs.upDataRef.resetFields();
    },
    addusertosql() {
      this.$refs.addUserRef.validate(boolean => {
        if (boolean) {
          this.$axios.post("users", this.adduserobj).then(res => {
            res = res.data;
            if (res.meta.status == 201) {
              this.$message({
                message: res.meta.msg,
                type: "success"
              });
            } else {
              this.$message.error(res.meta.msg);
            }

            this.closeuseradd();
          });
        }
      });
    },
    updatatosql() {
      this.$refs.upDataRef.validate(boolean => {
        if (boolean) {
          this.$axios
            .put(`users/${this.updataobj.id}`, this.updataobj)
            .then(res => {
              res = res.data;
              console.log(res);
              if (res.meta.status == 200) {
                this.$message({
                  message: res.meta.msg,
                  type: "success"
                });
              } else {
                this.$message.error(res.meta.msg);
              }
              this.gettable();
              this.closeupdata();
            });
        }
      });
    },
    delectuser(e) {
      this.$confirm("确定删除该用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete("users/" + e).then(res => {
            if (res.data.meta.status == 200) {
              this.$message({
                type: "success",
                message: res.data.meta.msg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    this.gettable();
    this.$axios.get("roles").then(res => {
      this.roleslist = res.data.data;
    });
  }
};
</script>

<style lang="less" scoped>
.input-with-select {
  width: 400px;
}
</style>
