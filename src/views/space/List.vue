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
                  <div class="name" @click="routerLink(item)">{{item.name}}</div>
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
        tableData: [
          {
            id: 11,
            name: "会议室",
            number: "10002",
            productList: null,
            remark: "小型会议室-备注",
            spaceDetailList: null,
            spaceImgList: null,
            imgMainSrc: '/src/common/images/image.png',
          },
          {
            id: 11,
            name: "会议室",
            number: "10002",
            productList: null,
            remark: "小型会议室-备注",
            spaceDetailList: null,
            spaceImgList: null,
            imgMainSrc: '/src/common/images/image.png',
          },
          {
            id: 11,
            name: "会议室",
            number: "10002",
            productList: null,
            remark: "小型会议室-备注",
            spaceDetailList: null,
            spaceImgList: null,
            imgMainSrc: '/src/common/images/image.png',
          },
          {
            id: 11,
            name: "会议室",
            number: "10002",
            productList: null,
            remark: "小型会议室-备注",
            spaceDetailList: null,
            spaceImgList: null,
            imgMainSrc: '/src/common/images/image.png',
          },
          {
            id: 11,
            name: "会议室",
            number: "10002",
            productList: null,
            remark: "小型会议室-备注",
            spaceDetailList: null,
            spaceImgList: null,
            imgMainSrc: '/src/common/images/image.png',
          },
        ],
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
          //   if(!item.imgMain) {
              // item.imgMainSrc = '/src/common/images/image.png'
            // }
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


    // 跳转详情页
    routerLink(item) {
      this.$router.push({
        name: 'SpaceDetail',
        query: {
          id: item.id
        }
      })
    },

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "./element-variables.scss";
  .SpacePage {
    .showTable{
      background-color: #fff;
      margin-top: 20px;
      padding: 15px;
      .proItem:hover {
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.5);
      }
      .proItem {
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
        position: relative;
        margin-bottom: 15px;
        transition: 0.5s;
        // imgWarp
        .imgWarp {
          position: relative;
          .proImg {
            display: block;
            width: 100%;
          }
          .proImg:hover {
            cursor: zoom-out;
          }
          .copy {
            position: absolute;
            top: 0;
            right: 10px;
            cursor: pointer;
          }
        }

        // infoWarp
        .infoWarp {
          padding: 12px;
          font-size: 14px;
          line-height: 30px;
          color: $--color-text-regular;
          .name {
            font-size: 16px;
            color: $--color-text-primary;
            font-weight: bold;
            line-height: 25px;
            margin-bottom: 10px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            cursor: pointer;
          }
          .name:hover {
            color: $--color-primary;
          }
          .spec {
            .specText {

            }
            .specTextMore {
              cursor: pointer;
            }
          }
          .price {
            .priceText {
              color: $--color-primary;
              span {
                font-size: 24px;
                font-weight: bold;
              }
            }
            .priceBtn {

            }
          }
        }

        // proLayer
        .proLayer {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: rgba(0, 0, 0, 0.6);
          color: #fff;
          padding: 30px 25px;
          font-size: 14px;
          .title {
            margin-bottom: 15px;
          }
          dl {
            overflow: hidden;
            margin-top: 8px;
            dt {
              float: left;
            }
            dd {
              float: right;
              color: $--color-primary;
              span {
                font-weight: bold;
              }
            }
          }
        }
      }
    }


  }
</style>
