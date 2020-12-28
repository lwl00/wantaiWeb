<template>
  <el-menu :default-active="defaultActive" class="wt_menu" mode="horizontal" @select="handleSelect">
    <el-menu-item
      v-for="(item, index) in permission_routers_product[0].children"
      :key="index"
      :index="(index+1+'')"
      v-if="item.meta && !item.hidden"
      @click="routerLink(item)">
      {{item.meta.title}}
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
        defaultActive: this.$route.meta.defaultActive,
        permission_routers_product: [],
      }
    },
    created() {
      this.permission_routers_product = constantRouterMap.filter(item => item.name == 'Product')
      console.log(this.$route.meta.defaultActive)
    },
    methods: {
      //
      handleSelect(key, keyPath) {
        // console.log(key, keyPath);
      },

      // 跳转页面
      routerLink(item) {
        this.$router.push({
          name: item.name,
          query: {}
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "./element-variables.scss";
  .el-menu--horizontal > .el-menu-item {
    border-bottom-color: $--color-primary !important;
  }
</style>
