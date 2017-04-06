<template>
  <div class="s-card">
    <div class="s-card-header" v-if="$slots.header || header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="s-card-body" :style="bodyStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 's-card',
    props: ['header', 'bodyStyle']
  }
</script>
<style>
  .s-card {
    border: 1px solid #d1dbe5;
    border-radius: 4px;
    background-color: #fff;
    overflow: hidden;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04)
  }
  .s-card-header {
    padding: 18px 20px;
    border-bottom: 1px solid #d1dbe5;
    box-sizing: border-box
  }
  .s-card-body {
    padding: 20px
  }
</style>