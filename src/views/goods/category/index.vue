<template>
  <div>
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类表格 -->
      <!-- 全局组件tree-table插件 -->
      <tree-table class="treetable" :data="categoryList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border>
        <!-- 是否有效的模板 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color: lightgreen" v-if="scope.cat_deleted"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序的模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary" @click='editCateDialog(scope.row)'>编辑</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="deleteCate(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 7,10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">
      <el-form :model="addCateForm" ref="addCateFormRef" :rules="addCateFormRules" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader expand-trigger="hover" :options="parentCateList" v-model="selectKeys" :props="cateProps" clearable @change="parentCateChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%" @close="editCateDialogClose">
      <el-form :model="editCateForm" ref="editCateFormRef" :rules="editCateFormRules" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

export default {
  data() {
    return {
      // 查询分类请求参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类列表
      categoryList: [],
      // 商品分类总条数
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template', //自定义模板列//使用作用域插槽
          template: 'isok', //模板 名称
        },
        {
          label: '排序',
          type: 'template', //自定义模板列//使用作用域插槽
          template: 'order', //模板 名称
        },
        {
          label: '操作',
          type: 'template', //自定义模板列//使用作用域插槽
          template: 'opt', //模板 名称
          width: 200 + 'px',
        },
      ],
      // 添加分类对话框的显示隐藏
      addCateDialogVisible: false,
      // 添加分类表单
      addCateForm: {
        cat_pid: 0, // 分类父Id
        cat_name: '', //分类名称
        cat_level: 0, //分类层级  默认0
      },
      //验证规则
      addCateFormRules: {
        cat_name: {
          required: true, //必填项
          message: '请输入分类名称',
          trigger: 'blur', //失去焦点时验证
        },
      },
      editCateFormRules: {
        cat_name: {
          required: true, //必填项
          message: '请输入分类名称',
          trigger: 'blur', //失去焦点时验证
        },
      },
      // 父级分类列表
      parentCateList: [],
      // 选中的父级分类id数组
      selectKeys: [],
      cateProps: {
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 显示/隐藏编辑对话框
      editCateDialogVisible: false,
      // 编辑分类表单
      editCateForm: {
        cat_id: 0,
        cat_name: '',
      }
    }
  },
  mounted() {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList() {
      const res = await this.$API.category.reqCategoryList(this.queryInfo)
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类失败')
      // 保存获取的商品分类列表
      this.categoryList = res.data.result
      // 分类总条数
      this.total = res.data.total
    },

    // 监视pageSize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategoryList()
    },
    // 监视pagenumber页数改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCategoryList()
    },
    // 添加分类的对话框
    showAddCate() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类列表
    async getParentCateList() {
      const res = await this.$API.category.reqCategoryList({ type: 2 });
      if (res.meta.status !== 200)
        return this.$message.error('父级分类获取失败')
      this.parentCateList = res.data
    },
    // 选择项发生变化触发 监听用户选择
    parentCateChange() {
      // 判断选中的父级id数组selectKeys中是否有值，如果七长度大于0说明选择了
      // 分类父级，并且是数组的最后一位元素，等于0说明没有父级分类，添加的是一级分类，
      if (this.selectKeys.length > 0) {
        // 取出数组最后一位元素作为父级分类
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        // 分类层级与父级分类数组长度相等
        this.addCateForm.cat_level = this.selectKeys.length;
        return;
      }
      //如果没有选择就是默认值为0
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    // 确认添加分类按钮

    addCate() {
      // 调用validate函数验证表单输入
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请输分类名称');
        //发送添加请求
        const res = await this.$API.category.reqAddCate(this.addCateForm);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg);
        // 刷新列表
        this.getCategoryList();
        // 关闭对话框
        this.addCateDialogVisible = false;
      });
    },
    //关闭添加分类对话框，清空表单
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields();
      // 清空练级选择的data，解决报错信息
      // this.$refs.addCateFormRef.$children[1].$children[1].panel.activePath = [];
      //清空选中的父级分类id数组
      this.selectKeys = [];
      // 重置分类表单的分类信息
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    // 编辑对话框
    async editCateDialog(cate) {
      // 打开编辑对话框时发送请求，根据ID查询分类
      const res = await this.$API.category.reqIdSearchCate(cate.cat_id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // 对id赋值
      this.editCateForm.cat_id = res.data.cat_id;
      // 对表单中分类名称赋值
      this.editCateForm.cat_name = res.data.cat_name;
      this.editCateDialogVisible = true;
    },
    // 编辑对话框确定按钮
    editCate() {
      // 当点击确定时验证表单信息并发送请求
      this.$refs.editCateFormRef.validate(async (valid) => {
        const { cat_id, cat_name } = this.editCateForm
        const res = await this.$API.category.reqIdEditCate(cat_id, { cat_name });
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        // 刷新列表
        this.getCategoryList();
        // 关闭对话框
        this.editCateDialogVisible = false;
      });

    },
    // 监视关闭编辑对话框
    editCateDialogClose() {
      this.$refs.editCateFormRef.resetFields();
    },
    // 删除分类
    async deleteCate(cate) {
      const confirmData = await this.$confirm(
        `是否删除 ${cate.cat_name} 分类`, '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => { err });
      if (confirmData !== 'confirm') return this.$message.info('您已取消删除');
      // 发送删除请求
      const res = await this.$API.category.reqDeleteCate(cate.cat_id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      // 刷新列表
      this.getCategoryList();
    }
  },
}
</script>

<style lang="scss" scoped>
.treetable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
