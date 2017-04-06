/**
 * Created by YOU on 2017/3/24.
 */
import Box from './src/main';

/* istanbul ignore next */
Box.install = function(Vue) {
  Vue.component(Box.name, Box);
};

export default Box;
