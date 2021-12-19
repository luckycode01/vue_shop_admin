<template>
  <div>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" type="text" v-model="queryInfo.query" clearable @blur="getGoodsList" @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品表格区 -->
      <el-table :data="goodsList" border stripe style="margin:20px 0">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="105px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column label="创建时间" width="150px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template>
            <el-button type="primary" size="mini" circle icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" circle icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[10, 15, 20, 25]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'List',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1, //当前页数
        pagesize: 10,
      },
      goodsList: [],
      // 商品总数
      total: 0,
    }

  },

  mounted() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const res = await this.$API.goodsList.reqGetGoodsList(this.queryInfo);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // 保存商品列表数据
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // 每页显示数量发生变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 页数变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    addGoods() {
      this.$router.push('/goodsList/add')
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
