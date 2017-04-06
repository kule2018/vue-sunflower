<template>
  <label class="s-switch"
       :class="{'on': model,'off':!model,'disable':disabled}"
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
          <span v-if="!onIconClass && onText" class="text ">{{onText}}</span>
        </span>
        <span v-else key="off" class="off">
          <i :class="[offIconClass]" v-if="offIconClass"></i>
          <span v-if="!offIconClass && offText" class="text ">{{offText}}</span>
        </span>
      </transition>
      <span class="ball" :class="{'right':model,'left':!model}"></span>
    </div>

	</label>
</template>

<script>
  export default {
    name: 'sSwitch',
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

<style >
  @import "../../theme-default/common/var.css";

  @component-namespace s{
    @b switch{
      display: inline-block;
      height: var(--switch-height);
      line-height: var(--switch-height);
      font-size: var(--switch-font-size);
      overflow: hidden;
      border-radius: var(--switch-height/2);
      cursor: pointer;
      &.on{
        background-color: var(--switch-on-color);
         transition: background-color .2s;
      }
      &.off{
        background-color: var(--switch-off-color);
        transition: background-color .2s;
      }
      &.disable{
         background: var(--switch-disabled-color) !important;
         cursor: not-allowed!important;
          & *{
              cursor: not-allowed!important;
              color: var(--switch-disabled-text-color) !important;
            }
       }

      @e input{
        display: none;
      }

      & .pathway{
          height: 100%;
          margin: 0 2px;
          position: relative;

        & .on i,& .off i {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: #fff;
        }
        & .on{
          & i{

              left: 0;
            }
            & .text{
                left: 10px;
              }
          }
        & .off{
          & i{
              right: 0;
            }
          & .text{
              right: 10px;
            }
          }

        & .text{
          user-select: none;
          cursor: pointer;
          font-size: var(--switch-font-size);
          color: var(--color-white);
          position: absolute;
          &.on{
           left: 10px;
          }
          &.off{
           right: 10px;
          }
        }
        & .ball{
            circle: var(--switch-button-size) #fff;
            position: absolute;
            top: 50%;
        }
        & .ball.right{
            left: 100%;
            transform: translate(-100%,-50%);
            transition: all .2s;
        }
        & .ball.left{
          left: 0;
            transform: translate(0,-50%);
            transition: all .2s;
        }
      }
    }
    .switch-transition-enter-active,.switch-transition-leave-active{
       transition:all .1s;
    }
    .switch-transition-enter,.switch-transition-leave-active{
      opacity: 0;
    }
  }

</style>
