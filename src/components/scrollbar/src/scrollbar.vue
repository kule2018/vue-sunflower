<script>
// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js

import { addResizeListener, removeResizeListener } from '../../../extra/utils/resize-event';
import scrollbarWidth from '../../../extra/utils/scrollbar-width';
import { toObject } from '../../../extra/utils/util';
import Bar from './bar';

/* istanbul ignore next */
export default {
  name: 'sScrollbar',

  components: { Bar },

  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div'
    }
  },

  data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0
    };
  },

  computed: {
    wrap() {
      return this.$refs.wrap;
    }
  },

  render(h) {
    let gutter = scrollbarWidth();
    let style = this.wrapStyle;

    if (gutter) {
      const gutterWith = `-${gutter}px`;
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;

      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } else if (typeof this.wrapStyle === 'string') {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }
    const view = h(this.tag, {
      class: ['s-scrollbar-view', this.viewClass],
      style: this.viewStyle,
      ref: 'resize'
    }, this.$slots.default);
    const wrap = (
      <div
        ref="wrap"
        style={ style }
        onScroll={ this.handleScroll }
        class={ [this.wrapClass, 's-scrollbar-wrap', gutter ? '' : 's-scrollbar-wrap-hidden-default'] }>
        { [view] }
      </div>
    );
    let nodes;

    if (!this.native) {
      nodes = ([
        wrap,
        <Bar
          move={ this.moveX }
          size={ this.sizeWidth }></Bar>,
        <Bar
          vertical
          move={ this.moveY }
          size={ this.sizeHeight }></Bar>
      ]);
    } else {
      nodes = ([
        <div
          ref="wrap"
          class={ [this.wrapClass, 's-scrollbar-wrap'] }
          style={ style }>
          { [view] }
        </div>
      ]);
    }
    return h('div', { class: 's-scrollbar' }, nodes);
  },

  methods: {
    handleScroll() {
      const wrap = this.wrap;

      this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
      this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);
    },

    update() {
      let heightPercentage, widthPercentage;
      const wrap = this.wrap;
      if (!wrap) return;

      heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
      widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);

      this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : '';
      this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : '';
    }
  },

  mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
    !this.noresize && addResizeListener(this.$refs.resize, this.update);
  },

  destroyed() {
    if (this.native) return;
    !this.noresize && removeResizeListener(this.$refs.resize, this.update);
  }
};
</script>
<style>
  @charset "UTF-8";
  @import "../../theme-default/common/var.css";

  @component-namespace s {
    @b scrollbar {
      overflow: hidden;
      position: relative;

    &:hover,
    &:active,
    &:focus {
      .s-scrollbar__bar {
        opacity: 1;
        transition: opacity 340ms ease-out;
      }
    }

    @e wrap {
      overflow: scroll;

      @m hidden-default {
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
      }
    }

    @e thumb {
      position: relative;
      display: block;
      size: 0;
      cursor: pointer;
      border-radius: inherit;
      background-color: var(--scrollbar-background-color);
      transition: .3s background-color;

    &:hover {
       background-color: var(--scrollbar-hover-background-color);
     }
    }

    @e bar {
      position: absolute;
      right: 2px;
      bottom: 2px;
      z-index: 1;
      border-radius: 4px;
      opacity: 0;
      transition: opacity 120ms ease-out;

      @when vertical {
        width: 6px;
        top: 2px;

      > div {
          width: 100%;
        }
      }

      @when horizontal {
        height: 6px;
        left: 2px;

      > div {
          height: 100%;
        }
      }
    }
  }
  }

</style>
