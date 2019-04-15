import Vue from 'vue'

import { AssessmentsQuestionTypes, getAssessmentsCategoryByQuestionTypes } from '@/defines/assessments'

const state = {
  assessmentsItems: [], // 测评数据列表
  assessmentsTotal: 0, // 测评总题数
  consumedTime: 0, // 测评耗时
  timer: null, // 定时器
  assessmentsInfo: {
    assessmentsStatus: 0,
    currItemIndex: 0,
    evaluationID: -1,
    currentPhase: 1
  }
}

const mutations = {
  ASSESSMENTSITEMS (state, data) {
    state.assessmentsItems = data
    state.assessmentsTotal = data.length
  },

  RESETCONSUMEDTIME (state) {
    state.consumedTime = 0
  },

  NEXTITEMINDEX (state) {
    state.assessmentsInfo.currItemIndex++
    if (state.assessmentsInfo.currItemIndex >= state.assessmentsTotal - 1) {
      state.assessmentsInfo.currItemIndex = state.assessmentsTotal - 1
    }
  },

  ASSESSMENTSINFO (state, data) {
    state.assessmentsInfo.assessmentsStatus = data.evaluationStatus
    state.assessmentsInfo.currItemIndex = data.userEvaluation.currentQuestionIndex
    state.assessmentsInfo.evaluationID = data.userEvaluation.evaluationID
    state.assessmentsInfo.currentPhase = data.userEvaluation.currentPhase
  }
}

const getters = {
  nextQuestionPath (state) {
    const currItem = state.assessmentsItems[state.assessmentsInfo.currItemIndex]
    const itemTypeName = getAssessmentsCategoryByQuestionTypes(currItem.itemType)
    return `/assessments/pages/${itemTypeName}?id=${state.assessmentsInfo.currItemIndex}`
  },

  currAssessmentsItem (state) {
    const currItem = state.assessmentsItems[state.assessmentsInfo.currItemIndex]
    return currItem
  },

  isLastItem (state) {
    return state.assessmentsInfo.currItemIndex === state.assessmentsTotal - 1
  }
}

const actions = {
  async createAssessments ({commit}, params = {}) {
    const result = await Vue.iBox.http('assessmentsUrl.createAssessments', {
      testType: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Scene).TestType,
      wxOpenID: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Admin).WxOpenID,
      ...params
    })()

    Vue.iBox.setTokenSync(Vue.iBox.TokenKey.Assessments, { UserEvaluationID: result.data.userEvaluationID })
  },

  async reCreateAssessments ({commit}, params = {}) {
    const result = await Vue.iBox.http('assessmentsUrl.reCreateAssessments', {
      testType: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Scene).TestType,
      ...params
    })()

    Vue.iBox.setTokenSync(Vue.iBox.TokenKey.Assessments, { UserEvaluationID: result.data.userEvaluationID })
  },

  async findAssessmentsItems ({commit}, params = {}) {
    const result = await Vue.iBox.http('assessmentsUrl.findAssessmentsItems', {
      userEvaluationID: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Assessments).UserEvaluationID,
      ...params
    })({method: 'get'})

    for (let item of result.data) {
      item.choices = Vue.iBox.sort(item.choices)

      if (item.itemType === AssessmentsQuestionTypes.Word || item.itemType === AssessmentsQuestionTypes.ListeningWord) {
        item.choices = Vue.iBox.addIndeterminateChoice(item)
      }
    }

    commit('ASSESSMENTSITEMS', result.data)
  },

  async saveUserAnswer ({commit}, params = {}) {
    actions.clearTimerOnAssessments()

    await Vue.iBox.http('assessmentsUrl.saveUserAnswer', {
      userEvaluationID: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Assessments).UserEvaluationID,
      elapsedSec: state.consumedTime || 1,
      ...params
    })()

    commit('RESETCONSUMEDTIME')
    commit('NEXTITEMINDEX')
    actions.startTimerOnAssessments({commit})
  },

  startTimerOnAssessments ({commit}) {
    state.timer = setInterval(function () {
      state.consumedTime += 1
    }, 1000)
  },

  clearTimerOnAssessments () {
    clearInterval(state.timer)
  },

  async getAssessmentsReport ({commit}, params = {}) {
    return await Vue.iBox.http('assessmentsUrl.getAssessmentsReport', {
      userEvaluationID: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Assessments).UserEvaluationID,
      ...params
    })({method: 'get'})
  },

  async share ({commit}, params = {}) {
    return await Vue.iBox.http('assessmentsUrl.share', {
      testType: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Scene).TestType,
      ...params
    })()
  },

  async getUserAssessmentsStatus ({commit}, params = {}) {
    const result = await Vue.iBox.http('assessmentsUrl.getUserAssessmentsStatus', {
      testType: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Scene).TestType,
      ...params
    })({method: 'get'})

    commit('ASSESSMENTSINFO', result.data)
    Vue.iBox.setTokenSync(Vue.iBox.TokenKey.Assessments, { UserEvaluationID: result.data.userEvaluation.evaluationID })
  },

  async complete ({commit}, params = {}) {
    await Vue.iBox.http('assessmentsUrl.complete', {
      userEvaluationID: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Assessments).UserEvaluationID,
      wxOpenID: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Admin).WxOpenID,
      ...params
    })()

    actions.clearTimerOnAssessments()
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
