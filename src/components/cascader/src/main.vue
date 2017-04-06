<template>
  <span
    class="s-cascader"
    :class="[
      {
        'is-opened': menuVisible,
        'is-disabled': disabled
      },
      size ? 's-cascader--' + size : ''
    ]"
    @click="handleClick"
    @mouseenter="inputHover = true"
    @mouseleave="inputHover = false"
    ref="reference"
    v-clickoutside="handleClickoutside"
  >
    <s-input
      ref="input"
      :readonly="!filterable"
      :placeholder="currentLabels.length ? undefined : placeholder"
      v-model="inputValue"
      @change="debouncedInputChange"
      :validate-event="false"
      :size="size"
      :disabled="disabled"
    >
      <template slot="icon">
        <i
          key="1"
          v-if="clearable && inputHover && currentLabels.length"
          class="s-input__icon s-icon-circle-close s-cascader__clearIcon"
          @click="clearValue"
        ></i>
        <i
          key="2"
          v-else
          class="s-input__icon s-icon-caret-bottom"
          :class="{ 'is-reverse': menuVisible }"
        ></i>
      </template>
    </s-input>
    <span class="s-cascader__label" v-show="inputValue === ''">
      <template v-if="showAllLevels">
        <template v-for="(label, index) in currentLabels">
          {{ label }}
          <span v-if="index < currentLabels.length - 1"> / </span>
        </template>
      </template>
      <template v-else>
        {{ currentLabels[currentLabels.length - 1] }}
      </template>
    </span>
  </span>
</template>

<script>
import Vue from 'vue';
import sCascaderMenu from './menu';
import sInput from '../../input';
import Popper from '../../../extra/utils/vue-popper';
import Clickoutside from '../../../extra/utils/clickoutside';
import emitter from '../../../extra/mixins/emitter';
import Locale from '../../../extra/mixins/locale';
import { t } from '../../../extra/locale';
import debounce from '../../../extra/throttle-debounce/debounce';

const popperMixin = {
  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },
    appendToBody: Popper.props.appendToBody,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeDestroy: Popper.beforeDestroy
};

export default {
  name: 'sCascader',

  directives: { Clickoutside },

  mixins: [popperMixin, emitter, Locale],

  components: {
    sInput
  },

  props: {
    options: {
      type: Array,
      required: true
    },
    props: {
      type: Object,
      default() {
        return {
          children: 'children',
          label: 'label',
          value: 'value',
          disabled: 'disabled'
        };
      }
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    placeholder: {
      type: String,
      default() {
        return t('el.cascader.placeholder');
      }
    },
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: false
    },
    changeOnSelect: Boolean,
    popperClass: String,
    expandTrigger: {
      type: String,
      default: 'click'
    },
    filterable: Boolean,
    size: String,
    showAllLevels: {
      type: Boolean,
      default: true
    },
    debounce: {
      type: Number,
      default: 300
    }
  },

  data() {
    return {
      currentValue: this.value,
      menu: null,
      debouncedInputChange() {},
      menuVisible: false,
      inputHover: false,
      inputValue: '',
      flatOptions: null
    };
  },

  computed: {
    labelKey() {
      return this.props.label || 'label';
    },
    valueKey() {
      return this.props.value || 'value';
    },
    childrenKey() {
      return this.props.children || 'children';
    },
    currentLabels() {
      let options = this.options;
      let labels = [];
      this.currentValue.forEach(value => {
        const targetOption = options && options.filter(option => option[this.valueKey] === value)[0];
        if (targetOption) {
          labels.push(targetOption[this.labelKey]);
          options = targetOption[this.childrenKey];
        }
      });
      return labels;
    }
  },

  watch: {
    menuVisible(value) {
      value ? this.showMenu() : this.hideMenu();
    },
    value(value) {
      this.currentValue = value;
    },
    currentValue(value) {
      this.dispatch('sFormItem', 'el.form.change', [value]);
    },
    options: {
      deep: true,
      handler(value) {
        if (!this.menu) {
          this.initMenu();
        }
        this.flatOptions = this.flattenOptions(this.options);
        this.menu.options = value;
      }
    }
  },

  methods: {
    initMenu() {
      this.menu = new Vue(sCascaderMenu).$mount();
      this.menu.options = this.options;
      this.menu.props = this.props;
      this.menu.expandTrigger = this.expandTrigger;
      this.menu.changeOnSelect = this.changeOnSelect;
      this.menu.popperClass = this.popperClass;
      this.popperElm = this.menu.$el;
      this.menu.$on('pick', this.handlePick);
      this.menu.$on('activeItemChange', this.handleActiveItemChange);
      this.menu.$on('menuLeave', this.doDestroy);
    },
    showMenu() {
      if (!this.menu) {
        this.initMenu();
      }

      this.menu.value = this.currentValue.slice(0);
      this.menu.visible = true;
      this.menu.options = this.options;
      this.$nextTick(_ => {
        this.updatePopper();
        this.menu.inputWidth = this.$refs.input.$el.offsetWidth - 2;
      });
    },
    hideMenu() {
      this.inputValue = '';
      this.menu.visible = false;
    },
    handleActiveItemChange(value) {
      this.$nextTick(_ => {
        this.updatePopper();
      });
      this.$emit('active-item-change', value);
    },
    handlePick(value, close = true) {
      this.currentValue = value;
      this.$emit('input', value);
      this.$emit('change', value);

      if (close) {
        this.menuVisible = false;
      }
    },
    handleInputChange(value) {
      if (!this.menuVisible) return;
      const flatOptions = this.flatOptions;

      if (!value) {
        this.menu.options = this.options;
        return;
      }

      let filteredFlatOptions = flatOptions.filter(optionsStack => {
        return optionsStack.some(option => new RegExp(value, 'i').test(option[this.labelKey]));
      });

      if (filteredFlatOptions.length > 0) {
        filteredFlatOptions = filteredFlatOptions.map(optionStack => {
          return {
            __IS__FLAT__OPTIONS: true,
            value: optionStack.map(item => item[this.valueKey]),
            label: this.renderFilteredOptionLabel(value, optionStack)
          };
        });
      } else {
        filteredFlatOptions = [{
          __IS__FLAT__OPTIONS: true,
          label: this.t('EL.cascader.noMatch'),
          value: '',
          disabled: true
        }];
      }
      this.menu.options = filteredFlatOptions;
    },
    renderFilteredOptionLabel(inputValue, optionsStack) {
      return optionsStack.map((option, index) => {
        const label = option[this.labelKey];
        const keywordIndex = label.toLowerCase().indexOf(inputValue.toLowerCase());
        const labelPart = label.slice(keywordIndex, inputValue.length + keywordIndex);
        const node = keywordIndex > -1 ? this.highlightKeyword(label, labelPart) : label;
        return index === 0 ? node : [' / ', node];
      });
    },
    highlightKeyword(label, keyword) {
      const h = this._c;
      return label.split(keyword)
        .map((node, index) => index === 0 ? node : [
          h('span', { class: { 's-cascader-menu__item__keyword': true }}, [this._v(keyword)]),
          node
        ]);
    },
    flattenOptions(options, ancestor = []) {
      let flatOptions = [];
      options.forEach((option) => {
        const optionsStack = ancestor.concat(option);
        if (!option[this.childrenKey]) {
          flatOptions.push(optionsStack);
        } else {
          if (this.changeOnSelect) {
            flatOptions.push(optionsStack);
          }
          flatOptions = flatOptions.concat(this.flattenOptions(option[this.childrenKey], optionsStack));
        }
      });
      return flatOptions;
    },
    clearValue(ev) {
      ev.stopPropagation();
      this.handlePick([], true);
    },
    handleClickoutside() {
      this.menuVisible = false;
    },
    handleClick() {
      if (this.disabled) return;
      if (this.filterable) {
        this.menuVisible = true;
        return;
      }
      this.menuVisible = !this.menuVisible;
    }
  },

  created() {
    this.debouncedInputChange = debounce(this.debounce, value => {
      this.handleInputChange(value);
    });
  },

  mounted() {
    this.flatOptions = this.flattenOptions(this.options);
  }
};
</script>
<style>
  @charset "UTF-8";
  @import "../../theme-default/common/var.css";

  @component-namespace s {

    @b cascader {
      display: inline-block;
      position: relative;
      background-color: #fff;

      .s-input,
      .s-input__inner {
        cursor: pointer;
        background-color: transparent;
        z-index: var(--index-normal);
      }

      .s-input__icon {
        transition: none;
      }

      .s-icon-caret-bottom {
        transition: transform .3s;

      @when reverse {
        transform: rotateZ(180deg);
      }
    }

    @e label {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      line-height: 34px;
      padding: 0 25px 0 10px;
      color: var(--input-color);
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      box-sizing: border-box;
      cursor: pointer;
      font-size: 14px;
      text-align: left;
      span {
        color: var(--color-light-silver);
      }
    }

    @m large {
      font-size: var(--input-large-font-size);

      .s-cascader__label {
        line-height: calc(var(--input-large-height) - 2);
      }
    }
    @m small {
      font-size: var(--input-small-font-size);

      .s-cascader__label {
        line-height: calc(var(--input-small-height) - 2);
      }
    }
  }

  @b cascader-menus {
    white-space: nowrap;
    background: #fff;
    position: absolute;
    margin: 5px 0;
    z-index: calc(var(--index-normal) + 1);
    border: var(--select-dropdown-border);
    border-radius: var(--border-radius-small);
    box-shadow: var(--select-dropdown-shadow);
  }

  @b cascader-menu {
    display: inline-block;
    vertical-align: top;
    height: 204px;
    overflow: auto;
    border-right: var(--select-dropdown-border);
    background-color: var(--select-dropdown-background);
    box-sizing: border-box;
    margin: 0;
    padding: 6px 0;
    min-width: 160px;

  &:last-child {
     border-right: 0;
   }

    @e item {
      font-size: var(--select-font-size);
      padding: 8px 30px 8px 10px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--select-option-color);
      height: var(--select-option-height);
      line-height: 1.5;
      box-sizing: border-box;
      cursor: pointer;

      @e keyword {
        font-weight: bold;
      }

      @m extensible {
      &:after {
        font-family: 'element-icons';
        content: "\e606";
        font-size: 12px;
        transform: scale(0.8);
        color: rgb(191, 203, 217);
        position: absolute;
        right: 10px;
        margin-top: 1px;
      }
      }

      @when disabled {
        color: var(--select-option-disabled-color);
        background-color: var(--select-option-disabled-background);
        cursor: not-allowed;

      &:hover {
         background-color: var(--color-white);
       }
      }

      @when active {
        color: var(--color-white);
        background-color: var(--select-option-selected);

      &:hover {
         background-color: var(--select-option-selected-hover);
       }
      }

    &:hover {
       background-color: var(--select-option-hover-background);
     }

    &.selected {
       color: var(--color-white);
       background-color: var(--select-option-selected);

    &.hover {
       background-color: var(--select-option-selected-hover);
     }
    }
  }

  @m flexible {
    height: auto;
    max-height: 180px;
    overflow: auto;

    .s-cascader-menu__item {
      overflow: visible;
    }
  }
  }
  }

</style>
