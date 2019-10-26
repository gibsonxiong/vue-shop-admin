/*
  {
    title,  //必填
    icon,
    inMenu,
    needPermission,
  }
*/

import Layout from '@/layout'

const router = {
  path: '/item',
  component: Layout,
  meta: {
    title: '商品管理',
    icon: 'theme',
    inMenu: true
  },
  children: [
    {
      path: 'prop',
      name: '/item/prop',
      component: () => import('@/views/item/prop'),
      meta: {
        inMenu: true,
        title: '商品属性',
        needPermission: true
      }
    },
    {
      path: 'category',
      name: '/item/category',
      component: () => import('@/views/item/category'),
      meta: {
        inMenu: true,
        title: '商品分类',
        needPermission: true
      }
    },
    {
      path: 'item',
      name: '/item/item',
      component: () => import('@/views/item/item'),
      meta: {
        inMenu: true,
        title: '商品列表',
        needPermission: true
      }
    },
    {
      path: 'item-create',
      name: '/item/item-create',
      component: () => import('@/views/item/item-edit'),
      meta: {
        title: '商品新增',
        needPermission: true
      }
    },
    {
      path: 'item-update/:itemId',
      name: '/item/item-update',
      component: () => import('@/views/item/item-edit'),
      meta: {
        title: '商品修改',
        needPermission: true
      }
    }

  ]
}

export default router
