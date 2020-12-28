<template>
  <el-menu
    default-active="2"
    class="brandAside"
    @open="handleOpen"
    @close="handleClose">
    <el-menu-item index="1" @click="handleChangeAllserie"><i class="el-icon-menu"></i> 全部品牌</el-menu-item>
    <el-submenu
      v-for="(brandItem, brandIndex) in brandTreeData"
      :key="brandIndex"
      :index="(brandIndex+1+'')">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>{{brandItem.name}}</span>
      </template>
      <el-menu-item
        v-for="(serieItem, serieIndex) in brandItem.children"
        :key="serieIndex"
        :index="(brandIndex+'_'+serieIndex+1+'')"
        @click="handleChangeserie(serieItem)"
        >{{serieItem.name}}</el-menu-item>
    </el-submenu>

  </el-menu>
</template>

<script>
  import { formatBrandTreeData, setlocalStorage } from 'common/js/dom';
  import { getBrandTree } from 'api/interface';
  export default {
    name: 'Aside',
    data() {
      return {
        brandTreeData: [],
      }
    },
    created() {
      this._getBrandTree()
    },
    methods: {
      // 获取数据
      _getBrandTree() {
        this.loading = true
        getBrandTree().then(res => {
          this.loading = false
          if (res.status == 200) {
            this.brandTreeData = formatBrandTreeData(res.data.brandList)
          }
        })
      },



      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      // 选择系列（查询数据）
      handleChangeserie(row) {
        setlocalStorage('brandId', row.brandId)
        setlocalStorage('seriesId', row.id)
        this.$emit('getProductListMethod');
      },
      // 选择全部系列（查询数据）
      handleChangeAllserie() {
        setlocalStorage('brandId', '')
        setlocalStorage('seriesId', '')
        this.$emit('getProductListMethod');
      },
    }
  }
</script>

<style type="text/css" media="screen">
  .brandAside {
    border: 0;
  }
  .brandAside .el-menu {
    width: 100%;
  }
  .brandAside .el-menu .el-menu-item {
    width: 50%;
    min-width: auto;
    padding: 0 !important;
    text-align: center;
    float: left;
  }
  .brandAside .el-menu {
    background-color: #f5f5f5;
  }
  .brandAside>.el-menu-item {
    padding: 0 10px !important;
  }
</style>
