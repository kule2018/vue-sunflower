<template>
  <article class="article">
    <h1>Scrollbar</h1>

    <h3>基础用法</h3>
    <div class="example">
      <div class="example-demo">
        <s-scrollbar wrap-class="scrollheight">
          <div v-for="o in year">{{ o }}</div>
        </s-scrollbar>
      </div>
      <div class="example-code" v-hljs>
        <pre><code>
    &lt;s-scrollbar wrap-class="scrollheight"&gt;
      &lt;div v-for="o in year"&gt;{{ "o" }}&lt;/div&gt;
    &lt;/s-scrollbar&gt;
    &lt;script&gt;
    let year = [];
    for (let i=2000; i<2017; i++) {
      year.push(i);
    }
    export default {
      data() {
        return {
          year
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
  let year = [];
  for (let i=2000; i<2017; i++) {
    year.push(i);
  }
  export default {
    data() {
      return {
        year
      }
    }
  }
</script>
<style lang="scss">
  .scrollheight {
    max-height: 200px;
    div {
      text-align: center;
      line-height: 2;
    }
    > div {
      > div {
        &:hover {
          background: rgba(32, 160, 255, 0.4);
        }
      }
    }
  }
</style>