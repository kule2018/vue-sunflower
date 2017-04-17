import Alert from "./alert";
import Axios from "./ajax";
import Badge from "./badge";
import Box from "./box";
import {Breadcrumb, BreadcrumbItem} from "./breadcrumb";
import {Button, ButtonGroup} from "./button";
import Card from "./card";

const components = [
    Alert,
    Badge,
    Box,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    ButtonGroup,
    Card
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
  Alert,
  Axios,
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  Card
}
