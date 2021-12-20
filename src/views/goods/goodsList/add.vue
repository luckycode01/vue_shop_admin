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
          <el-form ref="addGoodsFormRef" rules="addGoodsFormRules" v-model="addGoodsForm" label-position='top' label-width="80px">
            <el-tabs v-model="isActiveTab" tab-position="left" style="height: 200px;">
              <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品名称">
                  <el-input v-model="model"></el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
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
      addGoodsFormRules: [

      ],
      addGoodsForm: {},

    }
  },
}
</script>

<style lang="scss" scoped>
.el-tab-pane {
  padding: 0px 20px;
}
</style>
