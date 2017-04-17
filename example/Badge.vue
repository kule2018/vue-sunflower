<template>
  <article class="article">
    <h1>Badge 标记</h1>
    <h3>基础用法</h3>
    <div class="example">
      <div class="example-demo">
        <s-badge :value="12" class="item">
          <s-button size="small">评论</s-button>
        </s-badge>
        <s-badge :value="3" class="item">
          <s-button size="small">回复</s-button>
        </s-badge>
      </div>
      <div class="example-code" v-hljs>
        <pre><code>
      &lt;s-badge :value="12" class="item"&gt;
        &lt;s-button size="small"&gt;评论&lt;/s-button&gt;
      &lt;/s-badge&gt;
      &lt;s-badge :value="3" class="item"&gt;
        &lt;s-button size="small"&gt;回复&lt;/s-button&gt;
      &lt;/s-badge&gt;
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
  .example-demo {
    .item {
      margin-right: 40px;
    }
  }
</style>