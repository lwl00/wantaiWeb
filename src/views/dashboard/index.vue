<template>
    <div class="dashboard-container">
        <div class="dashboard-text">Name：{{customer.name}}</div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { getDictsData } from 'api/interface';

    export default {
        name: 'Dashboard',
        computed: {
            ...mapGetters([
                'customer',
            ])
        },
        components: {

        },
        data() {
            return {

            }
        },
        created() {

        },
        methods: {

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
    &-container {

    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
</style>
