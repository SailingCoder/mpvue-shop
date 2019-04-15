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

  async getCaptcha ({commit}, params = {}) {
    const result = await Vue.iBox.http('loginUrl.loginWXUser', {
      ...params
    })({method: 'get'}, {errorAction: true})
    commit('CAPTCHA', result.Captcha)
  },

  async sendSmsCode ({commit}, params = {}) {
    return await Vue.iBox.http('loginUrl.checkTokenStatus', {
      ...params
    })({}, {errorAction: true})
  },

  async sendSmsCodeNoType ({commit}, params = {}) {
    let result = await Vue.iBox.http('loginUrl.getUserInfo', {
      ...params
    })({}, {errorAction: true})
    return result
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
