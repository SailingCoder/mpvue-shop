import Vue from 'vue'

const state = {
  subPackage1Items: [],
  subPackage1Total: 0,
  subPackage1Info: {
    currItemIndex: 0
  }
}

const mutations = {
  ASSESSMENTSITEMS (state, data) {
    state.subPackage1Items = data
    state.subPackage1Total = data.length
  }
}

const getters = {
  currAssessmentsItem (state) {
    const currItem = state.subPackage1Items[1]
    return currItem
  },

  isLastItem (state) {
    return state.subPackage1Info.currItemIndex === state.subPackage1Total - 1
  }
}

const actions = {

  async findUserNameItems ({commit}, params = {}) {
    const result = await Vue.iBox.http('subPackage1Url.findUserNameItems', {
      userEvaluationID: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Assessments).UserEvaluationID,
      ...params
    })({method: 'get'})

    commit('ASSESSMENTSITEMS', result.data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
