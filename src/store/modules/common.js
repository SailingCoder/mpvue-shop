import Vue from 'vue'

const state = {
}

const mutations = {
}

const actions = {
  async uploadToken ({commit}, params = {}) {
    const result = await Vue.iBox.http('commonUrl.uploadToken', {
      testType: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Scene).TestType,
      ...params
    })({method: 'get'})

    return result
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
