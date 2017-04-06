/*
create by YOU
*/

<template>
  <div class="s-label-input" :style="groupStyle">
    <label :style="labelStyle" :class="size">{{ label }}</label>
    <div class="s-label-input-group-input" :style="inputStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/babel">
  export default {
    name: 'sLabelInput',
    computed: {
      groupStyle() {
        return 'width:' + this.width + 'px';
      },
      inputStyle() {
        return 'width:' + (this.width - this.labelWidth - 15) + 'px';
      },
      labelStyle() {
        return 'width:' + this.labelWidth + 'px';
      }
    },
    props: {
      label: {
        type: String
      },
      width: {
        type: Number,
        default: 200
      },
      labelWidth: {
        type: Number,
        default: 60
      },
      size: {
        type: String,
        // large small mini
        default: 'normal'
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .s-label-input
    display: inline-block
    margin: 5px
    label
      display: inline-block
      text-align: right
      vertical-align: top
      &.large
        height: 42px
        line-height: 42px
        font-size: 20px
      &.normal
        height: 36px
        line-height: 36px
        font-size: 18px
      &.small
        height: 30px
        line-height: 30px
        font-size: 16px
      &.mini
        height: 22px
        line-height: 22px
        font-size: 14px
    .s-label-input-group-input
      display: inline-block
      vertical-align: top
</style>
