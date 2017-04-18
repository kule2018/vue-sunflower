import Picker from '../Picker';
import DatePanel from '../panel/Date';
import DateRangePanel from '../panel/Date-range';

const getPanel = function(type) {
  if (type === 'daterange' || type === 'datetimerange') {
    return DateRangePanel;
  }
  return DatePanel;
};

export default {
  mixins: [Picker],

  name: 'SDatePicker',

  props: {
    type: {
      type: String,
      default: 'date'
    }
  },

  created() {
    this.panel = getPanel(this.type);
  }
};
