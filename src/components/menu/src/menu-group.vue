/**
* Created by alex on 2017/3/13.
*/
<template>
  <li :class="[prefixCls + '-item-group']">
    <div :class="[prefixCls + '-item-group-title']">{{ title }}</div>
    <ul><slot></slot></ul>
  </li>
</template>

<script type="text/babel">
  const prefixName = 's-menu';
  export default {
    name: 'sMenuGroup',
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        prefixCls: prefixName
      };
    }
  };
</script>

