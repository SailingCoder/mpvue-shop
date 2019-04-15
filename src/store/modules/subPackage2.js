import Vue from 'vue'

import { PracticeStatus, PracticeType, getPracticeLowerEnNameByType } from '@/defines/courseSession'

const state = {
  speaking: {
    practiceInfo: {},
    status: {
      currQuestionIndex: 0,
      currQuestionData: {},
      currStepIndex: 0,
      currStepData: {},
      currSubQuestionIndex: 0,
      currSubQuestionData: {},
      isLastItem: false
    },
    practiceStatus: PracticeStatus.Lock
  },
  listening: {
    practiceInfo: {},
    status: {
      currQuestionIndex: 0,
      currQuestionData: {},
      currStepIndex: 0,
      currStepData: {},
      currSubQuestionIndex: 0,
      currSubQuestionData: {},
      isLastItem: false
    },
    practiceStatus: PracticeStatus.Lock
  },
  writing: {
    practiceInfo: {},
    status: {
      currQuestionIndex: 0,
      currQuestionData: {},
      currStepIndex: 0,
      currStepData: {},
      currSubQuestionIndex: 0,
      currSubQuestionData: {},
      isLastItem: false
    },
    practiceStatus: PracticeStatus.Lock
  },
  reading: {
    practiceInfo: {},
    status: {
      currQuestionIndex: 0,
      currQuestionData: {},
      currStepIndex: 0,
      currStepData: {},
      currSubQuestionIndex: 0,
      currSubQuestionData: {},
      isLastItem: false
    },
    practiceStatus: PracticeStatus.Lock
  },
  timer: null,
  elapsedSec: 0,
  course: {}
}

const mutations = {
  PRACTICEINFO (state, data) {
    state[data.practiceTypeEN].practiceInfo = data
  },

  STATUS (state, data) {
    state[data.practiceTypeEN].status = data
  },

  PRACTICESTATUS (state, data) {
    state[data.practiceTypeEN].practiceStatus = data.practiceStatus
  },

  RESETELAPSEDSEC (state) {
    state.elapsedSec = 0
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
    let result = await Vue.iBox.http('courseSessionUrl.findCourses', {
      testType: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Scene).TestType,
      // isMocking: Vue.iBox.IsMocking,
      ...params
    })({method: 'get'})

    commit('COURSE', result.data)
  },

  async findPractices ({commit}, params = {}) {
    const result = await Vue.iBox.http('courseSessionUrl.findPractices', {
      testType: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Scene).TestType,
      // isMocking: Vue.iBox.IsMocking,
      ...params
    })({method: 'get'})
    const practiceInfo = result.data
    const status = {}

    try {
      // 处理完成测评后默认情况
      if (practiceInfo.userAnswer.shouldDoQuestionID === 0 &&
          practiceInfo.userAnswer.shouldDoStepID === 0 &&
          practiceInfo.userAnswer.shouldDoSubQuestionID === 0) {
        practiceInfo.questions.map((question, index) => {
          if (question && index === 0) {
            question.isShow = true
            status.currQuestionIndex = index
            status.currQuestionData = question
          } else {
            question.isShow = false
          }

          question.steps.map((step, stepIndex) => {
            if (question.isShow && step && stepIndex === 0) {
              step.isShow = true
              status.currStepIndex = stepIndex
              status.currStepData = step
            } else {
              step.isShow = false
            }

            const totalSubQuestionsPerStep = step.subQuestions.length
            let subQuestionNum = 0

            step.subQuestions.map((subQuestion, subQuestionIndex) => {
              if (subQuestion.userAnswer) {
                subQuestion.isComplete = true
                subQuestionNum++
              } else {
                subQuestion.isComplete = false
              }

              if (step.isShow && subQuestion && subQuestionIndex === 0) {
                subQuestion.isShow = true
                status.currSubQuestionIndex = subQuestionIndex
                status.currSubQuestionData = subQuestion
              } else {
                subQuestion.isShow = false
              }

              if (parseInt(subQuestion.practiceType, 10) === PracticeType.Writing) {
                if (subQuestion.writeSubject.indexOf('####') !== -1) {
                  subQuestion.writeSubjectEnglish = subQuestion.writeSubject.slice(0, subQuestion.writeSubject.indexOf('#'))
                  subQuestion.writeSubjectChinese = subQuestion.writeSubject.slice(subQuestion.writeSubject.indexOf('#') + 4)
                }
                if (subQuestion.userAnswer.indexOf('@ANSWER@') !== -1) {
                  subQuestion.userAnswer1 = subQuestion.userAnswer.slice(0, subQuestion.userAnswer.indexOf('@ANSWER@'))
                  subQuestion.userAnswer2 = subQuestion.userAnswer.slice(subQuestion.userAnswer.indexOf('@ANSWER@') + 8)
                }
              }

              if (parseInt(subQuestion.practiceType, 10) === PracticeType.Speaking && (stepIndex === 2 || stepIndex === 3)) {
                let testType = Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Scene).TestType
                subQuestion.speakAudio = `https://ssl-public.langlib.com/FreeTrial/${testType}/${subQuestion.speakAudio}`

                if (subQuestion.userAnswer) {
                  subQuestion.userAnswer = 'https://ssl-public.langlib.com' + subQuestion.userAnswer
                }
              }
            })

            if (subQuestionNum >= totalSubQuestionsPerStep) {
              step.isComplete = true
            } else {
              step.isComplete = false
            }
          })
        })
      } else {
        practiceInfo.questions.map((question, index) => {
          if (question && question.sysQuestionID === practiceInfo.userAnswer.shouldDoQuestionID) {
            question.isShow = true
            status.currQuestionIndex = index
            status.currQuestionData = question
          } else {
            question.isShow = false
          }

          question.steps.map((step, stepIndex) => {
            if (question.isShow && step && step.stepID === practiceInfo.userAnswer.shouldDoStepID) {
              step.isShow = true
              status.currStepIndex = stepIndex
              status.currStepData = step
            } else {
              step.isShow = false
            }

            const totalSubQuestionsPerStep = step.subQuestions.length
            let subQuestionNum = 0

            step.subQuestions.map((subQuestion, subQuestionIndex) => {
              if (subQuestion.userAnswer) {
                subQuestion.isComplete = true
                subQuestionNum++
              } else {
                subQuestion.isComplete = false
              }

              if (step.isShow && subQuestion && subQuestion.subQuestionID === practiceInfo.userAnswer.shouldDoSubQuestionID) {
                subQuestion.isShow = true
                status.currSubQuestionIndex = subQuestionIndex
                status.currSubQuestionData = subQuestion
              } else {
                subQuestion.isShow = false
              }

              if (parseInt(subQuestion.practiceType, 10) === PracticeType.Writing) {
                if (subQuestion.writeSubject.indexOf('####') !== -1) {
                  subQuestion.writeSubjectEnglish = subQuestion.writeSubject.slice(0, subQuestion.writeSubject.indexOf('#'))
                  subQuestion.writeSubjectChinese = subQuestion.writeSubject.slice(subQuestion.writeSubject.indexOf('#') + 4)
                }
                if (subQuestion.userAnswer.indexOf('@ANSWER@') !== -1) {
                  subQuestion.userAnswer1 = subQuestion.userAnswer.slice(0, subQuestion.userAnswer.indexOf('@ANSWER@'))
                  subQuestion.userAnswer2 = subQuestion.userAnswer.slice(subQuestion.userAnswer.indexOf('@ANSWER@') + 8)
                }
              }

              if (parseInt(subQuestion.practiceType, 10) === PracticeType.Speaking && (stepIndex === 2 || stepIndex === 3)) {
                let testType = Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Scene).TestType
                subQuestion.speakAudio = `https://ssl-public.langlib.com/FreeTrial/${testType}/${subQuestion.speakAudio}`

                if (subQuestion.userAnswer) {
                  subQuestion.userAnswer = 'https://ssl-public.langlib.com' + subQuestion.userAnswer
                }
              }
            })

            if (subQuestionNum >= totalSubQuestionsPerStep) {
              step.isComplete = true
            } else {
              step.isComplete = false
            }
          })
        })
      }
    } catch (e) {
      console.log(`练习数据处理：${e}`)
    }

    status.isLastItem = status.currSubQuestionData.isLastSubQuestion === PracticeStatus.YES &&
                        status.currStepData.isLastStep === PracticeStatus.YES &&
                        status.currQuestionData.isLastQuestion === PracticeStatus.YES

    const practiceTypeEN = getPracticeLowerEnNameByType(params.practiceType)
    practiceInfo.practiceTypeEN = practiceTypeEN
    status.practiceTypeEN = practiceTypeEN
    const practiceStatus = {
      practiceStatus: practiceInfo.userAnswer.practiceStatus,
      practiceTypeEN: practiceTypeEN
    }

    commit('PRACTICEINFO', practiceInfo)
    commit('STATUS', status)
    commit('PRACTICESTATUS', practiceStatus)
  },

  async saveUserAnswer ({commit}, params = {}) {
    await Vue.iBox.http('courseSessionUrl.saveUserAnswer', {
      elapsedSec: parseInt(state.elapsedSec, 10) || 1,
      // isMocking: Vue.iBox.IsMocking,
      ...params
    })()

    actions.changeSubQuestionCompleteStatus({commit}, {'userAnswer': params.answer, 'userAudioTime': params.audioTime, 'practiceType': params.practiceType})
    actions.startTimerOnPractice({commit})
  },

  async getCourseSessionReport ({commit}, params = {}) {
    let result = await Vue.iBox.http('courseSessionUrl.getCourseSessionReport', {
      testType: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Scene).TestType,
      // isMocking: Vue.iBox.IsMocking,
      ...params
    })({method: 'get'})

    let report = result.data

    for (let i = 0; i < report.section.cPointStackBar.length; i++) {
      let previousLevel = report.section.cPointStackBar[i].previousLevel / report.section.cPointStackBar[i].maxLevel
      let currLevel = ((report.section.cPointStackBar[i].maxLevel - report.section.cPointStackBar[i].previousLevel) / 3 * report.section.cPointStackBar[i].currLevel) / report.section.cPointStackBar[i].maxLevel + previousLevel

      previousLevel = Math.round(previousLevel * 1000) / 10
      currLevel = Math.round(currLevel * 1000) / 10
      report.section.cPointStackBar[i].previousLevel = previousLevel
      report.section.cPointStackBar[i].currLevel = currLevel
    }

    return report
  },

  async complete ({commit}, params = {}) {
    actions.clearTimerOnPractice({commit})

    await Vue.iBox.http('courseSessionUrl.complete', {
      testType: Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Scene).TestType,
      // isMocking: Vue.iBox.IsMocking,
      ...params
    })()

    const practiceStatus = {
      practiceStatus: PracticeStatus.Done,
      practiceTypeEN: getPracticeLowerEnNameByType(params.practiceType)
    }

    commit('PRACTICESTATUS', practiceStatus)
  },

  changeSubQuestionCompleteStatus ({commit}, data) {
    const practiceTypeEN = getPracticeLowerEnNameByType(data.practiceType)
    const current = state[practiceTypeEN]
    const subQuestion = current.practiceInfo.questions[current.status.currQuestionIndex].steps[current.status.currStepIndex].subQuestions[current.status.currSubQuestionIndex]
    if (subQuestion.practiceType === PracticeType.Speaking && current.status.currStepIndex === 2) {
      subQuestion.userAnswer = 'https://ssl-public.langlib.com' + data.userAnswer
      subQuestion.userAudioTime = data.userAudioTime
      subQuestion.isComplete = true
      return ''
    }

    subQuestion.userAnswer = data.userAnswer
    subQuestion.isComplete = true
  },

  stepIntoNext ({commit}, data) {
    return new Promise((resolve, reject) => {
      try {
        const practiceTypeEN = getPracticeLowerEnNameByType(data.practiceType)
        const current = state[practiceTypeEN]
        const questions = current.practiceInfo.questions
        const totalQuestions = questions ? questions.length : 0
        const totalSteps = questions && questions[current.status.currQuestionIndex].steps ? questions[current.status.currQuestionIndex].steps.length : 0
        const totalSubQuestions = questions && questions[current.status.currQuestionIndex].steps[current.status.currStepIndex] && questions[current.status.currQuestionIndex].steps[current.status.currStepIndex].subQuestions
          ? questions[current.status.currQuestionIndex].steps[current.status.currStepIndex].subQuestions.length : 0

        const status = {
          currSubQuestionIndex: current.status.currSubQuestionIndex,
          currStepIndex: current.status.currStepIndex,
          currQuestionIndex: current.status.currQuestionIndex,
          isLastItem: current.status.isLastItem
        }

        ++status.currSubQuestionIndex

        if (status.currSubQuestionIndex >= totalSubQuestions) {
          status.currSubQuestionIndex = 0
          ++status.currStepIndex
        }

        if (status.currStepIndex >= totalSteps) {
          status.currStepIndex = 0
          ++status.currQuestionIndex
        }

        if (status.currQuestionIndex >= totalQuestions) {
          status.currQuestionIndex = 0
        }

        questions.map((question, questionIndex) => {
          if (questionIndex === status.currQuestionIndex) {
            question.isShow = true
            status.currQuestionData = question
          } else {
            question.isShow = false
          }

          question.steps.map((step, stepIndex) => {
            if (question.isShow && stepIndex === status.currStepIndex) {
              step.isShow = true
              status.currStepData = step
            } else {
              step.isShow = false
            }

            const totalSubQuestionsPerStep = step.subQuestions.length
            let subQuestionNum = 0

            step.subQuestions.map((subQuestion, subQuestionIndex) => {
              if (subQuestion.userAnswer) {
                subQuestion.isComplete = true
                subQuestionNum++
              } else {
                subQuestion.isComplete = false
              }

              if (step.isShow && subQuestionIndex === status.currSubQuestionIndex) {
                subQuestion.isShow = true
                status.currSubQuestionData = subQuestion
              } else {
                subQuestion.isShow = false
              }
            })

            if (subQuestionNum >= totalSubQuestionsPerStep) {
              step.isComplete = true
            } else {
              step.isComplete = false
            }
          })
        })

        status.isLastItem = status.currSubQuestionData.isLastSubQuestion === PracticeStatus.YES &&
          status.currStepData.isLastStep === PracticeStatus.YES &&
          status.currQuestionData.isLastQuestion === PracticeStatus.YES
        status.practiceTypeEN = getPracticeLowerEnNameByType(data.practiceType)

        commit('STATUS', status)
        actions.startTimerOnPractice({commit})
        resolve()
      } catch (e) {
        reject(e)
      }
    })
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
  },

  goToSomeStep ({commit}, params = {}) {
    const practiceTypeEN = getPracticeLowerEnNameByType(params.practiceType)
    const questions = state[practiceTypeEN].practiceInfo.questions
    const status = {}

    questions.map((question, questionIndex) => {
      if (questionIndex === params.currQuestionIndex) {
        question.isShow = true
        status.currQuestionData = question
        status.currQuestionIndex = params.currQuestionIndex
      } else {
        question.isShow = false
      }

      question.steps.map((step, stepIndex) => {
        if (question.isShow && stepIndex === params.currStepIndex) {
          step.isShow = true
          status.currStepData = step
          status.currStepIndex = params.currStepIndex
        } else {
          step.isShow = false
        }

        const totalSubQuestionsPerStep = step.subQuestions.length
        let subQuestionNum = 0

        step.subQuestions.map((subQuestion, subQuestionIndex) => {
          if (subQuestion.userAnswer) {
            subQuestion.isComplete = true
            subQuestionNum++
          } else {
            subQuestion.isComplete = false
          }

          if (step.isShow && subQuestionIndex === params.currSubQuestionIndex) {
            subQuestion.isShow = true
            status.currSubQuestionData = subQuestion
            status.currSubQuestionIndex = params.currSubQuestionIndex
          } else {
            subQuestion.isShow = false
          }
        })

        if (subQuestionNum >= totalSubQuestionsPerStep) {
          step.isComplete = true
        } else {
          step.isComplete = false
        }
      })
    })

    status.isLastItem = status.currSubQuestionData.isLastSubQuestion === PracticeStatus.YES &&
      status.currStepData.isLastStep === PracticeStatus.YES &&
      status.currQuestionData.isLastQuestion === PracticeStatus.YES
    status.practiceTypeEN = getPracticeLowerEnNameByType(params.practiceType)

    commit('STATUS', status)
    actions.startTimerOnPractice({commit})
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
