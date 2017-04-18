<template>
  <div class="s-checkbox-group">
    <slot></slot>
  </div>
</template>
<script>
  import Emitter from '../extra/mixins/emitter';
  export default {
    name: 's-checkbox-group',
    componentName: 'SCheckboxGroup',
    mixins: [Emitter],
    props: {
      value: {},
      min: Number,
      max: Number
    },
    watch: {
      value(value) {
        this.dispatch('SFormItem', 'el.form.change', [value]);
      }
    }
  };
</script>