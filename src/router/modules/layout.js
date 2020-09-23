
const _import = require('../config/_import_' + process.env.NODE_ENV)
/**
 * 业务模块home
 */
export default [
    // 布局首页
  {
    path: '/layout',
    name: '示例',
    component: _import('layout/index')
  },
  {
    path: '/threeCols',
    name: '三列布局',
    component: _import('layout/three-cols')
  },
  {
    path: '/twoCols',
    name: '两列自适应布局',
    component: _import('layout/two-cols')
  }

  
]

