<template>
  <s-menu :theme="theme3" active-key="1">
    <template v-for="(route,index) in menu">
      <s-menu-group :title="route.groupName" >
          <template v-for="(val,key) in route.list">
            <s-menu-item key="{{key}}">
              <router-link v-bind:to="val.path">
              <span style="width: 100%" @click="scrollTop">
                {{val.title}}
              </span>
              </router-link>
            </s-menu-item>
          </template>
      </s-menu-group>
    </template>
  </s-menu>
</template>
<script type="text/babel">
  export default {
    data () {
      return {
        theme3: 'light'
      };
    },
    props:{
      menu:{
        type:Array
      }
    },
    methods:{
      scrollTop () {
        window.scrollTo(0,0)
      }
    }
  }
</script>


<style>
  a{
    padding: 0!important;
  }
</style>
