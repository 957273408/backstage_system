<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb lazy1='权限管理' lazy2='角色列表'></breadcrumb>
    <!-- 添加用户按钮 -->
    <div style="height:40px">
      <el-button type="success" @click="showAddUser=true" plain>添加用户</el-button>
    </div>
    <!-- table列表 -->
    <el-table :data="roleslist" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row class="arrow" v-for="onetree in props.row.children" :key="onetree.id">
            <el-col :span="4">
              <el-tag
                @close="handleClose(props,onetree)"
                closable
                type="success"
              >{{onetree.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="authlist" v-for="towtree in onetree.children" :key="towtree.id">
                <el-col :span="5">
                  <el-tag
                    @close="handleClose(props,towtree)"
                    closable
                    type="warning"
                  >{{towtree.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-tag
                    @close="handleClose(props,suitree)"
                    v-for="suitree in towtree.children"
                    :key="suitree.id"
                    closable
                    type="danger"
                  >{{suitree.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" type="index" width="140"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="240"></el-table-column>
      <el-table-column prop="level" label="操作" width="240">
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
          <el-button
            type="warning"
            icon="el-icon-check"
            @click="showtree(scopet.row)"
            size="small"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加用户 -->
    <el-dialog title="添加角色" :visible.sync="showAddUser" width="50%">
      <span>
        <el-form :model="addUser" status-icon :rules="rules" ref="addUserRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addUser.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addUser.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddUser">取 消</el-button>
        <el-button type="primary" @click="addUserTosql">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色 -->
    <el-dialog title="修改角色" :visible.sync="showEditUser" width="50%">
      <span>
        <el-form :model="editUser" status-icon :rules="rules" ref="editUserRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editUser.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editUser.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditUser">取 消</el-button>
        <el-button type="primary" @click="EditUserTosql">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 给角色授权 -->
    <el-dialog title="给角色授权" :visible.sync="showtreeUser" width="50%">
      <span>
        <el-tree
          ref="treeRef"
          :data="treelist"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="checkedtree"
          :props="defaultProps"
        ></el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showtreeUser=false">取 消</el-button>
        <el-button type="primary" @click="treeTosql">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleslist: [],
      treelist: [],
      checkedtree: [],
      roleId: "",
      showAddUser: false, //添加用户
      showEditUser: false, //修改用户
      showtreeUser: false, //给用户授权
      addUser: {
        roleName: "",
        roleDesc: ""
      },
      editUser: {
        id: "",
        roleName: "",
        roleDesc: ""
      },
      rules: {
        roleName: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        roleDesc: []
      },
      defaultProps: {
        label: "authName",
        children: "children"
      }
    };
  },
  methods: {
    getTable() {
      this.$axios.get("roles").then(res => {
        this.roleslist = res.data.data;
      });
      return this;
    },
    tod(e) {
      console.log(e);
    },
    // 添加用户
    closeAddUser() {
      this.$refs.addUserRef.resetFields();

      this.showAddUser = false;
      return this;
    },
    addUserTosql() {
      this.$refs.addUserRef.validate(b => {
        if (b) {
          this.$axios.post("roles", this.addUser).then(res => {
            res = res.data;
            if (res.meta.status == "201") {
              this.$message({
                message: res.meta.msg,
                type: "success"
              });
              this.closeAddUser().getTable();
            } else {
              this.$message.error(res.meta.msg);
            }
          });
        }
      });
    },
    // 删除用户
    delectUser(e) {
      this.$confirm("是否删除此角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios.delete(`roles/${e.id}`).then(res => {
          res = res.data;
          if (res.meta.status == 200) {
            this.$message({
              message: res.meta.msg,
              type: "success"
            });
            this.getTable();
          } else {
            this.$message.error(res.meta.msg);
          }
        });
      });
    },
    // 修改角色
    showEdit(e) {
      this.editUser.id = e.id;
      this.editUser.roleName = e.roleName;
      this.editUser.roleDesc = e.roleDesc;
      this.showEditUser = true;
    },
    closeEditUser() {
      this.$refs.editUserRef.resetFields();
      this.showEditUser = false;
      return this;
    },
    EditUserTosql() {
      this.$refs.editUserRef.validate(b => {
        if (b) {
          this.$axios
            .put(`roles/${this.editUser.id}`, this.editUser)
            .then(res => {
              res = res.data;
              if (res.meta.status == 200) {
                this.$message({
                  message: res.meta.msg,
                  type: "success"
                });
                this.closeEditUser().getTable();
              } else {
                this.$message.error(res.meta.msg);
              }
            });
        }
      });
    },
    // 修改权限
    async showtree(e) {
      this.checkedtree = [];
      this.roleId = e.id;
      let res = await this.$axios.get("rights/tree");
      if (res.status == "200") {
        this.treelist = res.data.data;
      }
      // 递归
      let bb = e => {
        if (!e.children) {
          this.checkedtree.push(e.id);
        } else {
          e.children.forEach(el => {
            bb(el);
          });
        }
      };
      bb(e);
      this.showtreeUser = true;
    },
    async treeTosql(e) {
      let arr1 = this.$refs.treeRef.getCheckedKeys();
      let arr2 = this.$refs.treeRef.getHalfCheckedKeys();
      let rids = [...arr1, ...arr2].join(",");
      let res = await this.$axios.post(`roles/${this.roleId}/rights`, { rids });
      console.log(res);
      if(res.data.meta.status==200){
        this.$message({
          message:res.data.meta.msg,
          type:'success'
        })
      }else{
        this.$message.error(res.data.meta.msg)
      }
      this.getTable();
      this.showtreeUser = false;
    },
    // 删除权限
    async handleClose(e, l) {
      let res = await this.$axios.delete(`roles/${e.row.id}/rights/${l.id}`);
      console.log(this.roleslist);
      this.roleslist[e.$index].children = res.data.data;
    }
  },
  created() {
    this.getTable();
  },
  
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  height: 50px;
  line-height: 50px;
  background-color: #d3dce6;
  padding: 0px 20px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-tag {
  margin-left: 5px;
}
.authlist {
  border-top: solid 1px #d3dce6;
  padding-bottom: 5px;
}
.arrow {
  font-size: 16px;
  font-weight: bold;
}
</style>
