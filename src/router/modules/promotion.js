import Layout from '@/layout'

const router = {
  path: '/promotion',
  component: Layout,
  meta: {
    title: '促销管理',
    icon: 'theme',
    inMenu: true
  },
  children: [
    {
      path: 'coupon',
      name: '/promotion/coupon',
      component: () => import('@/views/promotion/coupon'),
      meta: {
        title: '优惠券',
        inMenu: true,
        needPermission: true
      }
    }
  ]
}

export default router
