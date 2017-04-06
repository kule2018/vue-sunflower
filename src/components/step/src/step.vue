/**
* Created by alex on 2017/3/13.
*/
<template>
  <div :class="wrapClasses" :style="styles">
    <div :class="[prefixCls + '-tail']"><i></i></div>
    <div :class="[prefixCls + '-head']">
      <div :class="[prefixCls + '-head-inner']">
        <span v-if="!icon && currentStatus != 'finish' && currentStatus != 'error'">{{ stepNumber }}</span>
        <i v-else :class="iconClasses"></i>
        <!--<span v-else :class="iconClasses"></span>-->
      </div>
    </div>
    <div :class="[prefixCls + '-main']">
      <div :class="[prefixCls + '-title']">{{ title }}</div>
      <div v-if="content" :class="[prefixCls + '-content']">{{ content }}</div>
    </div>
  </div>
</template>

<script type="text/babel">
  import { oneOf } from '../../utils/assist';

  const prefixName = 's-steps';
  const iconPrefixCls = 'iconfont';

  export default {
    name: 'sStep',
    props: {
      status: {
        validator (value) {
          return oneOf(value, ['wait', 'process', 'finish', 'error']);
        }
      },
      title: {
        type: String,
        default: ''
      },
      content: {
        type: String
      },
      icon: {
        type: String
      }
    },
    data () {
      return {
        prefixCls: prefixName,
        stepNumber: '',
        nextError: false,
        total: 1,
        currentStatus: ''
      };
    },
    created () {
      this.currentStatus = this.status;
    },
    computed: {
      wrapClasses () {
        return [
          `${prefixName}-item`,
          `${prefixName}-status-${this.currentStatus}`,
          {
            [`${prefixName}-custom`]: !!this.icon,
            [`${prefixName}-next-error`]: this.nextError
          }
        ];
      },
      iconClasses () {
        let icon = '';
        if (this.icon) {
          icon = this.icon;
        } else {
          if (this.currentStatus == 'finish') {
            icon = 'icon-finish';
          } else if (this.currentStatus == 'error') {
            icon = 'icon-close';
          }
        }
        return [
          `${iconPrefixCls}`,
          {
            [`${icon}`]: icon != ''
          }
        ];
      },
      styles () {
        return {
          width: `${1/this.total*100}%`
        };
      }
    },
    watch: {
      status (val) {
        this.currentStatus = val;
        if (this.currentStatus == 'error') {
          this.$parent.setNextError();
        }
      }
    }
  };
</script>

<style >
  .s-steps {
    font-size: 0;
    width: 100%;
    line-height: 1.5
  }

  .s-steps-item {
    display: inline-block;
    position: relative;
    vertical-align: top
  }

  .s-steps-item.s-steps-status-wait .s-steps-head-inner {
    background-color: #fff
  }

  .s-steps-item.s-steps-status-wait .s-steps-head-inner span,.s-steps-item.s-steps-status-wait .s-steps-head-inner>.s-steps-icon {
    color: #ccc
  }

  .s-steps-item.s-steps-status-wait .s-steps-content,.s-steps-item.s-steps-status-wait .s-steps-title {
    color: #999
  }

  .s-steps-item.s-steps-status-wait .s-steps-tail>i {
    background-color: #e3e8ee
  }

  .s-steps-item.s-steps-status-process .s-steps-head-inner {
    border-color: #39f;
    background-color: #39f
  }

  .s-steps-item.s-steps-status-process .s-steps-head-inner span,.s-steps-item.s-steps-status-process .s-steps-head-inner>.s-steps-icon {
    color: #fff
  }

  .s-steps-item.s-steps-status-process .s-steps-content,.s-steps-item.s-steps-status-process .s-steps-title {
    color: #666
  }

  .s-steps-item.s-steps-status-process .s-steps-tail>i {
    background-color: #e3e8ee
  }

  .s-steps-item.s-steps-status-finish .s-steps-head-inner {
    background-color: #fff;
    border-color: #39f
  }

  .s-steps-item.s-steps-status-finish .s-steps-head-inner span,.s-steps-item.s-steps-status-finish .s-steps-head-inner>.s-steps-icon {
    color: #39f
  }

  .s-steps-item.s-steps-status-finish .s-steps-tail>i:after {
    width: 100%;
    background: #39f;
    transition: all .2s ease-in-out;
    opacity: 1
  }

  .s-steps-item.s-steps-status-finish .s-steps-content,.s-steps-item.s-steps-status-finish .s-steps-title {
    color: #999
  }

  .s-steps-item.s-steps-status-error .s-steps-head-inner {
    background-color: #fff;
    border-color: #f50
  }

  .s-steps-item.s-steps-status-error .s-steps-content,.s-steps-item.s-steps-status-error .s-steps-head-inner>.s-steps-icon,.s-steps-item.s-steps-status-error .s-steps-title {
    color: #f50
  }

  .s-steps-item.s-steps-status-error .s-steps-tail>i {
    background-color: #e3e8ee
  }

  .s-steps-item.s-steps-next-error .s-steps-tail>i,.s-steps-item.s-steps-next-error .s-steps-tail>i:after {
    background-color: #f50
  }

  .s-steps-item.s-steps-custom .s-steps-head-inner {
    background: 0 0;
    border: 0;
    width: auto;
    height: auto
  }

  .s-steps-item.s-steps-custom .s-steps-head-inner>.s-steps-icon {
    font-size: 20px;
    top: 2px;
    width: 20px;
    height: 20px
  }

  .s-steps-item.s-steps-custom.s-steps-status-process .s-steps-head-inner>.s-steps-icon {
    color: #39f
  }

  .s-steps-item:last-child .s-steps-tail {
    display: none
  }

  .s-steps .s-steps-head,.s-steps .s-steps-main {
    position: relative;
    display: inline-block;
    vertical-align: top
  }

  .s-steps .s-steps-head {
    background: #fff
  }

  .s-steps .s-steps-head-inner {
    display: block;
    width: 26px;
    height: 26px;
    line-height: 24px;
    margin-right: 8px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 50%;
    font-size: 14px;
    transition: background-color .2s ease-in-out
  }

  .s-steps .s-steps-head-inner>.s-steps-icon {
    line-height: 1;
    position: relative
  }

  .s-steps .s-steps-head-inner>.s-steps-icon.s-icon {
    font-size: 24px
  }

  .s-steps .s-steps-head-inner .iconfont{
    line-height: 28px;
    font-size: 12px;
  }
  .s-steps .s-steps-head-inner .icon-finish{
    color: #39f;
  }
  .s-steps .s-steps-head-inner .icon-close{
    color:#f50;
  }
  .s-steps .s-steps-main {
    margin-top: 2.5px;
    display: inline
  }

  .s-steps .s-steps-custom .s-steps-title {
    margin-top: 2.5px
  }

  .s-steps .s-steps-title {
    display: inline-block;
    margin-bottom: 4px;
    padding-right: 10px;
    font-size: 14px;
    font-weight: 700;
    color: #666;
    background: #fff
  }

  .s-steps .s-steps-title>a:first-child:last-child {
    color: #666
  }

  .s-steps .s-steps-item-last .s-steps-title {
    padding-right: 0;
    width: 100%
  }

  .s-steps .s-steps-content {
    font-size: 12px;
    color: #999
  }

  .s-steps .s-steps-tail {
    width: 100%;
    padding: 0 10px;
    position: absolute;
    left: 0;
    top: 13px
  }

  .s-steps .s-steps-tail>i {
    display: inline-block;
    width: 100%;
    height: 1px;
    vertical-align: top;
    background: #e3e8ee;
    border-radius: 1px;
    position: relative
  }

  .s-steps .s-steps-tail>i:after {
    content: '';
    width: 0;
    height: 100%;
    background: #e3e8ee;
    opacity: 0;
    position: absolute;
    top: 0
  }

  .s-steps.s-steps-small .s-steps-head-inner {
    width: 18px;
    height: 18px;
    line-height: 16px;
    margin-right: 10px;
    text-align: center;
    border-radius: 50%;
    font-size: 12px
  }

  .s-steps.s-steps-small .s-steps-head-inner>.s-steps-icon.s-icon {
    font-size: 16px;
    top: 0
  }

  .s-steps.s-steps-small .s-steps-main {
    margin-top: 0
  }

  .s-steps.s-steps-small .s-steps-title {
    margin-bottom: 4px;
    margin-top: 0;
    color: #666;
    font-size: 12px;
    font-weight: 700
  }

  .s-steps.s-steps-small .s-steps-content {
    font-size: 12px;
    color: #999;
    padding-left: 30px
  }

  .s-steps.s-steps-small .s-steps-tail {
    top: 8px;
    padding: 0 8px
  }

  .s-steps.s-steps-small .s-steps-tail>i {
    height: 1px;
    width: 100%;
    border-radius: 1px
  }

  .s-steps .s-steps-item.s-steps-custom .s-steps-head-inner,.s-steps.s-steps-small .s-steps-item.s-steps-custom .s-steps-head-inner {
    width: inherit;
    height: inherit;
    line-height: inherit;
    border-radius: 0;
    border: 0;
    background: 0 0
  }

  .s-steps-vertical .s-steps-item {
    display: block
  }

  .s-steps-vertical .s-steps-tail {
    position: absolute;
    left: 13px;
    top: 0;
    height: 100%;
    width: 1px;
    padding: 30px 0 4px
  }

  .s-steps-vertical .s-steps-tail>i {
    height: 100%;
    width: 1px
  }

  .s-steps-vertical .s-steps-tail>i:after {
    height: 0;
    width: 100%
  }

  .s-steps-vertical .s-steps-status-finish .s-steps-tail>i:after,.s-steps-vertical.s-steps-small .s-steps-tail>i {
    height: 100%
  }

  .s-steps-vertical .s-steps-head {
    float: left
  }

  .s-steps-vertical .s-steps-head-inner {
    margin-right: 16px
  }

  .s-steps-vertical .s-steps-main {
    min-height: 47px;
    overflow: hidden;
    display: block
  }

  .s-steps-vertical .s-steps-main .s-steps-title {
    line-height: 26px
  }

  .s-steps-vertical .s-steps-main .s-steps-content {
    padding-bottom: 12px;
    padding-left: 0
  }

  .s-steps-vertical .s-steps-custom .s-steps-icon {
    left: 4px
  }

  .s-steps-vertical.s-steps-small .s-steps-custom .s-steps-icon {
    left: 0
  }

  .s-steps-vertical.s-steps-small .s-steps-tail {
    position: absolute;
    left: 9px;
    top: 0;
    padding: 22px 0 4px
  }

  .s-steps-vertical.s-steps-small .s-steps-title {
    line-height: 18px
  }

  .s-steps-horizontal .s-steps-content {
    padding-left: 35px
  }

  .s-steps-horizontal .s-steps-item:not(:first-child) .s-steps-head {
    padding-left: 10px;
    margin-left: -10px
  }
</style>
