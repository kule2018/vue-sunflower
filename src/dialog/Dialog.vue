<template>
  <transition name="dialog-fade">
    <div class="s-dialog-wrapper" v-show="visible" @click.self="handleWrapperClick">
      <div
              class="s-dialog"
              :class="[sizeClass, customClass]"
              ref="dialog"
              :style="style">
        <div class="s-dialog-header">
          <slot name="title">
            <span class="s-dialog-title">{{title}}</span>
          </slot>
          <div class="s-dialog-headerbtn">
            <i v-if="showClose" class="s-dialog-close s-icon s-icon-close" @click='close()'></i>
          </div>
        </div>
        <div class="s-dialog-body" v-if="rendered"><slot></slot></div>
        <div class="s-dialog-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Popup from '../extra/utils/popup';
  import emitter from '../extra/mixins/emitter';
  export default {
    name: 's-dialog',
    mixins: [Popup, emitter],
    props: {
      title: {
        type: String,
        default: ''
      },
      modal: {
        type: Boolean,
        default: true
      },

      modalAppendToBody: {
        type: Boolean,
        default: true
      },
      lockScroll: {
        type: Boolean,
        default: true
      },
      closeOnClickModal: {
        type: Boolean,
        default: true
      },
      closeOnPressEscape: {
        type: Boolean,
        default: true
      },
      showClose: {
        type: Boolean,
        default: true
      },
      size: {
        type: String,
        default: 'small'
      },
      customClass: {
        type: String,
        default: ''
      },
      top: {
        type: String,
        default: '15%'
      }
    },
    data() {
      return {
        visible: false
      };
    },
    watch: {
      value(val) {
        this.visible = val;
      },
      visible(val) {
        this.$emit('input', val);
        if (val) {
          this.$emit('open');
          this.$el.addEventListener('scroll', this.updatePopper);
          this.$nextTick(() => {
            this.$refs.dialog.scrollTop = 0;
          });
        } else {
          this.$el.removeEventListener('scroll', this.updatePopper);
          this.$emit('close');
        }
      }
    },
    computed: {
      sizeClass() {
        return `s-dialog-${ this.size }`;
      },
      style() {
        return this.size === 'full' ? {} : { 'top': this.top };
      }
    },
    methods: {
      handleWrapperClick() {
        if (this.closeOnClickModal) {
          this.close();
        }
      },
      updatePopper() {
        this.broadcast('SSelectDropdown', 'updatePopper');
        this.broadcast('SDropdownMenu', 'updatePopper');
      }
    },
    mounted() {
      if (this.value) {
        this.rendered = true;
        this.open();
      }
    }
  };
</script>
<style>
  .s-dialog {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
    box-sizing: border-box
  }

  .s-dialog-tiny {
    width: 30%
  }

  .s-dialog-small {
    width: 50%
  }

  .s-dialog-large {
    width: 90%
  }

  .s-dialog-full {
    width: 100%;
    top: 0;
    height: 100%;
    overflow: auto
  }

  .s-dialog-wrapper {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    overflow: auto;
    margin: 0
  }

  .s-dialog-header {
    padding: 20px 20px 0
  }

  .s-dialog-close {
    cursor: pointer;
    color: #bfcbd9
  }

  .s-dialog-close:hover {
    color: #20a0ff
  }

  .s-dialog-title {
    line-height: 1;
    font-size: 16px;
    font-weight: 700;
    color: #1f2d3d
  }

  .s-dialog-body {
    padding: 30px 20px;
    color: #48576a;
    font-size: 14px
  }

  .s-dialog-headerbtn {
    float: right
  }

  .s-dialog-footer {
    padding: 10px 20px 15px;
    text-align: right;
    box-sizing: border-box
  }

  .dialog-fade-enter-active {
    animation: dialog-fade-in .3s
  }

  .dialog-fade-leave-active {
    animation: dialog-fade-out .3s
  }

  @keyframes dialog-fade-in {
    0% {
      transform: translate3d(0,-20px,0);
      opacity: 0
    }

    to {
      transform: translateZ(0);
      opacity: 1
    }
  }

  @keyframes dialog-fade-out {
    0% {
      transform: translateZ(0);
      opacity: 1
    }

    to {
      transform: translate3d(0,-20px,0);
      opacity: 0
    }
  }

</style>