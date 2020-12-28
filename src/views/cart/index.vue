<template>
  <div class="CartPage" v-loading="loading">
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
          style="width: 100%"
          highlight-current-row
          :row-class-name="rowClassName"
          @selection-change="handleSelectionChange"
          al>
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
            :min-width="item.width"
            header-align="center"
            :align="item.align">
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
                <div class="name">
                  <span class="name_text" @click="routerLink(scope.row)">
                    {{scope.row.name}}  -- {{scope.row.specificationId}}
                  </span>
                  <i class="icon_discount" v-if="scope.row.discount">折</i>
                </div>
                <div class="info">
                  型号：{{scope.row.modelNumber}} <br>
                  规格：{{scope.row.size}} <br>
                  体积：{{scope.row.volume}} <br>
                </div>
              </div>
              <div class="price_warp" v-if="item.type == 'price'">
                ￥{{scope.row.unitPrice}}
              </div>
              <div class="quantity_warp" v-if="item.type == 'quantity'">
                <el-input-number
                  v-model="scope.row.quantity"
                  @change="handleChangeQuantity(scope.row, $event)"
                  :step="1"
                  :min="1"
                  label="产品数量"
                  step-strictly="true"
                  size="mini"></el-input-number>
                  <span> {{scope.row.unitName}}</span>
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
          <el-button type="primary" size="small" @click="routerProductLink"><i class="el-icon-plus"></i>添加产品</el-button>
        </div>
      </el-col>
    </el-row>


    <!-- 顶部悬浮行 -->
    <el-row :gutter="0" class="footNav">
      <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22" :offset="1" class="">

        <div class="chooseAll_warp">
          <el-checkbox v-model="chooseAll" @click="handleChooseAllSelection">全选</el-checkbox>
          <el-button class="delAll" type="text" @click="handleDeleteMultiple">删除选中</el-button>
        </div>
        <div class="amount_warp">
          当前方案总额：<span>￥</span><b>{{currentProject.amount}}</b>
        </div>
        <el-button type="primary" @click="routerExportLink">生成报价清单</el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import Sortable from 'sortablejs';
  import { setlocalStorage, getCookie, setCookie, delCookie, } from 'common/js/dom';
  import { getProject, editProject, addCartProject } from 'api/interface';
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
            width: '150',
          },
          {
            label: '单价',
            field: 'unitPrice',
            type: 'price',
            align: 'center',
          },
          {
            label: '数量',
            field: 'quantity',
            type: 'quantity',
            width: '170',
            align: 'center',
          },
          {
            label: '小计',
            field: 'subtotal',
            type: 'subtotal',
            align: 'center',
          },
          {
            label: '材质说明',
            field: 'instructions',
            type: 'instructions',
            width: '300',
          },
          {
            label: '操作',
            field: 'operat',
            type: 'operat',
            width: '80',
            align: 'center',
          },
        ],

        selectionChange: [], // 选中多选行数据

        chooseAll: false,

      }
    },
    created() {
      // 当前方案
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
        })
      },


      // 单个删除
      handleDeleteSingle(row) {
        this.loading = true
        console.log('单个删除', row)
        let currentProject = JSON.parse(localStorage.getItem('currentProject'))
        let currentProductSpecifiList = currentProject.productSpecifiList

        currentProductSpecifiList.forEach(function(item, index) {
          if(item.productId === row.productId && item.specificationId === row.specificationId) {
            currentProductSpecifiList.splice(index, 1)
          }
        })
        currentProject.projectDetailList = currentProductSpecifiList
        console.log('保存参数', currentProject)

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
        })
      },
      // 选择
      handleSelectionChange(e) {
        this.selectionChange = e
      },
      // 底部全选
      handleChooseAllSelection(e) {
        console.log(e)
        // if (this.chooseAll) {
        //   rows.forEach(row => {
        //     this.$refs.multipleTable.toggleRowSelection(row);
        //   });
        // } else {
        //   this.$refs.multipleTable.clearSelection();
        // }
      },
      // 多个删除
      handleDeleteMultiple() {
        // this.loading = true
        console.log('多个删除', this.selectionChange)
        if(this.selectionChange.length == 0) {
          this.$message({
            offset: '120',
            type: 'warning',
            message: '请选择数据'
          })
          return false
        }

        let currentProject = JSON.parse(localStorage.getItem('currentProject'))
        let currentProductSpecifiList = currentProject.productSpecifiList

        this.selectionChange.map(el => {
          currentProductSpecifiList.forEach(function(item, index) {
            if(item.productId === el.productId && item.specificationId === el.specificationId) {
              currentProductSpecifiList.splice(index, 1)
            }
          })
        })

        currentProject.projectDetailList = currentProductSpecifiList
        console.log('保存参数', currentProject)

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
        })
      },

      // 数量加减
      handleChangeQuantity(row, currentValue) {
        this.loading = true
        console.log(row, currentValue);
        let currentProject = JSON.parse(localStorage.getItem('currentProject'))
        let currentProductSpecifiList = currentProject.productSpecifiList

        currentProductSpecifiList.forEach(function(item, index) {
          if(item.productId === row.productId && item.specificationId === row.specificationId) {
            item.quantity = currentValue
          }
        })
        currentProject.projectDetailList = currentProductSpecifiList
        console.log('保存参数', currentProject)

        editProject(currentProject).then(res => {
          if (res.status == 200) {
            this.$message({
              offset: '120',
              message: '更新成功',
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
        })
      },
      // 跳转详情页
      routerLink(item) {
        console.log(item)
        this.$router.push({
          name: 'ProductDetail',
          query: {
            id: item.productId
          }
        })
      },
      // 跳转导出页
      routerExportLink() {
        this.$router.push({
          name: 'Export',
          query: {
            id: this.projectId
          }
        })
      },
      // 跳转产品列表页
      routerProductLink() {
        this.$router.push({
          name: 'ProductNormal',
          query: {}
        })
      },



    },
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "./element-variables.scss";

  .CartPage {
    .image_warp {

    }
    .info_warp {
      .name {
        .name_text {
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
        }
        .name_text:hover {
          color: $--color-primary;
        }
        .icon_discount {
          display: inline-block;
          width: 18px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          font-size: 12px;
          color: #fff;
          background-color: $--color-primary;
          border-radius: 4px;
          font-style: normal;
        }
      }

      .info {
        font-size: 12px;
        color: $--color-text-secondary;
        line-height: 18px;
        margin-top: 8px;
      }
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
    .chooseAll_warp {
      float: left;
      .delAll {
        margin-left: 20px;
      }
    }
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
