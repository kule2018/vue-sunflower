<template>
  <div
    :class="[prefixCls]"
    v-clickoutside="handleClose"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave">
    <div :class="[prefixCls + '-rel']" ref="reference" @click="handleClick"><slot></slot></div>
    <transition :name="transition">
      <Drop v-show="currentVisible" :placement="placement" ref="drop"><slot name="list"></slot></Drop>
    </transition>
  </div>
</template>

<script>
  import Drop from './Menu-dropdown';
  import clickoutside from '../extra/directives/clickoutside';
  import { oneOf } from '../extra/utils/assist';
  const prefixName = 's-dropdown';
  export default {
    name: 's-dropdown',
    directives: { clickoutside },
    components: { Drop },
    props: {
      trigger: {
        validator (value) {
          return oneOf(value, ['click', 'hover', 'custom']);
        },
        default: 'hover'
      },
      placement: {
        validator (value) {
          return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
        },
        default: 'bottom'
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      transition () {
        return ['bottom-start', 'bottom', 'bottom-end'].indexOf(this.placement) > -1 ? 'slide-up' : 'fade';
      }
    },
    data () {
      return {
        prefixCls: prefixName,
        currentVisible: this.visible
      };
    },
    watch: {
      visible (val) {
        this.currentVisible = val;
      },
      currentVisible (val) {
        if (val) {
          this.$refs.drop.update();
        } else {
          this.$refs.drop.destroy();
        }
        this.$emit('on-visible-change', val);
      }
    },
    methods: {
      handleClick () {
        if (this.trigger === 'custom') return false;
        if (this.trigger !== 'click') {
          return false;
        }
        this.currentVisible = !this.currentVisible;
      },
      handleMouseenter () {
        if (this.trigger === 'custom') return false;
        if (this.trigger !== 'hover') {
          return false;
        }
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.currentVisible = true;
        }, 250);
      },
      handleMouseleave () {
        if (this.trigger === 'custom') return false;
        if (this.trigger !== 'hover') {
          return false;
        }
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.currentVisible = false;
        }, 150);
      },
      handleClose () {
        if (this.trigger === 'custom') return false;
        if (this.trigger !== 'click') {
          return false;
        }
        this.currentVisible = false;
      },
      hasParent () {
        const $parent = this.$parent.$parent.$parent;
        if ($parent && $parent.$options.name === 'sDropdown') {
          return $parent;
        } else {
          return false;
        }
      }
    },
    mounted () {
      this.$on('on-click', (key) => {
        const $parent = this.hasParent();
        if ($parent) $parent.$emit('on-click', key);
      });
      this.$on('on-hover-click', () => {
        const $parent = this.hasParent();
        if ($parent) {
          this.$nextTick(() => {
            if (this.trigger === 'custom') return false;
            this.currentVisible = false;
          });
          $parent.$emit('on-hover-click');
        } else {
          this.$nextTick(() => {
            if (this.trigger === 'custom') return false;
            this.currentVisible = false;
          });
        }
      });
      this.$on('on-haschild-click', () => {
        this.$nextTick(() => {
          if (this.trigger === 'custom') return false;
          this.currentVisible = true;
        });
        const $parent = this.hasParent();
        if ($parent) $parent.$emit('on-haschild-click');
      });
    }
  };
</script>

<style >
.s-dropdown{
  width: 100%;
}
.s-dropdown-item{
  transition: background .2s ease-in-out;
  list-style: none;
  clear: both;
  white-space: nowrap
}
.s-dropdown{
  display: inline
}
.s-dropdown-rel{
  display: inline-block;
}
.s-dropdown .s-select-dropdown {
  overflow: visible;
  max-height: none
}
.s-dropdown-rel {
  position: relative
}

.s-dropdown-menu {
  min-width: 100px;
  padding-left: 0;
}

.s-dropdown-item {
  margin: 0;
  padding: 7px 16px;
  color: #657180;
  font-size: 12px!important;
  cursor: pointer
}

.s-dropdown-item-focus,.s-dropdown-item:hover {
  background: #f3f3f3
}

.s-dropdown-item-disabled {
  color: #c3cbd6;
  cursor: not-allowed
}

.s-dropdown-item-disabled:hover {
  color: #c3cbd6;
  background-color: #fff;
  cursor: not-allowed
}

.s-dropdown-item-selected,.s-dropdown-item-selected:hover {
  color: #fff;
  background: rgba(51,153,255,.9)
}

.s-dropdown-item-selected.s-dropdown-item-focus {
  background: rgba(45,135,225,.91)
}

.s-dropdown-item-divided {
  margin-top: 5px;
  border-top: 1px solid #e3e8ee
}

.s-dropdown-item-divided:before {
  content: '';
  height: 5px;
  display: block;
  margin: 0 -16px;
  background-color: #fff;
  position: relative;
  top: -7px
}
.s-dropdown-large .s-dropdown-item {
  padding: 7px 16px 8px;
  font-size: 14px!important
}
</style>
