import Picker from '../Picker';
import Panel from '../panel/Time-select';

export default {
  mixins: [Picker],

  name: 'STimeSelect',

  beforeCreate() {
    this.type = 'time-select';
    this.panel = Panel;
  }
};
