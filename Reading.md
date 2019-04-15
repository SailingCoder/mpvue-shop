## 目录结构

```
|____build              webpack打包的环境代码
|____config             webpack打包的配置文件
|____node_modules       项目运行依赖的npm包
|____src                项目代码文件夹
 |__components          自定义组件
 |__assessments         测评部分
 |__scoreCamp           提分营部分
 |__terminationCamp     结营课部分
 |__pages               主页面
 |__plugins             vue插件
  |__ibox
   |__index.js          vue插件的注册，包含接口请求及工具utils
  |__flyio
   |__apiUrl            接口请求地址管理
   |__config            接口请求配置管理
   |__interceptors.js   接口请求拦截器
   |__request           接口请求封装（包括loading及toast，接口的定制化配置及默认配置)
  |__modules            store的管理文件
  |__index.js           实现store对modules文件下的自动注册
 |__store               vuex状态管理
 |__app.json            小程序app.json配置
 |__App.vue             小程序的App页面【整合了小程序页面快速布局的一些样式类】
 |__main.js             类似vue的main.js，可以插件进行配置
 |__router              小程序的page.json的配置 集中式页面配置
 |__assets              静态资源文件夹
 |__defines             utils/global.js文件中常量定义会由defines内文件替换
  |__ald                阿拉丁统计接入
  |__ec-canvas          echarts后续可能会替换现有echarts接入方式，待定
  |__global.js          全局定义，后续会被替换
  |__index.js
|____.babelrc           es6语法转换配置文件
|____.editorconfig      编辑器配置
|____.eslintignore      eslint的忽略配置
|____.eslintrc.js       eslint配置
|____.gitignore         git push忽略配置
|____.postcssrc.js      postcss插件的配置文件
|____index.html         SPA的index页面
|____package.json       npm包配置文件
|____README.md          readme文档

``
ui库： https://kuangpf.com/mpvue-weui/#/navbar
