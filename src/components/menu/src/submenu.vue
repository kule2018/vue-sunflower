/**
* Created by alex on 2017/3/13.
*/
<template>
  <li :class="classes" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
    <div :class="[prefixCls + '-submenu-title']" ref="reference" @click="handleClick">
      <slot name="title"></slot>
      <i class="s-menu-submenu-title-icon iconfont icon-bottom"></i>
    </div>
    <ul :class="[prefixCls]" v-if="mode === 'vertical'" v-show="opened"><slot></slot></ul>
    <transition name="slide-up" v-else>
      <Drop
        v-show="opened"
        placement="bottom"
        ref="drop"
        :style="dropStyle"><slot></slot></Drop>
    </transition>
  </li>
</template>

<script type="text/babel">
  import Drop from '../../dropdown/src/menu-dropdown';
  import { getStyle } from '../../utils/assist';
  import Emitter from '../../mixins/emitter';

  const prefixName = 's-menu'

  export default {
    name: 'sSubmenu',
    mixins: [ Emitter ],
    components: { Drop },
    props: {
      name: {
        type: [String, Number],
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        prefixCls: prefixName,
        active: false,
        opened: false,
        dropWidth: parseFloat(getStyle(this.$el, 'width'))
      };
    },
    computed: {
      classes () {
        return [
          `${prefixName}-submenu`,
          {
            [`${prefixName}-item-active`]: this.active,
            [`${prefixName}-opened`]: this.opened,
            [`${prefixName}-submenu-disabled`]: this.disabled
          }
        ];
      },
      mode () {
        return this.$parent.mode;
      },
      accordion () {
        return this.$parent.accordion;
      },
      dropStyle () {
        let style = {};
        if (this.dropWidth) style.minWidth = `${this.dropWidth}px`;
        return style;
      }
    },
    methods: {
      handleMouseenter () {
        if (this.disabled) return;
        if (this.mode === 'vertical') return;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.$parent.updateOpenKeys(this.name);
        this.opened = true;
      }, 250);
      },
      handleMouseleave () {
        if (this.disabled) return;
        if (this.mode === 'vertical') return;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.$parent.updateOpenKeys(this.name);
        this.opened = false;
      }, 150);
      },
      handleClick () {
        if (this.disabled) return;
        if (this.mode === 'horizontal') return;
        const opened = this.opened;
        if (this.accordion) {
          this.$parent.$children.forEach(item => {
            if (item.$options.name === 'Submenu') item.opened = false;
        });
        }
        this.opened = !opened;
        this.$parent.updateOpenKeys(this.name);
      }
    },
    watch: {
      mode (val) {
        if (val === 'horizontal') {
          this.$refs.drop.update();
        }
      },
      opened (val) {
        if (this.mode === 'vertical') return;
        if (val) {
          this.dropWidth = parseFloat(getStyle(this.$el, 'width'));
          this.$refs.drop.update();
        } else {
          this.$refs.drop.destroy();
        }
      }
    },
    mounted () {
      this.$on('on-menu-item-select', (name) => {
        if (this.mode === 'horizontal') this.opened = false;
      this.dispatch('sMenu', 'on-menu-item-select', name);
      return true;
    });
      this.$on('on-update-active-name', (status) => {
        this.active = status;
    });
    }
  };
</script>


