<template>
  <article class="article">
    <h1>Checkbox</h1>

    <h3>基础用法</h3>
    <div class="example">
      <div class="example-demo">
        <s-checkbox v-model="checked">备选项</s-checkbox>
      </div>
      <div class="example-code" v-hljs>
        <pre><code>
    &lt;s-checkbox v-model="checked"&gt;备选项&lt;/s-checkbox&gt;
    &lt;script&gt;
    export default {
      data() {
        return {
          checked: true
        }
      }
    }
    &lt;/script&gt;
        </code></pre>
      </div>
    </div>

    <h3>多选框组</h3>
    <div class="example">
      <div class="example-demo">
        <s-checkbox-group v-model="checkList">
          <s-checkbox label="复选框 A"></s-checkbox>
          <s-checkbox label="复选框 B"></s-checkbox>
          <s-checkbox label="复选框 C"></s-checkbox>
          <s-checkbox label="禁用" disabled></s-checkbox>
          <s-checkbox label="选中且禁用" disabled></s-checkbox>
        </s-checkbox-group>
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
        checked: true,
        checkList: ["选中且禁用", "复选框 A"]
      }
    }
  }
</script>
<style lang="scss">

</style>