<template>
  <article class="article">
    <h1>Dialog</h1>

    <h3>基础用法</h3>
    <div class="example">
      <div class="example-demo">
        <s-button type="text" @click="dialogVisible = true">点击打开 Dialog</s-button>
        <s-dialog title="提示" v-model="dialogVisible" size="tiny">
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
            <s-button @click="dialogVisible = false">取消</s-button>
            <s-button type="primary" @click="dialogVisible = fasle">确定</s-button>
          </span>
        </s-dialog>
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
        dialogVisible: false
      }
    }
  }
</script>