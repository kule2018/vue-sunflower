import Vue from "vue";
import VueRouter from "vue-router";
import Sunflower from "../src/";
import App from "./App";
import Hljs from "./hljs"

Vue.use(VueRouter);
Vue.use(Sunflower);
Vue.use(Hljs);

const router = new VueRouter({
  routes: [
    {
      path: "/breadcrumb",
      component: require("./breadcrumb")
    }
  ]
});

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});