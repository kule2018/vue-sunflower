<template>
  <div class="s-button-group">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 's-button-group'
  };
</script>
<style>
  .s-button-group {
    display: inline-block;
    vertical-align: middle
  }

  .s-button-group .s-button-primary:first-child {
    border-right-color: hsla(0,0%,100%,.5)
  }

  .s-button-group .s-button-primary:last-child {
    border-left-color: hsla(0,0%,100%,.5)
  }

  .s-button-group .s-button-primary:not(:first-child):not(:last-child) {
    border-left-color: hsla(0,0%,100%,.5);
    border-right-color: hsla(0,0%,100%,.5)
  }

  .s-button-group .s-button-success:first-child {
    border-right-color: hsla(0,0%,100%,.5)
  }

  .s-button-group .s-button-success:last-child {
    border-left-color: hsla(0,0%,100%,.5)
  }

  .s-button-group .s-button-success:not(:first-child):not(:last-child) {
    border-left-color: hsla(0,0%,100%,.5);
    border-right-color: hsla(0,0%,100%,.5)
  }

  .s-button-group .s-button-warning:first-child {
    border-right-color: hsla(0,0%,100%,.5)
  }

  .s-button-group .s-button-warning:last-child {
    border-left-color: hsla(0,0%,100%,.5)
  }

  .s-button-group .s-button-warning:not(:first-child):not(:last-child) {
    border-left-color: hsla(0,0%,100%,.5);
    border-right-color: hsla(0,0%,100%,.5)
  }

  .s-button-group .s-button-danger:first-child {
    border-right-color: hsla(0,0%,100%,.5)
  }

  .s-button-group .s-button-danger:last-child {
    border-left-color: hsla(0,0%,100%,.5)
  }

  .s-button-group .s-button-danger:not(:first-child):not(:last-child) {
    border-left-color: hsla(0,0%,100%,.5);
    border-right-color: hsla(0,0%,100%,.5)
  }

  .s-button-group .s-button-info:first-child {
    border-right-color: hsla(0,0%,100%,.5)
  }

  .s-button-group .s-button-info:last-child {
    border-left-color: hsla(0,0%,100%,.5)
  }

  .s-button-group .s-button-info:not(:first-child):not(:last-child) {
    border-left-color: hsla(0,0%,100%,.5);
    border-right-color: hsla(0,0%,100%,.5)
  }

  .s-button-group .s-button {
    float: left;
    position: relative
  }

  .s-button-group .s-button+.s-button {
    margin-left: 0
  }

  .s-button-group .s-button:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0
  }

  .s-button-group .s-button:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0
  }

  .s-button-group .s-button:not(:first-child):not(:last-child) {
    border-radius: 0
  }

  .s-button-group .s-button:not(:last-child) {
    margin-right: -1px
  }

  .s-button-group .s-button.is-active,.s-button-group .s-button:active,.s-button-group .s-button:focus,.s-button-group .s-button:hover {
    z-index: 1
  }

</style>
