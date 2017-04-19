<template>
  <div class="s-input-number"
       :class="[
      size ? 's-input-number-' + size : '',
      { 'is-disabled': disabled },
      { 'is-without-controls': !controls}
    ]"
  >
    <span
            v-if="controls"
            class="s-input-number-decrease"
            :class="{'is-disabled': minDisabled}"
            v-repeat-click="decrease"
    >
      <i class="s-icon-minus"></i>
    </span>
    <span
            v-if="controls"
            class="s-input-number-increase"
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
  import SInput from '../input';
  import { once, on } from '../extra/utils/dom';

  export default {
    name: 's-input-number',
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
      SInput
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
  .s-input-number {
    display: inline-block;
    overflow: hidden;
    width: 180px;
    position: relative
  }

  .s-input-number .s-input {
    display: block
  }

  .s-input-number .s-input-inner {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding-right: 82px
  }

  .s-input-number.is-without-controls .s-input-inner {
    padding-right: 10px
  }

  .s-input-number.is-disabled .s-input-number-decrease,.s-input-number.is-disabled .s-input-number-increase {
    border-color: #d1dbe5;
    color: #d1dbe5
  }

  .s-input-number.is-disabled .s-input-number-decrease:hover,.s-input-number.is-disabled .s-input-number-increase:hover {
    color: #d1dbe5;
    cursor: not-allowed
  }

  .s-input-number-decrease,.s-input-number-increase {
    height: auto;
    border-left: 1px solid #bfcbd9;
    width: 36px;
    line-height: 34px;
    top: 1px;
    text-align: center;
    color: #97a8be;
    cursor: pointer;
    position: absolute;
    z-index: 1
  }

  .s-input-number-decrease:hover,.s-input-number-increase:hover {
    color: #20a0ff
  }

  .s-input-number-decrease:hover:not(.is-disabled)~.s-input .s-input-inner:not(.is-disabled),.s-input-number-increase:hover:not(.is-disabled)~.s-input .s-input-inner:not(.is-disabled) {
    border-color: #20a0ff
  }

  .s-input-number-decrease.is-disabled,.s-input-number-increase.is-disabled {
    color: #d1dbe5;
    cursor: not-allowed
  }

  .s-input-number-increase {
    right: 0
  }

  .s-input-number-decrease {
    right: 37px
  }

  .s-input-number-large {
    width: 200px
  }

  .s-input-number-large .s-input-number-decrease,.s-input-number-large .s-input-number-increase {
    line-height: 42px;
    width: 42px;
    font-size: 16px
  }

  .s-input-number-large .s-input-number-decrease {
    right: 43px
  }

  .s-input-number-large .s-input-inner {
    padding-right: 94px
  }

  .s-input-number-small {
    width: 130px
  }

  .s-input-number-small .s-input-number-decrease,.s-input-number-small .s-input-number-increase {
    line-height: 30px;
    width: 30px;
    font-size: 13px
  }

  .s-input-number-small .s-input-number-decrease {
    right: 31px
  }

  .s-input-number-small .s-input-inner {
    padding-right: 70px
  }

</style>
