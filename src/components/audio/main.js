import Vue from 'vue';
let AudioConstructor = Vue.extend(require('./audio.vue'));


let instance = null;
let oldOptions = {};

let Audio = function(options) {

  if (Vue.prototype.$isServer) return;
  options = options || {};
  if(instance === null){
    instance = new AudioConstructor({
      data: options
    });
    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el);
  } else {
      if(oldOptions.src !== options.src){
        instance.vm.load(options.src);
      }
      if(oldOptions.show !== options.show) {
        instance.vm.showOrHide(options.show);
      }
  }
  oldOptions = options;
  return instance.vm;
};

export default Audio;
