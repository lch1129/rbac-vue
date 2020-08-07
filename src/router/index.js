import Vue from "vue";
import VueRouter from "vue-router";
import UI from "../views/UI.vue";
import Login from "../views/Login.vue";
import Page404 from "@/views/Page404";
import UserManage from "../views/user/UserManage.vue";
import RoleManage from "../views/role/RoleManage.vue";
import MenuManage from "../views/menu/MenuManage.vue";

Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "*",
    name: "Page404",
    component: Page404
  },
  {
    path: "/main",
    name: "系统管理",
    component: UI,
    meta: {
      loginRequest: true
    },
    redirect: "/UserManage",
    children: [
      {
        path: "/UserManage",
        name: "用户管理",
        component: UserManage,
        meta: {
          loginRequest: true
        }
      },
      {
        path: "/RoleManage",
        name: "角色管理",
        component: RoleManage,
        meta: {
          loginRequest: true
        }
      },
      {
        path: "/MenuManage",
        name: "菜单管理",
        component: MenuManage,
        meta: {
          loginRequest: true
        }
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

router.beforeEach((to, from, next) => {
  if (to.meta.loginRequest) {
    if (sessionStorage.getItem('Authorization') == null) {
      next({
        path: "/"
      });
    } else {
      /* console.log(to.path); */
      if(sessionStorage.getItem('menuAddressArr').includes(to.path)){
        next();
      }else{
        next({
          path: "*"
        });
      }
    }
  } else {
    next();
  }
});
