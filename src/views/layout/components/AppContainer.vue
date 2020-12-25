<template>
    <section class="app-container">
        <transition name="fade-transform" mode="out-in">
            <!-- or name="fade" -->
            <!-- <router-view :key="key"></router-view> -->
            <keep-alive :include="cachedViews">
                <router-view :key="key"/>
            </keep-alive>
            <!-- <router-view/> -->
        </transition>
    </section>
</template>

<script>
export default {
    name: 'AppContainer',
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
