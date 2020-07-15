
const _import = require('../config/_import_' + process.env.NODE_ENV)
/**
 * 业务模块home
 */
export default [
  // 首页
  {
    path: '/index',
    name: '首页',
    component: _import('home/index'),
    meta: {
      isBack: false, //返回不刷新
      keepAlive: false,
      requiresAuth: true // 要求验证的页面,在此情况下其子页面也会被验证.
    },
  }
]

