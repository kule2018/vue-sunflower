<template>
  <label class="s-checkbox">
    <span class="s-checkbox-input"
          :class="{
        'is-disabled': disabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
    >
      <span class="s-checkbox-inner"></span>
      <input
              v-if="trueLabel || falseLabel"
              class="s-checkbox-original"
              type="checkbox"
              :name="name"
              :disabled="disabled"
              :true-value="trueLabel"
              :false-value="falseLabel"
              v-model="model"
              @change="handleChange"
              @focus="focus = true"
              @blur="focus = false">
      <input
              v-else
              class="s-checkbox-original"
              type="checkbox"
              :disabled="disabled"
              :value="label"
              :name="name"
              v-model="model"
              @change="handleChange"
              @focus="focus = true"
              @blur="focus = false">
    </span>
    <span class="s-checkbox-label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from '../extra/mixins/emitter';

  export default {
    name: 's-checkbox',
    mixins: [Emitter],
    componentName: 'SCheckbox',
    data() {
      return {
        selfModel: false,
        focus: false
      };
    },
    computed: {
      model: {
        get() {
          return this.isGroup
              ? this.store : this.value !== undefined
                  ? this.value : this.selfModel;
        },
        set(val) {
          if (this.isGroup) {
            let isLimitExceeded = false;
            (this._checkboxGroup.min !== undefined &&
            val.length < this._checkboxGroup.min &&
            (isLimitExceeded = true));
            (this._checkboxGroup.max !== undefined &&
            val.length > this._checkboxGroup.max &&
            (isLimitExceeded = true));
            isLimitExceeded === false &&
            this.dispatch('SCheckboxGroup', 'input', [val]);
          } else if (this.value !== undefined) {
            this.$emit('input', val);
          } else {
            this.selfModel = val;
          }
        }
      },
      isChecked() {
        if ({}.toString.call(this.model) === '[object Boolean]') {
          return this.model;
        } else if (Array.isArray(this.model)) {
          return this.model.indexOf(this.label) > -1;
        } else if (this.model !== null && this.model !== undefined) {
          return this.model === this.trueLabel;
        }
      },
      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'SCheckboxGroup') {
            parent = parent.$parent;
          } else {
            this._checkboxGroup = parent;
            return true;
          }
        }
        return false;
      },
      store() {
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      }
    },
    props: {
      value: {},
      label: {},
      indeterminate: Boolean,
      disabled: Boolean,
      checked: Boolean,
      name: String,
      trueLabel: [String, Number],
      falseLabel: [String, Number]
    },
    methods: {
      addToStore() {
        if (
            Array.isArray(this.model) &&
            this.model.indexOf(this.label) === -1
        ) {
          this.model.push(this.label);
        } else {
          this.model = this.trueLabel || true;
        }
      },
      handleChange(ev) {
        this.$emit('change', ev);
        if (this.isGroup) {
          this.$nextTick(_ => {
            this.dispatch('SCheckboxGroup', 'change', [this._checkboxGroup.value]);
          });
        }
      }
    },
    created() {
      this.checked && this.addToStore();
    }
  };
</script>
<style>
  .s-checkbox {
    color: #1f2d3d;
    position: relative;
    cursor: pointer;
    display: inline-block;
    white-space: nowrap;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none
  }

  .s-checkbox+.s-checkbox {
    margin-left: 15px
  }

  .s-checkbox-input {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle
  }

  .s-checkbox-input.is-indeterminate .s-checkbox-inner {
    background-color: #20a0ff;
    border-color: #0190fe
  }

  .s-checkbox-input.is-indeterminate .s-checkbox-inner:before {
    content: "";
    position: absolute;
    display: block;
    border: 1px solid #fff;
    margin-top: -1px;
    left: 3px;
    right: 3px;
    top: 50%
  }

  .s-checkbox-input.is-indeterminate .s-checkbox-inner:after {
    display: none
  }

  .s-checkbox-input.is-focus .s-checkbox-inner {
    border-color: #20a0ff
  }

  .s-checkbox-input.is-checked .s-checkbox-inner {
    background-color: #20a0ff;
    border-color: #0190fe
  }

  .s-checkbox-input.is-checked .s-checkbox-inner:after {
    transform: rotate(45deg) scaleY(1)
  }

  .s-checkbox-input.is-disabled .s-checkbox-inner {
    background-color: #eef1f6;
    border-color: #d1dbe5;
    cursor: not-allowed
  }

  .s-checkbox-input.is-disabled .s-checkbox-inner:after {
    cursor: not-allowed;
    border-color: #eef1f6
  }

  .s-checkbox-input.is-disabled .s-checkbox-inner+.s-checkbox-label {
    cursor: not-allowed
  }

  .s-checkbox-input.is-disabled.is-checked .s-checkbox-inner {
    background-color: #d1dbe5;
    border-color: #d1dbe5
  }

  .s-checkbox-input.is-disabled.is-checked .s-checkbox-inner:after {
    border-color: #fff
  }

  .s-checkbox-input.is-disabled.is-indeterminate .s-checkbox-inner {
    background-color: #d1dbe5;
    border-color: #d1dbe5
  }

  .s-checkbox-input.is-disabled.is-indeterminate .s-checkbox-inner:before {
    border-color: #fff
  }

  .s-checkbox-input.is-disabled+.s-checkbox-label {
    color: #bbb;
    cursor: not-allowed
  }

  .s-checkbox-inner {
    display: inline-block;
    position: relative;
    border: 1px solid #bfcbd9;
    border-radius: 4px;
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    background-color: #fff;
    z-index: 1;
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46)
  }

  .s-checkbox-inner:hover {
    border-color: #20a0ff
  }

  .s-checkbox-inner:after {
    box-sizing: content-box;
    content: "";
    border: 2px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 8px;
    left: 5px;
    position: absolute;
    top: 1px;
    transform: rotate(45deg) scaleY(0);
    width: 4px;
    transition: transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;
    transform-origin: center
  }

  .s-checkbox-original {
    opacity: 0;
    outline: none;
    position: absolute;
    margin: 0;
    left: -999px
  }

  .s-checkbox-label {
    font-size: 14px;
    padding-left: 5px
  }

</style>