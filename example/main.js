import Vue from "vue";
import VueRouter from "vue-router";
import Sunflower from "../src/";
import App from "./App";

Vue.use(VueRouter);
Vue.use(Sunflower);


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