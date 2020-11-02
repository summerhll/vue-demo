import Vue from 'vue'
import Router from 'vue-router'
import RouterModule from './modules' // 引入业务逻辑模块
import RouterCommon from './common' // 引入通用模块



Vue.use(Router)

const router = new Router({
  mode: 'hash', // history模式需要服务端支持
//   scrollBehavior(to, from, savedPosition) {
//     if (savedPosition) { //如果savedPosition存在，滚动条会自动跳到记录的值的地方
//       return savedPosition
//     } else {
//       return { x: 0, y: 0 } //savedPosition也是一个记录x轴和y轴位置的对象
//     }
//   },
  routes: [
    ...RouterCommon,
    ...RouterModule,
  ]
})

export default router

