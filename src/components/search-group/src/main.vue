/*
create by YOU
*/
<template>
  <div class="s-search-group">
    <div class="s-search-group-header" :style="headerStyle">
      <span>查询条件</span>
      <div class="arrow" @click="topArrowHandler"><i :class="topArrow"></i></div>
    </div>
    <transition name="slide-up">
        <div class="s-search-group-body" v-show="bodyShow" :style="bodyStyle">
          <div class="s-search-group-form" :style="[bodyStyle,formStyle]">
            <div class="s-search-group-field" ref="form">
              <slot></slot>
            </div>
            <div class="s-search-group-buttons" ref="btn">
              <slot name="button"></slot>
            </div>
          </div>
          <div class="s-search-group-arrow" @click="bottomArrowHandler" v-show="ifShowBottomArrow">
            <i :class="bottomArrow"></i>
          </div>
        </div>
    </transition>
  </div>
</template>
<script type="text/babel">
  import Vue from 'vue';
  export default{
    name: 'sSearchGroup',
    data() {
      return {
        bottomArrowShow: false,
        bodyShow: true,
        classMap: {
          'up': 'iconfont icon-top',
          'down': 'iconfont icon-bottom'
        },
        bottomArrowDirection: 'down',
        topArrowDirection: 'up',
        formPaddingRight: 0,
        originHeight: 0,
        bodyHeight: 0
      }
    },
    mounted() {
      let that = this;
      that.formPaddingRight = that.$refs.btn.offsetWidth;
      this.$nextTick(function () {
        that.originHeight = that.$refs.form.offsetHeight;
        that.bodyHeight = that.$refs.btn.offsetHeight;
      });
      window.addEventListener('resize', function () {
        setTimeout(function () {
          that.originHeight = that.$refs.form.offsetHeight;
        }, 50);
      });
    },
    computed: {
      topArrow() {
        return this.classMap[this.topArrowDirection];
      },
      bottomArrow() {
        return this.classMap[this.bottomArrowDirection];
      },
      headerStyle() {
          return 'background:' + this.background;
      },
      formStyle() {
        return {"padding-right" : this.formPaddingRight+'px'};
      },
      bodyStyle() {
        let height;
        if (this.bottomArrowDirection === 'down') {
          height = {"height":  this.bodyHeight + 'px'};
        } else {
          height = {"height":  this.originHeight + 'px'};
        }
        return height;
      },
      ifShowBottomArrow() {
        if (this.originHeight > this.bodyHeight && this.topArrowDirection === 'up') {
          return true;
        } else {
          return false;
        }
      }
    },
    methods: {
      reserve(direction){
        return direction === 'up' ? 'down' : 'up';
      },
      topArrowHandler() {
        this.topArrowDirection = this.reserve(this.topArrowDirection);
        this.bodyShow = !this.bodyShow;
        // display 改变后重新计算 originHeight
        this.$nextTick(function () {
          this.originHeight = this.$refs.form.offsetHeight;
        });
      },
      bottomArrowHandler() {
        this.bottomArrowDirection = this.reserve(this.bottomArrowDirection);
      }
    },
    props: {
      background: {
        type: String,
        default: '#20A0FF'
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .s-search-group
    position: relative
    .s-search-group-header
      height: 30px
      padding-left: 10px
      line-height: 30px
      background: #20A0FF
      .arrow
        margin-right:20px
        float:right
        cursor: pointer
        color : #fff
      span
        font-size: 12px
        font-weight: 500
        color: #ffffff
    .s-search-group-body
      position: relative
      padding: 15px
      overflow: hidden
      border :1px solid #d1dbe5

      .s-search-group-form
        position: relative
        overflow: hidden
        .s-search-group-buttons
          position: absolute
          right: 0
          top: 0
          padding: 5px
    .s-search-group-arrow
      position: absolute
      left: 50%
      bottom: 0
      width: 30px
      height: 12px
      line-height: 12px
      margin-left: -15px
      border-width: 1px 1px 0 1px
      border-color: #cccccc
      border-style: solid
      border-radius: 3px 3px 0 0
      text-align: center
      cursor: pointer
      i
        font-size: 12px
        color: #1f2d3d
</style>
