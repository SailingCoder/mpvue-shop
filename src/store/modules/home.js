import Vue from 'vue'

const state = {
  userStatus: {}
}

const mutations = {
  USERSTATUS (state, data) {
    state.userStatus = data
  }
}

const actions = {
  async getUserStatus ({commit}, params = {}) {
    const result = await Vue.iBox.http('homeUrl.getUserStatus', {
      testType: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Scene).TestType,
      ...params
    })({method: 'get'})
    commit('USERSTATUS', result.data)

    Vue.iBox.setTokenSync(Vue.iBox.TokenKey.Assessments, { UserEvaluationID: result.data.userEvaluation.userEvaluationID })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
