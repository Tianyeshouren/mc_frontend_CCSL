import Vue from 'vue'
import Router from 'vue-router'
import start from '@/components/start'
import ccsl from '@/components/CCSL'
import labdata from '@/components/labdata'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'start',
      component: start
    },
    {
      path: '/ccsl',
      name: 'ccsl',
      component: ccsl,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/labdata',
      name: 'labdata',
      component: labdata,
      meta: {
        keepAlive: true
      }
    }
  ]
})
