<template>
  <div class="productPage" v-loading="loading">
    <el-row :gutter="20">
      <el-col :xs="6" :sm="4" :md="4" :lg="3" :xl="3" :offset="1" class="aside">
        <Aside @getProductListMethod="_getProductList('1', table.pageSize)"></Aside>
      </el-col>
      <el-col :xs="16" :sm="18" :md="18" :lg="19" :xl="19" :offset="0" class="container">
        <!-- 查询条件 -->
        <section class="searchWarp">
          <div class="searchItem">
            <div class="searchItem_title">工艺</div>
            <div class="searchItem_main">
              <el-radio-group v-model="options.crafts">
                <el-radio
                  v-for="item in options.craftsOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                  size="mini"
                  @change="handleChangeRadio('crafts', $event)">
                  {{item.name}}
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="searchItem">
            <div class="searchItem_title">分类</div>
            <div class="searchItem_main">
              <el-radio-group v-model="options.categorys">
                <el-radio
                  v-for="item in options.categorysOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                  size="mini"
                  @change="handleChangeRadio('categorys', $event)">
                  {{item.name}}
                </el-radio>
              </el-radio-group>
            </div>
          </div>
        </section>

        <!-- 列表展示 -->
        <section class="showWarp">
          <div class="showTitle">
            <ul>
              <li class="active"><i class="el-icon-s-grid"></i> 网格模式</li>
              <li><i class="el-icon-s-operation"></i> 列表模式</li>
            </ul>
          </div>

          <!-- 网格模式 -->
          <div class="showTable" v-loading="table.tableLoading" v-if="table.tableData.length > 0">
            <el-row :gutter="15">
              <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4"
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
                    <el-button type="text" class="copy" title="复制" @click="copy"><i class="el-icon-document-copy"></i></el-button>
                  </div>
                  <div class="infoWarp">
                    <div class="name">{{item.name}}</div>
                    <div class="crafts">{{item.categorysName}}</div>
                    <div class="spec clear">
                      <div class="specText pull-left">{{item.specificationList[0].size}}</div>
                      <div class="specTextMore pull-right" @mouseenter="item.isShowProLayer = !item.isShowProLayer">更多规格</div>
                    </div>
                    <div class="price clear">
                      <div class="priceText pull-left">￥<span>{{item.specificationList[0].unitPrice}}</span></div>
                      <div class="priceBtn pull-right">
                        <el-button type="primary" size="mini" @click="handleAddProjecct(item)">加入方案</el-button>
                      </div>
                    </div>
                  </div>

                  <!-- 蒙层 -->
                  <div class="proLayer" v-show="item.isShowProLayer" @mouseleave="item.isShowProLayer = !item.isShowProLayer">
                    <div class="title">规格</div>
                    <dl v-for="(specItem, specIndex) in item.specificationList">
                      <dt>{{specItem.size}}</dt>
                      <dd>￥<span>{{specItem.unitPrice}}</span></dd>
                    </dl>
                  </div>
                </div>
              </el-col>
            </el-row>

          </div>

          <!-- 列表模式 -->
          <div class="showList"></div>

          <!-- 暂无商品 -->
          <div class="noDataWarp"  v-if="table.tableData.length == 0">
            暂无商品
          </div>

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
        </section>


      </el-col>
    </el-row>
  </div>
</template>

<script>

  import { setlocalStorage } from 'common/js/dom';
	import Aside from '@/components/Aside'
  import { getDictsData, getProductList, editProject } from 'api/interface';

	export default {
	  components: {
	    Aside,
	  },
	  name: "ProductNormal",
	  data() {
	    return {
        loading: false,

        // options
        options: {
          crafts: '',
          craftsOptions: [],

          categorys: '',
          categorysOptions: [],
        },

        table: {
          srcList: [],
          tableData: [],
          totalPage: 20,
          pageSize: 20,
          pageNum: 1,
          tableLoading: false,
        },

        search: {
          name: '',
          number: '',
          brandId: '',
          seriesId: '',
          crafts: '',
          categorys: '',
          status: true,
          discount: false,
        },




      }
		},
    created() {

      this.loading = true
      setlocalStorage('brandId', '')
      setlocalStorage('seriesId', '')
      setlocalStorage('crafts', '')
      setlocalStorage('categorys', '')

      this._getDictsData()
      this._getProductList(this.table.pageNum, this.table.pageSize);
    },
    mounted() {

    },
    methods: {
      // 数据字典
      _getDictsData: function () {
        // 工艺
        var paramsCraft = {
          isAll: true,
          code: 'Craft'
        }
        getDictsData(paramsCraft).then(res => {
          this.options.craftsOptions = res.data
        })
        // 分类
        var paramsCategory = {
          isAll: true,
          code: 'Category'
        }
        getDictsData(paramsCategory).then(res => {
          this.options.categorysOptions = res.data
        })
      },

      // 获取列表数据
      _getProductList: function (pageNum, pageSize) {
        var params = {
          name: localStorage.getItem('name') || '',
          number: localStorage.getItem('number') || '',
          brandId: localStorage.getItem('brandId') || '',
          seriesId: localStorage.getItem('seriesId') || '',
          crafts: localStorage.getItem('crafts') || '',
          categorys: localStorage.getItem('categorys') || '',
          status: true,
          discount: false,
          pageNum: pageNum,
          pageSize: pageSize,
        }

        this.table.tableLoading = true
        getProductList(params).then(res => {
          this.table.tableLoading = false
          this.loading = false
          if (res.status == 200) {
            this.table.srcList = []
            res.data.data.forEach((item, index) => {
              item.isShowProLayer = false
              if(!item.imgMain) {
                item.imgMainSrc = '../../../common/images/image.png'
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
        this._getProductList(this.table.pageNum, this.table.pageSize);
      },
      // 翻页
      handleCurrentChange: function (val) {
        this.table.pageNum = val
        this._getProductList(this.table.pageNum, this.table.pageSize);
      },

      // 工艺/分类选择
      handleChangeRadio(type, val) {
        setlocalStorage(type, val)
        this._getProductList(this.table.pageNum, this.table.pageSize);
      },

      // 复制图片
      copy (e) {
        this.$nextTick(function () {//nextTick,当前dom渲染完毕的回调
          console.log('foo', this.$refs.foo)//打印获取的dom
          const selection = window.getSelection()
          const range = document.createRange()
          range.selectNode(this.$refs.foo)//传入dom
          selection.addRange(range)
          document.execCommand('copy')//copy是复制
          selection.removeAllRanges()//清除缓存
        })
      },

      // 加入方案  TODO
      handleAddProjecct(item) {
        console.log(item)
        let quantity = 1  // 默认数量为1
        let subtotal = item.specificationList[0].unitPrice * quantity  // 小计
        let params = {
          productId: item.id,
          quantity: quantity,
          specificationId: item.specificationList[0].id,
          subtotal: subtotal
        }
        let currentProject = JSON.parse(localStorage.getItem('currentProject'))

        currentProject.projectDetailList.push(params)
        editProject(params).then(res => {
          if (res.status == 200) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })

            // 选中新增的方案
            setlocalStorage('isProjectNow', true)
            setlocalStorage('currentProject', res.data)
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
          this.addSaveLoading = false
        })
      }

    }

	}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "./element-variables.scss";

  .productPage {
    // 搜素
    .searchWarp {
      background-color: #fff;
      padding: 5px 20px;
      .searchItem {
        display: flex;
        margin: 20px;
        .searchItem_title {
          width: 60px;
          font-size: 18px;
          font-weight: 500;
        }
        .searchItem_main {
          flex: 1;
          .el-radio-button {
          }


        }
      }
    }

    // 展示
    .showWarp {
      .showTitle{
        height: 40px;
        line-height: 40px;
        background-color: #fff;
        margin-top: 20px;
        padding: 0 15px;
        ul {
          float: right;
          overflow: hidden;
          li {
            float: left;
            font-size: 14px;
            color: $--color-text-primary;
            margin-left: 15px;
            cursor: pointer;
          }
          li.active {
            color: $--color-primary-light-2;
          }
        }
      }
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

      .showList{

      }

      .wt_pagination{
        padding: 25px 0;
        text-align: center;
        background-color: #fff;
      }
    }
  }
</style>

<style rel="stylesheet/scss">
  .productPage .el-radio {
    margin: 0 0 0 13px;
    margin-bottom: 8px;
  }
  .productPage .el-radio__inner {
    opacity: 0;
  }
  .productPage .el-radio__label {
    padding: 0;
  }
</style>
