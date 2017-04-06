<template>
  <div :class="[
    type === 'textarea' ? 's-textarea' : 's-input',
    size ? 's-input--' + size : '',
    {
      'is-disabled': disabled,
      's-input-group': $slots.prepend || $slots.append,
      's-input-group--append': $slots.append,
      's-input-group--prepend': $slots.prepend
    }
  ]">
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="s-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <!-- input 图标 -->
      <slot name="icon">
        <i class="s-input__icon"
          :class="[
            's-icon-' + icon,
            onIconClick ? 'is-clickable' : ''
          ]"
          v-if="icon"
          @click="handleIconClick">
        </i>
      </slot>
      <input
        v-if="type !== 'textarea'"
        class="s-input__inner"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :autocomplete="autoComplete"
        :autofocus="autofocus"
        :min="min"
        :max="max"
        :step="step"
        :form="form"
        :value="currentValue"
        ref="input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      >
      <i class="s-input__icon s-icon-loading" v-if="validating"></i>
      <!-- 后置元素 -->
      <div class="s-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      class="s-textarea__inner"
      :value="currentValue"
      @input="handleInput"
      ref="textarea"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :style="textareaStyle"
      :readonly="readonly"
      :rows="rows"
      :form="form"
      :autofocus="autofocus"
      :maxlength="maxlength"
      :minlength="minlength"
      @focus="handleFocus"
      @blur="handleBlur">
    </textarea>
  </div>
</template>
<script>
  import emitter from '../../../extra/mixins/emitter';
  import calcTextareaHeight from './calcTextareaHeight';
  import merge from '../../../extra/utils/merge';

  export default {
    name: 'sInput',

    componentName: 'sInput',

    mixins: [emitter],

    data() {
      return {
        currentValue: this.value,
        textareaCalcStyle: {}
      };
    },

    props: {
      value: [String, Number],
      placeholder: String,
      size: String,
      resize: String,
      readonly: Boolean,
      autofocus: Boolean,
      icon: String,
      disabled: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      name: String,
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      rows: {
        type: Number,
        default: 2
      },
      autoComplete: {
        type: String,
        default: 'off'
      },
      form: String,
      maxlength: Number,
      minlength: Number,
      max: {},
      min: {},
      step: {},
      validateEvent: {
        type: Boolean,
        default: true
      },
      onIconClick: Function
    },

    computed: {
      validating() {
        return this.$parent.validateState === 'validating';
      },
      textareaStyle() {
        return merge({}, this.textareaCalcStyle, { resize: this.resize });
      }
    },

    watch: {
      'value'(val, oldValue) {
        this.setCurrentValue(val);
      }
    },

    methods: {
      handleBlur(event) {
        this.$emit('blur', event);
        if (this.validateEvent) {
          this.dispatch('sFormItem', 'el.form.blur', [this.currentValue]);
        }
      },
      inputSelect() {
        this.$refs.input.select();
      },
      resizeTextarea() {
        if (this.$isServer) return;
        var { autosize, type } = this;
        if (!autosize || type !== 'textarea') return;
        const minRows = autosize.minRows;
        const maxRows = autosize.maxRows;

        this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
      },
      handleFocus(event) {
        this.$emit('focus', event);
      },
      handleInput(event) {
        const value = event.target.value;
        this.$emit('input', value);
        this.setCurrentValue(value);
        this.$emit('change', value);
      },
      handleIconClick(event) {
        if (this.onIconClick) {
          this.onIconClick(event);
        }
        this.$emit('click', event);
      },
      setCurrentValue(value) {
        if (value === this.currentValue) return;
        this.$nextTick(_ => {
          this.resizeTextarea();
        });
        this.currentValue = value;
        if (this.validateEvent) {
          this.dispatch('sFormItem', 'el.form.change', [value]);
        }
      }
    },

    created() {
      this.$on('inputSelect', this.inputSelect);
    },

    mounted() {
      this.resizeTextarea();
    }
  };
</script>

<style type="text/css">
@import "../../theme-default/common/var.css";
@import "../../theme-default/icon.css";

@component-namespace s {
  @b input {
    position: relative;
    font-size: var(--font-size-base);
    display: inline-block;
    width: 100%;

    @e inner {
      appearance: none;
      background-color: var(--color-white);
      background-image: none;
      border-radius: var(--input-border-radius);
      border: var(--input-border);
      box-sizing: border-box;
      color: var(--input-color);
      display: block;
      font-size: inherit;
      height: var(--input-height);
      line-height: 1;
      outline: none;
      padding: 3px 10px;
      transition: var(--border-transition-base);
      width: 100%;

      &::placeholder {
        color: var(--input-placeholder-color);
      }

      &:hover {
        border-color: var(--input-hover-border);
      }

      &:focus {
        outline: none;
        border-color: var(--input-focus-border);
      }
    }

    @e icon {
      position: absolute;
      width: 35px;
      height: 100%;
      right: 0;
      top: 0;
      text-align: center;
      color: var(--input-icon-color);
      transition: all .3s;

      &:after {
        content: '';
        height: 100%;
        width: 0;
        display: inline-block;
        vertical-align: middle;
      }

      & + .s-input__inner {
        padding-right: 35px;
      }

      @when clickable {
        &:hover {
          cursor: pointer;
          color: var(--input-hover-border);

          & + .s-input__inner {
            border-color: var(--input-hover-border);
          }
        }
      }
    }

    @when active {
      .s-input__inner {
        outline: none;
        border-color: var(--input-focus-border);
      }
    }

    @when disabled {
      .s-input__inner {
        background-color: var(--disabled-fill-base);
        border-color: var(--disabled-border-base);
        color: var(--disabled-color-base);
        cursor: not-allowed;

        &::placeholder {
          color: var(--input-disabled-placeholder-color);
        }
      }
    }
    @m large {
      font-size: var(--input-large-font-size);

      & .s-input__inner {
        height: var(--input-large-height);
      }
    }
    @m small {
      font-size: var(--input-small-font-size);

      & .s-input__inner {
        height: var(--input-small-height);
      }
    }
    @m mini {
      font-size: var(--input-mini-font-size);

      & .s-input__inner {
        height: var(--input-mini-height);
      }
    }
  }

  @b input-group {
    line-height: normal;
    display: inline-table;
    width: 100%;
    border-collapse: separate;

    & > .s-input__inner {
      vertical-align: middle;
      display: table-cell;
    }
    @e append, prepend {
      background-color: var(--color-dark-white);
      color: var(--color-light-silver);
      vertical-align: middle;
      display: table-cell;
      position: relative;
      border: var(--border-base);
      border-radius: var(--input-border-radius);
      padding: 0 10px;
      width: 1%;
      white-space: nowrap;

      & .s-select,
      & .s-button {
        display: block;
        margin: -10px;
      }

      & .s-button,
      & .s-select .s-input__inner,
      & .s-select:hover .s-input__inner {
        border-color: transparent;
        background-color: transparent;
        color: inherit;
        border-top: 0;
        border-bottom: 0;
      }
      & .s-button,
      & .s-input {
        font-size: inherit;
      }
    }
    @e prepend {
      border-right: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    @e append {
      border-left: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    @m prepend {
      .s-input__inner {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    @m append {
      .s-input__inner {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }

  @b textarea {
    display: inline-block;
    width: 100%;
    vertical-align: bottom;

    @e inner {
      display: block;
      resize: vertical;
      padding: 5px 7px;
      line-height: 1.5;
      box-sizing: border-box;
      width: 100%;
      font-size: var(--font-size-base);
      color: var(--input-color);
      background-color: var(--color-white);
      background-image: none;
      border: var(--input-border);
      border-radius: var(--input-border-radius);
      transition: var(--border-transition-base);

      &::placeholder {
        color: var(--input-placeholder-color);
      }

      &:hover {
        border-color: var(--input-hover-border);
      }

      &:focus {
        outline: none;
        border-color: var(--input-focus-border);
      }
    }

    @when disabled {
      .s-textarea__inner {
        background-color: var(--disabled-fill-base);
        border-color: var(--disabled-border-base);
        color: var(--disabled-color-base);
        cursor: not-allowed;

        &::placeholder {
          color: var(--input-disabled-placeholder-color);
        }
      }
    }
  }
}

</style>
