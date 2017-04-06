import sFormItem from '../form/src/form-item';

/* istanbul ignore next */
sFormItem.install = function(Vue) {
  Vue.component(sFormItem.name, sFormItem);
};

export default sFormItem;
