/**
* Created by alex on 2017/3/13.
*/
<template>
  <ul :class="classes" :style="styles"><slot></slot></ul>
</template>

<script type="text/babel">
  import { oneOf } from '../../utils/assist';
  import Emitter from '../../mixins/emitter';

  const prefixName = 's-menu';

  export default {
    name: 'sMenu',
    mixins: [Emitter],
    props: {
      mode: {
        validator (value) {
          return oneOf(value, ['horizontal', 'vertical']);
        },
        default: 'vertical'
      },
      theme: {
        validator (value) {
          return oneOf(value, ['light', 'dark', 'primary']);
        },
        default: 'light'
      },
      activeName: {
        type: [String, Number]
      },
      openNames: {
        type: Array,
        default () {
          return [];
        }
      },
      accordion: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: '190px;'
      }
    },
    data () {
      return {
        currentActiveName: this.activeName
      };
    },
    computed: {
      classes () {
        let theme = this.theme;
        if (this.mode === 'vertical' && this.theme === 'primary') theme = 'light';
        return [
          `${prefixName}`,
          `${prefixName}-${theme}`,
          {
            [`${prefixName}-${this.mode}`]: this.mode
          }
        ];
      },
      styles () {
        let style = {};
        if (this.mode === 'vertical') style.width = this.width;
        return style;
      }
    },
    methods: {
      updateActiveName () {
        if (!this.currentActiveName) {
          this.currentActiveName = -1;
        }
        this.broadcast('Submenu', 'on-update-active-name', false);
        this.broadcast('MenuItem', 'on-update-active-name', this.currentActiveName);
      },
      updateOpenKeys (name) {
        const index = this.openNames.indexOf(name);
        if (index > -1) {
          this.openNames.splice(index, 1);
        } else {
          this.openNames.push(name);
        }
      },
      updateOpened () {
        this.$children.forEach(item => {
          if (item.$options.name === 'Submenu'
      )
        {
          if (this.openNames.indexOf(item.name) > -1) item.opened = true;
        }
      })
        ;
      }
    },
    mounted () {
      this.updateActiveName();
      this.updateOpened();
      this.$on('on-menu-item-select', (name) => {
        this.currentActiveName = name;
      this.$emit('on-select', name);
    });
    },
    watch: {
      openNames () {
        this.$emit('on-open-change', this.openNames);
      },
      activeName (val) {
        this.currentActiveName = val;
      },
      currentActiveName () {
        this.updateActiveName();
      }
    }
  }
</script>

<style >
  .s-menu {
    display: block;
    margin: 0;
    padding: 0;
    color: #657180;
    position: relative
  }

  .s-menu-horizontal.s-menu-light:after,
  .s-menu-vertical.s-menu-light:after {
    background: #d7dde4;
    position: absolute;
    bottom: 0;
    display: block;
    content: ''
  }

  .s-menu-horizontal {
    height: 60px;
    line-height: 60px
  }

  .s-menu-horizontal.s-menu-light:after {
    width: 100%;
    height: 1px;
    left: 0
  }

  .s-menu-vertical.s-menu-light:after {
    width: 1px;
    height: 100%;
    top: 0;
    right: 0;
    z-index: 1
  }

  .s-menu-light {
    background: #fff
  }

  .s-menu-dark {
    background: #464c5b
  }

  .s-menu-primary {
    background: #39f
  }

  .s-menu-item {
    display: block;
    position: relative;
    z-index: 1;
    cursor: pointer;
    transition: all .2s ease-in-out
  }

  .s-menu-item>i {
    margin-right: 6px
  }

  .s-menu-submenu-title span>i,
  .s-menu-submenu-title>i {
    margin-right: 8px
  }

  .s-menu-horizontal .s-menu-item,
  .s-menu-horizontal .s-menu-submenu {
    float: left;
    padding: 0 20px;
    position: relative;
    cursor: pointer;
    z-index: 3;
    transition: all .2s ease-in-out
  }

  .s-menu-light.s-menu-horizontal .s-menu-item,
  .s-menu-light.s-menu-horizontal .s-menu-submenu {
    height: inherit;
    line-height: inherit;
    border-bottom: 2px solid transparent;
    color: #657180
  }

  .s-menu-light.s-menu-horizontal .s-menu-item-active,
  .s-menu-light.s-menu-horizontal .s-menu-item:hover,
  .s-menu-light.s-menu-horizontal .s-menu-submenu-active,
  .s-menu-light.s-menu-horizontal .s-menu-submenu:hover {
    color: #39f;
    border-bottom: 2px solid #39f
  }

  .s-menu-dark.s-menu-horizontal .s-menu-item,
  .s-menu-dark.s-menu-horizontal .s-menu-submenu {
    color: #9ea7b4
  }

  .s-menu-dark.s-menu-horizontal .s-menu-item-active,
  .s-menu-dark.s-menu-horizontal .s-menu-item:hover,
  .s-menu-dark.s-menu-horizontal .s-menu-submenu-active,
  .s-menu-dark.s-menu-horizontal .s-menu-submenu:hover,
  .s-menu-primary.s-menu-horizontal .s-menu-item,
  .s-menu-primary.s-menu-horizontal .s-menu-submenu {
    color: #fff
  }

  .s-menu-primary.s-menu-horizontal .s-menu-item-active,
  .s-menu-primary.s-menu-horizontal .s-menu-item:hover,
  .s-menu-primary.s-menu-horizontal .s-menu-submenu-active,
  .s-menu-primary.s-menu-horizontal .s-menu-submenu:hover {
    background: #3091f2
  }

  .s-menu-horizontal .s-menu-submenu .s-select-dropdown {
    min-width: 100%;
    width: auto;
    max-height: none
  }

  .s-menu-horizontal .s-menu-submenu .s-select-dropdown .s-menu-item {
    height: auto;
    line-height: normal;
    border-bottom: 0;
    float: none
  }

  .s-menu-item-group {
    line-height: normal
  }

  .s-menu-item-group-title {
    height: 30px;
    line-height: 30px;
    padding-left: 8px;
    font-size: 12px;
    color: #999
  }

  .s-menu-item-group>ul {
    padding: 0!important;
    list-style: none!important
  }

  .s-menu-vertical .s-menu-item,
  .s-menu-vertical .s-menu-submenu-title {
    padding: 14px 24px;
    position: relative;
    cursor: pointer;
    z-index: 1;
    transition: all .2s ease-in-out
  }

  .s-menu-vertical .s-menu-item:hover,
  .s-menu-vertical .s-menu-submenu-title:hover {
    background: #f3f3f3
  }

  .s-menu-vertical .s-menu-submenu-title-icon {
    float: right;
    position: relative;
    top: 8px
  }

  .s-menu-submenu-title-icon {
    transition: transform .2s ease-in-out
  }

  .s-menu-opened .s-menu-submenu-title-icon {
    -ms-transform: rotate(180deg);
    transform: rotate(180deg)
  }

  .s-menu-vertical .s-menu-submenu .s-menu-item {
    padding-left: 43px
  }

  .s-menu-vertical .s-menu-item-group-title {
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    padding-left: 28px
  }

  .s-menu-dark.s-menu-vertical .s-menu-item-group-title {
    color: #657180
  }

  .s-menu-light.s-menu-vertical .s-menu-item {
    border-right: 2px solid transparent
  }

  .s-menu-light.s-menu-vertical .s-menu-item-active:not(.s-menu-submenu) {
    color: #39f;
    border-right: 2px solid #39f;
    z-index: 2
  }

  .s-menu-dark.s-menu-vertical .s-menu-item,
  .s-menu-dark.s-menu-vertical .s-menu-submenu-title {
    color: #9ea7b4
  }

  .s-menu-dark.s-menu-vertical .s-menu-item-active:not(.s-menu-submenu),
  .s-menu-dark.s-menu-vertical .s-menu-item-active:not(.s-menu-submenu):hover,
  .s-menu-dark.s-menu-vertical .s-menu-submenu-title-active:not(.s-menu-submenu),
  .s-menu-dark.s-menu-vertical .s-menu-submenu-title-active:not(.s-menu-submenu):hover {
    background: #313540
  }

  .s-menu-dark.s-menu-vertical .s-menu-item:hover,
  .s-menu-dark.s-menu-vertical .s-menu-submenu-title:hover {
    color: #fff;
    background: #464c5b
  }

  .s-menu-dark.s-menu-vertical .s-menu-item-active:not(.s-menu-submenu),
  .s-menu-dark.s-menu-vertical .s-menu-submenu-title-active:not(.s-menu-submenu) {
    color: #39f;
    border-right: 2px solid #39f
  }

  .s-menu-dark.s-menu-vertical .s-menu-submenu .s-menu-item:hover {
    color: #fff;
    background: 0 0!important
  }

  .s-menu-dark.s-menu-vertical .s-menu-submenu .s-menu-item-active,
  .s-menu-dark.s-menu-vertical .s-menu-submenu .s-menu-item-active:hover {
    border-right: none;
    color: #fff;
    background: #39f!important
  }

  .s-menu-dark.s-menu-vertical .s-menu-item-active .s-menu-submenu-title {
    color: #fff
  }

  .s-menu-dark.s-menu-vertical .s-menu-opened {
    background: #313540
  }

  .s-menu-dark.s-menu-vertical .s-menu-opened .s-menu-submenu-title {
    background: #464c5b
  }

  .s-menu-horizontal .s-menu-submenu .s-select-dropdown .s-menu-item {
    margin: 0;
    clear: both;
    color: #657180;
    white-space: nowrap;
    list-style: none;
    cursor: pointer;
    transition: background .2s ease-in-out
  }

  .s-menu-horizontal .s-menu-submenu .s-select-dropdown .s-menu-item-focus,
  .s-menu-horizontal .s-menu-submenu .s-select-dropdown .s-menu-item:hover {
    background: #f3f3f3
  }

  .s-menu-horizontal .s-menu-submenu .s-select-dropdown .s-menu-item-disabled {
    color: #c3cbd6;
    cursor: not-allowed
  }

  .s-menu-horizontal .s-menu-submenu .s-select-dropdown .s-menu-item-disabled:hover {
    color: #c3cbd6;
    background-color: #fff;
    cursor: not-allowed
  }

  .s-menu-horizontal .s-menu-submenu .s-select-dropdown .s-menu-item-selected,
  .s-menu-horizontal .s-menu-submenu .s-select-dropdown .s-menu-item-selected:hover {
    color: #fff;
    background: rgba(51, 153, 255, .9)
  }

  .s-menu-horizontal .s-menu-submenu .s-select-dropdown .s-menu-item-selected.s-menu-horizontal .s-menu-submenu .s-select-dropdown .s-menu-item-focus {
    background: rgba(45, 135, 225, .91)
  }

  .s-menu-horizontal .s-menu-submenu .s-select-dropdown .s-menu-item-divided {
    margin-top: 5px;
    border-top: 1px solid #e3e8ee
  }

  .s-menu-horizontal .s-menu-submenu .s-select-dropdown .s-menu-item-divided:before {
    content: '';
    height: 5px;
    display: block;
    margin: 0 -16px;
    background-color: #fff;
    position: relative;
    top: -7px
  }

  .s-menu-horizontal .s-menu-submenu .s-select-dropdown .s-menu-item,
  .s-menu-large .s-menu-horizontal .s-menu-submenu .s-select-dropdown .s-menu-item {
    padding: 7px 16px 8px;
    font-size: 14px!important
  }
  .s-menu-submenu-title-icon {
    position: absolute;
    top: 50%;
    right: -4px;
    margin-top: -5px;
    transition: transform .3s;
    font-size: 12px
  }
  .s-menu-opened .s-menu-submenu-title-icon{
    transform: rotate(180deg);
  }
  .slide-up-enter-active,.slide-up-leave-active {
    opacity: 1;
    transform: scaleY(1);
    transition: transform .3s cubic-bezier(.23,1,.32,1) .1s,opacity .3s cubic-bezier(.23,1,.32,1) .1s;
    transform-origin: center top
  }

  .slide-up-enter,.slide-up-leave-active {
    opacity: 0;
    transform: scaleY(0)
  }
</style>
