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
          text: 'Referer of a Website',
          subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
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
