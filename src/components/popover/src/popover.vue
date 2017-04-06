<template>
  <span>
    <transition :name="transition" @after-leave="doDestroy">
      <div
        class="s-popover"
        :class="[popperClass]"
        ref="popper"
        v-show="!disabled && showPopper"
        :style="{ width: width + 'px' }">
        <div class="s-popover-title" v-if="title" v-text="title"></div>
        <slot>{{ content }}</slot>
      </div>
    </transition>
    <slot name="reference"></slot>
  </span>
</template>

<script>
import Popper from '../../../extra/utils/vue-popper';
import { on, off } from '../../../extra/utils/dom';

export default {
  name: 'sPopover',

  mixins: [Popper],

  props: {
    trigger: {
      type: String,
      default: 'click',
      validator: value => ['click', 'focus', 'hover', 'manual'].indexOf(value) > -1
    },
    title: String,
    disabled: Boolean,
    content: String,
    reference: {},
    popperClass: String,
    width: {},
    visibleArrow: {
      default: true
    },
    transition: {
      type: String,
      default: 'fade-in-linear'
    }
  },

  watch: {
    showPopper(newVal, oldVal) {
      newVal ? this.$emit('show') : this.$emit('hide');
    }
  },

  mounted() {
    let reference = this.reference || this.$refs.reference;
    const popper = this.popper || this.$refs.popper;

    if (!reference && this.$slots.reference && this.$slots.reference[0]) {
      reference = this.referenceElm = this.$slots.reference[0].elm;
    }
    if (this.trigger === 'click') {
      on(reference, 'click', () => { this.showPopper = !this.showPopper; });
      on(document, 'click', this.handleDocumentClick);
    } else if (this.trigger === 'hover') {
      on(reference, 'mouseenter', this.handleMouseEnter);
      on(popper, 'mouseenter', this.handleMouseEnter);
      on(reference, 'mouseleave', this.handleMouseLeave);
      on(popper, 'mouseleave', this.handleMouseLeave);
    } else if (this.trigger === 'focus') {
      let found = false;

      if ([].slice.call(reference.children).length) {
        const children = reference.childNodes;
        const len = children.length;
        for (let i = 0; i < len; i++) {
          if (children[i].nodeName === 'INPUT' ||
              children[i].nodeName === 'TEXTAREA') {
            on(children[i], 'focus', () => { this.showPopper = true; });
            on(children[i], 'blur', () => { this.showPopper = false; });
            found = true;
            break;
          }
        }
      }
      if (found) return;
      if (reference.nodeName === 'INPUT' ||
        reference.nodeName === 'TEXTAREA') {
        on(reference, 'focus', () => { this.showPopper = true; });
        on(reference, 'blur', () => { this.showPopper = false; });
      } else {
        on(reference, 'mousedown', () => { this.showPopper = true; });
        on(reference, 'mouseup', () => { this.showPopper = false; });
      }
    }
  },

  methods: {
    handleMouseEnter() {
      this.showPopper = true;
      clearTimeout(this._timer);
    },
    handleMouseLeave() {
      this._timer = setTimeout(() => {
        this.showPopper = false;
      }, 200);
    },
    handleDocumentClick(e) {
      let reference = this.reference || this.$refs.reference;
      const popper = this.popper || this.$refs.popper;

      if (!reference && this.$slots.reference && this.$slots.reference[0]) {
        reference = this.referenceElm = this.$slots.reference[0].elm;
      }
      if (!this.$el ||
        !reference ||
        this.$el.contains(e.target) ||
        reference.contains(e.target) ||
        !popper ||
        popper.contains(e.target)) return;
      this.showPopper = false;
    }
  },

  destroyed() {
    const reference = this.reference;

    off(reference, 'mouseup');
    off(reference, 'mousedown');
    off(reference, 'focus');
    off(reference, 'blur');
    off(reference, 'mouseleave');
    off(reference, 'mouseenter');
    off(document, 'click', this.handleDocumentClick);
  }
};
</script>
<style>
  .s-popover {
    position: absolute;
    background: #fff;
    min-width: 150px;
    border-radius: 2px;
    border: 1px solid #d1dbe5;
    padding: 10px;
    z-index: 2000;
    font-size: 12px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12),0 0 6px 0 rgba(0,0,0,.04)
  }

  .s-popover .popper-arrow,.s-popover .popper-arrow:after {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid
  }

  .s-popover .popper-arrow {
    border-width: 6px
  }

  .s-popover .popper-arrow:after {
    content: " ";
    border-width: 6px
  }

  .s-popover[x-placement^=top] {
    margin-bottom: 12px
  }

  .s-popover[x-placement^=top] .popper-arrow {
    bottom: -6px;
    left: 50%;
    margin-right: 3px;
    border-top-color: #d1dbe5;
    border-bottom-width: 0
  }

  .s-popover[x-placement^=top] .popper-arrow:after {
    bottom: 1px;
    margin-left: -6px;
    border-top-color: #fff;
    border-bottom-width: 0
  }

  .s-popover[x-placement^=bottom] {
    margin-top: 12px
  }

  .s-popover[x-placement^=bottom] .popper-arrow {
    top: -6px;
    left: 50%;
    margin-right: 3px;
    border-top-width: 0;
    border-bottom-color: #d1dbe5
  }

  .s-popover[x-placement^=bottom] .popper-arrow:after {
    top: 1px;
    margin-left: -6px;
    border-top-width: 0;
    border-bottom-color: #fff
  }

  .s-popover[x-placement^=right] {
    margin-left: 12px
  }

  .s-popover[x-placement^=right] .popper-arrow {
    top: 50%;
    left: -6px;
    margin-bottom: 3px;
    border-right-color: #d1dbe5;
    border-left-width: 0
  }

  .s-popover[x-placement^=right] .popper-arrow:after {
    bottom: -6px;
    left: 1px;
    border-right-color: #fff;
    border-left-width: 0
  }

  .s-popover[x-placement^=left] {
    margin-right: 12px
  }

  .s-popover[x-placement^=left] .popper-arrow {
    top: 50%;
    right: -6px;
    margin-bottom: 3px;
    border-right-width: 0;
    border-left-color: #d1dbe5
  }

  .s-popover[x-placement^=left] .popper-arrow:after {
    right: 1px;
    bottom: -6px;
    margin-left: -6px;
    border-right-width: 0;
    border-left-color: #fff
  }

  .s-popover-title {
    color: #1f2d3d;
    font-size: 13px;
    line-height: 1;
    margin-bottom: 9px
  }

</style>
