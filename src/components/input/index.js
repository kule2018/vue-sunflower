import sInput from './src/input';

sInput.install = function(Vue) {
  Vue.component(sInput.name, sInput);
};

export default sInput;
