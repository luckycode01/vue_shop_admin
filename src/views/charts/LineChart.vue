<template>
  <div id="canvas_line" ref="line_chart"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: '',

  mounted() {
    this.$nextTick(() => {
      this.initChart();
    })
  },

  methods: {
    initChart() {
      // let echarts = require('echarts')
      // let chartDom = document.getElementById('canvas_line');
      // let myChart = echarts.init(chartDom);
      let myChart = echarts.init(this.$refs["line_chart"]);
      let option;
      option = {
        title: {
          text: 'Stacked Line'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Email',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Union Ads',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: 'Video Ads',
            type: 'line',
            stack: 'Total',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: 'Direct',
            type: 'line',
            stack: 'Total',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: 'Search Engine',
            type: 'line',
            stack: 'Total',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };
      option && myChart.setOption(option);
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    }
  },


}
</script>

<style lang="scss" >
#canvas_line {
  width: 45%;
  height: 280px;
  margin-bottom: 30px;
}
</style>
