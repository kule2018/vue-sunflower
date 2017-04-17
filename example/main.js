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
      path: "/ajax",
      component: require("./Ajax")
    },
    {
      path: "/breadcrumb",
      component: require("./Breadcrumb")
    },
    {
      path: "/button",
      component: require("./Button")
    }
  ]
});

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});