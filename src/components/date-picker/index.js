import sDatePicker from './src/picker/date-picker';

sDatePicker.install = function install(Vue) {
  Vue.component(sDatePicker.name, sDatePicker);
};

export default sDatePicker;
