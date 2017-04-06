<template>
  <div class="s-badge">
    <slot></slot>
    <transition name="s-zoom-in-center">
      <sup
        v-show="!hidden && ( content || isDot )"
        v-text="content"
        class="s-badge-content"
        :class="{ 'is-fixed': $slots.default, 'is-dot': isDot }">
      </sup>
    </transition>
  </div>
</template>

<script>
export default {
  name: 's-badge',

  props: {
    value: {},
    max: Number,
    isDot: Boolean,
    hidden: Boolean
  },

  computed: {
    content() {
      if (this.isDot) return;

      const value = this.value;
      const max = this.max;

      if (typeof value === 'number' && typeof max === 'number') {
        return max < value ? `${max}+` : value;
      }

      return value;
    }
  }
};
</script>

<style scoped>
  .s-badge {
    position: relative;
    vertical-align: middle;
    display: inline-block
  }

  .s-badge-content {
    background-color: #ff4949;
    border-radius: 10px;
    color: #fff;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #fff
  }

  .s-badge-content.is-dot {
    width: 8px;
    height: 8px;
    padding: 0;
    right: 0;
    border-radius: 50%
  }

  .s-badge-content.is-fixed {
    top: 0;
    right: 10px;
    position: absolute;
    transform: translateY(-50%) translateX(100%)
  }

  .s-badge-content.is-fixed.is-dot {
    right: 5px
  }
</style>
