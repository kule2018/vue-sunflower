<template>
  <transition :name="closeTransition ? '' : 's-zoom-in-center'">
    <span
      class="s-tag"
      :class="[type ? 's-tag--' + type : '', {'is-hit': hit}]"
      :style="{backgroundColor: color}">
      <slot></slot>
      <i class="s-tag__close s-icon-close"
        v-if="closable"
        @click="handleClose"></i>
    </span>
  </transition>
</template>
<script>
  export default {
    name: 'sTag',
    props: {
      text: String,
      closable: Boolean,
      type: String,
      hit: Boolean,
      closeTransition: Boolean,
      color: String
    },
    methods: {
      handleClose(event) {
        this.$emit('close', event);
      }
    }
  };
</script>

<style>
  @charset "UTF-8";
  @import "../../theme-default/common/var.css";

  @component-namespace s {

    @b tag {
      background-color: var(--tag-fill);
      display: inline-block;
      padding: var(--tag-padding);
      height: 24px;
      line-height: calc(@height - 2);
      font-size: var(--tag-font-size);
      color: var(--tag-color);
      border-radius: var(--tag-border-radius);
      box-sizing: border-box;
      border: 1px solid transparent;
      white-space: nowrap;

    & .s-icon-close {
        border-radius: 50%;
        text-align: center;
        position: relative;
        cursor: pointer;
        font-size: 12px;
        transform: scale(.75, .75);
        height: 18px;
        width: 18px;
        line-height: 18px;
        vertical-align: middle;
        top: -1px;
        right: -2px;

    &:hover {
       background-color: var(--color-white);
       color: var(--tag-fill);
     }
    }

    @m gray {
      background-color: var(--tag-gray-fill);
      border-color: var(--tag-gray-border);
      color: var(--tag-gray-color);
      @when hit {
        border-color: var(--tag-gray-color);
      }

    & .s-tag__close:hover {
        background-color: var(--tag-gray-color);
        color: var(--color-white);
      }
    }
    @m primary {
      background-color: var(--tag-primary-fill);
      border-color: var(--tag-primary-border);
      color: var(--tag-primary-color);
      @when hit {
        border-color: var(--tag-primary-color);
      }

    & .s-tag__close:hover {
        background-color: var(--tag-primary-color);
        color: var(--color-white);
      }
    }
    @m success {
      background-color: var(--tag-success-fill);
      border-color: var(--tag-success-border);
      color: var(--tag-success-color);
      @when hit {
        border-color: var(--tag-success-color);
      }

    & .s-tag__close:hover {
        background-color: var(--tag-success-color);
        color: var(--color-white);
      }
    }
    @m warning {
      background-color: var(--tag-warning-fill);
      border-color: var(--tag-warning-border);
      color: var(--tag-warning-color);
      @when hit {
        border-color: var(--tag-warning-color);
      }

    & .s-tag__close:hover {
        background-color: var(--tag-warning-color);
        color: var(--color-white);
      }
    }
    @m danger {
      background-color: var(--tag-danger-fill);
      border-color: var(--tag-danger-border);
      color: var(--tag-danger-color);
      @when hit {
        border-color: var(--tag-danger-color);
      }

    & .s-tag__close:hover {
        background-color: var(--tag-danger-color);
        color: var(--color-white);
      }
    }
  }
  }
</style>
