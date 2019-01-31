<template>
  <div class="loginbox">
    <el-form
      :model="userfrom"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <h1 class="title">登录后台系统</h1>
      <el-form-item label-width="0" prop="username">
        <el-input
          placeholder="请输入用户名"
          prefix-icon="iconfont icon-yonghu"
          v-model="userfrom.username"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="0" prop="password">
        <el-input
          placeholder="请输入内容"
          prefix-icon="iconfont icon-mima"
          v-model="userfrom.password"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item label-width="0">
        <el-checkbox v-model="keeppass" class="remember">记住密码</el-checkbox>
        <el-button type="primary" style="width:100%" @click="tologin" round>主要按钮</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      userfrom: {
        username: "admin",
        password: "123456"
      },
      keeppass: false,
      rules: {
        username: [
          { required: true, message: "输入账号", trigger: "blur" },
          { min: 3, max: 8, message: "账号不能小于3位数", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    tologin() {
      this.$refs.ruleForm.validate().then(obj => {
        if (obj) {
          this.$axios.post("login", this.userfrom).then(res => {
            res = res.data;
            if (res.meta.status !== 200) {
              this.$message({
                showClose: true,
                message: res.meta.msg,
                type: "warning"
              });
            } else {
              localStorage.mycode = res.data.token;
              this.$router.push("/layout/users");
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import url("//at.alicdn.com/t/font_1033408_hbxuo259cj.css");
.loginbox {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 100px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 15px 0px;
  }
}
</style>
