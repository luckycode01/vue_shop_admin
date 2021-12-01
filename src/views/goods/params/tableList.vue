<template>
  <div>
    <el-table style="margin-top:20px" :data='initData' border stripe>
      <!--展开行 -->
      <el-table-column type='expand'>
        <template slot-scope="{row}">
          <!-- tag标签 -->
          <el-tag closable @close='deleteTag(index,row)' v-for="(item, index) in row.attr_vals" :key="index">{{item}}</el-tag>
          <!-- 添加按钮 -->
          <el-input class="input-new-tag add-tag-inp" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)"></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
        </template>
      </el-table-column>
      <!-- 索引 -->
      <el-table-column label="#" type='index'></el-table-column>
      <el-table-column label="参数名称" prop="attr_name"></el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="$emit('showEditDialog',row)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete " @click="$emit('deleteParams',row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  name: '',
  props: ['initData'],
  methods: {
    // 点击添加按钮
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 键盘enter抬起/或失去焦点
    async saveTag(row) {
      const attrInfo = {
        attr_name: row.attr_name,
        attr_vals: row.attr_vals.join(' '),
      }
      this.$emit('addChildParams', attrInfo, row)
    },

    handleInputConfirm(row) {
      if (!row.inputValue.trim()) {
        row.inputVisible = false;
        row.inputValue = '';
        return
      }
      row.attr_vals.push(row.inputValue.trim());
      this.saveTag(row);
      row.inputVisible = false;
      row.inputValue = '';
    },
    deleteTag(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveTag(row);
    },
  }
}
</script>

<style lang="scss" scoped>
.sel-cate {
  margin-top: 15px;
}
.sel-cate span {
  margin-right: 15px;
}
.el-tag {
  margin: 10px;
}
.add-tag-inp {
  width: 100px;
}
</style>
