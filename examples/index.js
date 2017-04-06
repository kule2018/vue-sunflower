import Vue from "vue"
import VueRouter from "vue-router";
import App from "./app";
import Sunflower from "../dist/sunflower";

Vue.use(VueRouter);
Vue.use(Sunflower);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      component: require("./components/alert"),
    }
  ]
});

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
