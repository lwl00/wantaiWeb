<template>
  <div class="proItem">
    <div class="imgWarp">
      <el-image
        class="proImg"
        :src="item.imgMainSrc"
        alt=""
        fit="contain"
        lazy
        :preview-src-list="srcList"
        ref="foo">
      </el-image>
      <el-button type="text" class="copy" title="复制" @click="copy"><i class="el-icon-document-copy"></i></el-button>
    </div>
    <div class="infoWarp">
      <div class="name" @click="routerLink(item)">{{item.name}}</div>
      <div class="crafts">{{item.categorysName}}</div>
      <div class="spec clear">
        <div class="specText pull-left">{{item.specificationList[0].size}}</div>
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
</template>

<script>
import { mapGetters } from 'vuex';
import { formatBrandTreeData, setlocalStorage } from 'common/js/dom';
import { getBrandTree } from 'api/interface';
export default {
  name: 'ProductTable',
  props: {
    //表单数据
    item: {
      type: Object,
      default: {}
    },
    srcList: {
      type: Array,
      default: []
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

    // 跳转详情页
    routerLink(item) {
      console.log('跳转详情页')
      this.$router.push({
        name: 'ProductDetail',
        query: {
          id: item.id
        }
      })
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

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "./element-variables.scss";
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

</style>
