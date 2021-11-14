<template>
  <div>
    <el-card>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="userListInfo.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddUserDialog()">添加用户</el-button>
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
            <el-switch v-model="row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align='center' label="操作" width="200">
          <template slot-scope="{row}">
            <HintButton @click="editUserInfo(row.id)" :title='"编辑"' type='primary' icon="el-icon-edit" size='mini' circle></HintButton>
            <HintButton :title='"删除"' type='danger' icon="el-icon-delete" size='mini' circle></HintButton>
            <HintButton :title='"分配权限"' type='warning' icon="el-icon-setting" size='mini' circle></HintButton>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="userListInfo.pagenum" :page-sizes="[ 5, 7,11]" :page-size="userListInfo.pagesize" :total="total" layout="prev,pager, next,jumper,sizes,total">
      </el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialog" @close="closeaddUserDialog">
      <el-form :model="userForm" :rules="userFormRules" ref="userFormRef">
        <el-form-item label="用户名称" prop="username" label-width="120px">
          <el-input v-model="userForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" label-width="120px">
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
        <el-button @click="addUserDialog = false">取 消</el-button>
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
      addUserDialog: false,//控制添加对话框
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },//用户信息表单
    }
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    // 改变每页条数
    handleSizeChange(pagesize) {
      this.userListInfo.pagesize = pagesize;
      this.getUserList();
    },
    //改变当前页
    handleCurrentChange(currentPage) {
      this.userListInfo.pagenum = currentPage;
      this.getUserList();
    },
    async getUserList() {
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
    // 打开添加对话框
    showAddUserDialog() {
      this.addUserDialog = true;
    },
    // 关闭对话框时清空表单
    closeaddUserDialog() {
      this.$refs.userFormRef.resetFields();
    },
    // 确定添加用户
    addUser() {
      this.$refs.userFormRef.validate(async (valid) => {
        if (valid) {
          try {
            let res = await this.$API.user.addUser(this.userForm)
            if (res.meta.status == 201) {
              this.$message.success(res.meta.msg);
              this.addUserDialog = false;
              this.getUserList();
            } else {
              this.$message.error(res.meta.msg)
            }
          } catch (error) {
            this.$message.error("请求发送失败")
          }
        } else {
          this.$message.error("输入用户信息有误，请重新输入")
        }
      })
    },
    // 编辑用户信息
    async editUserInfo(id) {
      this.addUserDialog = true;
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

  },
}
</script>

<style lang="scss" scoped>
.el-pagination {
  text-align: right;
}
</style>
