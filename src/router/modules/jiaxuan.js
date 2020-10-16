
const _import = require('../config/_import_' + process.env.NODE_ENV)
/**
 * 业务模块home
 */
export default [
  {
    path: '/jiaxuan',
    name: '家选项目集锦',
    component: _import('jiaxuan/index'),
   
  },
  
  {
    path: '/slider',
    name: '家选轮播',
    component: _import('jiaxuan/slider'),
   
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

