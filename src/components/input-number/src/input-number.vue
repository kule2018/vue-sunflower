<template>
  <div class="s-input-number"
    :class="[
      size ? 's-input-number--' + size : '',
      { 'is-disabled': disabled },
      { 'is-without-controls': !controls}
    ]"
  >
    <span
      v-if="controls"
      class="s-input-number__decrease"
      :class="{'is-disabled': minDisabled}"
      v-repeat-click="decrease"
    >
      <i class="s-icon-minus"></i>
    </span>
    <span
      v-if="controls"
      class="s-input-number__increase"
      :class="{'is-disabled': maxDisabled}"
      v-repeat-click="increase"
    >
      <i class="s-icon-plus"></i>
    </span>
    <s-input
      :value="currentValue"
      @keydown.up.native.prevent="increase"
      @keydown.down.native.prevent="decrease"
      @blur="handleBlur"
      @input="handleInput"
      :disabled="disabled"
      :size="size"
      :max="max"
      :min="min"
      ref="input"
    >
        <template slot="prepend" v-if="$slots.prepend">
          <slot name="prepend"></slot>
        </template>
        <template slot="append" v-if="$slots.append">
          <slot name="append"></slot>
        </template>
    </s-input>
  </div>
</template>
<script>
  import sInput from '../../input';
  import { once, on } from '../../../extra/utils/dom';

  export default {
    name: 'sInputNumber',
    directives: {
      repeatClick: {
        bind(el, binding, vnode) {
          let interval = null;
          let startTime;
          const handler = () => vnode.context[binding.expression].apply();
          const clear = () => {
            if (new Date() - startTime < 100) {
              handler();
            }
            clearInterval(interval);
            interval = null;
          };

          on(el, 'mousedown', () => {
            startTime = new Date();
            once(document, 'mouseup', clear);
            interval = setInterval(handler, 100);
          });
        }
      }
    },
    components: {
      sInput
    },
    props: {
      step: {
        type: Number,
        default: 1
      },
      max: {
        type: Number,
        default: Infinity
      },
      min: {
        type: Number,
        default: -Infinity
      },
      value: {
        default: 0
      },
      disabled: Boolean,
      size: String,
      controls: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        currentValue: 0
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(value) {
          let newVal = Number(value);
          if (isNaN(newVal)) return;
          if (newVal >= this.max) newVal = this.max;
          if (newVal <= this.min) newVal = this.min;
          this.currentValue = newVal;
          this.$emit('input', newVal);
        }
      }
    },
    computed: {
      minDisabled() {
        return this._decrease(this.value, this.step) < this.min;
      },
      maxDisabled() {
        return this._increase(this.value, this.step) > this.max;
      },
      precision() {
        const { value, step, getPrecision } = this;
        return Math.max(getPrecision(value), getPrecision(step));
      }
    },
    methods: {
      toPrecision(num, precision) {
        if (precision === undefined) precision = this.precision;
        return parseFloat(parseFloat(Number(num).toFixed(precision)));
      },
      getPrecision(value) {
        const valueString = value.toString();
        const dotPosition = valueString.indexOf('.');
        let precision = 0;
        if (dotPosition !== -1) {
          precision = valueString.length - dotPosition - 1;
        }
        return precision;
      },
      _increase(val, step) {
        if (typeof val !== 'number') return this.currentValue;

        const precisionFactor = Math.pow(10, this.precision);

        return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor);
      },
      _decrease(val, step) {
        if (typeof val !== 'number') return this.currentValue;

        const precisionFactor = Math.pow(10, this.precision);

        return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor);
      },
      increase() {
        if (this.disabled || this.maxDisabled) return;
        const value = this.value || 0;
        const newVal = this._increase(value, this.step);
        if (newVal > this.max) return;
        this.setCurrentValue(newVal);
      },
      decrease() {
        if (this.disabled || this.minDisabled) return;
        const value = this.value || 0;
        const newVal = this._decrease(value, this.step);
        if (newVal < this.min) return;
        this.setCurrentValue(newVal);
      },
      handleBlur() {
        this.$refs.input.setCurrentValue(this.currentValue);
      },
      setCurrentValue(newVal) {
        const oldVal = this.currentValue;
        if (newVal >= this.max) newVal = this.max;
        if (newVal <= this.min) newVal = this.min;
        if (oldVal === newVal) return;
        this.$emit('change', newVal, oldVal);
        this.$emit('input', newVal);
        this.currentValue = newVal;
      },
      handleInput(value) {
        const newVal = Number(value);
        if (!isNaN(newVal)) {
          this.setCurrentValue(newVal);
        }
      }
    }
  };
</script>

<style>
  @charset "UTF-8";
  /*@import "./input.css";*/
  @import "../../theme-default/common/var.css";

  @component-namespace s {
    @b input-number {
      display: inline-block;
      overflow: hidden;
      width: 180px;
      position: relative;

    & .s-input {
        display: block;
      }
    & .s-input__inner {
        appearance: none;
        padding-right: calc(var(--input-height) * 2 + 10);
      }
      @e increase, decrease {
        height: auto;
        border-left: var(--border-base);
        width: var(--input-height);
        line-height: calc(var(--input-height) - 2);
        top: 1px;
        text-align: center;
        color: var(--color-light-silver);
        cursor: pointer;
        position: absolute;
        z-index: 1;

      &:hover {
         color: var(--color-primary);

      &:not(.is-disabled) ~ .s-input .s-input__inner:not(.is-disabled) {
         border-color: var(--input-focus-border);
       }
      }

      @when disabled {
        color: var(--disabled-border-base);
        cursor: not-allowed;
      }
    }

    @e increase {
      right: 0;
    }
    @e decrease {
      right: calc(var(--input-height) + 1px);
    }

    @when disabled {
    & .s-input-number__increase, .s-input-number__decrease {
      border-color: var(--disabled-border-base);
      color: var(--disabled-border-base);

    &:hover {
       color: var(--disabled-border-base);
       cursor: not-allowed;
     }
    }
  }
  @m large {
    width: 200px;

  & .s-input-number__increase, .s-input-number__decrease {
      line-height: var(--input-large-height);
      width: var(--input-large-height);
      font-size: var(--input-large-font-size);
    }
  & .s-input-number__decrease {
      right: calc(var(--input-large-height) + 1px);
    }
  & .s-input__inner {
      padding-right: calc(var(--input-large-height) * 2 + 10);
    }
  }
  @m small {
    width: 130px;

  & .s-input-number__increase, .s-input-number__decrease {
      line-height: var(--input-small-height);
      width: var(--input-small-height);
      font-size: var(--input-small-font-size);
    }
  & .s-input-number__decrease {
      right: calc(var(--input-small-height) + 1px);
    }
  & .s-input__inner {
      padding-right: calc(var(--input-small-height) * 2 + 10);
    }
  }
  @when without-controls {
  & .s-input__inner {
    padding-right: 10px;
  }
  }
  }
  }

</style>
