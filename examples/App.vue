<template>
  <div id="componentsPage">
    <sf-header></sf-header>
    <div class="mainWrapper">
      <s-row type="flex" justify="center">
        <s-col span="4">
          <div class="menu">
            <sf-menu :menu= menulist></sf-menu>
          </div>
        </s-col>
        <s-col span="20">
          <router-view></router-view>
        </s-col>
      </s-row>
      </div>
      <sf-footer></sf-footer>
  </div>
</template>
<script>
import header from "./page/head"
import menu from "./page/leftmenu"
import footer from "./page/footer"
import list from "./list.json"

export default {
  data () {
    return {
      menulist: list.components
    }
  },
  components: {
    'sf-header': header,
    'sf-menu': menu,
    'sf-footer': footer
  }
};
</script>

<style>
  #componentsPage {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .mainWrapper {
    width: 1140px;
    padding: 0 30px;
    margin: 0 auto;
  }
  .menu {
    padding-top: 55px;
  }

  .menu a {
    color: #5e6b82;
    display: block;
    margin-left : 20px;
  }

  .menu a.router-link-active {
    color: #20a0ff;
  }
</style>
