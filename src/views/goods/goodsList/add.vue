<template>
  <div>
    <el-card>
      <el-row style="margin-bottom:30px">
        <el-col :span="24">
          <el-alert title="消息提示的文案" type="info" center show-icon></el-alert>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:30px">
        <el-col :span="24">
          <el-steps :space="200" :active="isActiveTab-0" align-center finish-status="success">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form ref="addGoodsFormRef" :rules="addGoodsFormRules" v-model="addGoodsForm" label-position='top' label-width="80px">
            <el-tabs v-model="isActiveTab" tab-position="left">
              <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addGoodsForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                  <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                  <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number" type="number">
                  <el-input v-model="addGoodsForm.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="goods_cat">
                  <el-cascader :options="categoryList" :props="cateProp" v-model="addGoodsForm.goods_cat" @change="handleChange" clearable></el-cascader>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品参数" name="1">
                <el-form-item v-for="param in manyParamsList" :key="param.id" :label="param.attr_name" prop="" type="">
                  <el-checkbox-group v-model="checkList">
                    <el-checkbox :label="val" v-for="(val,index) in param.attr_vals" :key="index"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
              <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
              <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
            </el-tabs>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      isActiveTab: 0,
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        goods_cat: [],
      },
      categoryList: [],
      cateProp: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 参数列表
      manyParamsList: [],

    }
  },
  mounted() {
    this.getCategoryList();

  },
  methods: {
    async getCategoryList() {
      const res = await this.$API.category.reqCategoryList()
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类失败')
      // 保存获取的商品分类列表
      this.categoryList = res.data
    },
    handleChange(val) {
      this.addGoodsForm.goods_cat = val;
      this.getParamsData();
    },
    // 获取参数数据
    async getParamsData() {
      let cateId = this.addGoodsForm.goods_cat[this.addGoodsForm.goods_cat.length - 1]
      console.log(cateId);
      const res = await this.$API.params.reqGetParamsList(cateId, { sel: 'many' })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      let data = res.data;
      data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
      })
      // if (this.activeName === "many")
      this.manyParamsList = data;
      // else
      // this.onlyTabData = data;
    },
  },
}
</script>

<style lang="scss" scoped>
.el-tab-pane {
  padding: 0px 20px;
}
</style>
