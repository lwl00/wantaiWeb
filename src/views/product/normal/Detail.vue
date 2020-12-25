<template>
  <div class="productDetailPage" v-loading="loading">

      <el-row :gutter="20" class="productBase">
        <el-col :xs="22" :sm="9" :md="9" :lg="7" :xl="7" :offset="1" class="imgWarp">
          <div class="proImg_big_warp">
            <el-image
              class="proImg_big"
              v-if="choose.image"
              :src="choose.imageSrc"
              :alt="choose.modelNumber"
              fit="contain"
              lazy>
            </el-image>
          </div>
          <div class="proImg_small_warp">
            <el-image
              class="proImg_small"
              v-for="(item, index) in options.specificationsOptions"
              v-if="item.image"
              :key="index"
              :src="item.imageSrc"
              :alt="item.modelNumber"
              fit="contain"
              lazy>
            </el-image>
          </div>

          <div class="">
            <el-button size="small"><i class="el-icon-search"></i> 查看效果图</el-button>
          </div>

        </el-col>
        <el-col :xs="21" :sm="12" :md="12" :lg="14" :xl="14" :offset="1" class="infoWarp">
          <div class="name">{{addForm.name}}</div>
          <dl class="infoItem">
            <dt>编号</dt>：
            <dd>{{addForm.number}}</dd>
          </dl>
          <dl class="infoItem">
            <dt>型号</dt>：
            <dd>{{choose.modelNumber}}</dd>
          </dl>
          <dl class="infoItem">
            <dt>体积</dt>：
            <dd>{{choose.volume ? choose.volume : '暂无'}}</dd>
          </dl>
          <dl class="infoItem">
            <dt>价格</dt>：
            <dd>{{choose.unitPrice}}</dd>
          </dl>
          <dl class="infoItem">
            <dt>材质说明</dt>：
            <dd style="max-width: 800px;">{{addForm.instructions}}</dd>
          </dl>
          <dl class="infoItem" style="line-height: 46px;">
            <dt>选择参数</dt>：
            <dd style="max-width: 500px;">
              <el-radio-group v-model="options.specifications">
                <el-radio
                  style="display: inline-block;width: 140px;margin: 5px 10px 5px 0;"
                  v-for="(item, index) in options.specificationsOptions"
                  :key="index"
                  :label="item.id"
                  border
                  size="medium"
                  @change="handleChangeSpecRadio($event, item)">
                  {{item.size}}</el-radio>

              </el-radio-group>
            </dd>
          </dl>
          <dl class="infoItem" style="line-height: 40px;">
            <dt>数量</dt>：
            <dd>
              <el-input-number
                v-model="choose.quantity"
                @change="handleChangeQuantity"
                :step="1"
                :min="1"
                label="产品数量"
                step-strictly="true"></el-input-number>
            </dd>
          </dl>

          <div>
            <el-button
              :type="projectIsNow ? 'primary' :''"
              :disabled="!projectIsNow"
              @click="handleDeatilAddProject">加入方案</el-button>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="0" class="productOther">
        <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22" :offset="1">
          <!-- 关联产品 -->
          <div class="contactProduct">
            <div class="title contactProduct_title">
              关联产品
            </div>
            <el-row :gutter="15"  class="container contactProduct_container">
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
                      <div class="specText pull-left">{{item.specificationList[0].size}}</div>
                      <!-- <div class="specTextMore pull-right" @mouseenter="item.isShowProLayer = !item.isShowProLayer">更多规格</div> -->
                    </div>
                    <div class="price clear">
                      <div class="priceText pull-left">￥<span>{{item.specificationList[0].unitPrice}}</span></div>
                      <div class="priceBtn pull-right">
                        <el-button type="primary" size="mini" @click="handleAddProject(item)" v-if="projectIsNow">加入方案</el-button>
                      </div>
                    </div>
                  </div>

                  <!-- 蒙层 -->
                  <!-- <div class="proLayer" v-show="item.isShowProLayer" @mouseleave="item.isShowProLayer = !item.isShowProLayer">
                    <div class="" style="margin-bottom: 15px;">规格</div>
                    <dl v-for="(specItem, specIndex) in item.specificationList">
                      <dt>{{specItem.size}}</dt>
                      <dd>￥<span>{{specItem.unitPrice}}</span></dd>
                    </dl>
                  </div> -->
                </div>
              </el-col>
            </el-row>
          </div>

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

          <!-- 效果图 -->
          <div class="imgEffect" v-if="addForm.imgEffectList.length > 0">
            <div class="title imgEffect_title">
              效果图
            </div>
            <el-row :gutter="10"  class="container imgEffect_container">
              <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4"
                v-for="(item, index) in addForm.imgEffectList"
                v-if="item.image"
                :key="index">
                <el-image
                  class="imgEffectImg"
                  :src="item.imageSrc"
                  alt=""
                  fit="contain"
                  lazy
                  :preview-src-list="previewImgEffectList"
                  ref="foo">
                </el-image>

              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
  </div>

</template>

<script>

  import { mapGetters } from 'vuex';
  import Dialog from 'base/Dialog';
  import DialogAddCart from '@/components/DialogAddCart'
  import { getCookie, setlocalStorage } from 'common/js/dom';
  import { getProduct, addCartProject } from 'api/interface';

  export default {
    name: "ProductDetail",
    components: {
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
        isDiscountPage: false,

        id: '',
        loading: false,

        // 表单数据
        addForm: {
          name: '',  // 产品名称
          number: '',  // 产品编号
          brandId: '',  //
          seriesId: '',  //
          crafts: '',  //
          categorys: '',  //
          imgMain: '',  //
          status: 'true',  //
          discount: 'false',  //
          unit: '',  //
          instructions: '',  //
          specificationList: [],  // 明细表
          imgEffectList: [],  // 实景效果图表
          contactsName: '',  // 关联产品名称
          contactNumbers: '',  // 关联产品编号
        },

        // options
        options: {
          specifications: '',
          specificationsOptions: [],
        },

        choose: {
          id: '',   // 规格id
          productId: '',   // 产品id
          size: '',   // 规格
          unitPrice: '',   // 单价
          modelNumber: '',   // 型号
          volume: '',   // 体积
          image: '',   // 图片名称
          imageSrc: '',  // 图片路径
          quantity: 1,       // 数量
        },


        // 产品图
        imgSrcList: [],

        // 效果图(放大查看)
        previewImgEffectList: [],


        // 关联产品
        table: {
          srcList: [],
          tableData: [],
          totalPage: 20,
          pageSize: 20,
          pageNum: 1,
          tableLoading: false,
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
      this.id = this.$route.query.id
      if(this.id) {

      }
      this._getProduct(this.id);
    },
    mounted() {

    },
    methods: {
      // 获取数据
      _getProduct(id) {
        this.loading = id ? true : false
        getProduct(id).then(res => {
          this.loading = false
          if (res.status == 200) {
            this.addForm = res.data.product
            this.options.specifications = res.data.product.specificationList[0].id
            this.options.specificationsOptions = res.data.product.specificationList

            // 默认选中第一个规格，
            this.setChoose(res.data.product.specificationList[0])
            console.log(this.choose)


            // 效果图
            if(res.data.product.imgEffectList && res.data.product.imgEffectList.length > 0) {
              for(var i=0; i<=3; i++) {

                res.data.product.imgEffectList.forEach((item, index) => {
                  if(item.image) {
                    item.imageSrc = 'http://e.wantaix.com:8081/images/202012071836036419.jpg'
                    this.previewImgEffectList.push(item.imageSrc)
                  }
                })
              }
            }

            // 关联产品
            if(res.data.product.contactProductList && res.data.product.contactProductList.length > 0) {
              res.data.product.contactProductList.forEach((item, index) => {
                item.isShowProLayer = false
                if(!item.imgMain) {
                  item.imgMainSrc = '/src/common/images/image.png'
                }
                this.table.srcList.push(item.imgMainSrc)
              })
            }
            this.table.tableData = res.data.product.contactProductList

          }
        })
      },
      // 数量加减
      handleChangeQuantity(currentValue, oldValue) {
        console.log(currentValue, oldValue);
        console.log(this.choose.quantity);
      },
      // 选择规格
      handleChangeSpecRadio(e, item) {
        console.log(e, item)
        this.setChoose(item)
      },
      // 设置选中规格数据，展示其单价、型号、体积
      setChoose(obj) {
        for(var el in this.choose) {
          if(obj[el]) {
            this.choose[el] = obj[el]
          }
        }
      },

      // 加入方案
      handleDeatilAddProject() {
        var params = {
          projectId: Number(getCookie('projectId')),
          productId: this.choose.productId,
          specificationId: this.choose.id,
          quantity: this.choose.quantity,
        }
        console.log('参数', params)

        addCartProject(params).then(res => {
          if (res.status == 200) {
            this.$message({
              offset: '120',
              message: '加入成功',
              type: 'success'
            })

            // 选中新增的方案
            setlocalStorage('currentProject',  JSON.stringify(res.data))
          } else {
            this.$message({
              offset: '120',
              type: 'error',
              message: res.message
            })
          }
          this.addSaveLoading = false
        })
      },

      /*
       * 关联产品加入购物车
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

      // 加入方案弹窗s
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


    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "./element-variables.scss";
  .productDetailPage {
    .productBase {
      padding-bottom: 40px;
      border-bottom: 1px solid #ddd;
      // 左图
      .imgWarp {
        margin-bottom: 20px;
        .proImg_big_warp {
          .proImg_big {
            display: block;
            width: 100%;
          }
        }
        .proImg_small_warp {
          margin-top: 8px;
          .proImg_small {
            display: inline-block;
            width: 20%;
            margin: 0 3px;
          }
        }

      }

      // 右信息
      .infoWarp {
        .name {
          font-size: 20px;
          color: $--color-text-primary;
          font-weight: bold;
          margin-bottom: 25px;
        }
        .infoItem {
          line-height: 20px;
          font-size: 14px;
          color: $--color-text-secondary;
          display: flex;
          margin: 15px 0;
          dt {
            width: 65px;
            text-align: justify;
            -ms-text-justify: inter-word;
            text-justify: inter-ideograph;
            text-align-last: justify;
            -moz-text-align-last: justify;
          }
          dd {
            flex: 1;
            color: $--color-text-primary;
          }
        }
      }
    }

    .productOther {
      margin-top: 20px;
      .title {
        font-size: 16px;
        color: #333;
        background-color: #dfdfdf;
        padding: 15px;
        font-weight: bold;
        position: relative;
      }
      .title::before {
        content: '';
        width: 3px;
        height: 100%;
        background-color: $--color-primary;
        position: absolute;
        top: 0;
        left: 0;
      }
      .container {
        margin-top: 20px;
      }
    }

    // 关联产品
    .contactProduct {
      margin-top: 30px;
      .contactProduct_title {

      }
      .contactProduct_container {
        .proItem:hover {
            box-shadow: 0 2px 12px 0 rgba(0,0,0,0.5);
          }
          .proItem {
            box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
            position: relative;
            margin-bottom: 15px;
            transition: 0.5s;
            background-color: #fff;
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

    // 效果图
    .imgEffect {
      margin-top: 30px;
      .imgEffect_title {

      }
      .imgEffect_container {
        .imgEffectImg {
          display: block;
          width: 100%;
          margin-bottom: 15px;
        }
      }
    }


  }

</style>
<style>
  .infoItem .el-radio__input {
    display: none;
  }

  .productDetailPage .el-radio {
    margin: 0 0 0 13px;
    margin-bottom: 8px;
  }
  .productDetailPage .el-radio__inner {
    opacity: 0;
  }
  .productDetailPage .el-radio__label {
    padding: 0;
  }
</style>
