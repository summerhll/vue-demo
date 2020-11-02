
const _import = require('../config/_import_' + process.env.NODE_ENV)
/**
 * 业务模块home
 */
export default [
  {
    path: '/scroll',
    name: '滚动透传问题',
    component: _import('scroll/index'),
   
  },
  
  {
    path: '/noScroll',
    name: 'body无滚动 + 弹层无滚动',
    component: _import('scroll/noScroll'),
   
  },
  {
    path: '/leftDelete',
    name: '左滑删除',
    component: _import('jiaxuan/left-delete'),
   
  },
  {
    path : '/configureDetail',
    name: '配置详情',
    component: _import('jiaxuan/configure-detail'),
   
  },
  {
    path : '/pkDetail',
    name: '对比详情',
    component: _import('jiaxuan/pk-detail'),
   
  }
  
]

