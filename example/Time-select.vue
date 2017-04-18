<template>
  <article class="article">
    <h1>TimeSelect</h1>

    <h3>固定时间点</h3>
    <div class="example">
      <div class="example-demo">
        <s-time-select
          v-model="value1"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30'
          }"
          placeholder="选择时间"></s-time-select>
      </div>
      <div class="example-code" v-hljs>
        <pre><code>
    &lt;s-time-select
      v-model="value1"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30'
        }"
      placeholder="选择时间">&lt;/s-time-select>
    &lt;script>
      export default {
        data() {
          return {
            value1: ""
          }
        }
      }
    &lt;/script>
        </code></pre>
      </div>
    </div>
  </article>
</template>
<script>
  export default {
    data() {
      return {
        value1: ""
      }
    }
  }
</script>
<style lang="scss">

</style>