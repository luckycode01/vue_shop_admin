<template>
  <div>
    <el-card>
      <el-tabs v-model="tabValue" @tab-click='handleChange' type="border-card">
        <el-tab-pane name="tree" label="树型显示">
          <el-tree :data="rightList" :props="defaultProps" accordion></el-tree>
        </el-tab-pane>
        <el-tab-pane name="list" label="列表显示">
          <el-table :data="rightList" style="width: 100%" stripe border>
            <el-table-column type="index" align="center" label="序号" width="80"></el-table-column>
            <el-table-column prop="authName" label="权限名称" width="width"></el-table-column>
            <el-table-column prop="path" label="路径" width="width"></el-table-column>
            <el-table-column label="权限等级" width="width">
              <template slot-scope="{row}">
                <el-tag v-if="row.level == 0" type="success">一级</el-tag>
                <el-tag v-if="row.level == 1" type="warning">二级</el-tag>
                <el-tag v-if="row.level == 2" type="info">三级</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data() {
    return {
      tabValue: 'tree',
      rightList: [],
      // type: "tree",
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created() {

  },
  mounted() {
    this.getRightsList();
  },
  watch: {
    tabValue() {
      this.getRightsList();
    }
  },
  methods: {
    async getRightsList() {
      try {
        const res = await this.$API.power.reqRightsList(this.tabValue);
        if (res.meta.status == 200) {
          this.$message.success(res.meta.msg);
          this.rightList = res.data;
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    handleChange() {
      // this.type
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
