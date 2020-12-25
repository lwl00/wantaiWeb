<template>
    <div class="container" id="headerWarp">
      <div class="header">
        <div class="logo">
            <router-link to="/dashboard">
                <img src="~common/images/logo.png" />
            </router-link>
        </div>

        <!-- 导航菜单 -->
        <Menu/>


        <div class="userinfo">
          <el-button-group style="margin-right: 20px;">
            <el-button type="primary" size="small" @click="handleConfigProject" v-if="!projectIsNow">开始配置方案</el-button>
            <!-- <el-button type="primary" size="small" @click="handleConfigProject" >开始配置方案</el-button> -->
          </el-button-group>

          <el-dropdown style="line-height: normal;">
            <span class="el-dropdown-link">
              <i class="fa fa-user" aria-hidden="true"></i>
              {{name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <i class="fa fa-user" aria-hidden="true"></i> 个人中心
              </el-dropdown-item>
              <el-dropdown-item>
                <i class="fa fa-sign-out" aria-hidden="true"></i> 历史方案
              </el-dropdown-item>
              <el-dropdown-item >
                <div @click="_logout"><i class="fa fa-sign-out" aria-hidden="true"></i> 退出</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>


           <!-- <span class>
                <i class="fa fa-user" aria-hidden="true"></i>
                {{name}}
            </span>
            <span class="userinfoItem" @click="modifypassword">
                <i class="fa fa-cog" aria-hidden="true"></i> 修改密码
            </span>
            <span class="userinfoItem" @click="_logout">
                <i class="fa fa-sign-out" aria-hidden="true"></i> 退出
            </span> -->
        </div>
      </div>

      <!-- 正在配置方案 -->
      <div v-if="projectIsNow">
        <NavNow
          @handleExitCurrentProject="handleExitCurrentProject"
          @handleEditCurrentProject="handleEditCurrentProject"
          @handleDeleteCurrentProject="handleDeleteCurrentProject"
          :currentProject="currentProject"/>
      </div>


      <!-- 新增的弹出层 -->
      <dialogModel
        class="dialog-model"
        ref="dialog-model-project"
        title="选择方案"
        :width="dialog.dialogWidth">
        <div class="dialog-model-content">
          <el-button
            type="primary"
            size="small"
            @click="handleAddCurrentProject"
            style="margin-bottom: 10px;"><i class="el-icon-circle-plus-outline"></i> 新增方案</el-button>

          <Table :table="table" :isShowSelection="table.isShowSelection" @dblclick="handleDblclick" @handleSelectionChange="handleSelectionChange"></Table>

          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="table.pageNum"
            :page-sizes="[20, 50, 100]"
            :page-size="table.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="table.totalPage"
          ></el-pagination>
        </div>
      </dialogModel>

      <!-- 新增的弹出层 -->
      <dialogModel
        class="dialog-model"
        ref="dialog-model-projectFrom"
        :title="projectIsNow ? '编辑客户信息' : '新增方案'"
        :width="dialog.dialogWidth">
        <div class="dialog-model-content">
          <el-form :model="projectFrom" ref="projectFrom" :rules="rules" size="small">
            <el-form-item
              label="方案名称"
              :label-width="formLabelWidth"
              prop="name">
              <el-input
                v-model="projectFrom.name"
                style="width:200px;"
                class="pull-left"
                placeholder="请输入方案名称"></el-input>
            </el-form-item>
            <el-form-item
              label="客户公司"
              :label-width="formLabelWidth"
              prop="companyName">
              <el-input
                v-model="projectFrom.companyName"
                style="width:200px;"
                class="pull-left"
                placeholder="请输入客户公司"></el-input>
            </el-form-item>
            <el-form-item
              label="联系人"
              :label-width="formLabelWidth"
              prop="">
              <el-input
                v-model="projectFrom.contact"
                style="width:200px;"
                class="pull-left"
                placeholder="请输入联系人"></el-input>
            </el-form-item>
            <el-form-item
              label="联系电话"
              :label-width="formLabelWidth"
              prop="">
              <el-input
                v-model="projectFrom.phone"
                style="width:200px;"
                class="pull-left"
                placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="dialog-model-footer">
          <el-button
            type="primary"
            size="small"
            @click="handleSaveProject('dialog-model-projectFrom','projectFrom')"
            :loading="addSaveLoading">确定</el-button>
          <el-button size="small" @click="handleCancelProject('dialog-model-projectFrom','projectFrom')">取消</el-button>
        </div>
      </dialogModel>

    </div>
</template>

<script>

import Dialog from 'base/Dialog'
import Table from '@/components/Table'
import NavNow from './NavNow.vue'
import Menu from './Menu.vue'
import { mapGetters } from 'vuex';
import { getCookie, setCookie, delCookie, setlocalStorage } from 'common/js/dom';
import { logout, getProjectList, getProject, addProject, editProject, delProject } from 'api/interface';

export default {
    name: "headerWarp",
    components: {
      NavNow,
      Menu,
     'dialogModel': Dialog,
     Table,
    },
    computed: {
      ...mapGetters([
        'name',
        'roles',
        'token',
        'projectIsNow',
      ])
    },
    data() {
      return {
        collapsed: false,
        activeIndex: '1',

        // 表格
        table: {
          title: [
            {
              label: '方案名称',
              field: 'name',
            },
            {
              label: '创建时间',
              field: 'createdTime',
              type: 'dateTime',
            },
          ],
          tableData: [],
          totalPage: 20,
          pageSize: 20,
          pageNum: 1,
          tableLoading: false,
          tableHeight: '450px',
          isShowSelection: false,
          selectionChange: [],  // 多选行数据
        },

        // 弹窗层
        dialog: {
          loading: false,
          editTitle: '编辑',    //编辑弹窗标题
          addTitle: '新增',      //新增弹窗标题
          dialogWidth: '500px',   //弹窗宽度
        },

        currentProject: {},

        addSaveLoading: false,
        formLabelWidth: '100px',
        projectFrom: {
          name: '',
          amount: 0,
          companyName: "",
          contact: "",
          customerName: "",
          phone: "",
          projectDetailList: [],
          remark: ""
        },
        rules: {
          name: [
            { required: true, message: '请输入方案名称', trigger: 'blur'},
          ],
          companyName: [
            { required: true, message: '请输入客户公司', trigger: 'blur'},
          ],
        }

      }
    },
    created() {

      // 当前方案
      if(localStorage.getItem('currentProject')) {
        this.currentProject = JSON.parse(localStorage.getItem('currentProject'))
      }
      console.log(this.currentProject)
      console.log(this.projectIsNow)

    },
    methods: {
      //退出登录
      _logout: function () {
        var _this = this;
        _this.$confirm('确认退出吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('LogOut').then(() => {
            _this.$router.push('/login');
            location.reload()// In order to re-instantiate the vue-router object to avoid bugs
          })
        }).catch(() => {
          console.log('取消退出')
        });
      },
      //折叠导航栏
      collapse: function () {
        this.collapsed = !this.collapsed;
      },
      // 修改密码
      modifypassword: function () {
        this.$router.push('/user/modifypassword');
      },


      show: function (type) {      //弹出弹出框   type(ref)
        this.$refs[type].showModel();
      },
      hide: function (type) {      //隐藏弹出框
        this.$refs[type].hideModel();
      },
      // 获取列表数据
      _getProjectList: function (pageNum, pageSize) {
        var params = {
          number: '',
          name: '',
          companyName: '',
          contact: '',
          createdTime: '',
          pageNum: pageNum,
          pageSize: pageSize,
        }

        this.table.tableLoading = true
        getProjectList(params).then(res => {
          this.table.tableLoading = false
          if (res.status == 200) {
            this.table.tableData = res.data.data
            this.table.totalPage = res.pageVO.total
          }
        })
      },
      // 每页显示条数
      handleSizeChange: function (val) {
        this.table.pageSize = val
        this._getProjectList(this.table.pageNum, this.table.pageSize);
      },
      // 翻页
      handleCurrentChange: function (val) {
        this.table.pageNum = val
        this._getProjectList(this.table.pageNum, this.table.pageSize);
      },
      // 双击行选择
      handleDblclick(row) {

        console.log('双击行选择', row)
        this.currentProject = row
        getProject(row.id).then(res => {
          this.loading = false
          if (res.status == 200) {
            setlocalStorage('currentProject', JSON.stringify(res.data.project))


            setCookie('projectId', row.id, 'h12')
            // 设置方案状态cookies/store
            setCookie('projectIsNow', true, 'h12')
            this.$store.dispatch('ToggleProjectIsNow', true)
          }
        })
        // setlocalStorage('currentProject', JSON.stringify(row))
        this.hide('dialog-model-project')

      },
      // 多选行数据(不用)
      handleSelectionChange(e) {
        this.table.selectionChange = e
      },

      // 开始配置方案(√)
      handleConfigProject() {
        this.show('dialog-model-project')
        this._getProjectList(this.table.pageNum, this.table.pageSize);

      },
      // 退出方案(√)
      handleExitCurrentProject() {
        console.log('退出方案')
        delCookie('projectId')
        this.currentProject = ''
        setlocalStorage('currentProject', '')
        console.log(this.$route.path)

        // 购物车回到主页
        if(this.$route.path == '/cart') {
          this.$router.push('/');
        }

        // 设置方案状态cookies/store
        setCookie('projectIsNow', false, 'h12')
        this.$store.dispatch('ToggleProjectIsNow', false)
      },
      // 新增方案(√)
      handleAddCurrentProject() {
        console.log('新增方案')
        this.projectFrom = {
          name: '',
          amount: 0,
          companyName: "",
          contact: "",
          customerName: "",
          phone: "",
          projectDetailList: [],
          remark: ""
        },
        this.show('dialog-model-projectFrom')
      },
      // 编辑方案(√)
      handleEditCurrentProject() {
        this.projectFrom = JSON.parse(localStorage.getItem('currentProject'))
        this.show('dialog-model-projectFrom')
      },
      // 删除方案(√)
      handleDeleteCurrentProject() {
        console.log('删除方案')
        this.$confirm('是否删除【'+this.currentProject.name+'】方案', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delCookie('projectId')
          this._getdelProject(this.currentProject.id)
        }).catch(() => {
          this.$message({
            offset: '120',
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 删除确定(√)
      _getdelProject(ids) {
        delProject(ids).then(res => {
          if (res.status == 200) {
            this.$message({
        offset: '120',
              message: '删除成功',
              type: 'success'
            })
            this.handleExitCurrentProject()
          } else if (res.status == 500) {
            this.$message({
              offset: '120',
              type: 'warning',
              message: res.message
            })
          }
        })
      },
      // 保存方案(√)
      handleSaveProject(type, formName) {
        console.log('保存方案')
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = this.projectFrom
            console.log('提交保存参数', params)
            // this.addSaveLoading = true

            if(this.projectIsNow || this.projectFrom.id) {  // 编辑
              // TODO
              params.projectDetailList = JSON.parse(localStorage.getItem('currentProject')).projectDetailList
              console.log(params)
              editProject(params).then(res => {
                if (res.status == 200) {
                  this.$message({
        offset: '120',
                    message: '编辑成功',
                    type: 'success'
                  })

                  this.$refs[formName].resetFields()
                  this.hide(type)
                  this.hide('dialog-model-project')

                  // 选中新增的方案
                  this.handleDblclick(res.data)
                } else {
                  this.$message({
        offset: '120',
                    type: 'error',
                    message: res.message
                  })
                }
                this.addSaveLoading = false
              })
            }else {  // 新增
              addProject(params).then(res => {
                if (res.status == 200) {
                  this.$message({
                    offset: '120',
                    message: '添加成功',
                    type: 'success'
                  })

                  this.$refs[formName].resetFields()
                  this.hide(type)
                  this.hide('dialog-model-project')

                  // 选中新增的方案
                  this.handleDblclick(res.data)
                } else {
                  this.$message({
                    offset: '120',
                    type: 'error',
                    message: res.message
                  })
                }
                this.addSaveLoading = false
              })
            }

          }else {
            this.$message({
              offset: '120',
              type: 'warning',
              message: '请完善信息'
            })
            this.addSaveLoading = false
            return false;
          }
        })
      },
      // 取消方案(√)
      handleCancelProject(type, formName) {
        this.$message('已取消')
        this.$refs[formName].resetFields()
        this.hide(type)
      },


    },
    watch: {
      projectIsNow: function(val1, val2) {
        console.log(val1, val2)
      }
    }
}
</script>

<style lang="scss" scoped>
#headerWarp {
    position: fixed;
    top: 0px;
    // z-index: 2999;
    width: 100%;
    color: #fff;
    .header {
      height: 60px;
      background: #332c2b;
      .userinfo {
          text-align: right;
          padding-right: 35px;
          float: right;
          line-height: 60px;
          .userinfoItem {
              cursor: pointer;
              margin-left: 30px;
              color: #fafafa;
          }

          .userinfo-inner {
              cursor: pointer;
              color: #fff;
              img {
                  width: 40px;
                  height: 40px;
                  border-radius: 20px;
                  margin: 20px 0px 20px 10px;
                  float: right;
              }
          }
      }
      .logo {
          height: 60px;
          font-size: 22px;
          line-height: 78px;
          padding-left: 20px;
          padding-right: 20px;
          text-align: left;
          float: left;
          img {
              display: inline-block;
              vertical-align: top;
              height: 38px;
              margin: 11px 21px;
          }
          .txt {
              color: #fff;
          }
      }
      .tools {
          padding: 0px 23px;
          width: 14px;
          height: 60px;
          line-height: 60px;
          cursor: pointer;
      }


      .wt_menu {
        display: inline-block;
      }

    }
}
</style>
