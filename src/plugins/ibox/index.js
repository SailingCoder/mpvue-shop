// iBoxPlugin
import handleRequest from '@/plugins/flyio/request'
import { navigateTo, redirectTo, reLaunch, getTokenSync, setTokenSync, getSystemInfoSync } from '@/utils/wxApi'
import utils from '@/utils/index'
import { TokenKey, getWXFissionSceneID, ShareNeedShare } from '@/defines/user'
import { IsMocking } from '@/defines/request'

export default {
  /**
   * 自定义方法
   * 组件内使用： this.$iBox.validator
   * 全局使用：Vue.iBox.validator
   */
  install (Vue) {
    const iBox = {
      ...utils,
      http: handleRequest,
      navigateTo,
      redirectTo,
      ShareNeedShare,
      reLaunch,
      getTokenSync,
      setTokenSync,
      getSystemInfoSync,
      TokenKey,
      IsMocking,
      getWXFissionSceneID
    }

    Vue.iBox = iBox
    Vue.prototype.$iBox = iBox
  }
}
