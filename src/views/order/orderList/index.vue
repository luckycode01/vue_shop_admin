<template>
  <div>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" type="text" v-model="queryInfo.query" clearable @blur="$message.info('功能开发中')" @clear="$message.info('功能开发中')">
            <el-button slot="append" icon="el-icon-search" @click="$message.info('功能开发中')"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-table :data="orderList" border stripe style="width: 100%;margin: 20px 0;">
            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
            <el-table-column prop="order_number" label="订单编号" width="width" align="center"></el-table-column>
            <el-table-column prop="order_fapiao_title" label="发票分类" width="width" align="center"></el-table-column>
            <el-table-column prop="order_price" label="订单价格" width="width" align="center"></el-table-column>
            <el-table-column label="是否付款" width="width" align="center">
              <template slot-scope="{row}">
                <el-tag v-if="row.pay_status==1" type="success">已支付</el-tag>
                <el-tag v-else type="danger">未支付</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货" width="width" align="center"></el-table-column>
            <el-table-column prop="update_time" label="下单时间" width="width" align="center"></el-table-column>
            <el-table-column label="操作" width="140" align="center">
              <template>
                <HintButton :title="'编辑'" type="primary" icon="el-icon-edit" size='mini' @click="$message.info('功能开发中')"></HintButton>
                <HintButton :title="'地址'" type="success" icon="el-icon-location" size='mini' @click="$message.info('功能开发中')"></HintButton>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 分页区-->
      <el-pagination @size-change="handChangeSize" @current-change="handChangePage" :current-page="queryInfo.pagenum" :page-sizes="[5, 7,10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
import HintButton from "@/components/HintButton/index.vue";
export default {
  name: "",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      orderList: []
    }
  },
  mounted() {
    this.getOrdersList();
  },
  methods: {
    handChangeSize(val) {
      this.queryInfo.pagesize = val;
      this.getOrdersList();
    },
    handChangePage(val) {
      this.queryInfo.pagenum = val;
      this.getOrdersList();
    },
    async getOrdersList() {
      try {
        const res = await this.$API.order.reqOrdersList(this.queryInfo);
        if (res.meta.status == 200) {
          this.$message.success(res.meta.msg);
          this.total = res.data.total;
          this.orderList = res.data.goods;
        }
        else {
          this.$message.error(res.meta.msg);
        }
      } catch (error) {
        this.$message.error(error);
      }
    }
  },
  components: { HintButton }
}
</script>

<style lang="scss" scoped>
</style>
