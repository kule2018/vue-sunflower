<template>
  <transition name="s-loading-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="s-loading-mask"
      :class="[customClass, { 'is-fullscreen': fullscreen }]">
      <div class="s-loading-spinner">
        <svg class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none"/>
        </svg>
        <p v-if="text" class="s-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        text: null,
        fullscreen: true,
        visible: false,
        customClass: ''
      };
    },

    methods: {
      handleAfterLeave() {
        this.$emit('after-leave');
      }
    }
  };
</script>