<script>
  import Emitter from '../../../extra/mixins/emitter.js'


  export default {
    name: 'sCheckboxGroup',

    componentName: 'sCheckboxGroup',

    mixins: [Emitter],

    props: {
      value: {}
    },

    watch: {
      value(value) {
        console.log(1)
        this.dispatch('sFormItem', 'el.form.change', [value]);
      }
    }
  };
</script>

<template>
  <div class="s-checkbox-group">
    <slot></slot>
  </div>
</template>
