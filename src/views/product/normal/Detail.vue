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
                v-model="quantity"
                @change="handleChangeQuantity"
                :step="1"
                :min="1"
                label="产品数量"
                step-strictly="true"></el-input-number>
            </dd>
          </dl>

          <div>
            <el-button type="primary">加入方案</el-button>
            <el-button>开始配置方案</el-button>
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
            <div class="container contactProduct_container">

            </div>
          </div>

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

  import { setlocalStorage } from 'common/js/dom';
  import { getProduct, editProject } from 'api/interface';

  export default {
    components: {

    },
    name: "ProductDetail",
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
        quantity: 1,

        // options
        options: {
          specifications: '',
          specificationsOptions: [],
        },

        choose: {
          size: '',   // 规格
          unitPrice: '',   // 单价
          modelNumber: '',   // 型号
          volume: '',   // 体积
          image: '',   // 图片名称
          imageSrc: ''  // 图片路径
        },


        // 产品图
        imgSrcList: [],

        // 效果图(放大查看)
        previewImgEffectList: [],

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

          }
        })
      },
      // 数量加减
      handleChangeQuantity(currentValue, oldValue) {
        console.log(currentValue, oldValue);
        console.log(this.quantity);
      },
      // 选择规格
      handleChangeSpecRadio(e, item) {
        console.log(e, item)
        this.setChoose(item)
      },
      // 设置选中规格数据，展示其单价、型号、体积
      setChoose(obj) {
        for(var el in this.choose) {
          this.choose[el] = obj[el]
        }
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
      margin-top: 40px;
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
      .contactProduct_title {

      }
      .contactProduct_container {

      }
    }

    // 效果图
    .imgEffect {
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
</style>
