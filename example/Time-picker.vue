<template>
  <article class="article">
    <h1>TimePicker</h1>

    <h3>日期和时间点</h3>
    <div class="example">
      <div class="example-demo">
        <div class="halfblock">
          <span>默认</span>
          <s-date-picker
            v-model="value1"
            type="datetime"
            placeholder="选择日期时间"></s-date-picker>
        </div>
        <div class="halfblock">
          <span>带快捷选项</span>
          <s-date-picker
            v-model="value2"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions1"></s-date-picker>
        </div>
      </div>
      <div class="example-code" v-hljs>
        <pre><code>
    &lt;div class="halfblock">
      &lt;span>默认&lt;/span>
      &lt;s-date-picker
              v-model="value1"
              type="datetime"
              placeholder="选择日期时间">&lt;/s-date-picker>
    &lt;/div>
    &lt;div class="halfblock">
      &lt;span>带快捷选项&lt;/span>
      &lt;s-date-picker
              v-model="value2"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions1">&lt;/s-date-picker>
    &lt;/div>
    &lt;script>
      export default {
        data() {
          return {
            pickerOptions1: {
              shortcuts: [{
                text: "今天",
                onClick(picker) {
                  picker.$emit("pick", new Date());
                }
              }, {
                text: "昨天",
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600*1000*24);
                  picker.$emit("pick", date);
                }
              }, {
                text: "一周前",
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600*1000*24*7);
                  picker.$emit("pick", date);
                }
              }]
            },
            value1: "",
            value2: ""
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
        pickerOptions1: {
          shortcuts: [{
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          }, {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600*1000*24);
              picker.$emit("pick", date);
            }
          }, {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600*1000*24*7);
              picker.$emit("pick", date);
            }
          }]
        },
        value1: "",
        value2: ""
      }
    }
  }
</script>
<style lang="scss">

</style>