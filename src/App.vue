<template>
  <div id="app">
  <el-container style="height: 100%; border: 0px solid #eee">
  <el-aside width="auto" id="appelaside" style="user-select: none">
<el-menu
  :default-active="$route.path"
  class="el-menu-demo"
  @select="handleSelect"
  background-color="rgb(31, 30, 30)"
  text-color="white"
  active-text-color="orange"
  id="appelm"
  router>
  <el-menu-item index="/"><i class="el-icon-star-on"></i>主页</el-menu-item>
  <el-menu-item index="/ccsl"><i class="el-icon-s-promotion"/>工具</el-menu-item>
  <el-menu-item index="/labdata"><i class="el-icon-s-data"/>结果</el-menu-item>
</el-menu>
  </el-aside>
  <el-main style="padding: 0px 0px 0px 0px">
    <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </el-main>
  </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      // this.$router.push({
      //   path: key
      // })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: auto;
  width:100%;
  border:0px;
  padding:0px;
  height: 100%;
}
#drag {
  cursor:move;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height:20px;
  background-color:  rgb(31, 30, 30);
  -webkit-app-region: drag;
}
#appelaside{
  background-color: rgb(31, 30, 30);
  padding: 0px;
  border: 0px;
  margin-right: 1px;
}
#appelm{
  padding: 0px;
  margin: 0px;
  border: 0px;
}
a{
  text-decoration: none;}
.but {
  color: white;
  width: 5%;
  height: 20px;
  background-color: rgb(31, 30, 30);
  cursor:pointer;
  user-select: none;
  display: flex;
  align-items:center;
  justify-content: center;
  -webkit-app-region: no-drag;
}
.but:hover{
  color:red;
}
</style>
