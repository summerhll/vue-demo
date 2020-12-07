
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
  },
 
  {
    path: '/demo/key',
    name: '使用index做key',
    component: _import('demo/key')
  },
  {
    path: '/demo/transition-key',
    name: 'transition使用key',
    component: _import('demo/transition-key')
  },
  {
    path: '/demo/tab',
    name: 'tab',
    component: _import('demo/tab')
  },
  {
    path: '/demo/route-children',
    name: '嵌套路由',
    component: _import('demo/route-children'),
    children: [
      {
        path: 'a',
        component: _import('demo/transition-key')
      },
      {
        path: 'b',
        component: _import('demo/key')
      },
    ]

  },
  {
    path: '/demo/route-children-tab',
    name: '嵌套路由',
    component: _import('demo/route-children-tab'),
    redirect : '/demo/route-children-tab/a',
    children: [
      {
        path: 'a',
        component: _import('demo/transition-key')
      },
      {
        path: 'b',
        component: _import('demo/key')
      },
    ]
    
  },
  
 
]

