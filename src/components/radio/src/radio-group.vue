<template>
  <div class="s-radio-group">
    <slot></slot>
  </div>
</template>
<script>
  import Emitter from '../../../extra/mixins/emitter';

  export default {
    name: 'sRadioGroup',

    componentName: 'sRadioGroup',

    mixins: [Emitter],

    props: {
      value: {},
      size: String,
      fill: String,
      textColor: String,
      disabled: Boolean
    },
    watch: {
      value(value) {
        this.$emit('change', value);
        this.dispatch('sFormItem', 'el.form.change', [this.value]);
      }
    }
  };
</script>

