<template>
  <div class="UserLayout" v-loading="loading">
    <el-row :gutter="20">
      <el-col :xs="6" :sm="4" :md="4" :lg="3" :xl="3" :offset="1" class="aside">
        <AccountAside></AccountAside>
      </el-col>
      <el-col :xs="16" :sm="18" :md="18" :lg="19" :xl="19" :offset="0" class="container">
        <UserContainer></UserContainer>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import AccountAside from './components/AccountAside.vue';
import UserContainer from './components/UserContainer.vue';

export default {
  name: "UserLayout",
  components: {
    UserContainer,
    AccountAside,
  },
  computed: {
    ...mapGetters([
      'customer',
    ])
  },
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .UserLayout {
    // 左侧
    .aside {
      padding: 10px;
      background-color: #eee;
    }
  }
</style>
