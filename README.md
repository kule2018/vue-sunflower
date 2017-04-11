# vue-sunflower
##### 此教程环境版本
|软件名|版本|
|:---:|:---:|
|nodejs| 6.10.2|
|vue|2.2.6|
|webpack|2.3.3|

> 当然，你可以使用 `yarn` 来管理依赖包。

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
  * 安装 [`babel-loader`](https://webpack.js.org/loaders/babel-loader/) 和 `webpack`，此 loader 的作用是将 `ES6` 转为 `ES5`。
  ```npm
    npm install --save-dev babel-loader babel-core babel-preset-env webpack
  ```
  * 安装 [`vue-jsx`](https://npm.taobao.org/package/babel-plugin-transform-vue-jsx)，这些 npm 包提供对 `.vue` 文件中 `jsx` 语法的转换
  ```npm
    npm install --save-dev babel-plugin-syntax-jsx babel-plugin-transform-vue-jsx babel-helper-vue-jsx-merge-props
  ```
  * 安装 [`vue-loader`](http://vue-loader.vuejs.org/en/)，此 `loader` 能够将 `.vue` 文件转换为简单的 `js` 模块。