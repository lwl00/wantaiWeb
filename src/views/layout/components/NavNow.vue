<template>
  <el-row class="navNow" :gutter="0">
    <el-col
      :xs="12"
      :sm="8"
      :md="8"
      :lg="8"
      :xl="8">
      <div class="title">正在配置 <span>{{currentProject.name}}</span> 的方案</div>
    </el-col>
    <el-col
      :xs="12"
      :sm="16"
      :md="16"
      :lg="16"
      :xl="16"
      style="text-align: right;">
      <el-button type="text" size="small" @click="handleEditCurrentProject">编辑客户信息</el-button>
      <el-button type="text" size="small" @click="handleExitCurrentProject">退出方案</el-button>
      <el-button type="text" size="small" @click="handleDeleteCurrentProject">删除方案</el-button>
      <el-button type="primary" size="small" @click="routerLinkCart">查看购物车</el-button>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'NavNow',
    components: {

    },
    props: {
      currentProject: {
          type: Object,
          default: null
      },
    },

    computed: {

    },
    data() {
      return {

      }
    },
    computed: {

    },
    created() {

    },
    methods: {
      // 退出方案
      handleExitCurrentProject() {
        this.$emit('handleExitCurrentProject')
      },
      // 编辑方案
      handleEditCurrentProject() {
        this.$emit('handleEditCurrentProject')
      },
      // 删除方案
      handleDeleteCurrentProject() {
        this.$emit('handleDeleteCurrentProject')
      },

      // 跳转购物车
      routerLinkCart() {
        let routeData = this.$router.resolve({
          name: "Cart",
          query: {},
        });
        window.open( routeData.href , '_blank' )
      }
    },
    watch: {

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "./element-variables.scss";
  .navNow {
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    padding: 0 20px;
    margin: 0 20px;
    box-shadow: 0 6px 9px #ddd;
    .title {
      color: $--color-text-primary;
      span {
         color: $--color-primary;
      }
    }
  }
</style>
