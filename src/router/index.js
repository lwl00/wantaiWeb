import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import userLayout from '../views/user/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    roles: 'system:roles:read'   原本为roles: 'admin'访问菜单，
                                 改造后为权限'system:roles:read'访问，此后src/permission下roles表示权限
}
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/Login'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'User',
    meta: { title: '个人中心', icon: 'example' },
    children: [
      {
        path: '/user/index',
        component: userLayout,
        redirect: '/user/account',
        name: 'Index',
        component: () => import('@/views/user/Layout'),
        meta: { title: '个人中心', icon: '' },
        children: [
          {
            path: '/user/account',
            name: 'Account',
            component: () => import('@/views/user/Account'),
            meta: { title: '个人中心', icon: '', defaultActive: '1' },
          },
          {
            path: '/user/project/list',
            name: 'ProjectList',
            component: () => import('@/views/user/ProjectList'),
            meta: { title: '方案管理', icon: '', defaultActive: '2' },
          },
          {
            path: '/user/project/detail',
            name: 'ProjectDetail',
            component: () => import('@/views/user/ProjectDetail'),
            meta: { title: '方案详情', icon: '', defaultActive: '3' },
            hidden: true,
          },
          {
            path: '/user/modifypassword',
            name: 'ModifyPassword',
            component: () => import('@/views/user/ModifyPassword'),
            meta: { title: '修改密码', icon: '', defaultActive: '4' },
          }
        ],
      },

    ]
  },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       name: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       meta: { title: '首页', icon: 'shouye', noCache: true, affix: true },
  //       alwaysShow: true
  //     },
  //   ]
  // },
  {
    path: '',
    component: Layout,
    redirect: '/product',
    name: 'Product',
    meta: { title: '产品', icon: '' },
    children: [
      {
        path: '/product',
        name: 'ProductNormal',
        component: () => import('@/views/product/normal/List'),
        meta: { title: '产品库', icon: '', defaultActive: '1' },
        children: [],
      },
      {
        path: '/product/detail',
        name: 'ProductDetail',
        component: () => import('@/views/product/normal/Detail'),
        meta: { title: '产品详情', icon: '', defaultActive: '2' },
        children: [],
        hidden: true,
      },

      {
        path: '/product/discount',
        name: 'ProductDiscount',
        component: () => import('@/views/product/discount/List'),
        meta: { title: '折扣专区', icon: '', defaultActive: '3' },
        children: [],
      },

      {
        path: '/space',
        name: 'SpaceList',
        component: () => import('@/views/space/List'),
        meta: { title: '空间搭配', icon: '', defaultActive: '4' },
        children: [],
      },
      {
        path: '/space/detail',
        name: 'SpaceDetail',
        component: () => import('@/views/space/Detail'),
        meta: { title: '空间详情', icon: '', defaultActive: '5' },
        children: [],
        hidden: true,
      },
      {
        path: '/cart',
        name: 'Cart',
        component: () => import('@/views/cart/index'),
        meta: { title: '购物车', icon: '', defaultActive: '6' },
        children: [],
        hidden: true,
      },
      {
        path: '/export',
        name: 'Export',
        component: () => import('@/views/export/index'),
        meta: { title: '导出方案', icon: '', defaultActive: '7' },
        children: [],
        hidden: true,
      },
    ]
  },

  // 方案管理
  {
    path: '/project',
    component: Layout,
    redirect: '/project/list',
    name: 'Project',
    meta: { title: '方案管理', icon: 'link'},
    children: [
      {
        path: '/project/list',
        name: 'ProjectList',
        component: () => import('@/views/project/List'),
        meta: { title: '方案管理', icon: '' }
      },
      {
        path: '/project/detail',
        name: 'ProjectDetail',
        component: () => import('@/views/project/Detail'),
        meta: { title: '方案详情', icon: '' },
        hidden: true
      },
    ]
  },


]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
