<template>
<div :class="classObj" class="app-wrapper">
    <Header @isProjectNowFn="isProjectNowFn"/>
    <div :style="{ height: isProjectNow ? '100px' : '60px' }"></div>
    <div class="main-container">
      <AppContainer/>
    </div>
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
        <div class="" style="
        position: fixed;
        top: 60px;
        width: 100%;
        z-index: 100;">
            <navbar/>
            <tags-view/>
        </div>
        <app-main/>
    </div> -->
</div>
</template>

<script>
// import { Header, Navbar, Sidebar, TagsView, AppMain } from './components'
import { Header, AppContainer } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Header,
    AppContainer
  },
  mixins: [ResizeMixin],
  data() {
    return {
      isProjectNow: null
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
  },
  created() {
    // 读取localStorage中的isProjectNow，转换为Boolean
    this.isProjectNow = localStorage.getItem('isProjectNow') == 'true' ? true : false
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    isProjectNowFn(val) {
      this.isProjectNow = val;
    }
  },
  watch: {
    // isProjectNow(newVal, oldVal) {
    //   console.log(newVal)
    //   console.log(oldVal)
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
