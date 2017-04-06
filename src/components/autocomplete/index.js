import sAutocomplete from './src/autocomplete';

sAutocomplete.install = function(Vue) {
  Vue.component(sAutocomplete.name, sAutocomplete);
};

export default sAutocomplete;
