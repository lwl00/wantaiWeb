<template>
  <div class="ExportPage" v-loading="loading">
    <el-row :gutter="20" class="">
      <el-col :xs="6" :sm="4" :md="4" :lg="3" :xl="3" :offset="1" class="aside">
        <section class="aside_section">
          <div class="aside_section_title">
            方案名称
          </div>
          <div class="aside_section_container">
            <p>{{currentProject.name}}</p>
          </div>
        </section>
        <section class="aside_section">
          <div class="aside_section_title">
            客户信息
          </div>
          <div class="aside_section_container">
            <p>{{currentProject.companyName}}</p>
            <p>{{currentProject.contact}}</p>
            <p>{{currentProject.phone}}</p>
          </div>
        </section>
        <section class="aside_section">
          <div class="aside_section_title">
            标题内容
          </div>
          <div class="aside_section_container">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
              <el-checkbox v-for="label in columns" :label="label" :key="label" style="width: 50%">{{label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </section>
        <section class="aside_section">
          <div class="aside_section_title">
            公司/个人名片
          </div>
          <div class="aside_section_container">
            <p>佛山市万泰家具有限公司</p>
            <p>刘丽</p>
            <p>15989954179</p>
          </div>
        </section>


      </el-col>
      <el-col :xs="16" :sm="18" :md="18" :lg="19" :xl="19" :offset="0" class="container">
        <div class="project_operat">
          <el-button type="primary" size="small" @click="hanldeExportProject">导出报价清单</el-button>
        </div>
        <div class="project_name">{{currentProject.name}}</div>

        <el-table
          border
          size="mini"
          :data="tableData"
          style="width: 100%"
          highlight-current-row
          :row-class-name="rowClassName"
          @selection-change="handleSelectionChange">
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column
            v-for="(item, index) in title"
            v-if="!item.hidden"
            :key="`col_${index}`"
            :prop="item.field"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align">
            <template slot-scope="scope">
              <div class="image_warp" v-if="item.type == 'imgMain'">
                <el-image
                  class="proImg"
                  :src="scope.row.imgMainSrc"
                  :alt="scope.row.modelNumber"
                  fit="contain"
                  lazy
                  ref="foo">
                </el-image>
              </div>
              <div v-else>{{scope.row[item.field]}}</div>
            </template>
          </el-table-column>
        </el-table>

        <div class="project_info">
          <div class="amount">
            实收总金额：￥{{currentProject.amount}}   <br/>
            大写总金额：{{currentProject.amount | convertCurrency}}
          </div>
          <div class="project_info_con">
            <div class="procure">
              采购方：{{currentProject.companyName}} <br/>
              联系人：{{currentProject.contact}} <br/>
              联系电话：{{currentProject.phone}} <br/>
            </div>
            <div class="supply">
              供货方：采购方 <br/>
              联系人：联系人 <br/>
              联系电话：联系电话 <br/>
            </div>
          </div>
        </div>

      </el-col>
    </el-row>



  </div>
</template>

<script>
  import Sortable from 'sortablejs';
  import { setlocalStorage, getCookie, setCookie, delCookie, convertCurrency } from 'common/js/dom';
  import { getProject, editProject, addCartProject, exportProjectDetail } from 'api/interface';
  const columns = [];
  export default {
    name: "Export",
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
            type: 'imgMain',
            width: '150',
            align: 'center',
            hidden: false,
          },
          {
            label: '产品名称',
            field: 'name',
            type: 'name',
            hidden: false,
            width: '150',
          },
          {
            label: '型号',
            field: 'modelNumber',
            type: 'modelNumber',
            hidden: false,
            align: 'center',
          },
          {
            label: '规格',
            field: 'size',
            type: 'size',
            hidden: false,
            align: 'center',
            width: '120',
          },
          // {
          //   label: '品牌',
          //   field: 'brandName',
          //   type: 'brandName',
          //   hidden: false,
          // },
          // {
          //   label: '系列',
          //   field: 'seriesName',
          //   type: 'price',
          //   hidden: false,
          // },
          // {
          //   label: '工艺',
          //   field: 'craftsName',
          //   type: 'craftsName',
          //   hidden: false,
          // },
          // {
          //   label: '分类',
          //   field: 'categorysName',
          //   type: 'categorysName',
          //   hidden: false,
          // },
          // {
          //   label: '颜色',
          //   field: 'color',
          //   type: 'color',
          //   hidden: false,
          //   align: 'center',
          // },
          {
            label: '数量',
            field: 'quantity',
            type: 'quantity',
            hidden: false,
            width: '50',
            align: 'center',
          },
          {
            label: '单位',
            field: 'unitName',
            type: 'unit',
            hidden: false,
            width: '50',
            align: 'center',
          },
          {
            label: '单价',
            field: 'unitPrice',
            type: 'unitPrice',
            hidden: false,
            align: 'center',
          },
          {
            label: '总价',
            field: 'subtotal',
            type: 'subtotal',
            hidden: false,
            align: 'center',
          },
          {
            label: '材质说明',
            field: 'instructions',
            type: 'instructions',
            hidden: false,
            width: '300',
          },
        ],

        checkAll: true,
        isIndeterminate: true,
        checkedColumns: [],  // 选中列，默认为全部
        columns: columns,  // 备选列项，全部

      }
    },
    created() {
      // 当前方案
      if(getCookie('projectId')) {
        this.projectId = getCookie('projectId')
        this._getProject(this.projectId)
      }

      // 初始化数据
      this.title.map((item, index) => {
        this.checkedColumns.push(item.label)
        columns.push(item.label)
      })
    },
    mounted() {
      // this.rowDrop()
    },
    filters: {
      convertCurrency: convertCurrency
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
            }
        });
      },

      // 选择
      handleSelectionChange(e) {
        console.log(e)
      },
      // 跳转详情页
      routerLink(item) {
        this.$router.push({
          name: 'ProductDetail',
          query: {
            id: item.productId
          }
        })
      },

      // 全选
      handleCheckAllChange(val) {
        this.checkedColumns = val ? columns : [];
        this.isIndeterminate = false;
        this.setTableColumns()
      },
      // 勾选
      handleCheckedColumnsChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.columns.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.columns.length;
        this.setTableColumns()
      },
      // 设置列
      setTableColumns() {
        this.title.map((item, index) => {
          if(this.checkedColumns.includes(item.label)) {
            item.hidden = false
          }else {
            item.hidden = true
          }
        })
      },

      hanldeExportProject() {
        var nameStr = ''
        var fieldStr = ''
        this.title.map((item, index) => {
          if(!item.hidden) {
            nameStr += item.label+','
            fieldStr += item.type+','
          }
          nameStr.slice(0,nameStr.length-1)
          fieldStr.slice(0,fieldStr.length-1)
        })

        var params = {
          id: this.projectId,
          nameStr: nameStr,
          fieldStr : fieldStr,
          fieldTail: 'amount,name,companyName,contact,phone,customerName',  // 写死
        }
        window.location.href = exportProjectDetail(params)
      }

    },
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "./element-variables.scss";

  .ExportPage {
    .aside {
      padding: 0 !important;
      background-color: #eee;
      border: 1px solid #eee;
      .aside_section {

        .aside_section_title {
          font-size: 16px;
          color: #333;
          background-color: #dfdfdf;
          padding: 10px;
          font-weight: bold;
          position: relative;
        }
        .aside_section_title::before {
          content: '';
          width: 3px;
          height: 100%;
          background-color: $--color-primary;
          position: absolute;
          top: 0;
          left: 0;
        }
        .aside_section_container {
          padding: 20px;
          font-size: 14px;
          color: $--color-text-primary;
          line-height: 24px;
          background-color: #eee;
        }
      }


    }
    .container {
      .project_operat {
        text-align: right;
        margin-bottom: 15px;
        background-color: #eee;
        padding: 10px;
      }
      .project_name {
        background-color: #eee;
        font-size: 20px;
        color: $--color-text-primary;
        padding: 20px 0;
        text-align: center;
        font-weight: bold;
      }

      .project_info {
        background-color: #eee;
        line-height: 24px;
        padding: 15px;
        .amount {
          border-bottom: 1px solid #dfdfdf;
          padding: 10px;
        }
        .project_info_con {
          display: flex;
          padding: 10px;
          .procure {
            flex: 1;
          }
          .supply {
            flex: 1;
          }

        }
      }
    }
  }
</style>
