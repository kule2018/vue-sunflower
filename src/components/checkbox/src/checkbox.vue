<template>
  <label class="s-checkbox">
    <span class="s-checkbox__input"
      :class="{
        'is-disabled': disabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
    >
      <span class="s-checkbox__inner"></span>
      <input
        v-if="trueLabel || falseLabel"
        class="s-checkbox__original"
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
        class="s-checkbox__original"
        type="checkbox"
        :disabled="disabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
    </span>
    <span class="s-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from '../../../extra/mixins/emitter.js'

  export default {
    name: 'sCheckbox',

    mixins: [Emitter],

    componentName: 'sCheckbox',

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
            this.dispatch('sCheckboxGroup', 'input', [val]);
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
          if (parent.$options.componentName !== 'sCheckboxGroup') {
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
            this.dispatch('sCheckboxGroup', 'change', [this._checkboxGroup.value]);
          });
        }
      }
    },

    created() {
      this.checked && this.addToStore();
    }
  };
</script>

<style type="text/css">
  @import "../../theme-default/common/var.css";

  @component-namespace s {

    @b checkbox {
      color: var(--checkbox-color);
      position: relative;
      cursor: pointer;
      display: inline-block;
      white-space: nowrap;
      @utils-user-select none;

      @e input {
        white-space: nowrap;
        cursor: pointer;
        outline: none;
        display: inline-block;
        line-height: 1;
        position: relative;
        vertical-align: middle;

        @when disabled {
          .s-checkbox__inner {
            background-color: var(--checkbox-disabled-input-fill);
            border-color: var(--checkbox-disabled-input-border-color);
            cursor: not-allowed;

        &::after {
           cursor: not-allowed;
           border-color: var(--checkbox-disabled-icon-color);
         }

        & + .s-checkbox__label {
              cursor: not-allowed;
            }
        }
      &.is-checked {
        .s-checkbox__inner {
          background-color: var(--checkbox-disabled-checked-input-fill);
          border-color: var(--checkbox-disabled-checked-input-border-color);

      &::after {
         border-color: var(--checkbox-disabled-checked-icon-color);
       }
      }
    }
  &.is-indeterminate {
    .s-checkbox__inner {
      background-color: var(--checkbox-disabled-checked-input-fill);
      border-color: var(--checkbox-disabled-checked-input-border-color);

  &::before {
     border-color: var(--checkbox-disabled-checked-icon-color);
   }
  }
  }
  & + .s-checkbox__label {
        color: var(--disabled-color-base);
        cursor: not-allowed;
      }
  }
  @when checked {
    .s-checkbox__inner {
      background-color: var(--checkbox-checked-input-fill);
      border-color: var(--checkbox-checked-input-border-color);

  &::after {
     transform: rotate(45deg) scaleY(1);
   }
  }
  }
  @when focus {
    .s-checkbox__inner {
      border-color: var(--checkbox-input-border-color-hover);
    }
  }
  @when indeterminate {
    .s-checkbox__inner {
      background-color: var(--checkbox-checked-input-fill);
      border-color: var(--checkbox-checked-input-border-color);

  &::before {
     content: '';
     position: absolute;
     display: block;
     border: 1px solid var(--checkbox-checked-icon-color);
     margin-top: -1px;
     left: 3px;
     right: 3px;
     top: 50%;
   }

  &::after {
     display: none;
   }
  }
  }
  }
  @e inner {
    display: inline-block;
    position: relative;
    border: var(--checkbox-input-border);
    border-radius: var(--checkbox-input-border-radius);
    box-sizing: border-box;
    rect: var(--checkbox-input-width) var(--checkbox-input-height) var(--checkbox-input-fill);
    z-index: var(--index-normal);
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),
    background-color .25s cubic-bezier(.71,-.46,.29,1.46);

  &:hover {
     border-color: var(--checkbox-input-border-color-hover);
   }

  &::after {
     box-sizing: content-box;
     content: "";
     border: 2px solid var(--checkbox-checked-icon-color);
     border-left: 0;
     border-top: 0;
     height: 8px;
     left: 5px;
     position: absolute;
     top: 1px;
     transform: rotate(45deg) scaleY(0);
     width: 4px;
     transition: transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;
     transform-origin: center;
   }
  }

  @e original {
    opacity: 0;
    outline: none;
    position: absolute;
    margin: 0;
    left: -999px;
  }

  @e label {
    font-size: var(--checkbox-font-size);
    padding-left: 5px;
  }

  & + .s-checkbox {
        margin-left: 15px;
      }
  }
  }
</style>
