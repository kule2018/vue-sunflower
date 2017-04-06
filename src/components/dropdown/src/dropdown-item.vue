/**
* Created by alex on 2017/3/14.
*/
<template>
  <li :class="classes" @click="handleClick"><slot></slot></li>
</template>

<script type="text/babel">
  const prefixName = 's-dropdown-item';
  export default {
    name: 'sDropdownItem',
    props: {
      name: {
        type: [String, Number]
      },
      disabled: {
        type: Boolean,
        default: false
      },
      selected: {
        type: Boolean,
        default: false
      },
      divided: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      classes () {
        return [
          `${prefixName}`,
          {
            [`${prefixName}-disabled`]: this.disabled,
            [`${prefixName}-selected`]: this.selected,
            [`${prefixName}-divided`]: this.divided
          }
        ];
      }
    },
    methods: {
      handleClick () {
        const $parent = this.$parent.$parent.$parent;
        const hasChildren = this.$parent && this.$parent.$options.name === 'sDropdown';
        if (this.disabled) {
          this.$nextTick(() => {
            $parent.currentVisible = true;
          });
        } else if (hasChildren) {
          this.$parent.$emit('on-haschild-click');
        } else {
          if ($parent && $parent.$options.name === 'sDropdown') {
            $parent.$emit('on-hover-click');
          }
        }
        $parent.$emit('on-click', this.name);
      }
    }
  };
</script>

<style >

</style>
