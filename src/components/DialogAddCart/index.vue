<template>
  <div class="cmyy">
    <div class="dialog-model-content">
      <el-form :model="dialogProduct" ref="addForm">
        <el-form-item
          label="产品名称"
          :label-width="formLabelWidth"
          size="small">
          {{dialogProduct.name}}   {{choose.modelNumber}}
        </el-form-item>
        <el-form-item
          label="单价"
          :label-width="formLabelWidth"
          size="small">
          {{choose.unitPrice}}
        </el-form-item>
        <el-form-item
          label="小计"
          :label-width="formLabelWidth"
          size="small">
          {{choose.unitPrice * choose.quantity}}
        </el-form-item>

        <el-form-item
          label="规格"
          :label-width="formLabelWidth"
          size="small">
          <el-radio-group v-model="choose.id">
            <el-radio
              style="display: inline-block;width: 180px;margin: 5px 10px 5px 0;"
              v-for="(item, index) in dialogProduct.specificationList"
              :key="index"
              :label="item.id"
              border
              size="medium"
              @change="handleChangeSpecRadio($event, item)">
              {{item.modelNumber}}  {{item.size}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="数量"
          :label-width="formLabelWidth"
          size="small">
           <el-input-number
             v-model="choose.quantity"
             @change="handleChangeQuantity"
             :step="1"
             :min="1"
             label="产品数量"
             step-strictly="true"></el-input-number>
        </el-form-item>
      </el-form>

    </div>

    <div class="dialog-model-footer">
      <el-button
        type="primary"
        size="small"
        @click="handleDialogYes('dialog-model-product')">确定</el-button>
      <el-button size="small" @click="handleDialogNo('dialog-model-product')">取消</el-button>
    </div>
  </div>
</template>

<script>

  import { getCookie, setlocalStorage  } from 'common/js/dom';
  import { addCartProject } from 'api/interface';
  export default {
    components: {

    },
    name: "DialogProduct",
    props: {
      dialogProduct: {
        type: Object,
        default: null
      },
    },
    data() {
      return {
        formLabelWidth: '100px',
        choose: {
          id: '',            // 规格id
          productId: '',     // 产品id
          unitPrice: '',     // 单价
          modelNumber: '',   // 型号
          quantity: 1,       // 数量
        },
      }
    },
    created() {
      this.setChoose(this.dialogProduct.specificationList[0])
    },
    computed: {

    },
    mounted() {

    },
    methods: {
      // 商品弹窗确定
      handleDialogYes() {
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

            // TODO
            this.$emit('handleDialogYes')

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
      // 商品弹窗取消
      handleDialogNo(type) {
        this.$message('已取消')
        this.$emit('handleDialogNo')
      },

      // 选择规格
      handleChangeSpecRadio(e, item) {
        this.setChoose(item)
      },

      // 数量加减
      handleChangeQuantity(currentValue, oldValue) {
        console.log(this.choose.quantity);
      },

      // 设置选中规格数据，展示其单价、型号、体积
      setChoose(obj) {
        for(var el in this.choose) {
          if(obj[el]) {
            this.choose[el] = obj[el]
          }
        }
      },
    },

    watch: {
      dialogProduct: {
        handler(newVal, oldVal) {
          this.setChoose(newVal.specificationList[0])
        },
        immediate: true,
        deep: true
      },
    }
  }
</script>

<style>
</style>
