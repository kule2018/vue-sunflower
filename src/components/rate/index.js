/**
 * Created by alex on 2017/3/16.
 */
import Rate from './src/rate';

/* istanbul ignore next */
Rate.install = function(Vue) {
  Vue.component(Rate.name, Rate);
};

export default Rate;
