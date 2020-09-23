
const _import = require('../config/_import_' + process.env.NODE_ENV)
/**
 * 业务模块home
 */
export default [
  // 首页
  {
    path: '/demo',
    name: '示例',
    component: _import('demo/index')
  }
]

