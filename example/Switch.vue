<template>
    <article class="article">
        <h1>Switch 开关: 表示两种相互对立的状态间的切换，多用于触发「开/关」</h1>
        <h3> 基本用法</h3>
        <div class="example">
            <div class="example-demo">
                <s-switch
                    v-model="value1"
                    on-text=""
                    off-text="">
                </s-switch>
                <s-switch
                     v-model="value2"
                     on-color="#13ce66"
                     off-color="#ff4949">
                </s-switch>
                <s-switch
                     v-model="value3"
                     on-icon-class="s-icon-circle-check"
                     off-icon-class="s-icon-circle-close">
                </s-switch>
                <div class="description">
                    <p>绑定<code>v-model</code>到一个<code>Boolean</code>类型的变量。可以使用<code>on-text</code>属性与<code>off-text</code>属性来设置开关的文字描述，使用<code>on-color</code>属性与<code>off-color</code>属性来设置开关的背景色，使用<code>on-icon-class</code>属性与<code>off-icon-class</code>属性设置开关的图标类名。<br/><b>ps:</b>当设置了图标时文字不再显示
                    </p>
                </div>
            </div>
            <div class="example-code" v-hljs>
                <pre>
                    <code class="hljs language-html">
      <span class="hljs-tag">&lt;<span class="hljs-name">s-switch</span>
        <span class="hljs-attr">v-model</span>=<span class="hljs-string">"value1"</span>
        <span class="hljs-attr">on-text</span>=<span class="hljs-string">""</span>
        <span class="hljs-attr">off-text</span>=<span class="hljs-string">""</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">s-switch</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">s-switch</span>
        <span class="hljs-attr">v-model</span>=<span class="hljs-string">"value2"</span>
        <span class="hljs-attr">on-color</span>=<span class="hljs-string">"#13ce66"</span>
        <span class="hljs-attr">off-color</span>=<span class="hljs-string">"#ff4949"</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">s-switch</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">s-switch</span>
        <span class="hljs-attr">v-model</span>=<span class="hljs-string">"value3"</span>
        <span class="hljs-attr">on-icon-class</span>=<span class="hljs-string">"s-icon-circle-check"</span>
        <span class="hljs-attr">off-icon-class</span>=<span class="hljs-string">"s-icon-circle-close"</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">s-switch</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">
        <span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> {
          data() {
            <span class="hljs-keyword">return</span> {
            <span class="hljs-attr">value1</span>: <span class="hljs-literal">true</span>,
            <span class="hljs-attr">value2</span>: <span class="hljs-literal">true</span>,
            <span class="hljs-attr">value3</span>: <span class="hljs-literal">true</span>
          }
        }
      };
      </span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
                    </code>
                </pre>
            </div>
        </div>
        <div class="example-demo">
            <h3> 禁用状态</h3>
                <s-switch
                   v-model="value4"
                   on-text=""
                   off-text=""
                   disabled>
                </s-switch>
                <s-switch
                   v-model="value4"
                   disabled>
                </s-switch>
            <div class="description">
                <p>设置<code>disabled</code>属性，接受一个<code>Boolean</code>，设置<code>true</code>即可禁用。
                </p>
            </div>
        </div>
        <div class="example-code" v-hljs>
            <pre>
                <code class="hljs language-html">
      <span class="hljs-tag">&lt;<span class="hljs-name">s-switch</span>
        <span class="hljs-attr">v-model</span>=<span class="hljs-string">"value3"</span>
        <span class="hljs-attr">on-text</span>=<span class="hljs-string">""</span>
        <span class="hljs-attr">off-text</span>=<span class="hljs-string">""</span>
        <span class="hljs-attr">disabled</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">s-switch</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">s-switch</span>
        <span class="hljs-attr">v-model</span>=<span class="hljs-string">"value3"</span>
        <span class="hljs-attr">disabled</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">s-switch</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">script</span>&gt;</span><span class="javascript">
        <span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> {
          data() {
            <span class="hljs-keyword">return</span> {
              <span class="hljs-attr">value3</span>: <span class="hljs-literal">true</span>
            }
          }
        };
      </span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
</code></pre>
        </div>
        <div class="example-demo">
            <h3 id="attributes"> Attributes</h3>
            <table class="table">
                <thead>
                <tr>
                    <th>参数</th>
                    <th>说明</th>
                    <th>类型</th>
                    <th>可选值</th>
                    <th>默认值</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>disabled</td>
                    <td>是否禁用</td>
                    <td>boolean</td>
                    <td>—</td>
                    <td>false</td>
                </tr>
                <tr>
                    <td>width</td>
                    <td>switch 的宽度（像素）</td>
                    <td>number</td>
                    <td>—</td>
                    <td>58（有文字）/ 46（无文字）</td>
                </tr>
                <tr>
                    <td>on-icon-class</td>
                    <td>switch 打开时所显示图标的类名，设置此项会忽略 <code>on-text</code></td>
                    <td>string</td>
                    <td>—</td>
                    <td>—</td>
                </tr>
                <tr>
                    <td>off-icon-class</td>
                    <td>switch 关闭时所显示图标的类名，设置此项会忽略 <code>off-text</code></td>
                    <td>string</td>
                    <td>—</td>
                    <td>—</td>
                </tr>
                <tr>
                    <td>on-text</td>
                    <td>switch 打开时的文字</td>
                    <td>string</td>
                    <td>—</td>
                    <td>ON</td>
                </tr>
                <tr>
                    <td>off-text</td>
                    <td>switch 关闭时的文字</td>
                    <td>string</td>
                    <td>—</td>
                    <td>OFF</td>
                </tr>
                <tr>
                    <td>on-color</td>
                    <td>switch 打开时的背景色</td>
                    <td>string</td>
                    <td>—</td>
                    <td>#20A0FF</td>
                </tr>
                <tr>
                    <td>off-color</td>
                    <td>switch 关闭时的背景色</td>
                    <td>string</td>
                    <td>—</td>
                    <td>#C0CCDA</td>
                </tr>
                <tr>
                    <td>name</td>
                    <td>switch 对应的 name 属性</td>
                    <td>string</td>
                    <td>—</td>
                    <td>—</td>
                </tr>
                </tbody>
            </table>
            <h3 id="events"> Events</h3>
            <table class="table">
                <thead>
                <tr>
                    <th>事件名称</th>
                    <th>说明</th>
                    <th>回调参数</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>change</td>
                    <td>switch 状态发生变化时的回调函数</td>
                    <td>新状态的布尔值</td>
                </tr>
                </tbody>
            </table>
        </div>
    </article>
</template>
<script>
    export default {
        data: function () {
            return {
                value1: true,
                value2: true,
                value3: true,
                value4: true
            }
        }
    }
</script>
<style>
    table{
        border-collapse: collapse;
        width: 100%;
        background-color: #fff;
        color: #5e6d82;
        font-size: 14px;
        margin-bottom: 45px;
    }
    table th{
        padding-left: 10px;
        border-bottom: 1px solid #eaeefb;
        padding: 10px;
        max-width: 300px;
        text-align: left;
        border-top: 1px solid #eaeefb;
        background-color: #eff2f7;
        white-space: nowrap;
    }
    .table td{
        padding-left: 10px;
        border-bottom: 1px solid #eaeefb;
        padding: 10px;
        max-width: 250px;
    }

</style>
