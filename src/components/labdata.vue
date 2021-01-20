<template>
  <div id="pagelabdata">
    <el-container id="labdataelc">
    <el-main id="labdataelm">
         <el-table :data="tableData">
      <el-table-column
        prop="labname"
        label="当前实验"
        min-width="5%">
      </el-table-column>
      <el-table-column
        prop="bound"
        label="当前边界"
        min-width="5%">
      </el-table-column>
      <el-table-column
        prop="res"
        label="结果"
        min-width="5%">
      <template slot-scope="scope">
            <span v-if="scope.row.res==='sat'"><i class="el-icon-success"/></span>
            <span v-if="scope.row.res==='unsat'"><i class="el-icon-error"/></span>
            <span v-if="scope.row.res==='inprogress'"><i class="el-icon-loading"/></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        label="用时"
        min-width="5%">
      </el-table-column>
      <el-table-column
        prop="date"
        label="日期"
        min-width="5%">
      </el-table-column>
    </el-table>
    <div id="func">
      <div id="func1">
          <el-tooltip :content="'Echars: ' + showec" placement="top">
            <el-switch @change="test" v-model="showec" active-color="grey" inactive-color="orange"></el-switch>
          </el-tooltip>
          <div id="red" @click="rerender" ><i class="el-icon-refresh"></i></div>
      </div>
      <div id="func2">
          <button :disabled="ifchooselab" @click="deletelab" style="color:red;"><i class="el-icon-delete"></i>删除</button>
          <button  @click="redo" :disabled="ifchooselab" ref="aux" ><i class="el-icon-refresh-left"></i>重做</button>
      </div>
        </div>
     <div class="display" :class="{showht:showec === false}">
          <div v-show="showec" id="ec" ref="mychart"></div>
          <div v-show="!showec" id="ht" v-html="outputHtml"></div>
      </div>
      <input style="display:none" v-text="ccsl"/>
    </el-main>
     <el-aside id="labdataelhe" style="width:15%; background-color: rgb(31, 30, 30);">
      <div id="select">
      <el-dropdown @command="chooselab" trigger="click">
            <span class="el-dropdown-link">
            <div  id="selectlab" @click="putselect">
    <label>实验<i class="el-icon-arrow-down el-icon--right"></i></label>
  </div>
          </span>
          <el-dropdown-menu slot="dropdown" >
             <el-dropdown-item v-for="item in lablist" v-bind:key="item.labname" v-text="'['+item.labname+']' +' <'+ dateFormat(item.date)+'>'" :command="item" ></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown @command="choosebd" trigger="click">
            <span class="el-dropdown-link">
            <div  id="selectbd" @click="putselect">
    <label>边界<i class="el-icon-arrow-down el-icon--right"></i></label>
  </div>
          </span>
          <el-dropdown-menu slot="dropdown" >
             <el-dropdown-item v-for="item in bdlist" v-bind:key="item"  v-text="item" :command="item"> </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </div>
        <div id="d">
       <router-link to='/ccsl'><div id="toolbut"><i class="el-icon-back"></i></div></router-link>
        </div>
    </el-aside>
  </el-container>
  </div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'

export default {
  name: 'labdata',
  data: function () {
    return {
      ccsl: '这里显示ccsl',
      outputHtml: '请选择一个具体实验',
      showec: true,
      lablist: [],
      bdlist: [],
      curlab: '',
      curbd: '',
      tableData: [{
        bound: '无',
        labname: '无',
        time: '',
        res: '',
        date: ''}],
      reqout: {'labname': '', 'bound': ''},
      myChart: {},
      CLKDATA: [],
      XDATA: [],
      YDATA: [],
      SCHEDATA: []
    }
  },
  methods: {
    test () {
      console.log(this.showec)
    },
    oncopy (e) {
      console.log(e)
    },
    onerr (e) {

    },
    show () {
      // console.log(row.name)
      // console.log(this.$refs.ccsltext.$el.offsetHeight)
    },
    rerender () {
      this.putselect()
      this.putbd()
      if (this.curlab !== '' && this.curbd !== '' && this.tableData[0].res === 'inprogress') {
        alert('refresh data in case of inprogress' + this.curlab + ',' + this.curbd)
        this.getoutput()
      }
      console.log(this.ccsl)
      let dom = this.$refs.mychart
      this.myChart = echarts.init(dom)
      this.myChart.setOption(this.opt)
      this.myChart.resize()
    },
    cleardata () {
      this.curlab = ''
      this.curbd = ''
      this.tableData = [{
        bound: '无',
        labname: '无',
        time: '',
        res: '',
        date: ''}]
      this.ccsl = ''
      this.CLKDATA = []
      this.XDATA = []
      this.YDATA = []
      this.SCHEDATA = []
      this.outputHtml = '请选择一个具体实验'
      let dom = this.$refs.mychart
      this.showec = true
      this.myChart = echarts.init(dom)
      this.myChart.setOption(this.opt)
      this.myChart.resize()
      this.getlab()
      this.bdlist = []
    },
    deletelab () {
      // console.log(this.ifchooselab)
      this.$confirm('此操作将永久删除' + this.curlab + ',是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.reqout.labname = this.curlab
        const path = 'http://127.0.0.1:5000/DeleteLab'
        axios.post(path, this.reqout).then((response) => {
          if (response.data.r === true) {
            this.cleardata()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getoutput () {
      this.reqout.labname = this.curlab
      this.reqout.bound = this.curbd
      const path = 'http://127.0.0.1:5000/QueryOutput'
      axios.post(path, this.reqout).then((response) => {
        this.ccsl = response.data.ccsl
        this.tableData[0].time = response.data.time
        this.tableData[0].res = response.data.res
        if (this.tableData[0].res !== 'sat') {
          this.CLKDATA = []
          this.XDATA = []
          this.YDATA = []
          this.SCHEDATA = []
          this.outputHtml = response.data.output
          let dom = this.$refs.mychart
          this.myChart = echarts.init(dom)
          this.myChart.setOption(this.opt)
          this.myChart.resize()
        } else {
          this.CLKDATA = response.data.ec.CLK
          this.XDATA = response.data.ec.X
          this.YDATA = response.data.ec.Y
          this.SCHEDATA = response.data.ec.SCHE
          this.outputHtml = response.data.output
          let dom = this.$refs.mychart
          this.myChart = echarts.init(dom)
          this.myChart.setOption(this.opt)
          this.myChart.resize()
        }
      })
    },
    getbd () {
      this.reqout.labname = this.curlab
      const path = 'http://127.0.0.1:5000/Querybd'
      axios.post(path, this.reqout).then((response) => {
        this.bdlist = response.data.bdlist
        this.ccsl = response.data.ccsl
        // console.log(this.bdlist)
        // for(var i=0;i<this.bdlist.length;i++)
        // {
        //   console.log(this.bdlist[i])
        // }
      })
    },
    redo () {
      this.$router.push({
        name: 'ccsl',
        params: {
          ccslsrc: this.ccsl
        }
      })
    },
    dateFormat (time) {
      return this.$moment(time).utcOffset(0).format('YYYY/MM/DD-H:mm:ss')
    },
    getlab () {
      const path = 'http://127.0.0.1:5000/Query'
      axios.post(path, null).then((response) => {
        this.lablist = response.data
        // console.log(this.lablist)
        // for(var i=0;i<this.lablist.length;i++)
        // {
        //   console.log(this.lablist[i].labname)
        // }
      })
    },
    putbd () {
      if (this.curlab !== '') {
        this.getbd()
      }
    },
    putselect () {
      this.getlab()
    },
    chooselab (lab) {
      this.curlab = lab.labname
      this.curbd = ''
      this.tableData = [{
        bound: '',
        labname: lab.labname,
        time: '',
        res: '',
        date: this.$moment(lab.date).utcOffset(0).format('YYYY/MM/DD-H:mm')}]
      this.getbd()
      this.$refs['aux'].focus()
    },
    choosebd (bd) {
      this.curbd = bd
      this.tableData[0].bound = bd
      this.getoutput()
      this.$refs['aux'].focus()
    }
  },
  computed: {
    ifchooselab () {
      if (this.curlab === '') {
        return true
      } else {
        return false
      }
    },
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
            data: that.CLKDATA,
            textStyle: {
              color: '#ffffff'
            }
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
            data: that.XDATA,
            axisLabel: {
              textStyle: {
                color: '#ffffff'
              }
            }
          },
          yAxis: {
            type: 'category',
            data: that.YDATA,
            axisLabel: {
              textStyle: {
                color: '#ffffff'
              }
            }
          },
          series: that.SCHEDATA
        }
      return obj
    }
  },
  mounted () {
    let dom = this.$refs.mychart
    this.myChart = echarts.init(dom)
    this.myChart.setOption(this.opt)
    this.myChart.resize()
    this.getlab()
    // this.getData()
  }
}
</script>
<style>
#pagelabdata{
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color:  rgb(31, 30, 30);
  background-color:rgb(31, 30, 30);
  height: 100%;
  padding: 0px;
  margin: 0px;
}
#labdataelc{
  padding: 0;
  margin: 0px;
  border: 0px;
  height: 100%;
}
.display{
  width: 99%;
  background:rgb(48, 49, 49);
  height: 80%;
}
#ec{
  height: 100%;
  width: 100%;
}
#choose{
  background-color:gray;
  display: flex;
  flex-direction: column;
}
#select{
  background-color:rgb(31, 30, 30);
  display: flex;
  flex-direction: column;
  width: 100%;
}
#info{
  color: white;
  user-select: none;
}
#labdataelhe{
  display: flex;
  flex-direction: column;
  padding: 0px;
  border: 0px;
  align-items: flex-start
}
#labdataelm{
  margin:0px;
  padding: 0;
  border:0px;
  background-color:  rgb(48, 49, 49);
  width:100%;
}
#func {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}
#func1 {
  margin: 0 0 0 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}
#func2 {
  color: orange;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  user-select: none;
}
#d{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
}
.showht {
  background-color: rgb(224, 219, 210);
}
#ht {
  overflow: scroll;
}
#toolbut {
  color: orange;
  width: 96%;
  height: 50px;
  background-color: rgb(61, 61, 59);
  margin: 2px auto;
  border: 2px solid white;
  cursor:pointer;
  user-select: none;
  display: flex;
  align-items:center;
  justify-content: center;
}
#toolbut:hover {
  background-color: white;
}
#selectlab {
  color: orange;
  width: 96%;
  height: 50px;
  background-color: rgb(61, 61, 59);
  margin: 0 auto 2px auto;
  border: 2px solid white;
  cursor:pointer;
  user-select: none;
  display: flex;
  align-items:center;
  justify-content: center;
}
#selectlab:hover {
  background-color:white;
}
#selectbd {
  color: orange;
  width: 96%;
  height: 50px;
  background-color: rgb(61, 61, 59);
  margin: 2px auto;
  border: 2px solid white;
  cursor:pointer;
  user-select: none;
  display: flex;
  align-items:center;
  justify-content: center;
}
#selectbd:hover {
  background-color:white;
}
#red {
  color: orange;
  width: 40px;
  height: 20px;
  background-color: rgb(61, 61, 59);
  border: 2px solid white;
  cursor:pointer;
  user-select: none;
  display: flex;
  align-items:center;
  justify-content: center;
}
#red:hover {
  background-color:white;
}
</style>
