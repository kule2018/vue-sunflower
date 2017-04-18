<template>
  <s-input
    class="s-date-editor"
    :class="'s-date-editor-' + type"
    :readonly="!editable || readonly"
    :disabled="disabled"
    :size="size"
    v-clickoutside="handleClose"
    :placeholder="placeholder"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown.native="handleKeydown"
    :value="displayValue"
    @change.native="displayValue = $event.target.value"
    :validateEvent="false"
    ref="reference">
    <i slot="icon"
      class="s-input-icon"
      @click="handleClickIcon"
      :class="[showClose ? 's-icon-close' : triggerClass]"
      @mouseenter="handleMouseEnterIcon"
      @mouseleave="showClose = false"
      v-if="haveTrigger">
    </i>
  </s-input>
</template>

<script>
import Vue from 'vue';
import Clickoutside from '../extra/utils/clickoutside';
import { formatDate, parseDate, getWeekNumber, equalDate, isDate } from './util';
import Popper from '../extra/utils/vue-popper';
import Emitter from '../extra/mixins/emitter';
import SInput from '../input';

const NewPopper = {
  props: {
    appendToBody: Popper.props.appendToBody,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeDestroy: Popper.beforeDestroy
};

let RANGE_SEPARATOR = ' - ';
const DEFAULT_FORMATS = {
  date: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  time: 'HH:mm:ss',
  timerange: 'HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  datetimerange: 'yyyy-MM-dd HH:mm:ss',
  year: 'yyyy'
};
const HAVE_TRIGGER_TYPES = [
  'date',
  'datetime',
  'time',
  'time-select',
  'week',
  'month',
  'year',
  'daterange',
  'timerange',
  'datetimerange'
];
const DATE_FORMATTER = function(value, format) {
  return formatDate(value, format);
};
const DATE_PARSER = function(text, format) {
  return parseDate(text, format);
};
const RANGE_FORMATTER = function(value, format) {
  if (Array.isArray(value) && value.length === 2) {
    const start = value[0];
    const end = value[1];

    if (start && end) {
      return formatDate(start, format) + RANGE_SEPARATOR + formatDate(end, format);
    }
  }
  return '';
};
const RANGE_PARSER = function(text, format) {
  const array = text.split(RANGE_SEPARATOR);
  if (array.length === 2) {
    const range1 = array[0];
    const range2 = array[1];

    return [parseDate(range1, format), parseDate(range2, format)];
  }
  return [];
};
const TYPE_VALUE_RESOLVER_MAP = {
  default: {
    formatter(value) {
      if (!value) return '';
      return '' + value;
    },
    parser(text) {
      if (text === undefined || text === '') return null;
      return text;
    }
  },
  week: {
    formatter(value) {
      if (value instanceof Date) {
        const weekNumber = getWeekNumber(value);
        return value.getFullYear() + 'w' + (weekNumber > 9 ? weekNumber : '0' + weekNumber);
      }
      return value;
    },
    parser(text) {
      const array = (text || '').split('w');
      if (array.length === 2) {
        const year = Number(array[0]);
        const month = Number(array[1]);

        if (!isNaN(year) && !isNaN(month) && month < 54) {
          return text;
        }
      }
      return null;
    }
  },
  date: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  datetime: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  daterange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  datetimerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  timerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  time: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  month: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  year: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  number: {
    formatter(value) {
      if (!value) return '';
      return '' + value;
    },
    parser(text) {
      let result = Number(text);

      if (!isNaN(text)) {
        return result;
      } else {
        return null;
      }
    }
  }
};
const PLACEMENT_MAP = {
  left: 'bottom-start',
  center: 'bottom-center',
  right: 'bottom-end'
};

export default {
  mixins: [Emitter, NewPopper],

  props: {
    size: String,
    format: String,
    readonly: Boolean,
    placeholder: String,
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    popperClass: String,
    editable: {
      type: Boolean,
      default: true
    },
    align: {
      type: String,
      default: 'left'
    },
    value: {},
    rangeSeparator: {
      default: ' - '
    },
    pickerOptions: {}
  },

  components: { SInput },

  directives: { Clickoutside },

  data() {
    return {
      pickerVisible: false,
      showClose: false,
      currentValue: ''
    };
  },

  watch: {
    pickerVisible(val) {
      if (!val) this.dispatch('sFormItem', 'el.form.blur');
      if (this.readonly || this.disabled) return;
      val ? this.showPicker() : this.hidePicker();
    },
    currentValue(val) {
      if (val) return;
      if (this.picker && typeof this.picker.handleClear === 'function') {
        this.picker.handleClear();
      } else {
        this.$emit('input');
      }
    },
    value: {
      immediate: true,
      handler(val) {
        this.currentValue = isDate(val) ? new Date(val) : val;
      }
    },
    displayValue(val) {
      this.$emit('change', val);
      this.dispatch('sFormItem', 'el.form.change');
    }
  },

  computed: {
    reference() {
      return this.$refs.reference.$el;
    },

    refInput() {
      if (this.reference) return this.reference.querySelector('input');
      return {};
    },

    valueIsEmpty() {
      const val = this.currentValue;
      if (Array.isArray(val)) {
        for (let i = 0, len = val.length; i < len; i++) {
          if (val[i]) {
            return false;
          }
        }
      } else {
        if (val) {
          return false;
        }
      }
      return true;
    },

    triggerClass() {
      return this.type.indexOf('time') !== -1 ? 's-icon-time' : 's-icon-date';
    },

    selectionMode() {
      if (this.type === 'week') {
        return 'week';
      } else if (this.type === 'month') {
        return 'month';
      } else if (this.type === 'year') {
        return 'year';
      }

      return 'day';
    },

    haveTrigger() {
      if (typeof this.showTrigger !== 'undefined') {
        return this.showTrigger;
      }
      return HAVE_TRIGGER_TYPES.indexOf(this.type) !== -1;
    },

    displayValue: {
      get() {
        const value = this.currentValue;
        if (!value) return;
        const formatter = (
          TYPE_VALUE_RESOLVER_MAP[this.type] ||
          TYPE_VALUE_RESOLVER_MAP['default']
        ).formatter;
        const format = DEFAULT_FORMATS[this.type];

        return formatter(value, this.format || format);
      },

      set(value) {
        if (value) {
          const type = this.type;
          const parser = (
            TYPE_VALUE_RESOLVER_MAP[type] ||
            TYPE_VALUE_RESOLVER_MAP['default']
          ).parser;
          const parsedValue = parser(value, this.format || DEFAULT_FORMATS[type]);

          if (parsedValue && this.picker) {
            this.picker.value = parsedValue;
          }
        } else {
          this.picker.value = value;
        }
        this.$forceUpdate();
      }
    }
  },

  created() {
    RANGE_SEPARATOR = this.rangeSeparator;
    // vue-popper
    this.popperOptions = {
      boundariesPadding: 0,
      gpuAcceleration: false
    };
    this.placement = PLACEMENT_MAP[this.align] || PLACEMENT_MAP.left;
  },

  methods: {
    handleMouseEnterIcon() {
      if (this.readonly || this.disabled) return;
      if (!this.valueIsEmpty && this.clearable) {
        this.showClose = true;
      }
    },

    handleClickIcon() {
      if (this.readonly || this.disabled) return;
      if (this.showClose) {
        this.currentValue = '';
        this.showClose = false;
      } else {
        this.pickerVisible = !this.pickerVisible;
      }
    },

    dateChanged(dateA, dateB) {
      if (Array.isArray(dateA)) {
        let len = dateA.length;
        if (!dateB) return true;
        while (len--) {
          if (!equalDate(dateA[len], dateB[len])) return true;
        }
      } else {
        if (!equalDate(dateA, dateB)) return true;
      }

      return false;
    },

    handleClose() {
      this.pickerVisible = false;
    },

    handleFocus() {
      const type = this.type;

      if (HAVE_TRIGGER_TYPES.indexOf(type) !== -1 && !this.pickerVisible) {
        this.pickerVisible = true;
      }
      this.$emit('focus', this);
    },

    handleBlur() {
      this.$emit('blur', this);
    },

    handleKeydown(event) {
      const keyCode = event.keyCode;

      // tab
      if (keyCode === 9) {
        this.pickerVisible = false;
      }
    },

    hidePicker() {
      if (this.picker) {
        this.picker.resetView && this.picker.resetView();
        this.pickerVisible = this.picker.visible = false;
        this.destroyPopper();
      }
    },

    showPicker() {
      if (this.$isServer) return;
      if (!this.picker) {
        this.panel.defaultValue = this.currentValue;
        this.picker = new Vue(this.panel).$mount(document.createElement('div'));
        this.picker.popperClass = this.popperClass;
        this.popperElm = this.picker.$el;
        this.picker.width = this.reference.getBoundingClientRect().width;
        this.picker.showTime = this.type === 'datetime' || this.type === 'datetimerange';
        this.picker.selectionMode = this.selectionMode;
        if (this.format) {
          this.picker.format = this.format;
        }

        const updateOptions = () => {
          const options = this.pickerOptions;

          if (options && options.selectableRange) {
            let ranges = options.selectableRange;
            const parser = TYPE_VALUE_RESOLVER_MAP.datetimerange.parser;
            const format = DEFAULT_FORMATS.timerange;

            ranges = Array.isArray(ranges) ? ranges : [ranges];
            this.picker.selectableRange = ranges.map(range => parser(range, format));
          }

          for (const option in options) {
            if (options.hasOwnProperty(option) &&
                // 忽略 time-picker 的该配置项
                option !== 'selectableRange') {
              this.picker[option] = options[option];
            }
          }
        };
        updateOptions();
        this.$watch('pickerOptions', () => updateOptions(), { deep: true });

        this.$el.appendChild(this.picker.$el);
        this.pickerVisible = this.picker.visible = true;
        this.picker.resetView && this.picker.resetView();

        this.picker.$on('dodestroy', this.doDestroy);
        this.picker.$on('pick', (date, visible = false) => {
          this.$emit('input', date);
          this.pickerVisible = this.picker.visible = visible;
          this.picker.resetView && this.picker.resetView();
        });

        this.picker.$on('select-range', (start, end) => {
          this.refInput.setSelectionRange(start, end);
          this.refInput.focus();
        });
      } else {
        this.pickerVisible = this.picker.visible = true;
      }

      this.updatePopper();

      if (this.currentValue instanceof Date) {
        this.picker.date = new Date(this.currentValue.getTime());
      } else {
        this.picker.value = this.currentValue;
      }
      this.picker.resetView && this.picker.resetView();

      this.$nextTick(() => {
        this.picker.ajustScrollTop && this.picker.ajustScrollTop();
      });
    }
  }
};
</script>
<style>
  .s-date-table {
    font-size: 12px;
    min-width: 224px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }

  .s-date-table td {
    width: 32px;
    height: 32px;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer
  }

  .s-date-table td.next-month,.s-date-table td.prev-month {
    color: #ddd
  }

  .s-date-table td.today {
    color: #20a0ff;
    position: relative
  }

  .s-date-table td.today:before {
    content: " ";
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-top: .5em solid #20a0ff;
    border-left: .5em solid transparent
  }

  .s-date-table td.available:hover {
    background-color: #e4e8f1
  }

  .s-date-table td.in-range {
    background-color: #d2ecff
  }

  .s-date-table td.in-range:hover {
    background-color: #afddff
  }

  .s-date-table td.current:not(.disabled),.s-date-table td.end-date,.s-date-table td.start-date {
    background-color: #20a0ff!important;
    color: #fff
  }

  .s-date-table td.disabled {
    background-color: #f4f4f4;
    opacity: 1;
    cursor: not-allowed;
    color: #ccc
  }

  .s-date-table td.week {
    font-size: 80%;
    color: #8391a5
  }

  .s-date-table th {
    padding: 5px;
    color: #8391a5;
    font-weight: 400
  }

  .s-date-table.is-week-mode .s-date-table-row:hover {
    background-color: #e4e8f1
  }

  .s-date-table.is-week-mode .s-date-table-row.current {
    background-color: #d2ecff
  }

  .s-month-table {
    font-size: 12px;
    margin: -1px;
    border-collapse: collapse
  }

  .s-month-table td {
    text-align: center;
    padding: 20px 3px;
    cursor: pointer
  }

  .s-month-table td .cell {
    width: 48px;
    height: 32px;
    display: block;
    line-height: 32px;
    color: #48576a
  }

  .s-month-table td .cell:hover {
    background-color: #e4e8f1
  }

  .s-month-table td.disabled .cell {
    background-color: #f4f4f4;
    cursor: not-allowed;
    color: #ccc
  }

  .s-month-table td.current:not(.disabled) .cell {
    background-color: #20a0ff!important;
    color: #fff
  }

  .s-year-table {
    font-size: 12px;
    margin: -1px;
    border-collapse: collapse
  }

  .s-year-table .s-icon {
    color: #97a8be
  }

  .s-year-table td {
    text-align: center;
    padding: 20px 3px;
    cursor: pointer
  }

  .s-year-table td .cell {
    width: 48px;
    height: 32px;
    display: block;
    line-height: 32px;
    color: #48576a
  }

  .s-year-table td .cell:hover {
    background-color: #e4e8f1
  }

  .s-year-table td.disabled .cell {
    background-color: #f4f4f4;
    cursor: not-allowed;
    color: #ccc
  }

  .s-year-table td.current:not(.disabled) .cell {
    background-color: #20a0ff!important;
    color: #fff
  }

  .s-date-range-picker {
    min-width: 520px
  }

  .s-date-range-picker table {
    table-layout: fixed;
    width: 100%
  }

  .s-date-range-picker .s-picker-panel-body {
    min-width: 513px
  }

  .s-date-range-picker .s-picker-panel-content {
    margin: 0
  }

  .s-date-range-picker.has-sidebar.has-time {
    min-width: 766px
  }

  .s-date-range-picker.has-sidebar {
    min-width: 620px
  }

  .s-date-range-picker.has-time {
    min-width: 660px
  }

  .s-date-range-picker-header {
    position: relative;
    text-align: center;
    height: 28px
  }

  .s-date-range-picker-header button {
    float: left
  }

  .s-date-range-picker-header div {
    font-size: 14px;
    margin-right: 50px
  }

  .s-date-range-picker-content {
    float: left;
    width: 50%;
    box-sizing: border-box;
    margin: 0;
    padding: 16px
  }

  .s-date-range-picker-content.is-right .s-date-range-picker-header button {
    float: right
  }

  .s-date-range-picker-content.is-right .s-date-range-picker-header div {
    margin-left: 50px;
    margin-right: 50px
  }

  .s-date-range-picker-content.is-left {
    border-right: 1px solid #e4e4e4
  }

  .s-date-range-picker-editors-wrap {
    box-sizing: border-box;
    display: table-cell
  }

  .s-date-range-picker-editors-wrap.is-right {
    text-align: right
  }

  .s-date-range-picker-time-header {
    position: relative;
    border-bottom: 1px solid #e4e4e4;
    font-size: 12px;
    padding: 8px 5px 5px;
    display: table;
    width: 100%;
    box-sizing: border-box
  }

  .s-date-range-picker-time-header>.s-icon-arrow-right {
    font-size: 20px;
    vertical-align: middle;
    display: table-cell;
    color: #97a8be
  }

  .s-date-range-picker-time-picker-wrap {
    position: relative;
    display: table-cell;
    padding: 0 5px
  }

  .s-date-range-picker-time-picker-wrap .s-picker-panel {
    position: absolute;
    top: 13px;
    right: 0;
    z-index: 1;
    background: #fff
  }

  .s-time-range-picker {
    min-width: 354px;
    overflow: visible
  }

  .s-time-range-picker-content {
    position: relative;
    text-align: center;
    padding: 10px
  }

  .s-time-range-picker-cell {
    box-sizing: border-box;
    margin: 0;
    padding: 4px 7px 7px;
    width: 50%;
    display: inline-block
  }

  .s-time-range-picker-header {
    margin-bottom: 5px;
    text-align: center;
    font-size: 14px
  }

  .s-picker-panel,.s-time-range-picker-body {
    border-radius: 2px;
    border: 1px solid #d1dbe5
  }

  .s-picker-panel {
    color: #48576a;
    box-shadow: 0 2px 6px #ccc;
    background: #fff;
    line-height: 20px;
    margin: 5px 0
  }

  .s-picker-panel-body-wrapper:after,.s-picker-panel-body:after {
    content: "";
    display: table;
    clear: both
  }

  .s-picker-panel-content {
    position: relative;
    margin: 15px
  }

  .s-picker-panel-footer {
    border-top: 1px solid #e4e4e4;
    padding: 4px;
    text-align: right;
    background-color: #fff;
    position: relative
  }

  .s-picker-panel-shortcut {
    display: block;
    width: 100%;
    border: 0;
    background-color: transparent;
    line-height: 28px;
    font-size: 14px;
    color: #48576a;
    padding-left: 12px;
    text-align: left;
    outline: none;
    cursor: pointer
  }

  .s-picker-panel-shortcut:hover {
    background-color: #e4e8f1
  }

  .s-picker-panel-shortcut.active {
    background-color: #e6f1fe;
    color: #20a0ff
  }

  .s-picker-panel-btn {
    border: 1px solid #dcdcdc;
    color: #333;
    line-height: 24px;
    border-radius: 2px;
    padding: 0 20px;
    cursor: pointer;
    background-color: transparent;
    outline: none;
    font-size: 12px
  }

  .s-picker-panel-btn[disabled] {
    color: #ccc;
    cursor: not-allowed
  }

  .s-picker-panel-icon-btn {
    font-size: 12px;
    color: #97a8be;
    border: 0;
    background: transparent;
    cursor: pointer;
    outline: none;
    margin-top: 3px
  }

  .s-picker-panel-icon-btn:hover {
    color: #20a0ff
  }

  .s-picker-panel-link-btn {
    cursor: pointer;
    color: #20a0ff;
    text-decoration: none;
    padding: 15px;
    font-size: 12px
  }

  .s-picker-panel [slot=sidebar],.s-picker-panel-sidebar {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 110px;
    border-right: 1px solid #e4e4e4;
    box-sizing: border-box;
    padding-top: 6px;
    background-color: #fbfdff
  }

  .s-picker-panel [slot=sidebar]+.s-picker-panel-body,.s-picker-panel-sidebar+.s-picker-panel-body {
    margin-left: 110px
  }

  .s-date-picker {
    min-width: 254px
  }

  .s-date-picker .s-picker-panel-content {
    min-width: 224px
  }

  .s-date-picker table {
    table-layout: fixed;
    width: 100%
  }

  .s-date-picker.has-sidebar.has-time {
    min-width: 434px
  }

  .s-date-picker.has-sidebar {
    min-width: 370px
  }

  .s-date-picker.has-time {
    min-width: 324px
  }

  .s-date-picker-editor-wrap {
    position: relative;
    display: table-cell;
    padding: 0 5px
  }

  .s-date-picker-time-header {
    position: relative;
    border-bottom: 1px solid #e4e4e4;
    font-size: 12px;
    padding: 8px 5px 5px;
    display: table;
    width: 100%;
    box-sizing: border-box
  }

  .s-date-picker-header {
    margin: 12px;
    text-align: center
  }

  .s-date-picker-header-label {
    font-size: 14px;
    padding: 0 5px;
    line-height: 22px;
    text-align: center;
    cursor: pointer
  }

  .s-date-picker-header-label.active,.s-date-picker-header-label:hover {
    color: #20a0ff
  }

  .s-date-picker-prev-btn {
    float: left
  }

  .s-date-picker-next-btn {
    float: right
  }

  .s-date-picker-time-wrap {
    padding: 10px;
    text-align: center
  }

  .s-date-picker-time-label {
    float: left;
    cursor: pointer;
    line-height: 30px;
    margin-left: 10px
  }

  .time-select {
    margin: 5px 0;
    min-width: 0
  }

  .time-select .s-picker-panel-content {
    max-height: 200px;
    margin: 0
  }

  .time-select-item {
    padding: 8px 10px;
    font-size: 14px
  }

  .time-select-item.selected:not(.disabled) {
    background-color: #20a0ff;
    color: #fff
  }

  .time-select-item.selected:not(.disabled):hover {
    background-color: #20a0ff
  }

  .time-select-item.disabled {
    color: #d1dbe5;
    cursor: not-allowed
  }

  .time-select-item:hover {
    background-color: #e4e8f1;
    cursor: pointer
  }

  .fade-in-linear-enter-active,.fade-in-linear-leave-active {
    transition: opacity .2s linear
  }

  .fade-in-linear-enter,.fade-in-linear-leave,.fade-in-linear-leave-active {
    opacity: 0
  }

  .s-fade-in-enter-active,.s-fade-in-leave-active {
    transition: all .3s cubic-bezier(.55,0,.1,1)
  }

  .s-fade-in-enter,.s-fade-in-leave-active {
    opacity: 0
  }

  .s-zoom-in-center-enter-active,.s-zoom-in-center-leave-active {
    transition: all .3s cubic-bezier(.55,0,.1,1)
  }

  .s-zoom-in-center-enter,.s-zoom-in-center-leave-active {
    opacity: 0;
    transform: scaleX(0)
  }

  .s-zoom-in-top-enter-active,.s-zoom-in-top-leave-active {
    opacity: 1;
    transform: scaleY(1);
    transition: transform .3s cubic-bezier(.23,1,.32,1) .1s,opacity .3s cubic-bezier(.23,1,.32,1) .1s;
    transform-origin: center top
  }

  .s-zoom-in-top-enter,.s-zoom-in-top-leave-active {
    opacity: 0;
    transform: scaleY(0)
  }

  .s-zoom-in-bottom-enter-active,.s-zoom-in-bottom-leave-active {
    opacity: 1;
    transform: scaleY(1);
    transition: transform .3s cubic-bezier(.23,1,.32,1) .1s,opacity .3s cubic-bezier(.23,1,.32,1) .1s;
    transform-origin: center bottom
  }

  .s-zoom-in-bottom-enter,.s-zoom-in-bottom-leave-active {
    opacity: 0;
    transform: scaleY(0)
  }

  .collapse-transition {
    transition: height .3s ease-in-out,padding-top .3s ease-in-out,padding-bottom .3s ease-in-out
  }

  .list-enter-active,.list-leave-active {
    transition: all 1s
  }

  .list-enter,.list-leave-active {
    opacity: 0;
    transform: translateY(-30px)
  }

  .s-date-editor {
    position: relative;
    display: inline-block
  }

  .s-date-editor .s-picker-panel {
    position: absolute;
    min-width: 180px;
    box-sizing: border-box;
    box-shadow: 0 2px 6px #ccc;
    background: #fff;
    z-index: 10;
    top: 41px
  }

  .s-date-editor.s-input {
    width: 193px
  }

  .s-date-editor-daterange.s-input {
    width: 220px
  }

  .s-date-editor-datetimerange.s-input {
    width: 350px
  }

  .s-time-spinner.has-seconds .s-time-spinner-wrapper {
    width: 33%
  }

  .s-time-spinner.has-seconds .s-time-spinner-wrapper .s-scrollbar-wrap:not(.s-scrollbar-wrap-hidden-default) {
    padding-bottom: 15px
  }

  .s-time-spinner.has-seconds .s-time-spinner-wrapper:nth-child(2) {
    margin-left: 1%
  }

  .s-time-spinner-wrapper {
    max-height: 190px;
    display: inline-block;
    width: 50%;
    vertical-align: top;
    position: relative
  }

  .s-time-spinner-list {
    padding: 0;
    margin: 0;
    list-style: none;
    text-align: center
  }

  .s-time-spinner-list:after,.s-time-spinner-list:before {
    content: "";
    display: block;
    width: 100%;
    height: 80px
  }

  .s-time-spinner-item {
    height: 32px;
    line-height: 32px;
    font-size: 12px
  }

  .s-time-spinner-item:hover:not(.disabled):not(.active) {
    background: #e4e8f1;
    cursor: pointer
  }

  .s-time-spinner-item.active:not(.disabled) {
    color: #fff
  }

  .s-time-spinner-item.disabled {
    color: #d1dbe5;
    cursor: not-allowed
  }

  .s-time-panel {
    margin: 5px 0;
    border: 1px solid #d1dbe5;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,.12),0 0 6px rgba(0,0,0,.04);
    border-radius: 2px;
    position: absolute;
    width: 180px;
    left: 0;
    z-index: 1000;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }

  .s-time-panel-content {
    font-size: 0;
    position: relative;
    overflow: hidden
  }

  .s-time-panel-content:after,.s-time-panel-content:before {
    content: ":";
    top: 50%;
    color: #fff;
    position: absolute;
    font-size: 14px;
    margin-top: -15px;
    line-height: 16px;
    background-color: #20a0ff;
    height: 32px;
    z-index: -1;
    left: 0;
    right: 0;
    box-sizing: border-box;
    padding-top: 6px;
    text-align: left
  }

  .s-time-panel-content:after {
    left: 50%;
    margin-left: -2px
  }

  .s-time-panel-content:before {
    padding-left: 50%;
    margin-right: -2px
  }

  .s-time-panel-content.has-seconds:after {
    left: 66.66667%
  }

  .s-time-panel-content.has-seconds:before {
    padding-left: 33.33333%
  }

  .s-time-panel-footer {
    border-top: 1px solid #e4e4e4;
    padding: 4px;
    height: 36px;
    line-height: 25px;
    text-align: right;
    box-sizing: border-box
  }

  .s-time-panel-btn {
    border: none;
    line-height: 28px;
    padding: 0 5px;
    margin: 0 5px;
    cursor: pointer;
    background-color: transparent;
    outline: none;
    font-size: 12px;
    color: #8391a5
  }

  .s-time-panel-btn.confirm {
    font-weight: 800;
    color: #20a0ff
  }
  .s-input-icon {
    position: absolute;
    width: 35px;
    height: 100%;
    right: 0;
    top: 0;
    text-align: center;
    color: #bfcbd9;
    transition: all .3s
  }

  .s-input-icon:after {
    content: "";
    height: 100%;
    width: 0;
    display: inline-block;
    vertical-align: middle
  }
</style>
