<template>
  <div>
    <el-card>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="userListInfo.query" @input="getUserList()" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddOrEditUserDialog()">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" stripe style="width: 100%;margin: 20px 0;" border>
        <el-table-column align='center' type="index" label="序号" width="80"></el-table-column>
        <el-table-column align='center' prop="username" label="用户名" width="width"></el-table-column>
        <el-table-column align='center' prop="email" label="邮箱" width="width"></el-table-column>
        <el-table-column align='center' prop="mobile" label="电话" width="width"></el-table-column>
        <el-table-column align='center' prop="role_name" label="角色" width="width"></el-table-column>
        <el-table-column align='center' label="状态" width="80">
          <template slot-scope="{row}">
            <el-switch v-model="row.mg_state" @change="changeState(row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align='center' label="操作" width="200">
          <template slot-scope="{row}">
            <HintButton @click="showAddOrEditUserDialog(row.id)" :title='"编辑"' type='primary' icon="el-icon-edit" size='mini' circle></HintButton>
            <HintButton @click="deleteUser(row.id,row.username)" :title='"删除"' type='danger' icon="el-icon-delete" size='mini' circle></HintButton>
            <HintButton :title='"分配权限"' type='warning' icon="el-icon-setting" size='mini' circle></HintButton>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="userListInfo.pagenum" :page-sizes="[ 5, 7,11]" :page-size="userListInfo.pagesize" :total="total" layout="prev,pager, next,jumper,sizes,total">
      </el-pagination>
    </el-card>
    <!-- 添加或编辑用户 -->
    <el-dialog title="添加用户" :visible.sync="addOrEditUserDialog" @close="closeAddOrEditUserDialog">
      <el-form :model="userForm" :rules="userFormRules" ref="userFormRef">
        <el-form-item label="用户名称" prop="username" label-width="120px">
          <el-input :disabled="userForm.id" v-model="userForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="!userForm.id" label="用户密码" prop="password" label-width="120px">
          <el-input v-model="userForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="120px">
          <el-input v-model="userForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" label-width="120px">
          <el-input v-model="userForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrEditUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    let checkMobile = (rule, value, callback) => {
      if (value) {
        if (!/^1[3|4|5|7|8][0-9]{9}$/.test(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    return {
      // 表单验证
      userFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: ['blur', 'change'] },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: ['blur', 'change'] },
          { min: 6, max: 10, message: '请输入长度为6-10的密码', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: false, message: '请输入用户密码', trigger: ['blur', 'change'] },
          { validator: checkMobile, trigger: ['blur', 'change'] }
        ],
      },
      userListInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0,
      addOrEditUserDialog: false,//控制添加对话框
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
    }
  },
  mounted() {
    this.getUserList();
  },
  computed: {
    dialogTitle() {
      return this.userForm.id ? "编辑用户" : "添加用户"
    }
  },
  methods: {
    // 改变每页条数
    handleSizeChange(pagesize) {
      this.userListInfo.pagesize = pagesize;
      this.getUserList();
    },
    //改变当前页
    handleCurrentChange(currentPage) {
      // this.userListInfo.pagenum = currentPage;
      this.getUserList(currentPage);
    },
    async getUserList(pagenum = 1) {
      this.userListInfo.pagenum = pagenum;
      try {
        const res = await this.$API.user.getUserList(this.userListInfo);
        if (res.meta.status == 200) {
          // this.$message.success(res.meta.msg);
          this.userList = res.data.users;
          this.total = res.data.total;
        } else {
          this.$message.error(res.meta.msg)
        }
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    // 搜索
    searchUser() {

    },
    // 打开添加对话框
    async showAddOrEditUserDialog(id) {
      this.userForm = {
        username: '',
        password: '',
        email: '',
        mobile: '',
      }
      if (id) {
        console.log(id);
        try {
          const res = await this.$API.user.getUserInfoById(id);
          if (res.meta.status == 200) {
            this.userForm = res.data;
          } else {
            this.$message.error(res.meta.msg)
          }
        } catch (error) {
          this.$message("请求获取用户信息失败")
        }
      }
      this.addOrEditUserDialog = true;
    },
    // 关闭对话框时清空表单
    closeAddOrEditUserDialog() {
      this.$refs.userFormRef.resetFields();
    },
    // 确定添加用户
    addUser() {
      this.$refs.userFormRef.validate(async (valid) => {
        if (valid) {
          try {
            if (this.userForm.id) {
              let params = {
                mobile: this.userForm.mobile,
                email: this.userForm.email,
              }
              let res = await this.$API.user.putUserInfo(this.userForm.id, params)
              if (res.meta.status == 200) {
                this.$message.success(res.meta.msg);
                this.addOrEditUserDialog = false;
                this.getUserList();
              } else {
                this.$message.error(res.meta.msg);
              }
            } else {
              let res = await this.$API.user.addUser(this.userForm)
              if (res.meta.status == 201) {
                this.$message.success(res.meta.msg);
                this.addOrEditUserDialog = false;
                this.getUserList();
              } else {
                this.$message.error(res.meta.msg)
              }
            }
          } catch (error) {
            this.$message.error("请求发送失败")
          }
        } else {
          this.$message.error("输入用户信息有误，请重新输入")
        }
      })
    },
    // 删除用户
    deleteUser(id, name) {
      this.$confirm(`您将要删除${name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          let res = await this.$API.user.deleteUser(id);
          if (res.meta.status == 200) {
            this.$message.success(res.meta.msg);
            let pagenum = this.userList.length > 1 ? this.userListInfo.pagenum : this.userListInfo.pagenum - 1;
            this.getUserList(pagenum);
          } else {
            this.$message.error(res.meta.msg)
          }
        } catch (error) {
          this.$message.error(error)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 改变用户状态
    async changeState(row) {
      let { id, mg_state } = row;
      console.log(id, mg_state)
      try {
        let res = await this.$API.user.changeState(id, mg_state);
        if (res.meta.status == 200) {
          this.$message.success(res.meta.msg);
        } else {
          this.$message.error(res.meta.msg);
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-pagination {
  text-align: right;
}
</style>
