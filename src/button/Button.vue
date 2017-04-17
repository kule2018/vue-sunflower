<template>
  <button :disabled="disabled" class="s-button"
          @click="handleClick"
          :autofocus="autofocus"
          :type="nativeType"
          :class="[
              type ? 's-button-' + type : '',
              size ? 's-button-' + size : '',
              {
                'is-disabled': disabled,
                'is-loading': loading,
                'is-plain': plain
              }
          ]"
          >
    <i class="s-icon-loading" v-if="loading"></i>
    <i :class="'iconfont icon-' + icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
  export default {
    name: "s-button",

    props: {
      type: {
        type: String,
        default: "default"
      },
      size: String,
      icon: {
        type: String,
        default: ""
      },
      nativeType: {
        type: String,
        default: "button"
      },
      loading: Boolean,
      disabled: Boolean,
      plain: Boolean,
      autofocus: Boolean
    },

    methods: {
      handleClick(event) {
        this.$emit("click", event);
      }
    }
  }
</script>
<style>
  .s-button {
    display: inline-block;
    line-height: 1;
    white-space: normal;
    text-align: center;
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #bfcbd9;
    color: #1f2d3d;
    box-sizing: border-box;
    padding: 10px 15px;
    margin: 0;
    font-size: 14px;
    border-radius: 4px;
    outline: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  .s-button+.s-button {
    margin-left: 10px
  }

  .s-button:focus,.s-button:hover {
    color: #20a0ff;
    border-color: #20a0ff
  }

  .s-button:active {
    color: #1d90e6;
    border-color: #1d90e6;
    outline: none
  }

  .s-button::-moz-focus-inner {
    border: 0
  }

  .s-button [class*=s-icon-]+span {
    margin-left: 5px
  }

  .s-button.is-loading {
    position: relative;
    pointer-events: none
  }

  .s-button.is-loading:before {
    pointer-events: none;
    content: "";
    position: absolute;
    left: -1px;
    top: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: inherit;
    background-color: hsla(0,0%,100%,.35)
  }

  .s-button.is-disabled,.s-button.is-disabled:focus,.s-button.is-disabled:hover {
    color: #bfcbd9;
    cursor: not-allowed;
    background-image: none;
    background-color: #eef1f6;
    border-color: #d1dbe5
  }

  .s-button.is-disabled.s-button-text {
    background-color: transparent
  }

  .s-button.is-disabled.is-plain,.s-button.is-disabled.is-plain:focus,.s-button.is-disabled.is-plain:hover {
    background-color: #fff;
    border-color: #d1dbe5;
    color: #bfcbd9
  }

  .s-button.is-active {
    color: #1d90e6;
    border-color: #1d90e6
  }

  .s-button.is-plain:focus,.s-button.is-plain:hover {
    background: #fff;
    border-color: #20a0ff;
    color: #20a0ff
  }

  .s-button.is-plain:active {
    background: #fff;
    border-color: #1d90e6;
    color: #1d90e6;
    outline: none
  }

  .s-button-primary {
    color: #fff;
    background-color: #20a0ff;
    border-color: #20a0ff
  }

  .s-button-primary:focus,.s-button-primary:hover {
    background: #4db3ff;
    border-color: #4db3ff;
    color: #fff
  }

  .s-button-primary:active {
    outline: none
  }

  .s-button-primary.is-active,.s-button-primary:active {
    background: #1d90e6;
    border-color: #1d90e6;
    color: #fff
  }

  .s-button-primary.is-plain {
    background: #fff;
    border: 1px solid #bfcbd9;
    color: #1f2d3d
  }

  .s-button-primary.is-plain:focus,.s-button-primary.is-plain:hover {
    background: #fff;
    border-color: #20a0ff;
    color: #20a0ff
  }

  .s-button-primary.is-plain:active {
    background: #fff;
    border-color: #1d90e6;
    color: #1d90e6;
    outline: none
  }

  .s-button-success {
    color: #fff;
    background-color: #13ce66;
    border-color: #13ce66
  }

  .s-button-success:focus,.s-button-success:hover {
    background: #42d885;
    border-color: #42d885;
    color: #fff
  }

  .s-button-success:active {
    outline: none
  }

  .s-button-success.is-active,.s-button-success:active {
    background: #11b95c;
    border-color: #11b95c;
    color: #fff
  }

  .s-button-success.is-plain {
    background: #fff;
    border: 1px solid #bfcbd9;
    color: #1f2d3d
  }

  .s-button-success.is-plain:focus,.s-button-success.is-plain:hover {
    background: #fff;
    border-color: #13ce66;
    color: #13ce66
  }

  .s-button-success.is-plain:active {
    background: #fff;
    border-color: #11b95c;
    color: #11b95c;
    outline: none
  }

  .s-button-warning {
    color: #fff;
    background-color: #f7ba2a;
    border-color: #f7ba2a
  }

  .s-button-warning:focus,.s-button-warning:hover {
    background: #f9c855;
    border-color: #f9c855;
    color: #fff
  }

  .s-button-warning:active {
    outline: none
  }

  .s-button-warning.is-active,.s-button-warning:active {
    background: #dea726;
    border-color: #dea726;
    color: #fff
  }

  .s-button-warning.is-plain {
    background: #fff;
    border: 1px solid #bfcbd9;
    color: #1f2d3d
  }

  .s-button-warning.is-plain:focus,.s-button-warning.is-plain:hover {
    background: #fff;
    border-color: #f7ba2a;
    color: #f7ba2a
  }

  .s-button-warning.is-plain:active {
    background: #fff;
    border-color: #dea726;
    color: #dea726;
    outline: none
  }

  .s-button-danger {
    color: #fff;
    background-color: #ff4949;
    border-color: #ff4949
  }

  .s-button-danger:focus,.s-button-danger:hover {
    background: #ff6d6d;
    border-color: #ff6d6d;
    color: #fff
  }

  .s-button-danger:active {
    outline: none
  }

  .s-button-danger.is-active,.s-button-danger:active {
    background: #e64242;
    border-color: #e64242;
    color: #fff
  }

  .s-button-danger.is-plain {
    background: #fff;
    border: 1px solid #bfcbd9;
    color: #1f2d3d
  }

  .s-button-danger.is-plain:focus,.s-button-danger.is-plain:hover {
    background: #fff;
    border-color: #ff4949;
    color: #ff4949
  }

  .s-button-danger.is-plain:active {
    background: #fff;
    border-color: #e64242;
    color: #e64242;
    outline: none
  }

  .s-button-info {
    color: #fff;
    background-color: #50bfff;
    border-color: #50bfff
  }

  .s-button-info:focus,.s-button-info:hover {
    background: #73ccff;
    border-color: #73ccff;
    color: #fff
  }

  .s-button-info:active {
    outline: none
  }

  .s-button-info.is-active,.s-button-info:active {
    background: #48ace6;
    border-color: #48ace6;
    color: #fff
  }

  .s-button-info.is-plain {
    background: #fff;
    border: 1px solid #bfcbd9;
    color: #1f2d3d
  }

  .s-button-info.is-plain:focus,.s-button-info.is-plain:hover {
    background: #fff;
    border-color: #50bfff;
    color: #50bfff
  }

  .s-button-info.is-plain:active {
    background: #fff;
    border-color: #48ace6;
    color: #48ace6;
    outline: none
  }

  .s-button-large {
    padding: 11px 19px;
    font-size: 16px;
    border-radius: 4px
  }

  .s-button-small {
    padding: 7px 9px;
    font-size: 12px;
    border-radius: 4px
  }

  .s-button-mini {
    padding: 4px;
    font-size: 12px;
    border-radius: 4px
  }

  .s-button-text {
    border: none;
    color: #20a0ff;
    background: transparent;
    padding-left: 0;
    padding-right: 0
  }

  .s-button-text:focus,.s-button-text:hover {
    color: #4db3ff
  }

  .s-button-text:active {
    color: #1d90e6
  }
</style>