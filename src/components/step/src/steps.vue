/**
* Created by alex on 2017/3/13.
*/
<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script type="text/babel">
  import { oneOf } from '../../utils/assist';

  const prefixName = 's-steps';

  export default {
    name: 'sSteps',
    props: {
      current: {
        type: Number,
        default: 0
      },
      status: {
        validator (value) {
          return oneOf(value, ['wait', 'process', 'finish', 'error']);
        },
        default: 'process'
      },
      size: {
        validator (value) {
          return oneOf(value, ['small']);
        }
      },
      direction: {
        validator (value) {
          return oneOf(value, ['horizontal', 'vertical']);
        },
        default: 'horizontal'
      }
    },
    computed: {
      classes () {
        return [
          `${prefixName}`,
          `${prefixName}-${this.direction}`,
          {
            [`${prefixName}-${this.size}`]: !!this.size
          }
        ];
      }
    },
    mounted () {
      this.updateChildProps(true);
      this.setNextError();
      this.updateCurrent(true);
    },
    methods: {
      updateChildProps (isInit) {
        const total = this.$children.length;
        this.$children.forEach((child, index) => {
          child.stepNumber = index + 1;
          if (this.direction === 'horizontal') {
            child.total = total;
          }

          if (!(isInit && child.currentStatus)) {
            if (index == this.current) {
              if (this.status != 'error') {
                child.currentStatus = 'process';
              }
            } else if (index < this.current) {
              child.currentStatus = 'finish';
            } else {
              child.currentStatus = 'wait';
            }
          }
          if (child.currentStatus != 'error' && index != 0) {
            this.$children[index - 1].nextError = false;
          }
        });
      },
      setNextError () {
        this.$children.forEach((child, index) => {
          if (child.currentStatus == 'error' && index != 0) {
            this.$children[index - 1].nextError = true;
          }
        });
      },
      updateCurrent (isInit) {
        // 防止溢出边界
        if (this.current < 0 || this.current >= this.$children.length ) {
          return;
        }
        if (isInit) {
          const current_status = this.$children[this.current].currentStatus;
          if (!current_status) {
            this.$children[this.current].currentStatus = this.status;
          }
        } else {
          this.$children[this.current].currentStatus = this.status;
        }
      }
    },
    watch: {
      current () {
        this.updateChildProps();
      },
      status () {
        this.updateCurrent();
      }
    }
  };
</script>
