import Alert from "./alert";
import Axios from "./ajax";
import Badge from "./badge";
import Box from "./box";
import {Breadcrumb, BreadcrumbItem} from "./breadcrumb";
import {Button, ButtonGroup} from "./button";
import Card from "./card";
import {Carousel, CarouselItem} from "./carousel";
import Cascader from "./cascader";
import {Checkbox, CheckboxGroup} from "./checkbox";
import {Collapse, CollapseItem} from "./collapse";
import {DatePicker, TimePicker, TimeSelect} from "./date-picker";
import Dialog from "./dialog";
import Input from "./input";
import Scrollbar from "./scrollbar";
import Switch from "./switch";

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
    Checkbox,
    CheckboxGroup,
    Collapse,
    CollapseItem,
    DatePicker,
    Dialog,
    Input,
    Scrollbar,
    Switch,
    TimePicker,
    TimeSelect
];

const install = function(Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component);
  });
  Vue.prototype.$audio = Audio
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
  Checkbox,
  CheckboxGroup,
  Collapse,
  CollapseItem,
  DatePicker,
  Dialog,
  Input,
  Scrollbar,
  Switch,
  TimePicker,
  TimeSelect
}
