<template>
  <article class="article">
    <h1>Alert 警告</h1>
    <h3>基础用法</h3>
    <div class="example">
      <div class="example-demo">
        <s-alert title="成功提示" type="success"></s-alert>
        <s-alert title="消息提示" type="info"></s-alert>
        <s-alert title="警告提示" type="warning"></s-alert>
        <s-alert title="错误提示" type="error"></s-alert>
      </div>
      <div class="example-code" v-hljs>
        <pre><code>
    &lt;s-alert title="成功提示" type="success"&gt;&lt;/s-alert&gt;
    &lt;s-alert title="消息提示" type="info"&gt;&lt;/s-alert&gt;
    &lt;s-alert title="警告提示" type="warning"&gt;&lt;/s-alert&gt;
    &lt;s-alert title="错误提示" type="error"&gt;&lt;/s-alert&gt;
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
  .example {
    .s-alert {
      margin: 20px 0 0;
      &:first-child {
        margin: 0;
      }
    }
  }
</style>