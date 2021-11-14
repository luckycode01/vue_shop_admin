<template>
  <el-tooltip class="item" effect="dark" :content="title" :placement="top">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </el-tooltip>
</template>

<script>
export default {
  name: 'HintButton',
  props: [{
    title: String,
    default: '提示内容'
  }, {
    placement: String,
    default: 'top',
  }]
}
</script>

<style lang="scss" scoped>
</style>
