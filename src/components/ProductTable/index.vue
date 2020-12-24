<template>
  <el-row :gutter="15">
    <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4"
      v-for="(item, index) in table.tableData"
      :key="index">

      <ProductTable :item="item" :srcList="table.srcList"></ProductTable>

    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatBrandTreeData, setlocalStorage } from 'common/js/dom';
import { getBrandTree } from 'api/interface';
export default {
  name: 'ProductTable',
  props: {
    //表单数据
    table: {
      type: Object,
      default: {}
    },
  },
  computed: {
    ...mapGetters([
      'projectIsNow',
    ])
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
  @import "./element-variables.scss";

</style>
