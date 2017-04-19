<template>
  <article class="article">
    <h1>InputNumber</h1>

    <h3>基础用法</h3>
    <div class="example">
      <div class="example-demo">
        <s-input-number v-model="num1" @change="handleChange" :min="1" :max="10"></s-input-number>
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
    data() {
      return {
        num1: 1
      }
    },
    methods: {
      handleChange(value) {
        console.log(value);
      }
    }
  }
</script>
<style lang="scss">

</style>