<template>
  <div class="AccountPage" v-loading="loading">
    <section class="account_info">
      <div class="title">
        账号信息
      </div>
      <div class="container">
        <dl class="infoItem">
          <dt>姓名</dt>：
          <dd>{{customer.name}}</dd>
        </dl>
        <dl class="infoItem">
          <dt>账号</dt>：
          <dd>{{customer.username}}</dd>
        </dl>
        <dl class="infoItem">
          <dt>公司</dt>：
          <dd>{{customer.company}}</dd>
        </dl>
        <dl class="infoItem">
          <dt>职位</dt>：
          <dd>{{customer.position}}</dd>
        </dl>
        <dl class="infoItem">
          <dt>联系电话</dt>：
          <dd>{{customer.phone}}</dd>
        </dl>
        <dl class="infoItem">
          <dt>地址</dt>：
          <dd>{{customer.remark}}</dd>
        </dl>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import Dialog from 'base/Dialog';
import { deleteBlankSpace, formatSearch, calculateTableHeight, tableBtnPermissions, routerLinkPage, formatBrandTreeData } from 'common/js/dom';
import { getDictsData, getSpaceList, delSpace, getBrandTree } from 'api/interface';

export default {
  name: "Account",
  components: {
    'dialogModel': Dialog,
  },
  computed: {
    ...mapGetters([
      'customer',
    ])
  },
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
  @import "./css.scss";

  .AccountPage {
    .container {
      padding: 0 20px 20px;
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
</style>
