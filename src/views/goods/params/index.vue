<template>
  <div>
    <el-card>
      <el-alert title="注意 只允许为三级分类添加参数或属性" type="warning" show-icon :closable=false></el-alert>
      <span>选择商品分类：</span>
      <el-cascader v-model="selectCateKeys" :options="categoryList" :props="setProps" clearable @change="getParamsData" style="margin:20px 0"></el-cascader>
      <el-tabs v-model="activeName" @tab-click="getParamsData">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled='isBtnDisabled'>添加参数</el-button>
          <!-- 参数表格 -->
          <TableList :initData="manyTabData"></TableList>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled='isBtnDisabled'>添加属性</el-button>
          <TableList :initData="onlyTabData"></TableList>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import TableList from './tableList.vue'
export default {
  name: '',
  components: {
    TableList
  },
  data() {
    return {
      selectCateKeys: [],
      categoryList: [],
      setProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      // 动态参数数据
      manyTabData: [],
      // 静态属性
      onlyTabData: [],
      // 添加对话框显示与隐藏
      addDialogVisible: false,
      // 添加表单
      addForm: {
        attr_name: '',
      },
      //添加参数表单验证规则
      addFormRules: {
        attr_name: {
          required: true, //必填项
          message: '请输参数名称',
          trigger: 'blur', //失去焦点时验证
        },
      },
      // tab激活的name
      activeName: 'many',
      // 隐藏显示修改对话框
      editDialogVisible: false,
      // 修改对话框的表单数据
      editForm: {
        attr_name: ''
      },
      // 修改参数表单验证规则
      editFormRules: {
        attr_name: {
          required: true, //必填项
          message: '请输参数名称',
          trigger: 'blur', //失去焦点时验证
        },
      },
      // 输入框的显示与隐藏
      inputVisible: false,
      // 输入框双向数据绑定
      inputValue: '',
    }
  },
  mounted() {
    this.getCategoryList();
  },
  computed: {
    // 是否禁用按钮
    isBtnDisabled() {
      if (this.selectCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 选中的分类id
    cateId() {
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[2];
      }
      return null
    },
    //对话框的标题
    textTitle() {
      if (this.activeName === 'many') return '动态参数';
      return '静态属性'
    }

  },
  methods: {
    async getCategoryList() {
      const res = await this.$API.category.reqCategoryList()
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类失败')
      // 保存获取的商品分类列表
      this.categoryList = res.data
    },
    // 获取参数数据
    async getParamsData() {
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = [];
        this.manyTabData = [];
        this.onlyTabData = [];
        return
      }
      const res = await this.$API.params.reqGetParamsList(this.cateId, { sel: this.activeName })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      //将attr_vals由字符串转为数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 为每一个行添加一个属性，控制输入框的显示隐藏
        item.inputVisible = false
        // 表单双向绑定
        item.inputValue = ''
      })
      if (this.activeName === "many")
        this.manyTabData = res.data;
      else
        this.onlyTabData = res.data;
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
