import sForm from './src/form';

/* istanbul ignore next */
sForm.install = function(Vue) {
  Vue.component(sForm.name, sForm);
};

export default sForm;
