<template>
  <div
          class="s-carousel"
          :class="{ 's-carousel-card': type === 'card' }"
          @mouseenter.stop="handleMouseEnter"
          @mouseleave.stop="handleMouseLeave">
    <div
            class="s-carousel-container"
            :style="{ height: height }">
      <transition name="carousel-arrow-left">
        <button
                v-if="arrow !== 'never'"
                v-show="arrow === 'always' || hover"
                @mouseenter="handleButtonEnter('left')"
                @mouseleave="handleButtonLeave"
                @click.stop="throttledArrowClick(activeIndex - 1)"
                class="s-carousel-arrow s-carousel-arrow-left">
          <i class="s-icon-arrow-left"></i>
        </button>
      </transition>
      <transition name="carousel-arrow-right">
        <button
                v-if="arrow !== 'never'"
                v-show="arrow === 'always' || hover"
                @mouseenter="handleButtonEnter('right')"
                @mouseleave="handleButtonLeave"
                @click.stop="throttledArrowClick(activeIndex + 1)"
                class="s-carousel-arrow s-carousel-arrow-right">
          <i class="s-icon-arrow-right"></i>
        </button>
      </transition>
      <slot></slot>
    </div>
    <ul
            class="s-carousel-indicators"
            v-if="indicatorPosition !== 'none'"
            :class="{ 's-carousel-indicators-outside': indicatorPosition === 'outside' || type === 'card' }">
      <li
              v-for="(item, index) in items"
              class="s-carousel-indicator"
              :class="{ 'is-active': index === activeIndex }"
              @mouseenter="throttledIndicatorHover(index)"
              @click.stop="handleIndicatorClick(index)">
        <button class="s-carousel-button"></button>
      </li>
    </ul>
  </div>
</template>

<script>
  import throttle from 'throttle-debounce/throttle';
  import debounce from 'throttle-debounce/debounce';
  import { addResizeListener, removeResizeListener } from '../extra/utils/resize-event';

  export default {
    name: 's-carousel',

    props: {
      initialIndex: {
        type: Number,
        default: 0
      },
      height: String,
      trigger: {
        type: String,
        default: 'hover'
      },
      autoplay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 3000
      },
      indicatorPosition: String,
      indicator: {
        type: Boolean,
        default: true
      },
      arrow: {
        type: String,
        default: 'hover'
      },
      type: String
    },

    data() {
      return {
        items: [],
        activeIndex: -1,
        containerWidth: 0,
        timer: null,
        hover: false
      };
    },

    watch: {
      items(val) {
        if (val.length > 0) this.setActiveItem(0);
      },

      activeIndex(val, oldVal) {
        this.resetItemPosition();
        this.$emit('change', val, oldVal);
      }
    },

    methods: {
      handleMouseEnter() {
        this.hover = true;
        this.pauseTimer();
      },

      handleMouseLeave() {
        this.hover = false;
        this.startTimer();
      },

      itemInStage(item, index) {
        const length = this.items.length;
        if (index === length - 1 && item.inStage && this.items[0].active ||
            (item.inStage && this.items[index + 1] && this.items[index + 1].active)) {
          return 'left';
        } else if (index === 0 && item.inStage && this.items[length - 1].active ||
            (item.inStage && this.items[index - 1] && this.items[index - 1].active)) {
          return 'right';
        }
        return false;
      },

      handleButtonEnter(arrow) {
        this.items.forEach((item, index) => {
          if (arrow === this.itemInStage(item, index)) {
            item.hover = true;
          }
        });
      },

      handleButtonLeave() {
        this.items.forEach(item => {
          item.hover = false;
        });
      },

      handleItemChange: debounce(100, function() {
        this.updateItems();
      }),

      updateItems() {
        this.items = this.$children.filter(child => child.$options.name === 'SCarouselItem');
      },

      resetItemPosition() {
        this.items.forEach((item, index) => {
          item.translateItem(index, this.activeIndex);
        });
      },

      playSlides() {
        if (this.activeIndex < this.items.length - 1) {
          this.activeIndex++;
        } else {
          this.activeIndex = 0;
        }
      },

      pauseTimer() {
        clearInterval(this.timer);
      },

      startTimer() {
        if (this.interval <= 0 || !this.autoplay) return;
        this.timer = setInterval(this.playSlides, this.interval);
      },

      setActiveItem(index) {
        if (typeof index === 'string') {
          const filteredItems = this.items.filter(item => item.name === index);
          if (filteredItems.length > 0) {
            index = this.items.indexOf(filteredItems[0]);
          }
        }
        index = Number(index);
        if (isNaN(index) || index !== Math.floor(index)) {
          process.env.NODE_ENV !== 'production' &&
          console.warn('[SunFlower Warn][Carousel]index must be an integer.');
          return;
        }
        let length = this.items.length;
        if (index < 0) {
          this.activeIndex = length - 1;
        } else if (index >= length) {
          this.activeIndex = 0;
        } else {
          this.activeIndex = index;
        }
      },

      prev() {
        this.setActiveItem(this.activeIndex - 1);
      },

      next() {
        this.setActiveItem(this.activeIndex + 1);
      },

      handleIndicatorClick(index) {
        this.activeIndex = index;
      },

      handleIndicatorHover(index) {
        if (this.trigger === 'hover' && index !== this.activeIndex) {
          this.activeIndex = index;
        }
      }
    },

    created() {
      this.throttledArrowClick = throttle(300, true, index => {
        this.setActiveItem(index);
      });
      this.throttledIndicatorHover = throttle(300, index => {
        this.handleIndicatorHover(index);
      });
    },

    mounted() {
      this.updateItems();
      this.$nextTick(() => {
        addResizeListener(this.$el, this.resetItemPosition);
        if (this.initialIndex < this.items.length && this.initialIndex >= 0) {
          this.activeIndex = this.initialIndex;
        }
        this.startTimer();
      });
    },

    beforeDestroy() {
      if (this.$el) removeResizeListener(this.$el, this.resetItemPosition);
    }
  };
</script>
<style>
  .s-carousel {
    overflow-x: hidden;
    position: relative
  }

  .s-carousel-container {
    position: relative;
    height: 300px
  }

  .s-carousel-arrow {
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    width: 36px;
    height: 36px;
    cursor: pointer;
    transition: .3s;
    border-radius: 50%;
    background-color: rgba(31,45,61,.11);
    color: #fff;
    position: absolute;
    top: 50%;
    z-index: 10;
    transform: translateY(-50%);
    text-align: center;
    font-size: 12px
  }

  .s-carousel-arrow:hover {
    background-color: rgba(31,45,61,.23)
  }

  .s-carousel-arrow i {
    cursor: pointer
  }

  .s-carousel-arrow-left {
    left: 16px
  }

  .s-carousel-arrow-right {
    right: 16px
  }

  .s-carousel-indicators {
    position: absolute;
    list-style: none;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    padding: 0;
    z-index: 2
  }

  .s-carousel-indicators-outside {
    bottom: 26px;
    text-align: center;
    position: static;
    transform: none
  }

  .s-carousel-indicators-outside .s-carousel-indicator:hover button {
    opacity: .64
  }

  .s-carousel-indicators-outside button {
    background-color: #8391a5;
    opacity: .24
  }

  .s-carousel-indicator {
    display: inline-block;
    background-color: transparent;
    padding: 12px 4px;
    cursor: pointer
  }

  .s-carousel-indicator:hover button {
    opacity: .72
  }

  .s-carousel-indicator.is-active button {
    opacity: 1
  }

  .s-carousel-button {
    display: block;
    opacity: .48;
    width: 30px;
    height: 2px;
    background-color: #fff;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    transition: .3s
  }

  .carousel-arrow-left-enter,.carousel-arrow-left-leave-active {
    transform: translateY(-50%) translateX(-10px);
    opacity: 0
  }

  .carousel-arrow-right-enter,.carousel-arrow-right-leave-active {
    transform: translateY(-50%) translateX(10px);
    opacity: 0
  }
  .s-carousel-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: inline-block;
    transition: .4s ease-in-out;
    overflow: hidden;
    z-index: 0
  }

  .s-carousel-item.is-active {
    z-index: 2
  }

  .s-carousel-item-card {
    width: 50%
  }

  .s-carousel-item-card.is-in-stage {
    cursor: pointer;
    z-index: 1
  }

  .s-carousel-item-card.is-in-stage.is-hover .s-carousel-mask,.s-carousel-item-card.is-in-stage:hover .s-carousel-mask {
    opacity: .12
  }

  .s-carousel-item-card.is-active {
    z-index: 2
  }

  .s-carousel-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #fff;
    opacity: .24;
    transition: .2s
  }

</style>
