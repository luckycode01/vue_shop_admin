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
          <el-form ref="addGoodsFormRef" :rules="addGoodsFormRules" :model="addGoodsForm" label-position='top' label-width="80px">
            <el-tabs v-model="isActiveTab" tab-position="left" :before-leave="beforeTabLeave">
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
                  <el-checkbox-group v-model="param.attr_vals">
                    <el-checkbox :label="val" v-for="(val,index) in param.attr_vals" :key="index" border></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品属性" name="2">
                <el-form-item :label="onlyParams.attr_name" v-for="onlyParams in onlyParamsList" :key="onlyParams.attrr_id">
                  <el-input v-model="onlyParams.attr_vals"></el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品图片" name="3">
                <el-upload :action="uploadeURL" :headers="headerObj" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-tab-pane>
              <el-tab-pane label="商品内容" name="4">
                <quill-editor v-model="addGoodsForm.goods_introduce" ref="introduceEditor">
                </quill-editor>
                <el-form-item>
                  <el-button @click="addGoods" style="margin-top:20px" type="primary">添加商品</el-button>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="preViewImg" width="width">
      <img :src="preViewPath" alt="" style="width:100%;height: 100%;">
    </el-dialog>
  </div>
</template>

<script>
// 富文本编辑器
import "quill/dist/quill.core"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"
import { quillEditor } from 'vue-quill-editor'

import { cloneDeep } from 'lodash'
export default {
  name: '',
  components: {
    quillEditor
  },
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
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: [],
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
      onlyParamsList: [],
      checkList: [],//参数选择
      // 图片
      uploadeURL: "http://127.0.0.1:8888/api/private/v1/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("shop_admin_key"),
      },
      // 图片预览
      preViewImg: false,
      preViewPath: ""
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
      const res = await this.$API.params.reqGetParamsList(cateId, { sel: 'many' })
      const res1 = await this.$API.params.reqGetParamsList(cateId, { sel: 'only' })
      if (res.meta.status !== 200 && res1.meta.status !== 200) return this.$message.error(res.meta.msg);
      let data = res.data;
      data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
      })
      this.manyParamsList = data;
      this.onlyParamsList = res1.data;
    },
    // 图片上传相关
    handlePreview(file) {
      this.preViewPath = file.response.data.url;
      this.preViewImg = true;
    },
    handleSuccess(response, file, fileList) {
      this.addGoodsForm.pics.push({
        pic: response.data.tmp_path
      })
    },
    handleRemove(file, fileList) {
      let res = fileList.map(item => {
        return { pic: item.response.data.tmp_path }
      })
      this.addGoodsForm.pics = res;
    },
    beforeTabLeave(newVal, oldVal) {
      if (oldVal === "0" && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择三级分类')
        return false
      }
    },
    // 确定添加商品
    addGoods() {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写完整的商品信息')
        }
        let form = cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',');
        this.manyParamsList.forEach(item => {
          this.addGoodsForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          })
        })
        this.onlyParamsList.forEach(item => {
          this.addGoodsForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        })
        form.attrs = this.addGoodsForm.attrs;
        const res = await this.$API.goodsList.reqAddGoodsList(form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg);
        this.$router.push('/goods/goodslist/list')
      });
    }

  },
}
</script>

<style lang="scss" scoped>
.el-tab-pane {
  padding: 0px 20px;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0;
}
::v-deep .ql-container {
  min-height: 300px;
}
</style>
