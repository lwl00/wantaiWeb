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
                    <div class="name" @click="routerLink(item)">{{item.name}}</div>
                    <div class="crafts">{{item.categorysName}}</div>
                    <div class="spec clear">
                      <div class="specText pull-left" :title="item.specificationList[0].size">{{item.specificationList[0].size}}</div>
                      <div class="specTextMore pull-right" @mouseenter="item.isShowProLayer = !item.isShowProLayer">更多规格</div>
                    </div>
                    <div class="price clear">
                      <div class="priceText pull-left">￥<span>{{item.specificationList[0].unitPrice}}</span></div>
                      <div class="priceBtn pull-right">
                        <el-button type="primary" size="mini" @click="handleAddProject(item)" v-if="projectIsNow">加入方案</el-button>
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


        <!-- 加入购物车 -->
        <dialogModel
          class="dialog-model"
          ref="dialog-model-addCart"
          :title="dialog.dialogTitle"
          width="80%">
          <DialogAddCart
            :dialogProduct="dialogProduct"
            @handleDialogYes="handleDialogYes"
            @handleDialogNo="handleDialogNo">
          </DialogAddCart>
        </dialogModel>

      </el-col>
    </el-row>
  </div>
</template>

<script>

  import { mapGetters } from 'vuex';
  import { setlocalStorage } from 'common/js/dom';
	import Aside from '@/components/Aside'
  import Dialog from 'base/Dialog';
  import DialogAddCart from '@/components/DialogAddCart'
  import { getDictsData, getProductList, editProject } from 'api/interface';

	export default {
	  name: "ProductNormal",
	  components: {
	    Aside,
      'dialogModel': Dialog,
      DialogAddCart,
	  },
    computed: {
      ...mapGetters([
        'projectIsNow',
      ])
    },
	  data() {
	    return {
        loading: true,

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


        // 加入购物车
        dialog: {
          loading: false,
          dialogTitle: '加入购物车',    //编辑弹窗标题
          dialogWidth: '500px',   //弹窗宽度
        },
        dialogProduct: {},

      }
		},
    created() {
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
      handleAddProject(item) {
        console.log(item)
        this.dialogProduct = item
        this.show('dialog-model-addCart')
      },

      // 跳转详情页
      routerLink(item) {
        this.$router.push({
          name: 'ProductDetail',
          query: {
            id: item.id
          }
        })
      },



      /*
       * 加入购物车
       */
      show: function (type) {      //弹出弹出框   type(ref)
        this.$refs[type].showModel();
      },
      hide: function (type) {      //隐藏弹出框
        this.$refs[type].hideModel();
      },
      // 商品弹窗确定
      handleDialogYes(e) {
        this.hide('dialog-model-addCart')
      },
      // 商品弹窗取消
      handleDialogNo(type) {
        this.hide('dialog-model-addCart')
      },


    },
    watch: {
      projectIsNow: function(val1, val2) {
        console.log('projectIsNow', val1, val2)
      }
    }

	}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "./element-variables.scss";
  @import "@/common/css/product.scss";

  .productPage {
    // 品列分类
    .aside {
      padding: 10px;
      background-color: #eee;
    }
    // 搜素
    .searchWarp {
      background-color: #eee;
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
        background-color: #eee;
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
        background-color: #eee;
        margin-top: 20px;
        padding: 15px;
      }

      .showList{

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
