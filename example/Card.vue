<template>
  <article class="article">
    <h1>Card 卡片</h1>
    <h3>基础用法</h3>
    <div class="example">
      <div class="example-demo">
        <s-card class="box-card">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <s-button type="primary">操作按钮</s-button>
          </div>
          <div v-for="o in 4" class="text item">{{ "列表内容 " + o }}</div>
        </s-card>
      </div>
      <div class="example-code" v-hljs>
        <pre><code>
    &lt;s-card class="box-card"&gt;
      &lt;div slot="header" class="clearfix"&gt;
        &lt;span>卡片名称&lt;/span&gt;
        &lt;s-button type="primary"&gt;操作按钮&lt;/s-button&gt;
      &lt;/div>
      &lt;div v-for="o in 4" class="text item"&gt;{{ "列表内容 " + '+ o' }}&lt;/div&gt;
    &lt;/s-card&gt;
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
    .box-card {
      width: 480px;
      .clearfix {
        clear: both;
        >span {
          line-height: 34px;
        }
      }
      .s-button {
        float: right;
      }
      .text {
        font-size: 14px;
      }
      .item {
        padding: 18px 0;
      }
    }
  }
</style>