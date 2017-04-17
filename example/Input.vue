<template>
  <article class="article">
    <h1>Input 输入框</h1>
    <h3>基础用法</h3>
    <div class="example">
      <div class="example-demo">
        <s-input v-model="input" placeholder="请输入内容"></s-input>
      </div>
      <div class="example-code" v-hljs>
        <pre><code>
    &lt;s-input v-model="input" placeholder="请输入内容"&gt;&lt;/s-input&gt;
    &lt;script&gt;
    export default {
      data() {
        return {
          input: ""
        }
      }
    }
    &lt;/script&gt;
        </code></pre>
      </div>
    </div>
  </article>
</template>
<script>
  export default {
    data() {
      return {
        input: ""
      }
    }
  }
</script>
<style lang="scss">

</style>