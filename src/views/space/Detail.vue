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
              v-for="(item, index) in addForm.spaceImgList"
              v-if="item.image"
              :key="index"
              :src="item.imageSrc"
              :alt="item.id"
              fit="contain"
              lazy>
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
            <div class="container contactProduct_container">

            </div>
          </div>

        </el-col>
      </el-row>
  </div>

</template>

<script>

  import { mapGetters } from 'vuex';
  import { setlocalStorage } from 'common/js/dom';
  import { getSpace, editProject } from 'api/interface';

  export default {
    name: "SpaceDetail",
    components: {

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


            // 默认选中第一个规格，
            this.setChoose(res.data.space.spaceImgList[0])
            console.log(this.choose)

          }
        })
      },

      // 设置选中图片
      setChoose(obj) {
        for(var el in this.choose) {
          this.choose[el] = obj[el]
        }
      },

      // 加入方案  TODO
      handleAddProject() {
        let subtotal = this.choose.unitPrice * this.quantity  // 小计
        let params = {
          productId: this.choose.productId,
          quantity: this.quantity,
          specificationId: this.choose.id,
          subtotal: subtotal
        }
        console.log(params)
        let currentProject = JSON.parse(localStorage.getItem('currentProject'))

        currentProject.productSpecifiList.push(params)
        currentProject.projectDetailList = currentProject.productSpecifiList
        editProject(currentProject).then(res => {
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
