<template>
  <transition name="msgbox-fade">
    <div class="s-message-box-wrapper" v-show="value" @click.self="handleWrapperClick">
      <div class="s-message-box" :class="customClass">
        <div class="s-message-box-header" v-if="title !== undefined">
          <div class="s-message-box-title">{{ title || t('el.messagebox.title') }}</div>
          <i class="s-message-box-close s-icon-close" @click="handleAction('cancel')" v-if="showClose"></i>
        </div>
        <div class="s-message-box-content" v-if="message !== ''">
          <div class="s-message-box-status" :class="[ typeClass ]"></div>
          <div class="s-message-box-message" :style="{ 'margin-left': typeClass ? '50px' : '0' }"><p>{{ message }}</p></div>
          <div class="s-message-box-input" v-show="showInput">
            <s-input v-model="inputValue" :placeholder="inputPlaceholder" ref="input"></s-input>
            <div class="s-message-box-errormsg" :style="{ visibility: !!editorErrorMessage ? 'visible' : 'hidden' }">{{ editorErrorMessage }}</div>
          </div>
        </div>
        <div class="s-message-box-btns">
          <s-button
            :loading="cancelButtonLoading"
            :class="[ cancelButtonClasses ]"
            v-show="showCancelButton"
            @click.native="handleAction('cancel')">
            {{ cancelButtonText || t('el.messagebox.cancel') }}
          </s-button>
          <s-button
            :loading="confirmButtonLoading"
            ref="confirm"
            :class="[ confirmButtonClasses ]"
            v-show="showConfirmButton"
            @click.native="handleAction('confirm')">
            {{ confirmButtonText || t('el.messagebox.confirm') }}
          </s-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
  import Popup from '../../../extra/utils/popup';
  import Locale from '../../../extra/mixins/locale';
  import SInput from '../../input';
  import SButton from '../../button';
  import { addClass, removeClass } from '../../../extra/utils/dom';
  import { t } from '../../../extra/locale';

  let typeMap = {
    success: 'circle-check',
    info: 'information',
    warning: 'warning',
    error: 'circle-cross'
  };

  export default {
    mixins: [Popup, Locale],

    props: {
      modal: {
        default: true
      },
      lockScroll: {
        default: true
      },
      showClose: {
        type: Boolean,
        default: true
      },
      closeOnClickModal: {
        default: true
      },
      closeOnPressEscape: {
        default: true
      }
    },

    components: {
      SInput,
      SButton
    },

    computed: {
      typeClass() {
        return this.type && typeMap[this.type] ? `s-icon-${ typeMap[this.type] }` : '';
      },

      confirmButtonClasses() {
        return `s-button-primary ${ this.confirmButtonClass }`;
      },
      cancelButtonClasses() {
        return `${ this.cancelButtonClass }`;
      }
    },

    methods: {
      getSafeClose() {
        const currentId = this.uid;
        return () => {
          this.$nextTick(() => {
            if (currentId === this.uid) this.doClose();
          });
        };
      },
      doClose() {
        if (!this.value) return;
        this.value = false;
        this._closing = true;

        this.onClose && this.onClose();

        if (this.lockScroll) {
          setTimeout(() => {
            if (this.modal && this.bodyOverflow !== 'hidden') {
              document.body.style.overflow = this.bodyOverflow;
              document.body.style.paddingRight = this.bodyPaddingRight;
            }
            this.bodyOverflow = null;
            this.bodyPaddingRight = null;
          }, 200);
        }
        this.opened = false;

        if (!this.transition) {
          this.doAfterClose();
        }
        if (this.action) this.callback(this.action, this);
      },

      handleWrapperClick() {
        if (this.closeOnClickModal) {
          this.action = '';
          this.doClose();
        }
      },

      handleAction(action) {
        if (this.$type === 'prompt' && action === 'confirm' && !this.validate()) {
          return;
        }
        this.action = action;
        if (typeof this.beforeClose === 'function') {
          this.close = this.getSafeClose();
          this.beforeClose(action, this, this.close);
        } else {
          this.doClose();
        }
      },

      validate() {
        if (this.$type === 'prompt') {
          var inputPattern = this.inputPattern;
          if (inputPattern && !inputPattern.test(this.inputValue || '')) {
            this.editorErrorMessage = this.inputErrorMessage || t('el.messagebox.error');
            addClass(this.$refs.input.$el.querySelector('input'), 'invalid');
            return false;
          }
          var inputValidator = this.inputValidator;
          if (typeof inputValidator === 'function') {
            var validateResult = inputValidator(this.inputValue);
            if (validateResult === false) {
              this.editorErrorMessage = this.inputErrorMessage || t('el.messagebox.error');
              addClass(this.$refs.input.$el.querySelector('input'), 'invalid');
              return false;
            }
            if (typeof validateResult === 'string') {
              this.editorErrorMessage = validateResult;
              return false;
            }
          }
        }
        this.editorErrorMessage = '';
        removeClass(this.$refs.input.$el.querySelector('input'), 'invalid');
        return true;
      }
    },

    watch: {
      inputValue: {
        immediate: true,
        handler(val) {
          this.$nextTick(_ => {
            if (this.$type === 'prompt' && val !== null) {
              this.validate();
            }
          });
        }
      },

      value(val) {
        if (val) this.uid++;
        if (this.$type === 'alert' || this.$type === 'confirm') {
          this.$nextTick(() => {
            this.$refs.confirm.$el.focus();
          });
        }
        if (this.$type !== 'prompt') return;
        if (val) {
          setTimeout(() => {
            if (this.$refs.input && this.$refs.input.$el) {
              this.$refs.input.$el.querySelector('input').focus();
            }
          }, 500);
        } else {
          this.editorErrorMessage = '';
          removeClass(this.$refs.input.$el.querySelector('input'), 'invalid');
        }
      }
    },

    data() {
      return {
        uid: 1,
        title: undefined,
        message: '',
        type: '',
        customClass: '',
        showInput: false,
        inputValue: null,
        inputPlaceholder: '',
        inputPattern: null,
        inputValidator: null,
        inputErrorMessage: '',
        showConfirmButton: true,
        showCancelButton: false,
        action: '',
        confirmButtonText: '',
        cancelButtonText: '',
        confirmButtonLoading: false,
        cancelButtonLoading: false,
        confirmButtonClass: '',
        confirmButtonDisabled: false,
        cancelButtonClass: '',
        editorErrorMessage: null,
        callback: null
      };
    }
  };
</script>
<style>
  .s-message-box {
    text-align: left;
    display: inline-block;
    vertical-align: middle;
    background-color: #fff;
    width: 420px;
    border-radius: 3px;
    font-size: 16px;
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden
  }

  .s-message-box-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center
  }

  .s-message-box-wrapper:after {
    content: "";
    display: inline-block;
    height: 100%;
    width: 0;
    vertical-align: middle
  }

  .s-message-box-header {
    position: relative;
    padding: 20px 20px 0
  }

  .s-message-box-content {
    padding: 30px 20px;
    color: #48576a;
    font-size: 14px;
    position: relative
  }

  .s-message-box-close {
    display: inline-block;
    position: absolute;
    top: 19px;
    right: 20px;
    color: #999;
    cursor: pointer;
    line-height: 20px;
    text-align: center
  }

  .s-message-box-close:hover {
    color: #20a0ff
  }

  .s-message-box-input {
    padding-top: 15px
  }

  .s-message-box-input input.invalid,.s-message-box-input input.invalid:focus {
    border-color: #ff4949
  }

  .s-message-box-errormsg {
    color: #ff4949;
    font-size: 12px;
    min-height: 18px;
    margin-top: 2px
  }

  .s-message-box-title {
    padding-left: 0;
    margin-bottom: 0;
    font-size: 16px;
    font-weight: 700;
    height: 18px;
    color: #333
  }

  .s-message-box-message {
    margin: 0
  }

  .s-message-box-message p {
    margin: 0;
    line-height: 1.4
  }

  .s-message-box-btns {
    padding: 10px 20px 15px;
    text-align: right
  }

  .s-message-box-btns button:nth-child(2) {
    margin-left: 10px
  }

  .s-message-box-btns-reverse {
    -ms-flex-direction: row-reverse;
    flex-direction: row-reverse
  }

  .s-message-box-status {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 36px!important
  }

  .s-message-box-status.el-icon-circle-check {
    color: #13ce66
  }

  .s-message-box-status.el-icon-information {
    color: #50bfff
  }

  .s-message-box-status.el-icon-warning {
    color: #f7ba2a
  }

  .s-message-box-status.el-icon-circle-cross {
    color: #ff4949
  }

</style>
