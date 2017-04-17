<template>
  <div class="s-box" :style="getContentStyle" ref="box">
    <div v-show="header" class="s-box-header" ref="header" :style="getHeaderStyle">
      <i :class="headerIconClass"></i>
      <span>{{ title }}</span>
    </div>
    <div class="s-box-body clearfix" :style="getBodyHeight">
      <div clas="s-box-bar" v-for="item in barArray" :style="getBodyBarStyle(item)" v-if="barArray.length !== 1">
        <slot :name="item.index"></slot>
      </div>
      <div class="s-box-bar single" style="width: 100%;" v-else>
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
  // width,height,icon格式,是否显示Header, 分栏条数
  export default {
    name: 's-box',
    data() {
      return {
        barArray: ['100%'],
        headerHeight: 0
      };
    },
    created() {
      let reBars = [];
      if (typeof this.bars === 'number') {
        let bar = 100 / this.bars;
        for (let i = 0; i < this.bars; i++) {
          reBars.push({
            index: i + 1,
            width: bar + '%'
          });
        }
      } else if (typeof this.bars === 'object' && this.bars.length) {
        let count = 0;
        for (let i = 0; i < this.bars.length; i++) {
          count += this.bars[i];
        }
        let minBar = 100 / count;
        reBars = this.bars.map(function (value, index) {
          return {
            index: index,
            width: minBar * value + '%'
          };
        });
      }
      this.barArray = reBars;
    },
    mounted() {
      this.headerHeight = this.$refs.header.offsetHeight;
    },
    methods: {
      getBodyBarStyle(item) {
        let height = this.header ? Number.parseInt(this.height) - this.headerHeight : Number.parseInt(this.height);
        return 'width:' + item.width + ';minHeight: ' + height + 'px;';
      }
    },
    computed: {
      getContentStyle() {
        let borderStr = this.border ? '' : ' border:none;';
        return 'width:' + this.width + '; height:' + this.height + ';' + borderStr;
      },
      getHeaderStyle() {
        return this.border ? '' : ' border:none;';
      },
      getBodyHeight() {
        let height = this.header ? Number.parseInt(this.height) - this.headerHeight : Number.parseInt(this.height);
        return 'minHeight:' + height + 'px';
      },
      headerIconClass() {
        return 'iconfont icon-' + this.type;
      }
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      height: {
        type: String,
        default: '300px'
      },
      width: {
        type: String,
        default: '100%'
      },
      type: {
        type: String,
        default: 'event'
      },
      header: {
        type: Boolean,
        default: true
      },
      bars: {
        type: [Number, Array],
        default: 1
      },
      size: {
        type: String,
        default: 'small'
      },
      border: {
        type: Boolean,
        default: true
      }
    }
    //  ['title', 'height', 'width', 'type', 'header', 'bars']
  };
</script>
<style lang="scss">
  .clearfix:before {
    display: block;
    content: ''
  }

  .clearfix:after {
    display: block;
    content: '';
    clear: both;
    overflow: hidden;
  }

  .s-box {
    border: solid 1px #d1dbe5;
    border-radius: 5px;
    text-align: left;
    .s-box-header {
      box-sizing: border-box;
      width: 100%;
      line-height: 100%;
      padding: 10px 0 10px 15px;
      border-bottom: solid 1px #d1dbe5;
      i {
        display: inline-block;
        vertical-align: baseline;
        &.tiny {
          width: 12px;
          height: 12px;
          font-size: 12px
          + span {
            line-height: 12px;
            font-size: 12px
          }
        }
        &.small {
          width: 14px;
          height: 14px;
          font-size: 14px;
          + span {
            line-height: 14px;
            font-size: 14px;
          }
        }
        &.big {
          width: 20px;
          height: 20px;
          font-size: 20px;
          + span {
            line-height: 20px;
            font-size: 16px;
          }
        }
        &.large {
          width: 30px;
          height: 30px;
          font-size: 30px;
          + span {
            line-height: 30px;
            font-size: 20px;
          }
        }
      }
      span {
        display: inline-block;
        height: 100%;
        margin: auto 10px;
        font-size: 14px;
        vertical-align: top;
      }
    }
    .s-box-body {
      width: 100%;
      .s-box-bar {
        padding: 10px;
        box-sizing: border-box;
        float: left;
        height: 100%;
        text-align: center;
        &.single {
          text-align: left;
        }
      }
      > .s-box-bar + .s-box-bar {
        border-left: solid 1px #d1dbe5;
      }
    }
  }
</style>