<template>
  <section class="user-container">
    <keep-alive :include="cachedViews">
      <router-view :key="key"/>
    </keep-alive>
  </section>
</template>

<script>
export default {
  name: 'UserContainer',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style scoped>
    .app-main {
        /*50 = navbar  */
        min-height: calc(100vh - 70px);
        position: relative;
        overflow: hidden;
        padding-top: 74px;
    }
</style>
