import Vue from 'vue'
import App from './App.vue'

import router from './router';
import store from "./store";
import { Button, Switch } from 'mint-ui'
//import filters from "./utils/filters";
import directives from "./utils/directives";

Vue.component(Button.name, Button);
Vue.component(Switch.name, Switch);

//Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
Object.keys(directives).forEach(k => Vue.directive(k, directives[k]));


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
