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
  ``
