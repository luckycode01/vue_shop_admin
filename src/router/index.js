import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "首页",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "el-icon-s-home" }
      }
    ]
  },
  {
    name: "Acl",
    path: "/acl",
    component: Layout,
    redirect: "/acl/user/list",
    meta: {
      title: "权限管理",
      icon: "el-icon-lock"
    },
    children: [
      {
        path: "/user/list",
        name: "user",
        component: () => import("@/views/acl/user"),
        meta: { title: "用户列表", icon: "el-icon-s-custom" }
      },
      {
        path: "/right/list",
        name: "right",
        component: () => import("@/views/acl/rights"),
        meta: { title: "权限列表", icon: "el-icon-s-promotion" }
      },
      {
        path: "/roles/list",
        name: "roles",
        component: () => import("@/views/acl/roles"),
        meta: { title: "角色列表", icon: "el-icon-s-grid" }
      }
    ]
  },
  {
    name: "goods",
    path: "/goods",
    component: Layout,
    redirect: "/goods/goodslist/list",
    meta: {
      title: "商品管理",
      icon: "el-icon-s-goods"
    },
    children: [
      {
        path: "/goodslist/list",
        name: "goodslist",
        component: () => import("@/views/goods/goodsList"),
        meta: { title: "商品列表", icon: "el-icon-menu" }
      },
      {
        path: "/goodslist/add",
        name: "add",
        component: () => import("@/views/goods/goodsList/add"),
        meta: { title: "添加商品", icon: "el-icon-menu" }
      },
      {
        path: "params/list",
        name: "params",
        component: () => import("@/views/goods/params"),
        meta: { title: "分类参数", icon: "el-icon-s-data" }
      },
      {
        path: "/category/list",
        name: "category",
        component: () => import("@/views/goods/category"),
        meta: { title: "商品分类", icon: "el-icon-share" }
      }
    ]
  },
  {
    name: "order",
    path: "/order",
    component: Layout,
    redirect: "/order/list",
    meta: {
      title: "订单管理",
      icon: "el-icon-s-order"
    },
    children: [
      {
        path: "/orderlist",
        name: "orderlist",
        component: () => import("@/views/order/orderList"),
        meta: { title: "订单列表", icon: "el-icon-s-order" }
      },
      {
        path: "/detail",
        name: "detail",
        component: () => import("@/views/order/detail"),
        meta: { title: "订单详情", icon: "el-icon-s-data" }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
