<template>
  <ul class="s-select-group__wrap">
    <li class="s-select-group__title" v-show="visible">{{ label }}</li>
    <li>
      <ul class="s-select-group">
        <slot></slot>
      </ul>
    </li>
  </ul>
</template>

<script type="text/babel">
  import Emitter from '../../../extra/mixins/emitter';

  export default {
    mixins: [Emitter],

    name: 'sOptionGroup',

    componentName: 'sOptionGroup',

    props: {
      label: String,
      disabled: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        visible: true
      };
    },

    watch: {
      disabled(val) {
        this.broadcast('sOption', 'handleGroupDisabled', val);
      }
    },

    methods: {
      queryChange() {
        this.visible = this.$children &&
          Array.isArray(this.$children) &&
          this.$children.some(option => option.visible === true);
      }
    },

    created() {
      this.$on('queryChange', this.queryChange);
    },

    mounted() {
      if (this.disabled) {
        this.broadcast('sOption', 'handleGroupDisabled', this.disabled);
      }
    }
  };
</script>

<style scoped>
  @charset "UTF-8";
  @import "../../theme-default/common/var.css";

  @component-namespace s {

    @b select-group {
      margin: 0;
      padding: 0;

      @e wrap {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      @e title {
        padding-left: 10px;
        font-size: var(--select-group-font-size);
        color: var(--select-group-color);
        height: var(--select-group-height);
        line-height: var(--select-group-height);
      }

    & .s-select-dropdown__item {
        padding-left: 20px;
      }
    }
  }

</style>
