<template>
  <div :class="classes" :style="styles">
    <slot></slot>
  </div>
</template>

<script>
  const prefixName = 's-col';
  export default {
    name: 's-col',
    props: {
      span: [Number, String],
      order: [Number, String],
      offset: [Number, String],
      push: [Number, String],
      pull: [Number, String],
      className: String,
      xs: [Number, Object],
      sm: [Number, Object],
      md: [Number, Object],
      lg: [Number, Object]
    },
    computed: {
      gutter() {
        return this.$parent.gutter;
      },
      classes () {
        let classList = [
          `${prefixName}`,
          {
            [`${prefixName}-${this.span}`]: this.span,
            [`${prefixName}-order-${this.order}`]: this.order,
            [`${prefixName}-offset-${this.offset}`]: this.offset,
            [`${prefixName}-push-${this.push}`]: this.push,
            [`${prefixName}-pull-${this.pull}`]: this.pull,
            [`${this.className}`]: !!this.className
          }
        ];
        ['xs', 'sm', 'md', 'lg'].forEach(size => {
          if (typeof this[size] === 'number') {
            classList.push(`${prefixName}-span-${size}-${this[size]}`);
          } else if (typeof this[size] === 'object') {
            let props = this[size];
            Object.keys(props).forEach(prop => {
              classList.push(
                prop !== 'span'
                  ? `${prefixName}-${size}-${prop}-${props[prop]}`
                  : `${prefixName}-span-${size}-${props[prop]}`
              );
            });
          }
        });
        return classList;
      },
      styles () {
        let style = {};
        if (this.gutter !== 0) {
          style = {
            paddingLeft: this.gutter / 2 + 'px',
            paddingRight: this.gutter / 2 + 'px'
          };
        }
        return style;
      }
    }
  };
</script>

<style>
  .s-col-1, .s-col-2, .s-col-3, .s-col-4, .s-col-5, .s-col-6, .s-col-7, .s-col-8, .s-col-9, .s-col-10, .s-col-11, .s-col-12, .s-col-13, .s-col-14, .s-col-15, .s-col-16, .s-col-17, .s-col-18, .s-col-19, .s-col-20, .s-col-21, .s-col-22, .s-col-23, .s-col-24 {
    float: left;
    box-sizing: border-box;
  }
  .s-col-0 {
    display: none;
  }

  @for $i from 1 to 24 {
    .s-col-$i {
      width: calc(1 / 24 * $(i) * 100)%;
    }
    .s-col-offset-$i {
      margin-left: calc(1 / 24 * $(i) * 100)%;
    }
    .s-col-pull-$i {
      position: relative;
      right: calc(1 / 24 * $(i) * 100)%;
    }
    .s-col-push-$i {
      position: relative;
      left: calc(1 / 24 * $(i) * 100)%;
    }
    .s-col-order-$i{
      order: $(i);
    }
  }

  @media (max-width: 768px) {
    @for $i from 1 to 24 {
      .s-col-xs-$i {
        width: calc(1 / 24 * $(i) * 100)%;
      }
      .s-col-xs-offset-$i {
        margin-left: calc(1 / 24 * $(i) * 100)%;
      }
      .s-col-xs-pull-$i {
        position: relative;
        right: calc(1 / 24 * $(i) * 100)%;
      }
      .s-col-xs-push-$i {
        position: relative;
        left: calc(1 / 24 * $(i) * 100)%;
      }
    }
  }

  @media (min-width: 768px) {
    @for $i from 1 to 24 {
      .s-col-sm-$i {
        width: calc(1 / 24 * $(i) * 100)%;
      }
      .s-col-sm-offset-$i {
        margin-left: calc(1 / 24 * $(i) * 100)%;
      }
      .s-col-sm-pull-$i {
        position: relative;
        right: calc(1 / 24 * $(i) * 100)%;
      }
      .s-col-sm-push-$i {
        position: relative;
        left: calc(1 / 24 * $(i) * 100)%;
      }
    }
  }
  @media (min-width: 992px) {
    @for $i from 1 to 24 {
      .s-col-md-$i {
        width: calc(1 / 24 * $(i) * 100)%;
      }
      .s-col-md-offset-$i {
        margin-left: calc(1 / 24 * $(i) * 100)%;
      }
      .s-col-md-pull-$i {
        position: relative;
        right: calc(1 / 24 * $(i) * 100)%;
      }
      .s-col-md-push-$i {
        position: relative;
        left: calc(1 / 24 * $(i) * 100)%;
      }
    }
  }
  @media (min-width: 1200px) {
    @for $i from 1 to 24 {
      .s-col-lg-$i {
        width: calc(1 / 24 * $(i) * 100)%;
      }
      .s-col-lg-offset-$i {
        margin-left: calc(1 / 24 * $(i) * 100)%;
      }
      .s-col-lg-pull-$i {
        position: relative;
        right: calc(1 / 24 * $(i) * 100)%;
      }
      .s-col-lg-push-$i {
        position: relative;
        left: calc(1 / 24 * $(i) * 100)%;
      }
    }
  }
</style>
