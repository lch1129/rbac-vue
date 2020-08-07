import Vue from "vue";
import "./plugins/axios";
import ElementUI from "element-ui"; //element-ui的全部组件
import "../node_modules/element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;


Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
