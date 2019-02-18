<template>
  <div>
    <breadcrumb lazy1="商品管理" lazy2="分类参数"></breadcrumb>
    <el-cascader
      v-model="selectedOptions3"
      expand-trigger="hover"
      :options="options"
      @change="handleChange"
      :props="props"
    ></el-cascader>
    <el-tabs type="border-card">
      <el-tab-pane label="动态参数">
        <div style="height:40px">
          <el-button type="success"  plain>添加动态参数</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="静态属性">配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      selectedOptions3: [],
      tablelist: [],
      props: {
        label: "cat_name",
        children: "children",
        value: "cat_id"
      }
    };
  },
  methods: {
    async handleChange(e) {
      this.gettablelist()
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
      // console.log(this.selectedOptions3);
      let res2 = await this.$axios.get(
        `categories/${
          this.selectedOptions3[this.selectedOptions3.length - 1]
        }/attributes`,
        {
          params: {
            sel: "many"
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
      // console.log(e, i);
      e.attr_array.splice(i, 1);
      let res = await this.$axios.put(
        `categories/${e.cat_id}/attributes/${e.attr_id}`,
        {
          attr_name: e.attr_name,
          attr_sel: "many",
          attr_vals: e.attr_array.toString()
        }
      );
      // console.log(res);
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
      console.log(res);
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
