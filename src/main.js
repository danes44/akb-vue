import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/bootstrap-vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import './plugins/vuelidate'

Vue.config.productionTip = false

//make alias for axios and api
Vue.prototype.$http = axios;
Vue.prototype.$api = 'http://127.0.0.1:8000/api';

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
