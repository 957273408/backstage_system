import Vue from "vue";
import Router from "vue-router";
import login from "./views/login.vue";

Vue.use(Router);
const router = new Router({
  routes: [{
      path: "/",
      name: "home",
      component: login,
      meta: {
        unrequery: true
      }
    },
    {
      path: "/layout",
      name: "layout",
      component: reslove => require(["./views/layout/layout"], reslove),
      children: [{
        path: "users",
        name: 'users',
        component: reslove => require(["./views/layout/users/users"], reslove)
      }, {
        path: "roles",
        name: 'roles',
        component: () => import('./views/layout/roles/roles')
      }, {
        path: "rights",
        name: 'rights',
        component: () => import('./views/layout/rights/rights')
      }]
    },
  ]
});
router.beforeEach((to, from, next) => {
  if (to.meta.unrequery) {
    return next();
  }
  if (localStorage.mycode) {
    return next();
  }
  next('/')
});
export default router;