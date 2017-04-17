<template>
  <div :class="[
    type === 'textarea' ? 's-textarea' : 's-input',
    size ? 's-input-' + size : '',
    {
      'is-disabled': disabled,
      's-input-group': $slots.prepend || $slots.append,
      's-input-group-append': $slots.append,
      's-input-group-prepend': $slots.prepend
    }
  ]">
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="s-input-group-prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <!-- input 图标 -->
      <slot name="icon">
        <i class="s-input-icon"
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
        class="s-input-inner"
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
      <i class="s-input-icon s-icon-loading" v-if="validating"></i>
      <!-- 后置元素 -->
      <div class="s-input-group-append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      class="s-textarea-inner"
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
  import emitter from '../extra/mixins/emitter';
  import calcTextareaHeight from './calcTextareaHeight';
  import merge from '../extra/utils/merge';

  export default {
    name: 's-input',

    componentName: 's-input',

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

<style>
  .s-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%
  }

  .s-input.is-disabled .s-input-inner {
    background-color: #eef1f6;
    border-color: #d1dbe5;
    color: #bbb;
    cursor: not-allowed
  }

  .s-input.is-disabled .s-input-inner::-webkit-input-placeholder {
    color: #bfcbd9
  }

  .s-input.is-disabled .s-input-inner::-moz-placeholder {
    color: #bfcbd9
  }

  .s-input.is-disabled .s-input-inner:-ms-input-placeholder {
    color: #bfcbd9
  }

  .s-input.is-disabled .s-input-inner::placeholder {
    color: #bfcbd9
  }

  .s-input.is-active .s-input-inner {
    outline: none;
    border-color: #20a0ff
  }

  .s-input-inner {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    color: #1f2d3d;
    display: block;
    font-size: inherit;
    height: 36px;
    line-height: 1;
    outline: none;
    padding: 3px 10px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%
  }

  .s-input-inner::-webkit-input-placeholder {
    color: #97a8be
  }

  .s-input-inner::-moz-placeholder {
    color: #97a8be
  }

  .s-input-inner:-ms-input-placeholder {
    color: #97a8be
  }

  .s-input-inner::placeholder {
    color: #97a8be
  }

  .s-input-inner:hover {
    border-color: #8391a5
  }

  .s-input-inner:focus {
    outline: none;
    border-color: #20a0ff
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

  .s-input-icon+.s-input-inner {
    padding-right: 35px
  }

  .s-input-icon.is-clickable:hover {
    cursor: pointer;
    color: #8391a5
  }

  .s-input-icon.is-clickable:hover+.s-input-inner {
    border-color: #8391a5
  }

  .s-input-large {
    font-size: 16px
  }

  .s-input-large .s-input-inner {
    height: 42px
  }

  .s-input-small {
    font-size: 13px
  }

  .s-input-small .s-input-inner {
    height: 30px
  }

  .s-input-mini {
    font-size: 12px
  }

  .s-input-mini .s-input-inner {
    height: 22px
  }
  
</style>
