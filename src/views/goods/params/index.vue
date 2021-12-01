<template>
  <div>
    <el-card>
      <el-alert title="注意 只允许为三级分类添加参数或属性" type="warning" show-icon :closable=false></el-alert>
      <span>选择商品分类：</span>
      <el-cascader v-model="selectCateKeys" :options="categoryList" :props="setProps" clearable @change="getParamsData" style="margin:20px 0"></el-cascader>
      <el-tabs v-model="activeName" @tab-click="getParamsData">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled='isBtnDisabled' @click="addEditDialog">添加参数</el-button>
          <!-- 参数表格 -->
          <TableList @addChildParams='addChildParams' @deleteParams='deleteParams' @showEditDialog='addEditDialog' :initData="manyTabData"></TableList>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled='isBtnDisabled' @click="addEditDialog">添加属性</el-button>
          <TableList @addChildParams='addChildParams' @deleteParams='deleteParams' @showEditDialog='addEditDialog' :initData="onlyTabData"></TableList>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数/属性对话框 -->
    <el-dialog :title="addOrEdit + textTitle" :visible.sync="addOrEditDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-width="100px">
        <el-form-item :label="textTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
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
      addOrEditDialogVisible: false,
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
    },
    addOrEdit() {
      return this.addForm.attr_id ? '编辑' : "添加"
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
    // 添加/修改参数或属性对话框
    addEditDialog(params) {
      //参数或属性表单
      this.addForm = {
        attr_name: '',
      };
      if (params.cat_id) {
        this.getByIdSearchParams(params);
      }
      this.addOrEditDialogVisible = true;
    },
    async getByIdSearchParams(params) {
      const res = await this.$API.params.reqByIdSearchParams(params.cat_id, params.attr_id, { attr_sel: this.activeName });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.addForm = res.data;
    },
    // 关闭对话框
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入正确的数据');
        const id = this.cateId;
        const addParamsForm = {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
        }
        const res = await this.$API.params.reqAddEditParams(id, addParamsForm, this.addForm.attr_id);
        if (res.meta.status !== 201 && res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.addOrEditDialogVisible = false;
        this.getParamsData();
      })
    },
    // 添加子属性/参数
    async addChildParams(attrInfo, row) {
      attrInfo.attr_sel = this.activeName;
      // 发送请求，添加可选参数
      const res = await this.$API.params.reqAddEditParams(this.cateId, attrInfo, row.attr_id);
      if (res.meta.status !== 200) return this.$message.error('添加失败');
      this.$message.success(res.meta.msg);
    },
    // 删除操作
    deleteParams(event) {
      this.$confirm(`是否删除 ${event.attr_name} `, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$API.params.reqDeleteParams(this.cateId, event.attr_id);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.getParamsData();
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 修改按钮，对话框
    async showEditDialog(params) {
      const res = await reqByIdSearchParams(params.cat_id, params.attr_id, { attr_sel: this.activeName });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
