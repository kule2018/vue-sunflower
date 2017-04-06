<template>
  <label class="s-radio">
    <span class="s-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="s-radio__inner"></span>
      <input type="radio" class="s-radio__original"
        v-model="model"
        :value="label"
        :name="name"
        :disabled="isDisabled"
        :class="{'checked':model===label}"
        :checked="model === label"
      >
    </span>
    <span class="s-radio__label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>

<script>
  import Emitter from '../../../extra/mixins/emitter';

  export default {
    name: 'sRadio',
    componentName: 'sRadio',
    mixins:[Emitter],
    props: {
      value: {},
      label: {},
      name: String,
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed:{
      isGroup(){
        let parent = this.$parent;
        while(parent){
          if(parent.$options.componentName !== 'sRadioGroup'){
            parent = parent.$parent;
          }else{
            return parent;
          }
        }
        return false;
      },
      model:{
        get(){
            return this.isGroup ? this.isGroup.value : this.value;
        },
        set(val){
          if(this.isGroup){
            this.dispatch('sRadioGroup', 'input', [val]);

          }else{
            this.$emit('input',val);
          }
        }
      },
      isDisabled() {
        return this.isGroup
          ? this.isGroup.disabled || this.disabled
          : this.disabled;
      }
    }
  }
</script>

<style >
  @import "../../theme-default/common/var.css";
  @import "../../theme-default/mixins/_button.css";
  @component-namespace s{
    @b radio {
      color: var(--radio-color);
      position: relative;
      cursor: pointer;
      display: inline-block;
      white-space: nowrap;
      font-size: 0;
      @utils-user-select none;

      & + .s-radio {
        margin-left: 15px;
      }

      @e inner{
        border: var(--radio-input-border);
        border-radius: var(--radio-input-border-radius);
        circle: var(--radio-input-width) var(--radio-input-fill);
        position: relative;
        cursor: pointer;
        display: inline-block;
        box-sizing: border-box;
        &:hover{
           border-color: var(--radio-input-border-color-hover);
         }
        &:after{
           circle: 6px var(--color-white);
           content: "";
           position: absolute;
           left: 50%;
           top: 50%;
           transform: translate(-50%, -50%) scale(0);
           transition: transform .15s cubic-bezier(.71,-.46,.88,.6);
        }
      }

      @e input{
        cursor: pointer;
        vertical-align: middle;
        display: inline-block;

        .s-radio__original{
          display: none;
        }
        @when checked{
          .s-radio__inner{
            border-color: var(--radio-checked-input-border-color);
            background: var(--radio-checked-icon-color);

            &::after {
              transform: translate(-50%, -50%) scale(1);
            }
          }
        }
        @when disabled{
          .s-radio__inner {
            background-color: var(--radio-disabled-input-fill);
            border-color: var(--radio-disabled-input-border-color);
            cursor: not-allowed;

            &::after {
              cursor: not-allowed;
              background-color: var(--radio-disabled-icon-color);
            }

            & + .s-radio__label {
              cursor: not-allowed;
            }
          }
          &.is-checked {
            .s-radio__inner {
              background-color: var(--radio-disabled-checked-input-fill);
              border-color: var(--radio-disabled-checked-input-border-color);
              &::after {
                background-color: var(--radio-disabled-checked-icon-color);
              }
            }
          }
          & + .s-radio__label {
            color: var(--disabled-color-base);
            cursor: not-allowed;
          }
        }

      }

      @e label{
        font-size: var(--radio-font-size);
        padding-left: 5px;
        vertical-align: middle;
      }

    }

    @b radio-group {
      display: inline-block;
      font-size: 0;
      line-height: 1;

    }

    @b radio-button {
      position: relative;
      display: inline-block;

      @e inner {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        background: var(--button-default-fill);
        border: var(--border-base);
        border-left: 0;
        color: var(--button-default-color);
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        position: relative;
        cursor: pointer;
        transition: var(--all-transition);
        @utils-user-select none;

        @mixin button-size var(--button-padding-vertical), var(--button-padding-horizontal), var(--button-font-size), 0;

        &:hover {
          color: var(--color-primary);
        }

        & [class*="s-icon-"] {
          line-height: 0.9;

          & + span {
            margin-left: 5px;
          }
        }
      }

      @e orig-radio {
        opacity: 0;
        outline: none;
        position: absolute;
        z-index: -1;
        left: -999px;

        &:checked {
          & + .s-radio-button__inner {
            color: var(--radio-button-checked-color);
            background-color: var(--radio-button-checked-fill);
            border-color: var(--radio-button-checked-border-color);
            box-shadow: -1px 0 0 0 var(--radio-button-checked-border-color);
          }
        }

        &:disabled {
          & + .s-radio-button__inner {
            color: var(--button-disabled-color);
            cursor: not-allowed;
            background-image: none;
            background-color: var(--button-disabled-fill);
            border-color: var(--button-disabled-border);
          }
        }
      }

      &:first-child {
        .s-radio-button__inner {
          border-left: var(--border-base);
          border-radius: var(--border-radius-base) 0 0 var(--border-radius-base);
          box-shadow: none !important;
        }
      }
      &:last-child {
        .s-radio-button__inner {
          border-radius: 0 var(--border-radius-base) var(--border-radius-base) 0;
        }
      }
      @m large {
        & .s-radio-button__inner {
          @mixin button-size var(--button-large-padding-vertical), var(--button-large-padding-horizontal), var(--button-large-font-size), 0;
        }
      }
      @m small {
        & .s-radio-button__inner {
          @mixin button-size var(--button-small-padding-vertical), var(--button-small-padding-horizontal), var(--button-small-font-size), 0;
        }
      }
      @m mini {
        & .s-radio-button__inner {
          @mixin button-size var(--button-mini-padding-vertical), var(--button-mini-padding-horizontal), var(--button-mini-font-size), 0;
        }
      }
    }




  }

</style>
