# vue-sunflower
>在此教程中，我们将学习“使用webpack+vue实现组件库及示例页”。因为我在学习webpack的过程中，发现很多资料都是1.x版本的，对于我们新手来说是无法识别是哪个版本的，在2.x的环境中很容易掉坑里，加之vue-cli里的配置比较成熟，刚开始很难理解，所以我写了此教程，希望给大家展示一个清晰的思路，让大家少走弯路。
##### 此教程环境版本
|软件名|版本|
|:---:|:---:|
|nodejs| 6.10.2|
|vue|2.2.6|
|webpack|2.3.3|

> 当然，你可以使用 `yarn` 来管理依赖包。其他依赖包的版本可查看 `package.json`。此教程中的一些链接需要翻墙打开，不会翻墙不要怪我呦。

## 项目步骤
1. 创建项目目录
```npm
  mkdir vue-sunflower && cd vue-sunflower
```
2. 生成 `package.json` 文件
```npm
  npm init -y
```
3. 安装依赖
  * 安装 `vue` 和 `vue-router`
  ```npm
    npm install --save vue vue-router
  ```
  * 安装 `webpack` `dev-server`
  ```npm
    npm install --save-dev webpack webpack-dev-server
  ```
  * 安装 [`babel-loader`](https://webpack.js.org/loaders/babel-loader/) ，此 loader 的作用是将 `ES6` 转为 `ES5`。
  ```npm
    npm install --save-dev babel-loader babel-core babel-preset-env
  ```
  * 安装 [`vue-jsx`](https://npm.taobao.org/package/babel-plugin-transform-vue-jsx)，这些 npm 包提供对 `.vue` 文件中 `jsx` 语法的转换
  ```npm
    npm install --save-dev babel-plugin-syntax-jsx babel-plugin-transform-vue-jsx babel-helper-vue-jsx-merge-props
  ```
  * 安装 [`vue-loader`](http://vue-loader.vuejs.org/en/)及其同伴依赖 `vue-template-compiler` `css-loader`，此 `loader` 能够将 `.vue` 文件转换为简单的 `js` 模块。
  ```npm
    npm install --save-dev vue-loader vue-template-compiler css-loader
  ```
4. 新建目录及文件（手动创建，后面填入代码）
```
  vue-sunflower
  ├── build                     // webpack打包配置文件
  │   ├── webpack.demo.cfg.js   // 示例打包配置
  │   └── webpack.src.cfg.js    // 组件源码打包配置
  ├── example                   // 项目示例页
  │   ├── App.vue               // 示例页目录树及路由页
  │   ├── breadcrumb.vue        // 面包屑组件示例页
  │   └── main.js               // 示例页入口
  ├── node_modules              // npm包
  ├── src                       // 组件源码
  │   └── index.js              // 组件源码入口
  └── package.json              // node配置文件
```
5. 组件源码编写，可查看 `src/breadcrumb` 目录。
6. 源码入口修改
```javascript
  /**
   * ./src/index.js
   */
  import {Breadcrumb, BreadcrumbItem} from "./breadcrumb";
  
  const components = [
      Breadcrumb,
      BreadcrumbItem
  ];
  
  const install = function(Vue, opts = {}) {
    components.map(component => {
      Vue.component(component.name, component);
    });
  };
  
  if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
  }
  
  export default {
    install,
    Breadcrumb,
    BreadcrumbItem
  }
```
> 参考：[vuejs 插件](http://cn.vuejs.org/v2/guide/plugins.html)
7. 源码打包配置文件
```javascript
  /**
   * build/webpack.src.cfg.js
   */
  const path = require("path");
  
  module.exports = {
    entry: {
      sunflower: path.resolve(__dirname, "../src/index.js")
    },
    output: {
      path: path.resolve(__dirname, "../dist/sunflower"),
      filename: "[name].js"
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader"
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".js", ".json", ".vue"]
    }
  };
```
8. 增加打包脚本
```
  /**
   * package.json
   */
  "scripts": {
      "build:src": "webpack --config ./build/webpack.src.cfg.js --progress --profile"
    },
```
9. 打包组件源码
```npm
  npm run build:src
```
执行此命令后即可生成打包文件 `dist/sunflower/sunflower.js`

10. 示例页代码编写
```javascript
  /**
    * example/main.js
    */
  import Vue from "vue";
  import VueRouter from "vue-router";
  import Sunflower from "../dist/sunflower/sunflower"
  import App from "./App";
  
  Vue.use(VueRouter);
  Vue.use(Sunflower);
  
  const router = new VueRouter({
    routes: [
      {
        path: "/breadcrumb",
        component: require("./breadcrumb")
      }
    ]
  });
  
  new Vue({
    el: "#app",
    router,
    render: h => h(App)
  });
```
```vue
  /**
    * example/App.vue
    */
  <template>
    <div class="container">
      <nav>
        <ul class="menu-left">
          <router-link to="/breadcrumb" tag="li">Breadcrumb</router-link>
        </ul>
      </nav>
      <main class="main">
        <router-view></router-view>
      </main>
    </div>
  </template>
  <script>
    export default {
  
    }
  </script>
```
```vue
  /**
    * example/breadcrumb.vue
    */
  <template>
    <article class="article">
      <h1>Breadcrumb 面包屑</h1>
      <h3>基础用法</h3>
      <div class="example">
        <div class="example-demo">
          <s-breadcrumb separator="/">
            <s-breadcrumb-item :to="{ path: '/' }">首页</s-breadcrumb-item>
            <s-breadcrumb-item :to="{ path: '/'}">组件</s-breadcrumb-item>
            <s-breadcrumb-item :to="{ path: '/breadcrumb'}">面包屑</s-breadcrumb-item>
          </s-breadcrumb>
        </div>
        <div class="example-code">
          <pre><code>
      &lt;s-breadcrumb separator="/"&gt;
        &lt;s-breadcrumb-item :to="{ path: '/' }"&gt;首页&lt;/s-breadcrumb-item&gt;
        &lt;s-breadcrumb-item :to="{ path: '/'}"&gt;组件&lt;/s-breadcrumb-item&gt;
        &lt;s-breadcrumb-item :to="{ path: '/breadcrumb'}"&gt;面包屑&lt;/s-breadcrumb-item&gt;
      &lt;/s-breadcrumb&gt;
          </code></pre>
        </div>
      </div>
    </article>
  </template>
  <script>
    export default {
    }
  </script>
```
11. 示例代码打包配置文件
```javascript
  /**
   * build/webpack.demo.cfg.js
   */
  const path = require("path");
  
  module.exports = {
    entry: {
      demo: path.resolve(__dirname, "../example/main.js")
    },
    output: {
      path: path.resolve(__dirname, "../dist/demo"),
      filename: "[name].js"
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader"
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".js", ".json", ".vue"]
    }
  };
```
12. 增加打包脚本
```
  /**
   * package.json
   */
  "scripts": {
      "build:demo": "webpack --config ./build/webpack.demo.cfg.js --progress --profile"
    },
```
13. 打包示例页代码
```npm
  npm run build:demo
```
执行此命令后即可生成打包文件 `dist/demo/demo.js`
14. 查看示例页
```html
  /**
    * 根目录下新建 index.html
    */
  <body>
  <div id="app"></div>
  <script src="./dist/demo/demo.js"></script>
  </body>
```
浏览器打开 index.html 即可看到组件示例页。

## 小结
* 配置文件中的 `resolve.extensions`

  > 默认为 extensions: [".js", ".json"]，配置此参数，可以在导入模块时，省略文件类型（文件后缀）,在此项目中，我们在 `extensions` 中添加了 `.vue`，那么，我们在导入 `.vue` 模块时，只需要写文件名即可。
  
* 配置文件中的 `path.resolve`

  >`path.resolve()` 方法将路径解析为绝对路径，`__dirname` 获取当前文件（模块）所在目录的完整绝对路径。
  
* 示例页引用 `src` 和打包后代码 的区别。--output.library && libraryTarget
  > 在上面的代码中，`example/main.js` 第三行，我们 `import` 的是组件的源代码，若此处改为 `import Sunflower from "../dist/sunflower/sunflower"`,也就是说导入模块改为 `src` 打包后的 js 文件，执行 `npm run build:demo` 并访问 `index.html`，点击 `Breadcrumb` 打开面包屑组件示例页，会发现控制台报错：
   ```
   Unknown custom element: <s-breadcrumb> ...
   Unknown custom element: <s-breadcrumb-item> ...
   ```
  > 解决办法：在 src 的打包配置文件的 `output` 中增加如下代码：
   ```
  output: {
    ...
    library: "Sunflower",
    libraryTarget: "umd"
  }
   ```
  > 删除 dist目录下的demo 和 sunflower，执行 `npm run build:src` `npm run build:demo`，打开 `index.html` 即可看到组件使用成功。
   
* 如果我们每次修改代码后都要去手动重新打包，是非常不合理的，所以我们需要一个服务和热重载。这里我们先介绍 `webpack-dev-server` 的用法。
  > 在 3 中，我们已经安装了该 `npm` 包，接下来我们写 `DevServer` 的配置。
  ```
  /**
    * 修改 build/webpack.demo.cfg.js
    */
    module.exports = {
      entry: { ... },
      output: {
        ...
       publicPath: "/"
      },
      module: { ... },
      resolve: { ... },
      devServer: {
        contentBase: path.join(__dirname, "../dist"),
        port: 9000
      }
    }
  ```
  ```html
  /**
    * 在 dist 目录下新建 index.html
    */
    <body>
    <div id="app"></div>
    <script src="/demo.js"></script>
    </body>
  ```
  ```
  /**
    * package.json 中增加脚本
    */
    "script": {
      "build:hot": "webpack-dev-server --config ./build/webpack.demo.cfg.js --open --hot"
    }
  ```
  > 现在执行 `npm run build:hot`，会发现浏览器自动打开了示例页。此时，我们修改示例页的代码（有的IDE需要按 `Ctrl + s`），会发现浏览器自动刷新了（控制台也可以看到自动打包的日志）。如果需要修改组件源代码，那么需要在 `example/main.js` 的第三行，将 `sunflower` 的导入路径修改为 "../src/"，你可以尝试修改组件源码，浏览器会自动刷新。
  >> 在这里我们需要清楚以下知识点：
  >> 1. `webpack-dev-server` 生成的包并没有放在你的真实目录中，而是放在了内存中；
  >> 1. `webpack.demo.cfg.js` 中 `devServer.contentBase` 为 `index.html` 的目录路径，也就是说告诉 `devServer` 打包完成后，服务器打开的页面路径；
  >> 1. `webpack.demo.cfg.js` 中 `output.publicPath` 为打包后js的虚拟路径，也就是 `index.html` 中 `script` 的 `src`。例如，修改 `publicPath` 值为 "/a/b"，那么 `src` 需要修改为 `a/b/demo.js`。
  
  > 接下来，我们就可以进行组件的开发，以及示例页的编写。在 `src` 中添加组件源码，在 `example` 中添加组件示例页代码，浏览器会自动刷新。

* ES6 与 ES5。
  > 上面打包的代码里并未进行es6到es5的转换，因此在某些不支持es6的浏览器（例如IE9）中运行会报错，解决办法：在项目根目录下新建 `.babelrc`
  ```JSON
  {
    "presets": ["env"]
  }
  ```
  
## 各种 `css` 语法转换
在 `.vue` 文件中的 `style` 中，需要用 lang 声名 css 语法类型，例如：
```
<style lang="scss">
...
</style>
```
* less
  > 需要安装 `less` 和 `less-loader`，`npm install --save-dev less less-loader`
 
  > `webpack` 配置文件中，`vue-loader` 的 `options.loaders` 添加 `"less": "vue-style-loader!css-loader!less-loader"`，此条配置也可省略。
  
* sass
  > 需要安装 `node-sass` 和 `sass-loader`，`npm install --save-dev node-sass sass-loader`
    
  > `webpack` 配置文件中，`vue-loader` 的 `options.loaders` 添加 `"sass": "vue-style-loader!css-loader!sass-loader?indentedSyntax"`
     
* scss
  > 也是用 `sass-loader`，不需要加 `indentedSyntax`。
  
* stylus
  > 需要安装 `stylus` 和 `stylus-loader`，`npm install --save-dev stylus stylus-loader`
        
  > `webpack` 配置文件中，`vue-loader` 的 `options.loaders` 添加 `"stylus": "vue-style-loader!css-loader!stylus-loader"`，此条配置也可省略。

## 高亮示例页代码（使用自定义指令）
1. 安装highlightjs
    ```npm
    npm install --save highlightjs
    ```

# TODO
- [x] webpack + vue 实现组件库 初级教程
- [x] 示例页样式
- [x] es6转es5
- [ ] highlight自定义指令的实现
- [ ] 代码压缩
- [ ] js代码分离
- [ ] css代码提取到单独的文件
- [ ] 各种css语法转换
- [ ] vue-jsx语法的打包

##### webpack 部分
- [x] webpack-dev-server
- [ ] CommonsChunkPlugin
- [ ] ExtractTextWebpackPlugin
- [ ] HtmlWebpackPlugin
- [ ] UglifyjsWebpackPlugin
