<template>
  <transition name="s-alert-fade">
    <div class="s-alert" :class="[ typeClass ]" v-show="visible">
      <i class="s-alert-icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>
      <div class="s-alert-content">
        <span class="s-alert-title" :class="[ isBoldTitle ]" v-if="title">{{ title }}</span>
        <slot>
          <p class="s-alert-description" v-if="description">{{ description }}</p>
        </slot>
        <i class="s-alert-closebtn" :class="[{ 'is-customed': closeText !== '', 's-icon-close': closeText === '' }]" v-show="closable" @click="close()">{{closeText}}</i>
      </div>
    </div>
  </transition>
</template>

<script>
  const TYPE_CLASSES_MAP = {
    'success': 's-icon-circle-check',
    'warning': 's-icon-warning',
    'error': 's-icon-circle-cross'
  };
  export default {
    name: 's-alert',

    props: {
      title: {
        type: String,
        default: '',
        required: true
      },
      description: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'info'
      },
      closable: {
        type: Boolean,
        default: true
      },
      closeText: {
        type: String,
        default: ''
      },
      showIcon: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        visible: true
      };
    },

    methods: {
      close() {
        this.visible = false;
        this.$emit('close');
      }
    },

    computed: {
      typeClass() {
        return `s-alert-${this.type}`;
      },

      iconClass() {
        return TYPE_CLASSES_MAP[this.type] || 's-icon-information';
      },

      isBigIcon() {
        return this.description ? 'is-big' : '';
      },

      isBoldTitle() {
        return this.description ? 'is-bold' : '';
      }
    }
  };
</script>
<style>
  .s-alert {
    width: 100%;
    padding: 8px 16px;
    margin: 0;
    box-sizing: border-box;
    border-radius: 4px;
    position: relative;
    background-color: #fff;
    overflow: hidden;
    color: #fff;
    opacity: 1;
    display: table;
    transition: opacity .2s;
  }

  .s-alert .s-alert-description {
    color: #fff;
    font-size: 12px;
    margin: 5px 0 0;
  }

  .s-alert-success {
    background-color: #13ce66;
  }

  .s-alert-info {
    background-color: #50bfff;
  }

  .s-alert-warning {
    background-color: #f7ba2a;
  }

  .s-alert-error {
    background-color: #ff4949;
  }

  .s-alert-content {
    display: table-cell;
    padding: 0 8px
  }

  .s-alert-icon {
    font-size: 16px;
    width: 16px;
    display: table-cell;
    color: #fff;
    vertical-align: middle
  }

  .s-alert-icon.is-big {
    font-size: 28px;
    width: 28px
  }

  .s-alert-title {
    font-size: 13px;
    line-height: 18px
  }

  .s-alert-title.is-bold {
    font-weight: 700
  }

  .s-alert-closebtn {
    font-size: 12px;
    color: #fff;
    opacity: 1;
    top: 12px;
    right: 15px;
    position: absolute;
    cursor: pointer
  }

  .s-alert-closebtn.is-customed {
    font-style: normal;
    font-size: 13px;
    top: 9px
  }

  .s-alert-fade-enter,.s-alert-fade-leave-active {
    opacity: 0
  }

</style>
