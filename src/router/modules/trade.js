import Layout from '@/layout'

const router = {
  path: '/trade',
  component: Layout,
  meta: {
    title: '交易管理',
    icon: 'theme',
    inMenu: true
  },
  children: [
    {
      path: 'order',
      name: '/trade/order',
      component: () => import('@/views/trade/order'),
      meta: {
        title: '订单列表',
        inMenu: true,
        needPermission: true
      }
    }

  ]
}

export default router
