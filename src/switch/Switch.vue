<template>
  <label class="s-switch"
         :class="{'on':model,'off':!model,'disable':disabled}"
         :style="{'width':coreWidth + 'px','backgroundColor':model?onColor:offColor}"
  >
    <input type="checkbox"
           :name="name"
           v-model="model"
           :disabled="disabled"
           class="s-switch__input"
           @change="handleChange"
    >

    <div class="pathway">
      <transition name="switch-transition" mode="out-in">
        <span v-if="model" key="on" class="on">
          <i :class="[onIconClass]" v-if="onIconClass"></i>
          <span v-if="!onIconClass && onText" class="text">{{onText}}</span>
        </span>
        <span v-else key="off" class="off">
          <i :class="[offIconClass]" v-if="offIconClass"></i>
          <span v-if="!offIconClass && offText" class="text">{{offText}}</span>
        </span>
      </transition>
      <span class="ball" :class="{'right':model,'left':!model}"></span>
    </div>

  </label>
</template>

<script>
  export default {
    name: 's-switch',
    data(){
      return {
        coreWidth: this.width
      }
    },
    props: {
      value: {
        type: Boolean,
        default: true
      },
      onText: {
        type: String,
        default: 'ON'
      },
      offText: {
        type: String,
        default: 'OFF'
      },
      width: {
        type: Number,
        default: 0
      },
      disabled:{
        type:Boolean,
        default:false
      },
      onColor: {
        type: String,
        default: ''
      },
      offColor: {
        type: String,
        default: ''
      },
      onIconClass:{
        type: String,
        default: ''
      },
      offIconClass: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      }
    },
    methods:{
      handleChange:function(){
        if(this.disabled){return}
        this.$emit('input',!this.model);
      }
    },
    computed:{
      model:function(){
        return this.value;
      },
      hasText:function(){
        return !!(this.onText || this.offText);
      }
    },
    mounted(){
      if(!this.width){
        this.coreWidth = this.hasText ? 58: 46;
      }
    }
  }
</script>

<style>
  .s-switch {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    font-size: 14px;
    overflow: hidden;
    border-radius: 22px;
    cursor: pointer;
    margin: 20px 20px 20px 0
  }
  .s-switch.on{
    background-color: #20a0ff;
    transition: background-color .2s;
  }
  .s-switch.off{
    background-color: rgb(191, 203, 217);
    transition: background-color .2s;
  }
  .s-switch.disable {
    background: rgb(228, 232, 241) !important;;
    cursor: not-allowed !important;
  }
  .s-switch .disable *{
    cursor: not-allowed! important;
    color: #ccc !important;
  }


  .s-switch .pathway {
    height: 100%;
    margin: 0 2px;
    position: relative;
  }

  .s-switch .pathway .on i,.s-switch .pathway .off i {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
  }
  .s-switch .pathway .on i{
    left: 0;
  }
  .s-switch .pathway .on .text{
    left: 10px;
  }
  .s-switch .pathway .off i{
    right: 0;
  }
  .s-switch .pathway .off .text{
    right: 10px;
  }

  .s-switch .pathway .text {
    user-select: none;
    cursor: pointer;
    font-size: 14px;
    color: #fff;
    position: absolute;
  }
  .s-switch .pathway .text .on{
    left: 10px;
  }
  .s-switch .pathway .text .off{
    right: 10px;
  }
  .s-switch .ball{
    position: absolute;
    top: 50%;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
  }
  .s-switch .ball.right{
    left: 100%;
    transform: translate(-100%,-50%);
    transition: all .2s;
  }
  .s-switch .ball.left{
    left: 0;
    transform: translate(0,-50%);
    transition: all .2s;
  }
  .s-switch__input {
    display: none;
  }
  .s-switch-transition-enter-active,.s-switch-transition-leave-active{
    transition:all .1s;
  }
  .s-switch-transition-enter,.s-switch-transition-leave-active{
    opacity: 0;
  }

</style>
