import sCascader from './src/main';

sCascader.install = function(Vue) {
  Vue.component(sCascader.name, sCascader);
};

export default sCascader;
