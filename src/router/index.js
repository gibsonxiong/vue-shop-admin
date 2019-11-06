import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import { services } from '@/api/http'
import store from '@/store'
import api from '@/api'
import Layout from '@/layout'

const files = require.context('./modules', true, /\.js$/)
const modules = files.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  modules[moduleName] = files(modulePath).default
  return modules
}, {})

NProgress.configure({ showSpinner: false })

Vue.use(Router)

export const routes = [
  {
    path: '/home',
    component: () => import('@/views/home/index'),
    meta: {
      
    }
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    meta: {
      title: '注册'
    }
  },
  {
    path: '/shop-create',
    component: () => import('@/views/shop-create/index'),
    meta: {
      title: '创建店铺'
    }
  },
  {
    path: '/dragger',
    component: () => import('@/views/dragger/dragger'),
    meta: {
      title: '创建店铺'
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    meta: {
      title: '404'
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: {
      inMenu: true,
      onlyShowChildren: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: {
          title: '仪表盘',
          icon: 'dashboard',
          inMenu: true,
          needPermission: true
        }
      },
      {
        path: '401',
        name: '/401',
        component: () => import('@/views/error-page/401'),
        meta: {
          title: '401',
          noCache: true
        }
      },
      {
        path: 'redirect/:path*',
        name: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    children: [
      {
        path: 'index',
        name: 'profile',
        component: () => import('@/views/profile/index'),
        meta: {
          title: '个人信息',
          icon: 'user'
        }
      }
    ]
  },

  ...Object.values(modules)
]

export function getMeta(route, keys = []) {
  return keys.map(key => {
    return route.meta && route.meta[key]
  })
}

export function hasPermission(route, permissions) {
  const [needPermission] = getMeta(route, ['needPermission'])
  if (!needPermission) {
    return true
  } else {
    return permissions.indexOf(route.name) !== -1
  }
}

export function generateOptions(routes, permissions = [], skipPermission) {
  const result = []

  routes.forEach(route => {
    const [title, icon, inMenu, onlyShowChildren] = getMeta(route, ['title', 'icon', 'inMenu', 'onlyShowChildren'])
    const option = {
      icon,
      title,
      inMenu,
      onlyShowChildren,
      path: route.path
    }

    // 权限
    const _hasPermission = skipPermission === true ? true : hasPermission(route, permissions)
    option.visible = option.inMenu && _hasPermission

    if (route.children && route.children.length > 0) {
      option.children = generateOptions(route.children, permissions, skipPermission)

      // 如果所有子类都隐藏，则父类也隐藏
      option.hasChildVisible = option.children.some(child => {
        return child.visible || (child.onlyShowChildren && child.hasChildVisible)
      })

      if (!option.hasChildVisible) {
        option.visible = false
      }
    }

    result.push(option)
  })

  return result
}

export function generateTreeOption(route, permissions = [], skipPermission) {
  const [title, icon, inMenu] = getMeta(route, ['title', 'icon', 'inMenu'])

  const _hasPermission = skipPermission === true ? true : hasPermission(route, permissions)
  const visible = inMenu && _hasPermission
  const routeHasChildren = route.children && route.children.length > 0
  let children = []

  if (routeHasChildren) {
    children = generateTreeOptions(route.children, permissions, skipPermission)
  }

  if (routeHasChildren && children.length === 0) {
    return null
  }

  if (visible) {
    return {
      icon,
      title,
      name: route.name,
      path: route.path,
      children
    }
  } else {
    return null
  }
}

export function generateTreeOptions(routes, permissions = [], skipPermission) {
  const result = []

  routes.forEach(route => {
    const [title, icon, inMenu, onlyShowChildren] = getMeta(route, ['title', 'icon', 'inMenu', 'onlyShowChildren'])

    if (onlyShowChildren && route.children && route.children.length > 0) {
      route.children.forEach(subRoute => {
        const option = generateTreeOption(subRoute, permissions, skipPermission)
        if (option) {
          const path = require('path')
          option.path = path.resolve(route.path, option.path)
          result.push(option)
        }
      })
      return
    }

    const option = generateTreeOption(route, permissions, skipPermission)
    if (option) {
      result.push(option)
    }
  })

  return result
}

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

const appName = document.title

router.beforeEach(async(to, from, next) => {
  if (to.matched.length == 0) {
    return next('/404')
  }
  const [title, needPermission] = getMeta(to, ['title', 'needPermission'])
  const token = services.$getToken()

  NProgress.start()

  // set page title
  if (title) {
    document.title = `${title} - ${appName}`
  } else {
    document.title = appName
  }

  if (needPermission) {
    if (!token) {
      return next('/home')
    }

    let userInfo = store.state.user.userInfo

    // 没有加载用户信息
    if (!userInfo.id) {
      const res = await api.loadUserInfo()

      store.commit('user/SET_USER_INFO', res.data)
      userInfo = store.state.user.userInfo
    }

    // 管理员
    const isAdmin = !userInfo.shopRoleId || userInfo.role.isAdmin
    if (isAdmin) {
      return next()
    }

    // 拥有权限
    const permissions = userInfo.role.permissions
    if (hasPermission(to, permissions)) {
      return next()
    } else {
      return next('/401')
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
