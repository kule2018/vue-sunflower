
/**
* Created by alex on 2017/3/14.
*/
<template>
  <div :class="classes">
    <div :class="[prefixCls + '-bar']">
      <div :class="[prefixCls + '-nav-container']">
        <div :class="[prefixCls + '-nav-wrap']">
          <div :class="[prefixCls + '-nav-scroll']">
            <div :class="[prefixCls + '-nav']" ref="nav">
              <div :class="barClasses" :style="barStyle"></div>
              <div :class="tabCls(item)" v-for="(item, index) in navList" @click="handleChange(index)">
                {{ item.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="contentClasses" :style="contentStyle"><slot></slot></div>
  </div>
</template>

<script type="text/babel">
  /*import Icon from '../icon/icon.vue';*/
  import { oneOf, getStyle } from '../../utils/assist';
  const prefixName = 's-tabs';
  export default {
    name: 'sTab',
    props: {
      value: {
        type: [String, Number]
      },
      type: {
        validator (value) {
          return oneOf(value, ['line', 'card']);
        },
        default: 'line'
      },
      size: {
        validator (value) {
          return oneOf(value, ['small', 'default']);
        },
        default: 'default'
      },
      animated: {
        type: Boolean,
        default: true
      },
      closable: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        prefixCls: prefixName,
        navList: [],
        barWidth: 0,
        barOffset: 0,
        activeKey: this.value
      };
    },
    computed: {
      classes () {
        return [
          `${prefixName}`,
          {
            [`${prefixName}-card`]: this.type === 'card',
            [`${prefixName}-mini`]: this.size === 'small' && this.type === 'line',
            [`${prefixName}-no-animation`]: !this.animated
          }
        ];
      },
      contentClasses () {
        return [
          `${prefixName}-content`,
          {
            [`${prefixName}-content-animated`]: this.animated
          }
        ];
      },
      barClasses () {
        return [
          `${prefixName}-ink-bar`,
          {
            [`${prefixName}-ink-bar-animated`]: this.animated
          }
        ];
      },
      contentStyle () {
        const x = this.navList.findIndex((nav) => nav.name === this.activeKey);
        const p = x === 0 ? '0%' : `-${x}00%`;
        let style = {};
        if (x > -1) {
          style = {
            transform: `translateX(${p}) translateZ(0px)`
          };
        }
        return style;
      },
      barStyle () {
        let style = {
          display: 'none',
          width: `${this.barWidth}px`
        };
        if (this.type === 'line') style.display = 'block';
        if (this.animated) {
          style.transform = `translate3d(${this.barOffset}px, 0px, 0px)`;
        } else {
          style.left = `${this.barOffset}px`;
        }
        return style;
      }
    },
    methods: {
      getTabs () {
        return this.$children.filter(item => item.$options.name === 'sTabPane');
      },
      updateNav () {
        this.navList = [];
        this.getTabs().forEach((pane, index) => {
          this.navList.push({
            label: pane.label,
            icon: pane.icon || '',
            name: pane.currentName || index,
            disabled: pane.disabled,
            closable: pane.closable
          });
          if (!pane.currentName) pane.currentName = index;
          if (index === 0) {
            if (!this.activeKey) this.activeKey = pane.currentName || index;
          }
        });
        this.updateStatus();
        this.updateBar();
      },
      updateBar () {
        this.$nextTick(() => {
          const index = this.navList.findIndex((nav) => nav.name === this.activeKey);
          const prevTabs = this.$refs.nav.querySelectorAll(`.${prefixName}-tab`);
          const tab = prevTabs[index];
          this.barWidth = parseFloat(getStyle(tab, 'width'));
          if (index > 0) {
            let offset = 0;
            const gutter = this.size === 'small' ? 0 : 16;
            for (let i = 0; i < index; i++) {
              offset += parseFloat(getStyle(prevTabs[i], 'width')) + gutter;
            }
            this.barOffset = offset;
          } else {
            this.barOffset = 0;
          }
        });
      },
      updateStatus () {
        const tabs = this.getTabs();
        tabs.forEach(tab => tab.show = (tab.currentName === this.activeKey) || this.animated);
      },
      tabCls (item) {
        return [
          `${prefixName}-tab`,
          {
            [`${prefixName}-tab-disabled`]: item.disabled,
            [`${prefixName}-tab-active`]: item.name === this.activeKey
          }
        ];
      },
      handleChange (index) {
        const nav = this.navList[index];
        if (nav.disabled) return;
        this.activeKey = nav.name;
        this.$emit('input', nav.name);
        this.$emit('on-click', nav.name);
      },
      handleRemove (index) {
        const tabs = this.getTabs();
        const tab = tabs[index];
        tab.$destroy(true);
        if (tab.currentName === this.activeKey) {
          const newTabs = this.getTabs();
          let activeKey = -1;
          if (newTabs.length) {
            const leftNoDisabledTabs = tabs.filter((item, itemIndex) => !item.disabled && itemIndex < index);
            const rightNoDisabledTabs = tabs.filter((item, itemIndex) => !item.disabled && itemIndex > index);
            if (rightNoDisabledTabs.length) {
              activeKey = rightNoDisabledTabs[0].currentName;
            } else if (leftNoDisabledTabs.length) {
              activeKey = leftNoDisabledTabs[leftNoDisabledTabs.length - 1].currentName;
            } else {
              activeKey = newTabs[0].currentName;
            }
          }
          this.activeKey = activeKey;
        }
        this.$emit('on-tab-remove', tab.currentName);
        this.updateNav();
      },
      showClose (item) {
        if (this.type === 'card') {
          if (item.closable !== null) {
            return item.closable;
          } else {
            return this.closable;
          }
        } else {
          return false;
        }
      }
    },
    watch: {
      value (val) {
        this.activeKey = val;
      },
      activeKey () {
        this.updateBar();
        this.updateStatus();
      }
    }
  };
</script>
<style>
  .s-tabs {
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    color: #657180;
    zoom:1}

  .s-tabs:after {
    clear: both;
    font-size: 0;
    height: 0
  }

  .s-tabs-bar {
    outline: 0;
    border-bottom: 1px solid #d7dde4;
    margin-bottom: 16px
  }

  .s-tabs-nav-container,.s-tabs-nav-wrap {
    margin-bottom: -1px;
    overflow: hidden
  }
  .s-tabs-nav-container:after,.s-tabs-nav-container:before,.s-tabs:after,.s-tabs:before {
    content: "";
    display: table
  }
  .s-tabs-ink-bar {
    height: 2px;
    box-sizing: border-box;
    background-color: #39f;
    position: absolute;
    left: 0;
    bottom: 1px;
    z-index: 1;
    transition: transform .3s ease-in-out;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0
  }

  .s-tabs-nav-container {
    line-height: 1.5;
    font-size: 14px;
    box-sizing: border-box;
    white-space: nowrap;
    position: relative;
    zoom:1}

  .s-tabs-nav-container:after {
    clear: both;
    font-size: 0;
    height: 0
  }

  .s-tabs-nav-container-scrolling {
    padding-left: 32px;
    padding-right: 32px
  }

  .s-tabs-nav-scroll {
    overflow: hidden;
    white-space: nowrap
  }

  .s-tabs-nav {
    padding-left: 0;
    margin: 0;
    float: left;
    list-style: none;
    box-sizing: border-box;
    position: relative;
    transition: transform .5s ease-in-out
  }

  .s-tabs-nav:after,.s-tabs-nav:before {
    display: table;
    content: " "
  }

  .s-tabs-nav:after {
    clear: both
  }

  .s-tabs-nav .s-tabs-tab-disabled {
    pointer-events: none;
    cursor: default;
    color: #ccc
  }

  .s-tabs-nav .s-tabs-tab {
    display: inline-block;
    height: 100%;
    padding: 8px 16px;
    margin-right: 16px;
    box-sizing: border-box;
    cursor: pointer;
    text-decoration: none;
    position: relative;
    transition: color .3s ease-in-out
  }

  .s-tabs-nav .s-tabs-tab:hover {
    color: #5cadff
  }

  .s-tabs-nav .s-tabs-tab:active {
    color: #3091f2
  }

  .s-tabs-nav .s-tabs-tab .s-icon {
    width: 14px;
    height: 14px;
    margin-right: 8px
  }

  .s-tabs-nav .s-tabs-tab-active {
    color: #39f
  }

  .s-tabs-mini .s-tabs-nav-container {
    font-size: 14px
  }

  .s-tabs-mini .s-tabs-tab {
    margin-right: 0;
    padding: 8px 16px;
    font-size: 12px
  }

  .s-tabs .s-tabs-content-animated {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: row;
    flex-direction: row;
    will-change: transform;
    transition: transform .3s ease-in-out
  }

  .s-tabs .s-tabs-tabpane {
    -ms-flex-negative: 0;
    flex-shrink: 0;
    width: 100%;
    transition: opacity .3s;
    opacity: 1
  }

  .s-tabs .s-tabs-tabpane-inactive {
    opacity: 0;
    height: 0
  }

  .s-tabs.s-tabs-card>.s-tabs-bar .s-tabs-nav-container {
    height: 32px
  }

  .s-tabs.s-tabs-card>.s-tabs-bar .s-tabs-tab {
    margin: 0 4px 0 0;
    height: 31px;
    padding: 5px 16px 4px;
    border: 1px solid #d7dde4;
    border-bottom: 0;
    border-radius: 4px 4px 0 0;
    transition: all .3s ease-in-out;
    background: #f5f7f9
  }

  .s-tabs.s-tabs-card>.s-tabs-bar .s-tabs-tab-active {
    height: 32px;
    padding-bottom: 5px;
    background: #fff;
    transform: translateZ(0);
    border-color: #d7dde4;
    color: #39f
  }

  .s-tabs.s-tabs-card>.s-tabs-bar .s-tabs-nav-wrap {
    margin-bottom: 0
  }

  .s-tabs.s-tabs-card>.s-tabs-bar .s-tabs-tab .s-icon-ios-close-empty {
    width: 0;
    height: 22px;
    font-size: 22px;
    margin-right: 0;
    color: #999;
    text-align: right;
    vertical-align: middle;
    overflow: hidden;
    position: relative;
    top: -1px;
    -ms-transform-origin: 100% 50%;
    transform-origin: 100% 50%;
    transition: all .3s ease-in-out
  }

  .s-menu,.s-menu-item {
    list-style: none;
    font-size: 14px;
    outline: 0
  }

  .s-tabs.s-tabs-card>.s-tabs-bar .s-tabs-tab .s-icon-ios-close-empty:hover {
    color: #444
  }

  .s-tabs.s-tabs-card>.s-tabs-bar .s-tabs-tab-active .s-icon-ios-close-empty,.s-tabs.s-tabs-card>.s-tabs-bar .s-tabs-tab:hover .s-icon-ios-close-empty {
    width: 14px;
    transform: translateZ(0)
  }

  .s-tabs-no-animation .s-tabs-content {
    -ms-transform: none!important;
    transform: none!important
  }

  .s-tabs-no-animation .s-tabs-content>.s-tabs-tabpane-inactive {
    display: none
  }
</style>
