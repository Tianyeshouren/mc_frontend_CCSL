<template>
  <div id="t" ref="mychart">

  </div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'

export default {
  name: 'test',
  components: {
  },
  data: function () {
    return {
      myChart: {},
      da: {},
      CLKDATA: [],
      XDATA: [],
      YDATA: [],
      SCHEDATA: []
    }
  },
  methods: {
    getData () {
      // 对应 Python 提供的接口，这里的地址填写下面服务器运行的地址，本地则为127.0.0.1，外网则为 your_ip_address
      const path = 'http://127.0.0.1:5000/test'
      // const output = 'http://127.0.0.1:5000/static/output.html'
      axios.post(path, null).then((response) => {
        this.da = response.data
        this.CLKDATA = this.da.CLK
        this.XDATA = this.da.X
        this.YDATA = this.da.Y
        this.SCHEDATA = this.da.SCHE
        console.log(this.XDATA)
        let dom = this.$refs.mychart
        this.myChart = echarts.init(dom)
        this.myChart.setOption(this.opt)
      }).catch(function (error) {
        alert('Error ' + error)
      })
      // axios.get(output).then((res) => {
      //   console.log(res.data)
      //   that.inputccsl = res.data
      // })
    }
  },
  computed: {
    opt () {
      let that = this
      let obj =
        {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: that.CLKDATA
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            data: that.XDATA
          },
          yAxis: {
            type: 'category',
            data: that.YDATA
          },
          series: that.SCHEDATA
        }
      return obj
    }
  },
  mounted () {
    // this.getData()
  }
}
</script>
<style>
#t {
  height: 500px;
}
</style>
