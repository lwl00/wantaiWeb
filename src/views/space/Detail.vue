<template>
  <div class="productDetailPage" v-loading="loading">

      <el-row :gutter="20" class="productBase">
        <el-col :xs="22" :sm="9" :md="9" :lg="7" :xl="7" :offset="1" class="imgWarp">
          <div class="proImg_big_warp">
            <el-image
              class="proImg_big"
              v-if="choose.image"
              :src="choose.imageSrc"
              :alt="choose.id"
              fit="contain"
              lazy>
            </el-image>
          </div>
          <div class="proImg_small_warp">
            <el-image
              class="proImg_small"
              :class="{ active: item.id == choose.id }"
              v-for="(item, index) in addForm.spaceImgList"
              v-if="item.image"
              :key="index"
              :src="item.imageSrc"
              :alt="item.id"
              fit="contain"
              lazy
              @click="handleChangeImage(item)">
            </el-image>
          </div>

        </el-col>
        <el-col :xs="21" :sm="12" :md="12" :lg="14" :xl="14" :offset="1" class="infoWarp">
          <div class="name">{{addForm.name}}</div>
          <dl class="infoItem">
            <dt>编号</dt>：
            <dd>{{addForm.number}}</dd>
          </dl>
        </el-col>
      </el-row>

      <el-row :gutter="0" class="productOther">
        <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22" :offset="1">
          <!-- 关联产品 -->
          <div class="contactProduct">
            <div class="title contactProduct_title">
              包含产品
            </div>
            <el-row :gutter="15"  class="container contactProduct_container">
              <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4"
                v-for="(item, index) in table.tableData"
                :key="index">
                <div class="proItem">
                  <div class="imgWarp">
                    <router-link tag="a" target="_blank"
                      :to="{name: 'ProductDetail', query:{id: item.id}}">
                        <el-image
                        class="proImg"
                        :src="item.imgMainSrc"
                        alt=""
                        lazy
                        ref="foo">
                      </el-image>
                      <!-- 大图展示 :preview-src-list="table.srcList" -->
                    <!-- <el-button type="text" class="copy" title="复制" @click="copy"><i class="el-icon-document-copy"></i></el-button> -->
                    </router-link>
                  </div>
                  <div class="infoWarp">
                    <div class="name">
                      {{item.name}}
                    </div>
                    <div class="spec clear">
                      <div class="specText pull-left" :title="item.specificationList[0].size">{{item.specificationList[0].size}}</div>
                      <!-- <div class="specTextMore pull-right" @mouseenter="item.isShowProLayer = true">更多规格</div> -->
                    </div>
                    <div class="price clear">
                      <div class="priceText pull-left">￥<span>{{item.specificationList[0].unitPrice}}</span></div>
                      <div class="priceBtn pull-right">
                        <el-button type="primary" size="mini" @click="handleAddProject(item)" v-if="projectIsNow">加入方案</el-button>
                      </div>
                    </div>
                  </div>

                  <!-- 蒙层 -->
                  <!-- <div class="proLayer" v-show="item.isShowProLayer" @mouseleave="item.isShowProLayer = false">
                    <div class="" style="margin-bottom: 15px;">规格</div>
                    <dl v-for="(specItem, specIndex) in item.specificationList">
                      <dt>{{specItem.size}}</dt>
                      <dd>￥<span>{{specItem.unitPrice}}</span></dd>
                    </dl>

                    <div class="operat" @mouseleave="item.isShowProLayer = false">
                      <el-button type="primary" class="addProject" size="mini" @click="handleAddProject(item)" v-if="projectIsNow">加入方案</el-button>
                    </div>
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

        </el-col>
      </el-row>
  </div>

</template>

<script>

  import { mapGetters } from 'vuex';
  import Dialog from 'base/Dialog';
  import DialogAddCart from '@/components/DialogAddCart'
  import { setlocalStorage } from 'common/js/dom';
  import { getSpace, editProject } from 'api/interface';

  export default {
    name: "SpaceDetail",
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
          spaceImgList: [],  //
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
          id: '',   // 规格id
          image: '',   // 图片名称
          imageSrc: ''  // 图片路径
        },


        // 产品图
        imgSrcList: [],

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
      this._getSpace(this.id);
    },
    mounted() {

    },
    methods: {
      // 获取数据
      _getSpace(id) {
        this.loading = id ? true : false
        getSpace(id).then(res => {
          this.loading = false
          if (res.status == 200) {
            this.addForm = res.data.space

            // 图片
            if(res.data.space.spaceImgList && res.data.space.spaceImgList.length > 0) {
              res.data.space.spaceImgList.forEach((item, index) => {
                item.isShowProLayer = false
                if(!item.image) {
                  item.imageSrc = '/src/common/images/image.png'
                }
                this.addForm.spaceImgList.push(item.imageSrc)
              })
            }

            // 默认选中第一个规格，
            this.setChoose(res.data.space.spaceImgList[0])

            // 关联产品
            if(res.data.space.productList && res.data.space.productList.length > 0) {
              res.data.space.productList.forEach((item, index) => {
                item.isShowProLayer = false
                if(item.imgMain) {
                  item.imgMainSrc = '/src/common/images/image.png'
                }
                this.table.srcList.push(item.imgMainSrc)
              })
            }
            this.table.tableData = res.data.space.productList


          }
        })
      },

      // 设置选中图片
      setChoose(obj) {
        for(var el in this.choose) {
          this.choose[el] = obj[el]
        }
      },
      // 选择图片
      handleChangeImage(item) {
        this.setChoose(item)
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
        this.dialogProduct = item
        this.show('dialog-model-addCart')
      },


    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "./element-variables.scss";
  @import "@/common/css/product.scss";
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
            border: 2px solid transparent;
          }
          .proImg_small.active {
            border-color: $--color-primary;
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
