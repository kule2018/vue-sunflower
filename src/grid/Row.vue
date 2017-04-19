<template>
      <div :class="classes" :style="styles">
        <slot>写什么待定</slot>
      </div>
</template>

<script>
  import { oneOf } from '../extra/utils/assist';

  const prefixName = 's-row';
  export default{
    name: 's-row',
    props: {
        // 是否开启flex模式
      type: {
           validator (value) {
              return oneOf(value, ['flex'])
           }
        },
        // flex 布局下的垂直对齐方式
      align: {
        validator (value) {
           return oneOf(value, ['top', 'middle', 'bottom'])
        }
      },
      justify: {
        validator (value) {
           return oneOf(value, ['start', 'end', 'center', 'around', 'between'])
        }
      },
      gutter: {
        type: Number,
        default: 0
      },
      className: String
    },
    computed: {
      classes () {
        return [
          {
            [`${prefixName}`]: !this.type,
            [`${prefixName}-${this.type}`]: !!this.type,
            [`${prefixName}-${this.type}-${this.align}`]: !!this.align,
            [`${prefixName}-${this.type}-${this.justify}`]: !!this.justify,
            [`${this.className}`]: !!this.className
          }
        ]
      },
      styles () {
        let style = {};
        if (this.gutter !== 0) {
          style = {
            marginLeft: this.gutter / -2 + 'px',
            marginRight: this.gutter / -2 + 'px'
          }
        }
        return style
      }
    },
    methods: {
      updateGutter (val) {
        this.$children.forEach((child) => {
          if (val !== 0) {
          child.gutter = val;
        }
      });
      }
    },
    watch: {
      gutter (val) {
        this.updateGutter(val);
        }
    },
    ready () {
      this.updateGutter(this.gutter);
    }
  }

</script>

<style lang="scss">
  .s-row{
    position: relative;
    box-sizing: border-box;
    &:before,
    &:after {
      display: table;
      content: ""
    }

    &:after{
      clear: both
    }
    &-flex{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      &-top{
        align-items: flex-start;
      }

      &-middle{
        align-items: center;
      }

      &-bottom{
        align-items: flex-end;
      }

      &-start{
        justify-content: flex-start;
      }

      &-end{
        justify-content: flex-end;
      }

      &-center{
        justify-content: center;
      }

      &-between{
        justify-content: space-between;
      }

      &-around{
        justify-content: space-around;
      }
    }
  }
</style>
