import Alert from "./components/alert";
import Audio from "./components/audio";
import Badge from "./components/badge";
import {Breadcrumb, BreadcrumbItem} from "./components/breadcrumb"
import {Button, ButtonGroup} from "./components/button";
import Card from "./components/card";
import {Carousel, CarouselItem} from "./components/carousel";
import {Collapse, CollapseItem} from "./components/collapse";

const components = [
    Alert,
    Badge,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    ButtonGroup,
    Card,
    Carousel,
    CarouselItem,
    Collapse,
    CollapseItem
];

const install = function(Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component);
  });

  Vue.prototype.$audio = Audio;
}

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Alert,
  Audio,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  Card,
  Carousel,
  CarouselItem,
  Collapse,
  CollapseItem
}