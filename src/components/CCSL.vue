<template>
  <div id="pageccsl" >
   <el-container style="height:100%; width:100%; background-color: rgb(31, 30, 30); padding:0 ;margin:0;" >
  <el-main style=" width:100% background-color: rgb(31, 30, 30); padding:0%">
     <div class="btn">
      <button @click="inputsymbol($event)">#</button>
      <button @click="inputsymbol($event)">&lt;</button>
      <button @click="inputsymbol($event)">≤</button>
      <button @click="inputsymbol($event)">⊆</button>
      <button @click="inputsymbol($event)">+</button>
      <button @click="inputsymbol($event)">*</button>
      <button @click="inputsymbol($event)">∧</button>
      <button @click="inputsymbol($event)">∨</button>
      <button @click="inputsymbol($event)">$</button>
      <button @click="inputsymbol($event)">∝</button>
      <button @click="inputsymbol($event)">☇</button>
      <button @click="inputsymbol($event)">==</button>
      <button @click="inputsymbol($event)">∈</button>
      <button @click="inputsymbol($event)">-</button>
      <button @click="inputsymbol($event)">±</button>
      <button @click="inputsymbol($event)">⋈</button>
    </div>
      <div id="input">
     <textarea
              placeholder="请输入CCSL"
              v-model="inputccsl" ref="input"
              style="margin-right:2px"
              @click="cha('input')">
     </textarea>
    <textarea
              placeholder="请输入性质"
              v-model="inputp" ref="property"
              style="margin-left:2px"
              @click="cha('property')">
</textarea>
  </div>
  </el-main>
   <el-aside width="15%" style=" background-color: rgb(31, 30, 30); padding:0 0 0 0;" >
        <div id="parblock">
          <div class="inputblock"><el-input class="ib" v-model="bound" placeholder="请输入边界" ></el-input><div class="bianjie">边界</div></div>
          <div class="inputblock"><div class="bianjie">名称</div><el-input class="ib" v-model="labname" placeholder="请输入名称"></el-input></div>
          <div class="inputblock"><el-input class="ib" v-model="times" placeholder="请输入次数">></el-input><div class="bianjie">次数</div></div>
          <div class="inputblock"><div class="bianjie">跨度</div><el-input class="ib" v-model="gap" placeholder="请输入跨度"></el-input></div>
           <div id="subbut" @click="getData" onselectstart="return false" >提交<i class="el-icon-arrow-down"></i></div>
           <router-link to='labdata'><div id="lookbut" onselectstart="return false" >查看<i class="el-icon-right"></i></div></router-link>
        </div>
      </el-aside>
</el-container>
  </div>
</template>

<script>
import Submit from '@/components/Submit'
import axios from 'axios'
export default {
  name: 'ccsl',
  components: {
    Submit
  },
  data: function () {
    return {
      serverResponse: 'resp',
      data: {'ccsl': 'null', 'bound': '', 'labname': '', 'times': '1', 'gap': '10'},
      inputccsl: '',
      bound: 20,
      outputHtml: '3123',
      savefilename: '',
      saveinfo: {'name': '', 'bound': '', 'result': '', 'time': ''},
      cansave: false,
      cansubmit: 1,
      loading: false,
      labname: 'test',
      times: '1',
      gap: '10',
      inputp: '',
      curref: 'input'
    }
  },
  methods: {
    save () {
      const path = 'http://127.0.0.1:5000/store'
      axios.post(path, this.saveinfo).then((response) => {
        console.log(response.data.output)
        alert('Success ')
        this.cansave = false
        // console.log(this.saveinfo.result)
      }).catch(function (error) {
        alert('Error ' + error)
        this.cansave = true
      })
    },
    open () {
      this.$prompt('请输入', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '你的文件名是: ' + value
        })
        this.savefilename = value
        this.saveinfo.name = value
        this.saveinfo.bound = this.bound
        this.save()
      }).catch(() => {
      })
    },
    getData () {
      var that = this
      that.data.ccsl = that.inputccsl
      that.data.bound = that.bound
      that.data.labname = that.labname
      that.data.times = that.times
      that.data.gap = that.gap
      // 对应 Python 提供的接口，这里的地址填写下面服务器运行的地址，本地则为127.0.0.1，外网则为 your_ip_address
      const path = 'http://127.0.0.1:5000/do'
      // const output = 'http://127.0.0.1:5000/static/output.html'
      that.outputHtml = '正在计算中'
      that.loading = true
      axios.post(path, that.data).then((response) => {
        var msg = response.data.ccsl
        var res = response.data.result
        var time = response.data.time
        that.serverResponse = msg
        that.outputHtml = response.data.output
        console.log(response.data.output)
        that.saveinfo.time = time
        that.saveinfo.result = res
        that.cansave = true
        that.loading = false
        alert(response.data)
      }).catch(function (error) {
        alert('Error ' + error)
        that.outputHtml = '错误'
      })
      // axios.get(output).then((res) => {
      //   console.log(res.data)
      //   that.inputccsl = res.data
      // })
    },
    cha (s) {
      this.curref = s
      // console.log(this.curref)
    },
    inputsymbol (e) {
      // console.log(e.target.innerText)
      const i = this.$refs[this.curref]
      var startpos = i.selectionStart
      var endpos = i.selectionEnd
      // console.log(i.selectionStart)
      if (this.curref === 'input') {
        if (i.selectionStart || i.selectionStart === 0) {
          this.inputccsl = this.inputccsl.substring(0, startpos) + e.target.innerText + this.inputccsl.substring(endpos, i.value.length)
        }
      } else {
        if (i.selectionStart || i.selectionStart === 0) {
          this.inputp = this.inputp.substring(0, startpos) + e.target.innerText + this.inputp.substring(endpos, i.value.length)
        }
      }
      this.$nextTick(() => {
        this.$refs[this.curref].selectionStart = startpos + e.target.innerText.length
        this.$refs[this.curref].selectionEnd = startpos + e.target.innerText.length
        this.$refs[this.curref].focus()
      })
    }
  },
  mounted () {
    this.$refs['input'].focus()
  },
  activated () {
    if (this.$route.params.ccslsrc) {
      this.inputccsl = this.$route.params.ccslsrc
    }
    this.$refs['input'].focus()
  }
}
</script>
<style>
#pageccsl {
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-family:fantasy;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color:white;
  background-color:black;
  height: 100%;
  padding: 0px;
  margin: 0px;
  border:0px;
}
#subbut {
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
#lookbut {
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
#lookbut:hover {
  background-color: rgb(31, 30, 30);
}
#subbut:hover {
  background-color: rgb(31, 30, 30);
}
.btn {
  flex: 0 0 30px;
  display: flex;
  height: 3%;
  padding: 0 0 0 0;
  background-color:white;
}
#input {
  width: 100%;
  height: 97%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  left:0;
  top:0;
  right:0;
  bottom: 0;
  margin: 0px;
  border: 0px;
  padding: 0 0 0 0;
}
#input textarea{
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: white;
    width:50%;
    height: 99%;
    border:none;
    outline: none;
    background-color: rgb(70, 68, 68);
}
.output {
  width: 100%;
  height: 50px;
  background-color: rgb(29, 28, 28);
  margin-left: 4px;
}
#parblock{
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color:  rgb(31, 30, 30);
  color: white;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 100%;
}
.el-input__inner {
  border: 0;
}
.ib {
  background-color:  rgb(31, 30, 30);
  width:70%;
}
.inputblock
{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 97%;
  height: 50px;
  border: 2px solid white;

}
.bianjie{
  background-color:  rgb(31, 30, 30);
  color: orange;
  width: 40%;
  display: flex;
  align-items:center;
  justify-content: center;
  user-select: none;
}
</style>
