<template>
  <article class="article">
    <h1>Dropdown</h1>

    <h3>基础用法</h3>
    <div class="example">
      <div class="example-demo">
        <s-dropdown>
          <span class="s-dropdown-link">
            下拉菜单
            <i class="s-icon-caret-bottom s-icon-right"></i>
          </span>
          <s-dropdown-menu slot="dropdown">
            <s-dropdown-item>黄金糕</s-dropdown-item>
            <s-dropdown-item>狮子头</s-dropdown-item>
            <s-dropdown-item>螺蛳粉</s-dropdown-item>
            <s-dropdown-item disabled>双皮奶</s-dropdown-item>
            <s-dropdown-item divided>虾仔煎</s-dropdown-item>
          </s-dropdown-menu>
        </s-dropdown>
      </div>
      <div class="example-code" v-hljs>
        <pre><code>

        </code></pre>
      </div>
    </div>
  </article>
</template>
<script>
  export default {
  }
</script>
<style lang="scss">

</style>