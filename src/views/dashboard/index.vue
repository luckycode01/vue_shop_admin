<template>
  <div class="dashboard-container">
    <div class="chart-container">
      <LineChart></LineChart>
      <PieChart></PieChart>
      <BarChart></BarChart>
      <GaugeChart></GaugeChart>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LineChart from '@/views/charts/LineChart'
import PieChart from '../charts/PieChart'
import BarChart from '../charts/BarChart'
import GaugeChart from '../charts/GaugeChart'

export default {
  name: 'Dashboard',
  components: {
    LineChart,
    PieChart,
    BarChart,
    GaugeChart
  },

  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.chart-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
}
</style>
