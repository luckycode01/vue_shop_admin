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
          <el-button type="primary">添加用户</el-button>
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
            <HintButton :title='"编辑"' type='primary' icon="el-icon-edit" size='mini' circle></HintButton>
            <HintButton :title='"删除"' type='danger' icon="el-icon-delete" size='mini' circle></HintButton>
            <HintButton :title='"分配权限"' type='warning' icon="el-icon-setting" size='mini' circle></HintButton>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="userListInfo.pagenum" :page-sizes="[ 5, 7,11]" :page-size="userListInfo.pagesize" :total="total" layout="prev,pager, next,jumper,sizes,total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      userListInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0,
    }
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    // 改变每页条数
    handleSizeChange() {
    },
    //改变当前页
    handleCurrentChange() {

    },
    async getUserList() {
      try {
        const res = await this.$API.user.getUserList(this.userListInfo);
        if (res.meta.status == 200) {
          this.$message.success(res.meta.msg);
          this.userList = res.data.users;
          this.total = res.data.total;
        } else {
          this.$message.error(res.meta.msg)
        }
      } catch (error) {
        this.$message.error(error.message)
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
