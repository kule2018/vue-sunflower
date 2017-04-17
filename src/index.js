import Axios from "./ajax";
import {Breadcrumb, BreadcrumbItem} from "./breadcrumb";
import {Button, ButtonGroup} from "./button";

const components = [
    Breadcrumb,
    BreadcrumbItem,
    Button,
    ButtonGroup
];

const install = function(Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Axios,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup
}
