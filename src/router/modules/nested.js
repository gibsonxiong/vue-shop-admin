import Layout from '@/layout'

const router = {
  path: '/nested',
  component: Layout,
  meta: {
    title: '嵌套菜单',
    icon: 'theme',
    inMenu: true
  },
  children: [
    {
      path: 'menu1',
      component: () => import('@/views/nested/menu1/index'), // Parent router-view
      name: 'Menu1',
      meta: {
        title: 'Menu 1',
        inMenu: true
      },
      children: [
        {
          path: 'menu1-1',
          component: () => import('@/views/nested/menu1/menu1-1'),
          name: 'Menu1-1',
          meta: {
            title: 'Menu 1-1',
            inMenu: true,
            needPermission: true
          }
        },
        {
          path: 'menu1-2',
          component: () => import('@/views/nested/menu1/menu1-2'),
          name: 'Menu1-2',
          meta: {
            title: 'Menu 1-2',
            inMenu: true,
            onlyShowChildren: true
          },
          children: [
            {
              path: 'menu1-2-1',
              component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
              name: 'Menu1-2-1',
              meta: {
                title: 'Menu 1-2-1',
                inMenu: true,
                needPermission: true
              }
            }
          ]
        }
      ]
    },
    {
      path: 'menu2',
      name: 'Menu2',
      component: () => import('@/views/nested/menu2/index'),
      meta: {
        title: 'Menu 2',
        inMenu: true,
        needPermission: true
      }
    }
  ]
}

export default router
