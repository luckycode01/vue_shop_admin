<template>
  <div>
    <el-card>
      <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px;" @click="showAddOrEditRoles()">添加角色</el-button>
      <el-table :data="rolesDataList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="{row}">
            <el-row :class="['bd-bottom', index1 ? '' : 'bd-top', 'row-center']" v-for="(item1,index1) in row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag size="mini">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[index2 ? 'bd-top' : '', 'row-center']" v-for="(item2,index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag size="mini" type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable size="mini" type="warning" v-for="item3 in item2.children" :key="item3.id">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" align="center"></el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showAddOrEditRoles(row.id)">编辑</el-button>
            <el-popconfirm style="margin:0 10px" :title="'你确定要删除'+ row.roleName" @onConfirm="deleteRoles(row)">
              <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </el-popconfirm>
            <el-button type="warning" size="mini" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="添加角色" :visible.sync="addOrEditRolesDialog" width="width" @close="closeAddOrEditRolesDialog()">
      <el-form ref="rolesFormRef" :rules="rolesFormRules" :model="rolesForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addOrEditRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitRoleForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'roles',
  data() {
    return {
      // 表单验证
      rolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ]
      },
      rolesDataList: [],
      addOrEditRolesDialog: false,//编辑或修改角色对话框
      rolesForm: {
        roleName: '',
        roleDesc: '',
      }
    }
  },
  created() {
    this.getRolesDataList();
  },
  methods: {
    async getRolesDataList() {
      try {
        const res = await this.$API.power.reqRolesDataList();
        if (res.meta.status == 200) {
          this.$message.success(res.meta.msg);
          this.rolesDataList = res.data;
        } else {
          this.$message.error(res.meta.msg)
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    async showAddOrEditRoles(id) {
      this.addOrEditRolesDialog = true;
      this.rolesForm = {
        roleName: '',
        roleDesc: '',
      };
      if (id) {
        try {
          const res = await this.$API.power.reqRolesById(id);
          if (res.meta.status == 200) {
            this.rolesForm = res.data;
          } else {
            this.$message.error(res.meta.msg)
          }
        } catch (error) {
          this.$message.error(error);
        }
      }
    },
    // 关闭对话框时清空表单
    closeAddOrEditRolesDialog() {
      this.$refs.rolesFormRef.resetFields();
    },
    submitRoleForm() {
      this.$refs.rolesFormRef.validate(async (val) => {
        if (val) {
          let rolesForm = this.rolesForm;
          try {
            const res = await this.$API.power.submitRoleForm(rolesForm);
            if (res.meta.status == 200 || res.meta.status == 201) {
              this.$message.success(res.meta.msg);
              this.addOrEditRolesDialog = false;
              this.getRolesDataList();
            } else {
              this.$message.error(res.meta.msg);
            }
          } catch (error) {
            this.$message.error(error);
          }
        } else {
          this.$message.error("验证失败，请检查输入的信息是否正确")
        }
      })
    },
    async deleteRoles({ id, roleName }) {
      try {
        const res = await this.$API.power.deleteRoles(id);
        if (res.meta.status == 200) {
          this.$message.success(res.meta.msg);
          this.getRolesDataList();
        } else {
          this.$message.error(res.meta.msg);
        }
      } catch (error) {
        this.$message.error(error);
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.bd-top {
  border-top: 1px solid #eeeeee;
}
.bd-bottom {
  border-bottom: 1px solid #eeeeee;
}
.el-tag {
  margin: 7px;
}
.row-center {
  display: flex;
  align-items: center;
}
</style>
