<template>
  <el-menu
    :default-active="defaultActive"
    class="userAside"
    @open="handleOpen"
    @close="handleClose">
    <el-menu-item
      v-for="(item, index) in permission_routers_user[0].children[0].children"
      v-if="!item.hidden"
      :key="index"
      :index="(index+1+'')"
      @click="routerLink(item, index)">
      {{item.meta.title}}
    </el-menu-item>
  </el-menu>
</template>

<script>
  import { asyncRouterMap, constantRouterMap } from '@/router'
  import { getBrandTree } from 'api/interface';
  export default {
    name: 'AccountAside',
    data() {
      return {
        defaultActive: this.$route.meta.defaultActive,
        permission_routers_user: [],
      }
    },
    created() {
      this.permission_routers_user = constantRouterMap.filter(item => item.name == 'User')
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      // 跳转页面
      routerLink(item) {
        this.$router.push({
          name: item.name,
          query: {}
        })
      },
    },
    watch: {

    }
  }
</script>

<style type="text/css" media="screen">

</style>
