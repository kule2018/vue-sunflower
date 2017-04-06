/**
 * Created by YOU on 2017/3/27.
 */
import SearchGroup from './src/main';

/* istanbul ignore next */
SearchGroup.install = function(Vue) {
  Vue.component(SearchGroup.name, SearchGroup);
};

export default SearchGroup;
