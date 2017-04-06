<template>
  <li
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
    class="s-select-dropdown__item"
    v-show="visible"
    :class="{
      'selected': itemSelected,
      'is-disabled': disabled || groupDisabled || limitReached,
      'hover': parent.hoverIndex === index
    }">
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script type="text/babel">
  import Emitter from '../../../extra/mixins/emitter';

  export default {
    mixins: [Emitter],

    name: 'sOption',

    componentName: 'sOption',

    props: {
      value: {
        required: true
      },
      label: [String, Number],
      created: Boolean,
      disabled: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        index: -1,
        groupDisabled: false,
        visible: true,
        hitState: false
      };
    },

    computed: {
      currentLabel() {
        return this.label || ((typeof this.value === 'string' || typeof this.value === 'number') ? this.value : '');
      },

      currentValue() {
        return this.value || this.label || '';
      },

      parent() {
        let result = this.$parent;
        while (!result.isSelect) {
          result = result.$parent;
        }
        return result;
      },

      itemSelected() {
        if (!this.parent.multiple) {
          return this.value === this.parent.value;
        } else {
          return this.parent.value.indexOf(this.value) > -1;
        }
      },

      limitReached() {
        if (this.parent.multiple) {
          return !this.itemSelected &&
            this.parent.value.length >= this.parent.multipleLimit &&
            this.parent.multipleLimit > 0;
        } else {
          return false;
        }
      }
    },

    watch: {
      currentLabel() {
        if (!this.created) this.dispatch('sSelect', 'setSelected');
      },
      value() {
        if (!this.created) this.dispatch('sSelect', 'setSelected');
      }
    },

    methods: {
      handleGroupDisabled(val) {
        this.groupDisabled = val;
      },

      hoverItem() {
        if (!this.disabled && !this.groupDisabled) {
          this.parent.hoverIndex = this.parent.options.indexOf(this);
        }
      },

      selectOptionClick() {
        if (this.disabled !== true && this.groupDisabled !== true) {
          this.dispatch('sSelect', 'handleOptionClick', this);
        }
      },

      queryChange(query) {
        // query 里如果有正则中的特殊字符，需要先将这些字符转义
        let parsedQuery = String(query).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
        this.visible = new RegExp(parsedQuery, 'i').test(this.currentLabel) || this.created;
        if (!this.visible) {
          this.parent.filteredOptionsCount--;
        }
      },

      resetIndex() {
        this.$nextTick(() => {
          this.index = this.parent.options.indexOf(this);
        });
      }
    },

    created() {
      this.parent.options.push(this);
      this.parent.cachedOptions.push(this);
      this.parent.optionsCount++;
      this.parent.filteredOptionsCount++;
      this.index = this.parent.options.indexOf(this);

      this.$on('queryChange', this.queryChange);
      this.$on('handleGroupDisabled', this.handleGroupDisabled);
      this.$on('resetIndex', this.resetIndex);
    },

    beforeDestroy() {
      this.dispatch('sSelect', 'onOptionDestroy', this);
    }
  };
</script>

<style scoped>
  @charset "UTF-8";
  @import "../../theme-default/common/var.css";

  @component-namespace s {

    @b select-dropdown {
      @e item {
        font-size: var(--select-font-size);
        padding: 8px 10px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--select-option-color);
        height: var(--select-option-height);
        line-height: 1.5;
        box-sizing: border-box;
        cursor: pointer;

        @when disabled {
          color: var(--select-option-disabled-color);
          cursor: not-allowed;

        &:hover {
           background-color: var(--color-white);
         }
        }

      &.hover {
         background-color: var(--select-option-hover-background);
       }

      &.selected {
         color: var(--color-white);
         background-color: var(--select-option-selected);

      &.hover {
         background-color: var(--select-option-selected-hover);
       }
      }

    & span {
        line-height: 1.5 !important;
      }
    }
  }
  }

</style>
