import Picker from '../picker';
import DatePanel from '../panel/date';
import DateRangePanel from '../panel/date-range';

const getPanel = function(type) {
  if (type === 'daterange' || type === 'datetimerange') {
    return DateRangePanel;
  }
  return DatePanel;
};

export default {
  mixins: [Picker],

  name: 'sDatePicker',

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
