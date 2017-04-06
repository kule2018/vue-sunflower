/**
 * Created by YOU on 2017/4/5.
 */

import TableTree from './src/main';

/* istanbul ignore next */
TableTree.install = function(Vue) {
  Vue.component(TableTree.name, TableTree);
};

export default TableTree;
