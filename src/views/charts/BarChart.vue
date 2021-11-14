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
          text: 'World Population'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230]
          },
          {
            name: '2012',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807]
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
