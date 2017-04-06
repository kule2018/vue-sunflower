<template>
  <div
    class="s-select-dropdown"
    :class="[{ 'is-multiple': $parent.multiple }, popperClass]"
    :style="{ minWidth: minWidth }">
    <slot></slot>
  </div>
</template>

<script type="text/babel">
  import Popper from '../../../extra/utils/vue-popper';

  export default {
    name: 'sSelectDropdown',

    componentName: 'sSelectDropdown',

    mixins: [Popper],

    props: {
      placement: {
        default: 'bottom-start'
      },

      boundariesPadding: {
        default: 0
      },

      popperOptions: {
        default() {
          return {
            forceAbsolute: true,
            gpuAcceleration: false
          };
        }
      }
    },

    data() {
      return {
        minWidth: ''
      };
    },

    computed: {
      popperClass() {
        return this.$parent.popperClass;
      }
    },

    watch: {
      '$parent.inputWidth'() {
        this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';
      }
    },

    mounted() {
      this.referenceElm = this.$parent.$refs.reference.$el;
      this.$parent.popperElm = this.popperElm = this.$el;
      this.$on('updatePopper', this.updatePopper);
      this.$on('destroyPopper', this.destroyPopper);
    },
    methods: {
      update () {
        if (this.popper) {
          this.$nextTick(() => {
            this.popper.update();
          });
        } else {
          this.$nextTick(() => {
            this.popper = new Popper(this.$parent.$refs.reference, this.$el, {
              gpuAcceleration: false,
              placement: this.placement,
              boundariesPadding: 0,
              forceAbsolute: true,
              boundariesElement: 'body'
            });
            this.popper.onCreate(popper => {
              this.resetTransformOrigin(popper);
            });
          });
        }
        // set a height for parent is Modal and Select's width is 100%
        if (this.$parent.$options.name === 'iSelect') {
          this.width = parseInt(getStyle(this.$parent.$el, 'width'));
        }
      },
      destroy () {
        if (this.popper) {
          this.resetTransformOrigin(this.popper);
          setTimeout(() => {
            this.popper.destroy();
            this.popper = null;
          }, 300);
        }
      },
      resetTransformOrigin(popper) {
        let placementMap = {top: 'bottom', bottom: 'top'};
        let placement = popper._popper.getAttribute('x-placement').split('-')[0];
        let origin = placementMap[placement];
        popper._popper.style.transformOrigin = `center ${ origin }`;
      }
    },
    created () {
      this.$on('on-update-popper', this.update);
      this.$on('on-destroy-popper', this.destroy);
    },
    beforeDestroy () {
      if (this.popper) {
        this.popper.destroy();
      }
    }
  };
</script>

<style>
  @charset "UTF-8";
  @import "../../theme-default/common/var.css";

  @component-namespace s {

    @b select-dropdown {
      position: absolute;
      z-index: 1001;
      border: var(--select-dropdown-border);
      border-radius: var(--border-radius-small);
      background-color: var(--select-dropdown-background);
      box-shadow: var(--select-dropdown-shadow);
      box-sizing: border-box;
      margin: 5px 0;

      @when multiple {
      & .s-select-dropdown__item.selected {
        color: var(--select-option-selected);
        background-color: var(--select-dropdown-background);

      &.hover {
         background-color: var(--select-option-hover-background);
       }

      &::after {
         position: absolute;
         right: 10px;
         font-family: 'element-icons';
         content: "\E608";
         font-size: 11px;
         -webkit-font-smoothing: antialiased;
         -moz-osx-font-smoothing: grayscale;
       }
      }
    }

    .s-scrollbar.is-empty .s-select-dropdown__list{
      padding: 0;
    }
  }

  @b select-dropdown__empty {
    padding: var(--select-dropdown-empty-padding);
    margin: 0;
    text-align: center;
    color: var(--select-dropdown-empty-color);
    font-size: var(--select-font-size);
  }

  @b select-dropdown__wrap {
    max-height: var(--select-dropdown-max-height);
  }

  @b select-dropdown__list {
    list-style: none;
    padding: var(--select-dropdown-padding);
    margin: 0;
    box-sizing: border-box;
  }
  }

</style>
