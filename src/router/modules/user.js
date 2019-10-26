import Layout from '@/layout'

const router = {
  path: '/user',
  component: Layout,
  meta: {
    title: '用户管理',
    icon: 'theme',
    inMenu: true
  },
  children: [
    {
      path: 'user',
      name: '/user/user',
      component: () => import('@/views/user/user'),
      meta: {
        title: '用户列表',
        inMenu: true,
        needPermission: true
      }
    }

  ]
}

export default router
