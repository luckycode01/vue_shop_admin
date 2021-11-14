<template>
  <div id="canvas_line" ref="line_chart"></div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-gl';

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
      let ROOT_PATH =
        'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
      let myChart = echarts.init(this.$refs["line_chart"]);
      let option;
      option = {
        backgroundColor: '#000',
        globe: {
          baseTexture: ROOT_PATH + '/data-gl/asset/earth.jpg',
          heightTexture: ROOT_PATH + '/data-gl/asset/bathymetry_bw_composite_4k.jpg',
          displacementScale: 0.1,
          shading: 'lambert',
          environment: ROOT_PATH + '/data-gl/asset/starfield.jpg',
          light: {
            ambient: {
              intensity: 0.1
            },
            main: {
              intensity: 1.5
            }
          },
          layers: [
            {
              type: 'blend',
              blendTo: 'emission',
              texture: ROOT_PATH + '/data-gl/asset/night.jpg'
            },
            {
              type: 'overlay',
              texture: ROOT_PATH + '/data-gl/asset/clouds.png',
              shading: 'lambert',
              distance: 5
            }
          ]
        },
        series: []
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
