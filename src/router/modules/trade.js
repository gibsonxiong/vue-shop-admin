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
    },
    {
      path: 'order-detail/:orderId',
      name: '/trade/order-detail/:orderId',
      component: () => import('@/views/trade/order-detail'),
      meta: {
        title: '订单详情',
        needPermission: true
      }
    }
  ]
}

export default router
