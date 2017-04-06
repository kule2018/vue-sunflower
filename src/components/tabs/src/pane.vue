/**
* Created by alex on 2017/3/14.
*/
<template>
  <div :class="prefixCls" v-show="show"><slot></slot></div>
</template>

<script type="text/babel">
  const prefixName = 's-tabs-tabpane';
  export default {
    name: 'sTabPane',
    props: {
      name: {
        type: String
      },
      label: {
        type: String,
        default: ''
      },
      icon: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: false
      },
      closable: {
        type: Boolean,
        default: null
      }
    },
    data () {
      return {
        prefixCls: prefixName,
        show: true,
        currentName: this.name
      };
    },
    methods: {
      updateNav () {
        this.$parent.updateNav();
      }
    },
    watch: {
      name (val) {
        this.currentName = val;
        this.updateNav();
      },
      label () {
        this.updateNav();
      },
      icon () {
        this.updateNav();
      },
      disabled () {
        this.updateNav();
      }
    },
    mounted () {
      this.updateNav();
    }
  };
</script>
