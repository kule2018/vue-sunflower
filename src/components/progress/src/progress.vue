<template>
  <div
    class="s-progress"
    :class="[
      's-progress--' + type,
      status ? 'is-' + status : '',
      {
        's-progress--without-text': !showText,
        's-progress--text-inside': textInside,
      }
    ]"
  >
    <div class="s-progress-bar" v-if="type === 'line'">
      <div class="s-progress-bar__outer" :style="{height: strokeWidth + 'px'}">
        <div class="s-progress-bar__inner" :style="barStyle">
          <div class="s-progress-bar__innerText" v-if="showText && textInside">{{percentage}}%</div>
        </div>
      </div>
    </div>
    <div class="s-progress-circle" :style="{height: width + 'px', width: width + 'px'}" v-else>
      <svg viewBox="0 0 100 100">
        <path class="s-progress-circle__track" :d="trackPath" stroke="#e5e9f2" :stroke-width="relativeStrokeWidth" fill="none"></path>
        <path class="s-progress-circle__path" :d="trackPath" stroke-linecap="round" :stroke="stroke" :stroke-width="relativeStrokeWidth" fill="none" :style="circlePathStyle"></path>
      </svg>
    </div>
    <div
      class="s-progress__text"
      v-if="showText && !textInside"
      :style="{fontSize: progressTextSize + 'px'}"
    >
      <template v-if="!status">{{percentage}}%</template>
      <i v-else :class="iconClass"></i>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'sProgress',
    props: {
      type: {
        type: String,
        default: 'line',
        validator: val => ['line', 'circle'].indexOf(val) > -1
      },
      percentage: {
        type: Number,
        default: 0,
        required: true,
        validator: val => val >= 0 && val <= 100
      },
      status: {
        type: String
      },
      strokeWidth: {
        type: Number,
        default: 6
      },
      textInside: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 126
      },
      showText: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      barStyle() {
        var style = {};
        style.width = this.percentage + '%';
        return style;
      },
      relativeStrokeWidth() {
        return (this.strokeWidth / this.width * 100).toFixed(1);
      },
      trackPath() {
        var radius = parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10);

        return `M 50 50 m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`;
      },
      perimeter() {
        var radius = 50 - parseFloat(this.relativeStrokeWidth) / 2;
        return 2 * Math.PI * radius;
      },
      circlePathStyle() {
        var perimeter = this.perimeter;
        return {
          strokeDasharray: `${perimeter}px,${perimeter}px`,
          strokeDashoffset: (1 - this.percentage / 100) * perimeter + 'px',
          transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
        };
      },
      stroke() {
        var ret;
        switch (this.status) {
          case 'success':
            ret = '#13ce66';
            break;
          case 'exception':
            ret = '#ff4949';
            break;
          default:
            ret = '#20a0ff';
        }
        return ret;
      },
      iconClass() {
        if (this.type === 'line') {
          return this.status === 'success' ? 's-icon-circle-check' : 's-icon-circle-cross';
        } else {
          return this.status === 'success' ? 's-icon-check' : 's-icon-close';
        }
      },
      progressTextSize() {
        return this.type === 'line'
          ? 12 + this.strokeWidth * 0.4
          : this.width * 0.111111 + 2 ;
      }
    }
  };
</script>
<style>
  @charset "UTF-8";
  @import "../../theme-default/common/var.css";

  @component-namespace s {
    @b progress {
      position: relative;
      line-height: 1;

      @e text {
        font-size:14px;
        color:var(--color-extra-light-black);
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
        line-height: 1;

        i {
          vertical-align: middle;
          display: block;
        }
      }
      @m circle {
        display: inline-block;

        .s-progress__text {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          text-align: center;
          margin: 0;
          transform: translate(0, -50%);

        i {
          vertical-align: middle;
          display: inline-block;
        }
      }
    }
    @m without-text {
      .s-progress__text {
        display: none;
      }
      .s-progress-bar {
        padding-right: 0;
        margin-right: 0;
        display: block;
      }
    }
    @m text-inside {
      .s-progress-bar {
        padding-right: 0;
        margin-right: 0;
      }
    }
    @when success {
      .s-progress-bar__inner {
        background-color: var(--color-success);
      }
      .s-progress__text {
        color: var(--color-success);
      }
    }
    @when exception {
      .s-progress-bar__inner {
        background-color: var(--color-danger);
      }
      .s-progress__text {
        color: var(--color-danger);
      }
    }
  }
  @b progress-bar {
    padding-right: 50px;
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    margin-right: -55px;
    box-sizing: border-box;

    @e outer {
      height: 6px;
      border-radius: 100px;
      background-color: var(--color-light-gray);
      overflow: hidden;
      position: relative;
      vertical-align: middle;
    }
    @e inner {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      border-radius: 2px 0 0 2px;
      background-color: var(--color-primary);
      text-align: right;
      border-radius: 100px;
      line-height: 1;

    @utils-vertical-center;
    }
    @e innerText {
      display: inline-block;
      vertical-align: middle;
      color: var(--color-white);
      font-size: 12px;
      margin: 0 5px;
    }
  }
  }

  @keyframes progress {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 32px 0;
    }
  }

</style>
