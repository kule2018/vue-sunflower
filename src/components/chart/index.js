/**
 * Created by alex on 2017/3/27.
 */
import sChart from './src/chart';

sChart.install = function(Vue) {
  Vue.component(sChart.name, sChart);
};

export default sChart;
