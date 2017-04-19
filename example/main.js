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
    { path: "/ajax", component: require("./Ajax") },
    { path: "/alert", component: require("./Alert") },
    { path: "/badge", component: require("./Badge") },
    { path: "/box", component: require("./Box") },
    { path: "/breadcrumb", component: require("./Breadcrumb") },
    { path: "/button", component: require("./Button") },
    { path: "/card", component: require("./Card") },
    { path: "/carousel", component: require("./Carousel") },
    { path: "/cascader", component: require("./Cascader") },
    { path: "/checkbox", component: require("./Checkbox") },
    { path: "/collapse", component: require("./Collapse") },
    { path: "/date-picker", component: require("./Date-picker") },
    { path: "/dialog", component: require("./Dialog") },
    { path: "/dropdown", component: require("./Dropdown") },
    { path: "/form", component: require("./Form") },
    { path: "/grid", component: require("./Grid") },
    { path: "/input", component: require("./Input") },
    { path: "/input-number", component: require("./Input-number") },
    { path: "/scrollbar", component: require("./Scrollbar") },
    { path: "/switch", component: require("./Switch") },
    { path: "/time-picker", component: require("./Time-picker") },
    { path: "/time-select", component: require("./Time-select") }
  ]
});

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});