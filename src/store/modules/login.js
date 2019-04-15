import Vue from 'vue'

const state = {
  imgCode: {
    imgUrl: ''
  },
  tokenValidate: false,
  isValidate: 2
}

const mutations = {
  CAPTCHA (state, data) {
    state.imgCode.imgUrl = `data:image/svg+xml;utf8,${Vue.iBox.decodeBase64(data)}`
  }
}

const actions = {
  async wxLogin ({commit}, params = {}) {
    return new Promise((resolve, reject) => {
      wx.login({
        success: function (res) {
          if (res.code) {
            resolve(res.code)
          } else {
            reject(res)
          }
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  },

  // todo 新增单词小程序的登陆流程
  async getCaptcha ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginUrl.captchas', {
      ...params
    })({method: 'get'}, {errorAction: true})
    commit('CAPTCHA', result.Captcha)
  },

  async sendSmsCode ({commit}, params = {}) {
    return await Vue.iBox.http('loginUrl.sendValidateCode', {
      ...params
    })({}, {errorAction: true})
  },

  // 获取短信验证码 不带图形验证码
  async sendSmsCodeNoType ({commit}, params = {}) {
    let result = await Vue.iBox.http('loginUrl.sendSmsCode', {
      ...params
    })({}, {errorAction: true})
    return result
  },

  // 图形验证码发送短信
  async sendSmsCodeByCaptcha ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginUrl.sendSmsCodeByCaptcha', {
      ...params
    })({method: 'post'}, {errorAction: true})
    return result
  },

  // 根据微信小程序用户加密数据登录用户
  async bindCellWithEncryptedData ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginUrl.bindCellWithEncryptedData', {
      ...params
    })({method: 'post'}, {errorAction: true})

    // accesstoken ,过期时间， 用户ID，用户微信openId，是否绑定手机号，绑定token（用于后续设置用户名和密码时使用），是否需要图形验证码
    if (!result.status) {
      Vue.iBox.setTokenSync(Vue.iBox.TokenKey.Admin, Object.assign({}, Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Admin), result, {'Login': true}))
    }
    return result
  },

  // 检查用户信息完成性（目前仅检查是否绑定了手机号）
  async checkUserInfoIntegrity ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginUrl.checkUserInfoIntegrity', {
      ...params
    })({method: 'get'}, {errorAction: true})

    // 用户ID，是否绑定手机号

    if (!result.status && result.UserID) {
      Vue.iBox.setTokenSync(Vue.iBox.TokenKey.Admin, Object.assign({}, Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Admin), result, {'Login': true}))
    } else {
      Vue.iBox.setTokenSync(Vue.iBox.TokenKey.Admin, Object.assign({}, Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Admin), result, {'Login': false}))
    }

    return result
  },

  // 根据微信小程序code登录用户
  async loginByWxCode ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginUrl.loginByWxCode', {
      ...params
    })({method: 'post'}, {errorAction: true})

    // accesstoken ,过期时间， 用户ID，用户微信openId，是否绑定手机号

    if (result.AccessToken === '') {
      Vue.iBox.setTokenSync(Vue.iBox.TokenKey.Admin, Object.assign({}, Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Admin), result, {'Login': false}))
    } else if (result.AccessToken !== '') {
      Vue.iBox.setTokenSync(Vue.iBox.TokenKey.Admin, Object.assign({}, Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Admin), result, {'Login': true}))
    }

    return result
  },

  // 重新绑定用户
  async rebindUserWxInfo ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginUrl.rebindUserWxInfo', {
      ...params
    })({method: 'post'}, {errorAction: true})

    // accesstoken ,过期时间， 用户ID，用户微信openId，是否绑定手机号

    if (!result.status) {
      Vue.iBox.setTokenSync(Vue.iBox.TokenKey.Admin, Object.assign({}, Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Admin), result, {'Login': true}))
    }

    return result
  },

  // 根据微信小程序用户加密数据登录用户

  async loginByWxEncryptedData ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginUrl.loginByWxEncryptedData', {...params})({method: 'post'}, {errorAction: true})

    // accesstoken ,过期时间， 用户ID，用户微信openId，是否绑定手机号

    if (result.AccessToken === '') {
      // 成功登陆的情况
      Vue.iBox.setTokenSync(Vue.iBox.TokenKey.Admin, Object.assign({}, Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Admin), result, {'Login': false}))
    } else {
      Vue.iBox.setTokenSync(Vue.iBox.TokenKey.Admin, Object.assign({}, Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Admin), result, {'Login': true}))
    }

    return result
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
