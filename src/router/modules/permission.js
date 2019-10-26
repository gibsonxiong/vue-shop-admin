import Layout from '@/layout'

const router = {
  path: '/permission',
  component: Layout,
  meta: {
    title: '权限管理',
    icon: 'theme',
    inMenu: true
  },
  children: [
    {
      path: 'role',
      name: '/permission/role',
      component: () => import('@/views/permission/role'),
      meta: {
        title: '角色列表',
        inMenu: true,
        needPermission: true
      }
    },
    {
      path: 'member',
      name: '/permission/member',
      component: () => import('@/views/permission/member'),
      meta: {
        title: '成员列表',
        inMenu: true,
        needPermission: true
      }
    }
  ]
}

export default router
