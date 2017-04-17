<template>
  <article class="article">
    <h1>Carousel 轮播</h1>
    <h3>基础用法</h3>
    <div class="example">
      <div class="example-demo">
        <div class="halfblock">
          <span>默认指示器 hover 时触发</span>
          <s-carousel>
            <s-carousel-item v-for="item in 4" :key="item">
              <h3>{{ item }}</h3>
            </s-carousel-item>
          </s-carousel>
        </div>
        <div class="halfblock">
          <span>指示器 Click 时触发</span>
          <s-carousel trigger="click">
            <s-carousel-item v-for="item in 4" :key="item">
              <h3>{{ item }}</h3>
            </s-carousel-item>
          </s-carousel>
        </div>
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