<template>
  <transition name="s-notification-fade">
    <div
      class="s-notification"
      :class="customClass"
      v-show="visible"
      :style="{ top: top ? top + 'px' : 'auto' }"
      @mouseenter="clearTimer()"
      @mouseleave="startTimer()">
      <i
        class="s-notification-icon"
        :class="[ typeClass, iconClass ]"
        v-if="type || iconClass">
      </i>
      <div class="s-notification-group" :class="{ 'is-with-icon': typeClass || iconClass }">
        <h2 class="s-notification-title" v-text="title"></h2>
        <div class="s-notification-content"><slot>{{ message }}</slot></div>
        <div class="s-notification-closeBtn s-icon-close" @click="close"></div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
  let typeMap = {
    success: 'circle-check',
    info: 'information',
    warning: 'warning',
    error: 'circle-cross'
  };

  export default {
    data() {
      return {
        visible: false,
        title: '',
        message: '',
        duration: 4500,
        type: '',
        customClass: '',
        iconClass: '',
        onClose: null,
        closed: false,
        top: null,
        timer: null
      };
    },

    computed: {
      typeClass() {
        return this.type && typeMap[this.type] ? `el-icon-${ typeMap[this.type] }` : '';
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
          this.onClose();
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
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close();
          }
        }, this.duration);
      }
    }
  };
</script>
<style>
  .s-notification {
    width: 330px;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 2px;
    position: fixed;
    right: 16px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,.12),0 0 6px rgba(0,0,0,.04);
    transition: opacity .3s,transform .3s,right .3s,top .4s;
    overflow: hidden
  }

  .s-notification .el-icon-circle-check {
    color: #13ce66
  }

  .s-notification .el-icon-circle-cross {
    color: #ff4949
  }

  .s-notification .el-icon-information {
    color: #50bfff
  }

  .s-notification .el-icon-warning {
    color: #f7ba2a
  }

  .s-notification-group {
    margin-left: 0
  }

  .s-notification-group.is-with-icon {
    margin-left: 55px
  }

  .s-notification-title {
    font-weight: 400;
    font-size: 16px;
    color: #1f2d3d;
    margin: 0
  }

  .s-notification-content {
    font-size: 14px;
    line-height: 21px;
    margin: 10px 0 0;
    color: #8391a5;
    text-align: justify
  }

  .s-notification-icon {
    width: 40px;
    height: 40px;
    font-size: 40px;
    float: left;
    position: relative;
    top: 3px
  }

  .s-notification-closeBtn {
    top: 20px;
    right: 20px;
    position: absolute;
    cursor: pointer;
    color: #bfcbd9;
    font-size: 14px
  }

  .s-notification-closeBtn:hover {
    color: #97a8be
  }

  .s-notification-fade-enter {
    transform: translateX(100%);
    right: 0
  }

  .s-notification-fade-leave-active {
    opacity: 0
  }

</style>
