<template>
  <div class="productDetailPage" v-loading="loading">
    <el-row :gutter="20" class="">
      <el-col :xs="22" :sm="9" :md="9" :lg="7" :xl="7" :offset="1" class="">

      </el-col>
      <el-col :xs="22" :sm="9" :md="9" :lg="7" :xl="7" :offset="1" class="">

      </el-col>
    </el-row>

    <!-- 商品行 -->

    <el-row :gutter="0" class="">
      <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22" :offset="1" class="">

        <el-table
          size="mini"
          :data="tableData"
          border
          style="width: 100%"
          highlight-current-row
          :row-class-name="rowClassName"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="40"
            align="center">
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column
            v-for="(item, index) in title"
            :key="`col_${index}`"
            :prop="item.field"
            :label="item.label"
            :min-width="item.width">
            <template slot-scope="scope">
              <!-- 图片 -->
              <div class="image_warp" v-if="item.type == 'img'">
                <el-image
                  class="proImg"
                  :src="scope.row.imgMainSrc"
                  alt="scope.row.modelNumber"
                  fit="contain"
                  lazy
                  ref="foo">
                </el-image>
                <div>{{scope.row.number}}</div>
              </div>
              <!-- 信息 -->
              <div class="info_warp" v-if="item.type == 'info'">
                <div class="name">{{scope.row.name}}</div>
                <div class="info">
                  {{scope.row.modelNumber}} <br>
                  {{scope.row.size}} <br>
                  {{scope.row.volume}} <br>
                </div>
              </div>
              <div class="price_warp" v-if="item.type == 'price'">
                ￥{{scope.row.unitPrice}}
              </div>
              <div class="quantity_warp" v-if="item.type == 'quantity'">
                <el-input-number
                  v-model="scope.row.quantity"
                  :step="1"
                  :min="1"
                  label="产品数量"
                  step-strictly="true"
                  size="mini"></el-input-number>
                  <span>{{scope.row.unitName}}</span>
              </div>
              <div class="subtotal_warp" v-if="item.type == 'subtotal'">
                ￥{{scope.row.subtotal}}
              </div>
              <div class="instructions_warp" v-if="item.type == 'instructions'">
                {{scope.row.instructions}}
              </div>
              <div class="operat_warp" v-if="item.type == 'operat'">
                <el-button type="text" @click="handleDeleteSingle(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>


        <div style="text-align: center;margin-top: 15px;">
          <el-button type="primary" size="small"><i class="el-icon-plus"></i>添加产品</el-button>
        </div>
      </el-col>
    </el-row>


    <!-- 顶部悬浮行 -->
    <el-row :gutter="0" class="footNav">
      <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22" :offset="1" class="">
        <div class="amount_warp">
          当前方案总额：<span>￥</span><b>{{currentProject.amount}}</b>
        </div>
        <el-button type="primary">生成报价清单</el-button>
      </el-col>
    </el-row>




  </div>
</template>

<script>
  import Sortable from 'sortablejs';
  import { setlocalStorage, getCookie, setCookie, delCookie, } from 'common/js/dom';
  import { getProject, editProject } from 'api/interface';
  export default {
    name: "Cart",
    components: {

    },
    data() {
      return {
        loading: false,
        projectId: '',

        currentProject: {},

        tableData: [],
        title: [
          {
            label: '产品图片',
            field: 'imgMainSrc',
            type: 'img',
          },
          {
            label: '产品信息',
            field: 'name',
            type: 'info',
          },
          {
            label: '单价',
            field: 'unitPrice',
            type: 'price',
          },
          {
            label: '数量',
            field: 'quantity',
            type: 'quantity',
          },
          {
            label: '小计',
            field: 'subtotal',
            type: 'subtotal',
          },
          {
            label: '材质说明',
            field: 'instructions',
            type: 'instructions',
          },
          {
            label: '操作',
            field: 'operat',
            type: 'operat',
          },
        ],

      }
    },
    created() {
      // 当前方案
      // if(localStorage.getItem('currentProject')) {
      //   this.currentProject = JSON.parse(localStorage.getItem('currentProject'))
      // }
      // console.log(this.currentProject)
      // this.tableData = this.currentProject.productSpecifiList
      if(getCookie('projectId')) {
        this.projectId = getCookie('projectId')
        this._getProject(this.projectId)
      }

    },
    mounted() {
      this.rowDrop()
    },
    methods: {
      // 获取数据
      _getProject(projectId) {
        this.loading = true
        getProject(projectId).then(res => {
          this.loading = false
          if (res.status == 200) {
            this.currentProject = res.data.project

            // 明细表
            if(res.data.project.productSpecifiList.length > 0) {
              res.data.project.productSpecifiList.forEach(function(item, index) {
                if(item.image) {
                  item.imageUrl = item.imageSrc
                }
              })
              this.tableData = res.data.project.productSpecifiList
            }else {
              this.tableData = []
            }

            // 选中新增的方案
            setlocalStorage('currentProject',  JSON.stringify(res.data.project))
          }
        })
      },

      /* 明细表 */
      // 把每一行的索引放进row.row_index
      rowClassName({row, rowIndex}) {
        row.row_index = rowIndex+1;
      },


      // 行拖拽
      rowDrop () {
        const tbody = document.querySelector('.el-table__body-wrapper tbody');
        const _this = this;
        Sortable.create(tbody, {
          draggable: ".el-table__row",
           onEnd ({ newIndex, oldIndex }) {
              const currRow = _this.tableData.splice(oldIndex, 1)[0];
              _this.tableData.splice(newIndex, 0, currRow);
              console.log(_this.tableData)
              _this.handleAddProject(_this.tableData)
            }
        });

      },


      // 加入方案  TODO
      handleAddProject(tableData) {

        let currentProject = JSON.parse(localStorage.getItem('currentProject'))

        currentProject.projectDetailList = tableData
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


      // 单个删除
      handleDeleteSingle(row) {
        console.log('单个删除', row)
        let currentProject = JSON.parse(localStorage.getItem('currentProject'))
        console.log(currentProject)

        let currentProductSpecifiList = currentProject.productSpecifiList
        currentProductSpecifiList.splice(currentProductSpecifiList.findIndex(item => item.productId === row.productId), 1)


        currentProject.projectDetailList = currentProductSpecifiList
        console.log(currentProject)
        editProject(currentProject).then(res => {
          if (res.status == 200) {
            this.$message({
              offset: '120',
              message: '删除成功',
              type: 'success'
            })
            this._getProject(res.data.id)
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
      // 选择
      handleSelectionChange(e) {
        console.log(e)
      },
      // 多个删除
      handleDeleteMultiple() {
        console.log('多个删除')
        let currentProject = JSON.parse(localStorage.getItem('currentProject'))
        currentProject.projectDetailList = []
        editProject(currentProject).then(res => {
          if (res.status == 200) {
            this.$message({
              offset: '120',
              message: '删除成功',
              type: 'success'
            })
            this._getProject(res.data.id)
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



    },
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "./element-variables.scss";

  .cartItem {
    .image_warp {

    }
    .info_warp {

    }
    .price_warp {

    }
    .quantity_warp {

    }
    .subtotal_warp {

    }
    .instructions_warp {

    }
    .operat_warp {

    }
  }


  .footNav {
    text-align: right;
    background-color: #ded8d1;
    padding: 10px 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    .amount_warp {
      display: inline-block;
      vertical-align: middle;
      line-height: 32px;
      margin-right: 30px;
      color: $--color-text-primary;
      span {
        color: $--color-primary;
      }
      b {
        font-size: 26px;
        color: $--color-primary;
      }

    }
  }
</style>
