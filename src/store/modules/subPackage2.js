import Vue from 'vue'

import { ButtonCount } from '@/defines/subPackage2'

const state = {
  reading: {
    practiceInfo: {},
    data: {
      currIndexStatus: 0,
      currIndexData: {},
      isLastItem: false
    },
    count: ButtonCount,
  },
  timer: null,
  course: null
}

const mutations = {
  RESETELAPSEDSEC (state) {
    state.timer = null
  },

  COURSE (state, data) {
    state.course = data
  }
}

const getters = {
}

const actions = {
  async getCourses ({commit}, params = {}) {
    let result = await Vue.iBox.http('subPackage2Url.findCourses', {
      testType: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Scene).TestType,
      // isMocking: Vue.iBox.IsMocking,
      ...params
    })({method: 'get'})

    commit('COURSE', result.data)
  },

  startTimerOnPractice ({commit}) {
    actions.clearTimerOnPractice({commit})

    state.timer = setInterval(function () {
      state.elapsedSec += 1
    }, 1000)
  },

  clearTimerOnPractice ({commit}) {
    clearInterval(state.timer)
    commit('RESETELAPSEDSEC')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
