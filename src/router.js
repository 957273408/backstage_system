import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login.vue'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: login
    },
    {
      path: '/layout',
      name: 'home',
      component: reslove => require(['./views/layout/layout'], reslove),
      children: [{
        path: 'users',
        component: reslove => require(['./views/users/users'], reslove),
      }]
    }
  ]
})