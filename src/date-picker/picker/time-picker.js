import Picker from '../Picker';
import TimePanel from '../panel/Time';
import TimeRangePanel from '../panel/Time-range';

export default {
  mixins: [Picker],

  name: 'STimePicker',

  props: {
    isRange: Boolean
  },

  data() {
    return {
      type: ''
    };
  },

  created() {
    this.type = this.isRange ? 'timerange' : 'time';
    this.panel = this.isRange ? TimeRangePanel : TimePanel;
  }
};
