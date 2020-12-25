<template>
  <el-menu :default-active="activeIndex" class="wt_menu" mode="horizontal" @select="handleSelect">
      <el-menu-item
        v-for="(route, index) in permission_routers_product[0].children"
        :key="index"
        :index="(index+'_'+1)"
        v-if="route.meta && !route.hidden">
        <router-link :to="route.path" class="">
          {{route.meta.title}}
        </router-link>

      </el-menu-item>

  </el-menu>
</template>

<script>
  import { isExternal } from '@/utils'
  import { mapGetters } from 'vuex'
  import { asyncRouterMap, constantRouterMap } from '@/router'
  export default {
    name: "Menu",    // 导航菜单
    components: {

    },
    computed: {
    ...mapGetters([
      'permission_routers',
      // 'permission_routers_product',
      'sidebar'
    ]),

    },
    data() {
      return {
        activeIndex: '0_1',
        permission_routers_product: [],
      }
    },
    created() {
      this.permission_routers_product = constantRouterMap.filter(item => item.name == 'Product')
    },
    methods: {
      //
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wt_menu {
    .el-menu-item {
      padding: 0;
      a {
        display: block;
        height: 100%;
        padding: 0 20px;
      }
      a.router-link-exact-active.router-link-active {
        color: #fff;
      }
    }
  }
</style>
