// 阿拉丁统计引入
import '../static/sdk/ald-stat'

import Vue from 'vue'
import App from '@/App'
import store from '@/store'
import MpvueRouterPatch from 'mpvue-router-patch'
import IboxPlugin from '@/plugins/ibox'
import mixins from '@/mixins'
import '@/styles/iconfont.wxss'

Vue.use(MpvueRouterPatch)
Vue.use(IboxPlugin)
Vue.use(mixins)

Vue.config.productionTip = false
App.myType = 'app'
const app = new Vue({
  store,
  ...App
})

app.$mount()
