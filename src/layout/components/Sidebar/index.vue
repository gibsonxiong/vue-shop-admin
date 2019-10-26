<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="option in options"
          :key="option.path"
          :item="option"
          :base-path="option.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { routes, generateOptions } from '@/router'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar']),
    ...mapState('user', {
      userInfo: state => state.userInfo
    }),
    options() {
      const isAdmin = !this.userInfo.shopRoleId || this.userInfo.role.isAdmin
      if (isAdmin) {
        return generateOptions(routes, null, isAdmin)
      } else {
        const permissions = this.userInfo.role.permissions
        return generateOptions(routes, permissions)
      }
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {

  }
}
</script>
