import Alert from "./alert";
import Axios from "./ajax";
import Badge from "./badge";
import Box from "./box";
import {Breadcrumb, BreadcrumbItem} from "./breadcrumb";
import {Button, ButtonGroup} from "./button";
import Card from "./card";
import {Carousel, CarouselItem} from "./carousel";
import Cascader from "./cascader";
import Input from "./input";

const components = [
    Alert,
    Badge,
    Box,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    ButtonGroup,
    Card,
    Carousel,
    CarouselItem,
    Cascader,
    Input
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
  Card,
  Carousel,
  CarouselItem,
  Cascader,
  Input
}
