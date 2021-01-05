<template>
  <div class="SpacePage" v-loading="loading">
    <el-row :gutter="0">
      <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22" :offset="1">
        <div class="showTable">

          <el-row :gutter="15">
            <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4" class=""
              v-for="(item, index) in table.tableData"
              :key="index">
              <div class="proItem">
                <div class="imgWarp">
                  <el-image
                    class="proImg"
                    :src="item.imgMainSrc"
                    alt=""
                    fit="contain"
                    lazy
                    :preview-src-list="table.srcList"
                    ref="foo">
                  </el-image>
                </div>
                <div class="infoWarp">
                  <div class="name">
                    <router-link tag="a" target="_blank"
                      :to="{name: 'SpaceDetail', query:{id: item.id}}">{{item.name}}</router-link>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>


          <!-- 分页 -->
          <el-pagination
            class="wt_pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="table.pageNum"
            :page-sizes="[20, 50, 100]"
            :page-size="table.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="table.totalPage"
          ></el-pagination>
        </div>
      </el-col>

    </el-row>


  </div>
</template>

<script type="text/ecmascript-6">
import Dialog from 'base/Dialog';
import { deleteBlankSpace, formatSearch, calculateTableHeight, tableBtnPermissions, routerLinkPage, formatBrandTreeData } from 'common/js/dom';
import { getDictsData, getSpaceList, delSpace, getBrandTree } from 'api/interface';

export default {
  components: {
    'dialogModel': Dialog,
  },
  name: "SpaceList",
  data() {
    return {
      loading: true,
      table: {
        srcList: [],
        tableData: [],
        totalPage: 20,
        pageSize: 20,
        pageNum: 1,
        tableLoading: false,
      },
    }
  },
  created() {

  },
  mounted() {
    this._getSpaceList(this.table.pageNum, this.table.pageSize);
  },
  methods: {
    // 获取列表数据
    _getSpaceList: function (pageNum, pageSize) {
      var params = {
        name: '',
        number: '',
        createdTime: '',
        pageNum: pageNum,
        pageSize: pageSize,
      }

      this.table.tableLoading = true
      getSpaceList(params).then(res => {
        this.table.tableLoading = false
        this.loading = false
        if (res.status == 200) {
          res.data.data.forEach((item, index) => {
            if(item.spaceImgList.length > 0) {
              item.imgMainSrc = item.spaceImgList[0].imageSrc
            }else {
              item.imgMainSrc = '/src/common/images/image.png'
            }
            this.table.srcList.push(item.imgMainSrc)
          })

          this.table.tableData = res.data.data
          this.table.totalPage = res.pageVO.total

        }
      })
    },

    // 每页显示条数
    handleSizeChange: function (val) {
      this.table.pageSize = val
      this._getSpaceList(this.table.pageNum, this.table.pageSize);
    },
    // 翻页
    handleCurrentChange: function (val) {
      this.table.pageNum = val
      this._getSpaceList(this.table.pageNum, this.table.pageSize);
    },

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "./element-variables.scss";
  @import "@/common/css/product.scss";
  .SpacePage {
    .showTable{
      background-color: #fff;
      margin-top: 20px;
      padding: 15px;
    }


  }
</style>
