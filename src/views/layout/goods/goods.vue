<template>
  <div>
    <breadcrumb lazy1="商品管理" lazy2="商品列表"></breadcrumb>
    <div style="height:40px">
      <el-input
        placeholder="请输入内容"
        v-model="gettable.query"
        @input="changesarch"
        class="input-with-select"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" @click="routerto" plain>添加用户</el-button>
    </div>
    <el-table :data="tablelist.goods" border style="width: 100%">
      <el-table-column align="center" type="index" width="140"></el-table-column>
      <el-table-column prop="goods_name" label="参数名称" width="340"></el-table-column>
      <el-table-column prop="goods_price" label="价格" width="140"></el-table-column>
      <el-table-column prop="goods_number" label="库存量" width="80"></el-table-column>
      <el-table-column label="商品状态" width="80">
        <template slot-scope="props">{{props.row.goods_state|capitalize}}</template>
      </el-table-column>
      <el-table-column  label="创建时间" width="140">
          <template slot-scope="props">
              {{props.row.add_time|timeall}}
          </template>
      </el-table-column>
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
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="gettable.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="gettable.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tablelist.total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      dialogVisible4Add: false,
      tablelist: [],
      gettable: {
        query: "",
        pagenum: 1,
        pagesize: 10
      }
    };
  },
  filters: {
    capitalize: val => {
      switch (val) {
        case 0:
          return "未通过";
          break;
        case 1:
          return "审核中";
          break;
        case 2:
          return "已审核";
          break;
      }
    },
    timeall(val,fh='-'){
        let time=new Date(val)
        let year=time.getFullYear()
        let month=time.getMonth()+1
        let house=time.getHours()
        let minutes=time.getMinutes()
        let seconds=time.getSeconds()
        let dat=time.getDate()
        return `${year}${fh}${month}${fh}${dat}  ${house}:${minutes}:${seconds}`
    }
  },
  methods: {
    routerto() {
      this.$router.push('/layout/goods/addgoods')
    },
    handleSizeChange(e) {
      this.gettable.pagesize = e;
      this.getTableList();
    },
    handleCurrentChange(e) {
      this.gettable.pagenum = e;
      this.getTableList();
    },

    changesarch() {
      this.getTableList();
    },
    async getTableList() {
      let res = await this.$axios.get("goods", {
        params: this.gettable
      });
      if (res.status === 200) {
        this.tablelist = res.data.data;
      }
    }
  },
  created() {
    this.getTableList();
  }
};
</script>

<style lang='less' scoped>
.input-with-select {
  width: 400px;
}
</style>