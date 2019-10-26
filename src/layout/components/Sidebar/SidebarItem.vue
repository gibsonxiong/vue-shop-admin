<template>
  <div v-if="item.visible" class="menu-wrapper">
    <template v-if="item.onlyShowChildren">
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :is-nest="true"
        :base-path="resolvePath(item.path)"
        class="nest-menu"
      />
    </template>
    <el-submenu v-else-if="item.children && item.children.length > 0" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item :icon="item.icon" :title="item.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :is-nest="true"
        :base-path="resolvePath(item.path)"
        class="nest-menu"
      />
    </el-submenu>
    <app-link v-else :to="resolvePath(item.path)">
      <el-menu-item :index="resolvePath(item.path)" :class="{'submenu-title-noDropdown':!isNest}">
        <item :icon="item.icon" :title="item.title" />
      </el-menu-item>
    </app-link>

  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },

  methods: {
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
