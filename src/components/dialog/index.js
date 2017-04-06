/**
 * Created by alex on 2017/3/13.
 */
import sDialog from './showDialog';

sDialog.install = function(Vue) {
  Vue.component(sDialog.name, sDialog);
};

export default sDialog;
