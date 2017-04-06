<template>
  <span>
    <transition name="fade">
        <div :class="maskClasses" v-show="visible" @click="mask"></div>
    </transition>
    <div :class="wrapClasses" @click="handleWrapClick">
        <transition name="ease">
            <div :class="classes" :style="mainStyles" v-show="visible">
                <div :class="[prefixCls + '-content']">
                    <a :class="[prefixCls + '-close']" v-if="closable" @click="close">
                        <slot name="close">
                            <span>x</span>
                        </slot>
                    </a>
                    <div :class="[prefixCls + '-header']" v-if="showHead"><slot name="header"><div
                            :class="[prefixCls + '-header-inner']">{{ title }}</div></slot></div>
                    <div :class="[prefixCls + '-body']"><slot></slot></div>
                    <div :class="[prefixCls + '-footer']" v-if="!footerHide">
                        <slot name="footer">
                            <s-button type="text" size="large" @click.native="cancel">取消</s-button>
                            <s-button type="primary" size="large" :loading="buttonLoading"
                                      @click.native="ok">确认</s-button>
                        </slot>
                    </div>
                </div>
            </div>
        </transition>
    </div>
  </span>
</template>

<script type="text/babel">
  import Button from '../button';
  import {getScrollBarSize} from '../../extra/utils/assist';
  /*import { t } from '../../locale';*/

  const prefixName = 's-dialog';

  export default {
    name: 'sDialog',
    components: {sButton},
    props: {
      value: {
        type: Boolean,
        default: false
      },
      closable: {
        type: Boolean,
        default: true
      },
      maskClosable: {
        type: Boolean,
        default: true
      },
      title: {
        type: String
      },
      width: {
        type: [Number, String],
        default: 520
      },
      loading: {
        type: Boolean,
        default: false
      },
      styles: {
        type: Object
      },
      className: {
        type: String
      },
      // for instance
      footerHide: {
        type: Boolean,
        default: false
      },
      scrollable: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        prefixCls: prefixName,
        wrapShow: false,
        showHead: true,
        buttonLoading: false,
        visible: this.value
      };
    },
    computed: {
      wrapClasses () {
        return [
          `${prefixName}-wrap`,
          {
            [`${prefixName}-hidden`]: !this.wrapShow,
            [`${this.className}`]: !!this.className
          }
        ];
      },
      maskClasses () {
        return `${prefixName}-mask`;
      },
      classes () {
        return `${prefixName}`;
      },
      mainStyles () {
        let style = {};

        const styleWidth = {
          width: `${this.width}px`
        };

        const customStyle = this.styles ? this.styles : {};

        Object.assign(style, styleWidth, customStyle);

        return style;
      }
    },
    methods: {
      close () {
        this.visible = false;
        this.$emit('input', false);
        this.$emit('on-cancel');
      },
      mask () {
        if (this.maskClosable) {
          this.close();
        }
      },
      handleWrapClick (event) {
        // use indexOf,do not use === ,because ivu-modal-wrap can have other custom className
        const className = event.target.getAttribute('class');
        if (className && className.indexOf(`${prefixName}-wrap`) > -1) this.mask();
      },
      cancel () {
        this.close();
      },
      ok () {
        if (this.loading) {
          this.buttonLoading = true;
        } else {
          this.visible = false;
          this.$emit('input', false);
        }
        this.$emit('on-ok');
      },
      EscClose (e) {
        if (this.visible && this.closable) {
          if (e.keyCode === 27) {
            this.close();
          }
        }
      },
      checkScrollBar () {
        let fullWindowWidth = window.innerWidth;
        if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
          const documentElementRect = document.documentElement.getBoundingClientRect();
          fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
        }
        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
        if (this.bodyIsOverflowing) {
          this.scrollBarWidth = getScrollBarSize();
        }
      },
      setScrollBar () {
        if (this.bodyIsOverflowing && this.scrollBarWidth !== undefined) {
          document.body.style.paddingRight = `${this.scrollBarWidth}px`;
        }
      },
      resetScrollBar () {
        document.body.style.paddingRight = '';
      },
      addScrollEffect () {
        this.checkScrollBar();
        this.setScrollBar();
        document.body.style.overflow = 'hidden';
      },
      removeScrollEffect() {
        document.body.style.overflow = '';
        this.resetScrollBar();
      }
    },
    mounted () {
      if (this.visible) {
        this.wrapShow = true;
      }

      let showHead = true;

      if (this.$slots.head === undefined && !this.title) {
        showHead = false;
      }

      this.showHead = showHead;

      // ESC close
      document.addEventListener('keydown', this.EscClose);
    },
    beforeDestroy () {
      document.removeEventListener('keydown', this.EscClose);
      this.removeScrollEffect();
    },
    watch: {
      value (val) {
        this.visible = val;
      },
      visible (val) {
        if (val === false) {
          this.buttonLoading = false;
          this.timer = setTimeout(() => {
            this.wrapShow = false;
            this.removeScrollEffect();
          }, 300);
        } else {
          if (this.timer) clearTimeout(this.timer);
          this.wrapShow = true;
          if (!this.scrollable) {
            this.addScrollEffect();
          }
        }
      },
      loading (val) {
        if (!val) {
          this.buttonLoading = false;
        }
      },
      scrollable (val) {
        if (!val) {
          this.addScrollEffect();
        } else {
          this.removeScrollEffect();
        }
      }
    }
  };
</script>

<style>
  .s-dialog {
    width: auto;
    margin: 0 auto;
    position: relative;
    outline: 0;
    top: 100px
  }

  .s-dialog-mask, .s-dialog-wrap {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    left: 0
  }

  .s-dialog-hidden {
    display: none !important
  }

  .s-dialog-wrap {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    outline: 0
  }

  .s-dialog-wrap * {
    box-sizing: border-box
  }

  .s-dialog-mask {
    background-color: rgba(55, 55, 55, .6);
    height: 100%
  }

  .s-dialog-mask-hidden {
    display: none
  }

  .s-dialog-content {
    position: relative;
    background-color: #fff;
    border: 0;
    border-radius: 6px;
    background-clip: padding-box
  }

  .s-dialog-header {
    border-bottom: 1px solid #e3e8ee;
    padding: 14px 16px;
    line-height: 1
  }

  .s-dialog-header p, .s-dialog-header-inner {
    display: inline-block;
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: #464c5b;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
  }

  .s-dialog-close {
    font-size: 12px;
    position: absolute;
    right: 16px;
    top: 8px;
    overflow: hidden;
    cursor: pointer
  }

  .s-dialog-close .s-icon-ios-close-empty {
    font-size: 31px;
    color: #999;
    transition: color .2s ease;
    position: relative;
    top: 1px
  }

  .s-dialog-close .s-icon-ios-close-empty:hover {
    color: #444
  }

  .s-dialog-body {
    padding: 16px;
    font-size: 12px;
    line-height: 1.5
  }

  .s-dialog-footer {
    border-top: 1px solid #e3e8ee;
    padding: 12px 18px;
    text-align: right
  }

  .s-dialog-footer button + button {
    margin-left: 8px;
    margin-bottom: 0
  }

  @media (max-width: 768px) {
    .s-dialog {
      width: auto !important;
      margin: 10px
    }

    .vertical-center-dialog .s-dialog {
      -ms-flex: 1;
      flex: 1
    }
  }

  .s-dialog-confirm {
    padding: 0 4px
  }

  .s-dialog-confirm-head-title {
    display: inline-block;
    font-size: 14px;
    color: #464c5b;
    font-weight: 700
  }

  .s-dialog-confirm-body {
    margin-top: 6px;
    padding-left: 48px;
    padding-top: 18px;
    font-size: 12px;
    color: #657180;
    position: relative
  }

  .s-dialog-confirm-body-icon {
    font-size: 36px;
    position: absolute;
    top: 0;
    left: 0
  }

  .s-dialog-confirm-body-icon-info {
    color: #39f
  }

  .s-dialog-confirm-body-icon-success {
    color: #0c6
  }

  .s-dialog-confirm-body-icon-warning {
    color: #f90
  }

  .s-dialog-confirm-body-icon-error {
    color: #f50
  }

  .s-dialog-confirm-body-icon-confirm {
    color: #f90
  }

  .s-dialog-confirm-footer {
    margin-top: 40px;
    text-align: right
  }

  .s-dialog-confirm-footer button + button {
    margin-left: 8px;
    margin-bottom: 0
  }
</style>
