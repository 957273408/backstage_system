import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import breadcrumb from "./views/layout/components/Breadcrumb";
Vue.config.productionTip = false
Vue.use(Element)
Vue.component(
  'breadcrumb',breadcrumb
)

axios.interceptors.request.use(function (config) {
  if (localStorage.mycode) {
    config.headers['Authorization'] = localStorage.mycode
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (res) {
  if (res.data.meta.status === 400) {
    router.push('/')
  }
  return res;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});



axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
Vue.prototype.$axios = axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')