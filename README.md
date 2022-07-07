# web 页面自适应调整 html font-size 或 meta[viewport] scale

* [demo](https://github.com/lin09/demo/tree/master/mobile-front-end-adaptive)
* 配合[postcss-pxtorem](https://github.com/cuth/postcss-pxtorem)使用

## 安装
```
npm i @lin09/adaptivejs
// 或
yarn add @lin09/adaptivejs
```

## 使用
```
import adaptive from '@lin09/adaptivejs'
adaptive.run()
```

## 配置后再使用
```
import adaptive from '@lin09/adaptivejs'
adaptive.config({
  rootValue   : 16,    // px 转 rem 的基数，默认16px => 1rem
  designWidth : 750,   // 设计图宽度（单位px），默认750
  maxWidth    : 1024   // 内容最大放大到多少（单位px），默认1024
})
.run()
```
