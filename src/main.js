import Vue from 'vue'
import App from './App.vue'

import router from './router';
import store from "./store";

// import './styles/common.less'
import { Button, Switch } from 'mint-ui'

Vue.component(Button.name, Button);
Vue.component(Switch.name, Switch);



Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
