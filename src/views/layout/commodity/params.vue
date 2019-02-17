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
          <el-button type="success" @click plain>添加动态参数</el-button>
        </div>
        <el-table :data="tablelist" border style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
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
    todo(e) {
      console.log(e);
    },
    async handleChange(e) {
      let res = await this.$axios.get(
        `categories/${e[e.length - 1]}/attributes`,
        {
          params: {
            sel: "many"
          }
        }
      );
      this.tablelist = res.data.data;
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
      this.tablelist = res2.data.data;
    }
  },
  created() {
    this.getoptions();
  }
};
</script>

<style lang="less" scoped>
</style>
