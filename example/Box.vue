<template>
  <article class="article">
    <h1>Box 盒子</h1>
    <h3>基础用法</h3>
    <div class="example">
      <div class="example-demo">
        <s-box :title="'我是头部'">
          <p>内容</p>
        </s-box>
      </div>
      <div class="example-code" v-hljs>
        <pre><code>
    &lt;s-box :title="'我是头部'"&gt;
      &lt;p&gt;内容&lt;/p&gt;
    &lt;/s-box&gt;
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