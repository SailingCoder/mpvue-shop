## 目录结构

### 后期将会持续更新

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

## 规则

1. 变量定义使用大驼峰
2. 自定义方法使用小驼峰
3. 文件夹和文件命名使用小驼峰，如果是组件（文件）使用大驼峰
4. 按钮都要加防抖


## BEM命名规范

### 使用BEM命名规范来组织CSS代码
  1. BEM 是 Block（块） Element（元素） Modifier（修饰器）的简称

### 如何使用BEM
  1. 一个独立的（语义上或视觉上），可以复用而不依赖其它组件的部分，可作为一个块（Block）
  2. 属于块的某部分，可作为一个元素（Element）
  3. 用于修饰块或元素，体现出外形行为状态等特征的，可作为一个修饰器（Modifier）
  4. 在本规范中，以双下划线 __ 来作为块和元素的间隔，以单下划线 _ 来作为块和修饰器 或 元素和修饰器 的间隔，以中划线 - 来作为 块|元素|修饰器 名称中多个单词的间隔
  5. 保证各个部分只有一级 B__E_M  ，修饰器需要和对应的块或元素一起使用，避免单独使用

  ``` html
  <!-- 某个块 -->
  <form class="search-form">
      <!-- 某个元素 -->
      <div class="search-form__content-left">
          <!-- 错误：不能出现多个元素 -->
          <h2 class="search-form__content-left__h2">标题</h2>
          <!-- 某个元素，虽然是子集，保证了只有一级元素 -->
          <input class="search-form__input">
          <!-- 某个元素，加上了hover修饰器 -->
          <button class="search-form__button search-form__button_hover">搜索</button>
          <button class="search-form__button-set search-form__button-set_hover">搜索1</button>
          <!-- 错误：不能单独使用lg修饰器 -->
          <button class="search-form__button_lg">搜索</button>

          <!-- 块中可嵌套着另一个块 -->
          <p class="my-img">
              <img class="my-img__logo" src="abc.png" alt="image" title="image">
          </p>

      </div>
  </form>
  ```

ui库： https://kuangpf.com/mpvue-weui/#/navbar
