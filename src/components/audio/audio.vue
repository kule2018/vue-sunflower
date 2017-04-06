<template>
    <audio id="s-audio-el" v-show="show" controls="controls" :src="src" preload="auto"></audio>
</template>
<script>
  const defSrc = './assets/msg.mp3';
  const defShow = false;
  export default {
    data() {
      return {
        show : defShow,
        src : defSrc
      };
    },
    methods: {
      play:function () {
        this.$el.play();
      },
      load:function (newSrc) {
        newSrc = newSrc || defSrc;
        this.$el.src = newSrc;
        this.$el.load();
      },
      showOrHide:function (showFlag){
        showFlag = showFlag || defShow;
        this.show = showFlag;
      }
    }
  };
</script>
<style>
  #s-audio-el{
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
