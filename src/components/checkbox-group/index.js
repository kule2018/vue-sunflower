import sCheckboxGroup from '../checkbox/src/checkbox-group.vue';

/* istanbul ignore next */
sCheckboxGroup.install = function(Vue) {
  Vue.component(sCheckboxGroup.name, sCheckboxGroup);
};

export default sCheckboxGroup;
