<template>
  <div>
    <el-container>
      <el-aside width="200">
        <div class="logo"></div>
        <el-menu
          :default-active="woht"
          unique-opened
          router
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          background-color="#545c64"
          text-color="#fff"
        >
          <el-submenu v-for="(item) of datalist" :key="item.id" :index="item.authName">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/layout/'+val.path" v-for="(val) in item.children" :key="val.id">
              <i class="el-icon-setting"></i>
              {{val.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header">
            <span class="iconfont icon-caidan" @click="changeCollapse"></span>
            <div>电商后台管理系统</div>
            <a type="text" @click="open2">退出</a>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "layout",
  data() {
    return {
      dialogVisible: false,
      isCollapse: false,
      datalist: [],
      woht: location.hash.substring(1)
    };
  },
  methods: {
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    open2() {
      this.$confirm("确认退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          localStorage.clear("mycode");
          this.$router.push("/");
        })
        .catch(() => {});
    }
  },
  created() {
    this.$axios.get("menus").then(res => {
      res = res.data;
      if (res.meta.status == 200) {
        this.datalist = res.data;
      }
    });
  }
};
</script>

<style scoped lang='less'>
@import url("//at.alicdn.com/t/font_1033408_hbxuo259cj.css");
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu {
  border-right: 0;
}
.logo {
  height: 60px;
  background-image: url("../../assets/logo.png");
  background-size: cover;
  background-color: #ccc;
}
.header {
  display: flex;
  justify-content: space-between;
  span {
    font-size: 30px;
    color: orange;
  }
  div {
    font-size: 28px;
    color: #fff;
  }
  a {
    font-size: 20px;
    color: orange;
  }
}
div {
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #545c64;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: left;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
.el-container {
  height: 100%;
}
</style>