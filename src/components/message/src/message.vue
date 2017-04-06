<template>
  <transition name="s-message-fade">
    <div
      class="s-message"
      :class="customClass"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer">
      <img class="s-message-img" :src="typeImg" alt="" v-if="!iconClass">
      <div class="s-message-group" :class="{ 'is-with-icon': iconClass }">
        <p><i class="s-message-icon" :class="iconClass" v-if="iconClass"></i>{{ message }}</p>
        <div v-if="showClose" class="s-message-closeBtn s-icon-close" @click="close"></div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
  export default {
    data() {
      return {
        visible: false,
        message: '',
        duration: 3000,
        type: 'info',
        iconClass: '',
        customClass: '',
        onClose: null,
        showClose: false,
        closed: false,
        timer: null
      };
    },

    computed: {
      typeImg() {
        return require(`../assets/${ this.type }.svg`);
      }
    },

    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$el.addEventListener('transitionend', this.destroyElement);
        }
      }
    },

    methods: {
      destroyElement() {
        this.$el.removeEventListener('transitionend', this.destroyElement);
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },

      close() {
        this.closed = true;
        if (typeof this.onClose === 'function') {
          this.onClose(this);
        }
      },

      clearTimer() {
        clearTimeout(this.timer);
      },

      startTimer() {
        if (this.duration > 0) {
          this.timer = setTimeout(() => {
            if (!this.closed) {
              this.close();
            }
          }, this.duration);
        }
      }
    },

    mounted() {
      this.startTimer();
    }
  };
</script>
<style>
  .s-message {
    box-shadow: 0 2px 4px rgba(0,0,0,.12),0 0 6px rgba(0,0,0,.04);
    min-width: 300px;
    padding: 10px 12px;
    box-sizing: border-box;
    border-radius: 2px;
    position: fixed;
    left: 50%;
    top: 20px;
    transform: translateX(-50%);
    background-color: #fff;
    transition: opacity .3s,transform .4s;
    overflow: hidden
  }

  .s-message .el-icon-circle-check {
    color: #13ce66
  }

  .s-message .el-icon-circle-cross {
    color: #ff4949
  }

  .s-message .el-icon-information {
    color: #50bfff
  }

  .s-message .el-icon-warning {
    color: #f7ba2a
  }

  .s-message-group {
    margin-left: 38px;
    position: relative;
    height: 20px;
    line-height: 20px
  }

  .s-message-group p {
    font-size: 14px;
    margin: 0 34px 0 0;
    white-space: nowrap;
    color: #8391a5;
    text-align: justify
  }

  .s-message-group.is-with-icon {
    margin-left: 0
  }

  .s-message-img {
    width: 40px;
    height: 40px;
    position: absolute;
    left: 0;
    top: 0
  }

  .s-message-icon {
    vertical-align: middle;
    margin-right: 8px
  }

  .s-message-closeBtn {
    top: 3px;
    right: 0;
    position: absolute;
    cursor: pointer;
    color: #bfcbd9;
    font-size: 14px
  }

  .s-message-closeBtn:hover {
    color: #97a8be
  }

  .s-message-fade-enter,.s-message-fade-leave-active {
    opacity: 0;
    transform: translate(-50%,-100%)
  }

</style>
