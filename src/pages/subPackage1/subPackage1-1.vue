<template>
  <div class="activity">
    activity
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapState, mapActions } from 'vuex'

  import guidePopup from '@/components/assessments/GuidePopup'

  import { AssessmentsStatus, getAssessmentsCategoryByQuestionTypes } from '@/defines/assessments'

  export default {
    data () {
      return {
        currData: {
          testType: Vue.iBox.TestType.Default,
          timeFlag: false,
          title: '测评须知'
        },
        guidePopupComponents: {
          isShow: false
        }
      }
    },

    components: {
      guidePopup
    },

    async onLoad (res) {
      this.currData.testType = Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Scene).TestType

      await this.getUserAssessmentsStatus()

      if (Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Assessments).UserEvaluationID === AssessmentsStatus.Default) {
        await this.createAssessments()
        await this.getUserAssessmentsStatus()
      }

      await this.findAssessmentsItems()
    },

    computed: {
      ...mapState({
        currItemIndex: state => state.assessments.assessmentsInfo.currItemIndex,
        currentPhase: state => state.assessments.assessmentsInfo.currentPhase,
        assessmentsStatus: state => state.assessments.assessmentsInfo.assessmentsStatus,
        assessmentsItems: state => state.assessments.assessmentsItems
      }),
      navigatorComponentTitle () {
        return this.currData.testType ? `${Vue.iBox.getTestTypeCNName(this.currData.testType)}测评` : this.currData.title
      }
    },

    methods: {
      ...mapActions('assessments', [
        'findAssessmentsItems',
        'getUserAssessmentsStatus',
        'reCreateAssessments',
        'createAssessments',
        'startTimerOnAssessments'
      ]),
      ...mapActions('log', [
        'saveFormId'
      ]),
      startIntoNextPage: Vue.iBox.debounce(async function () {
        // const _this = this

        if (this.assessmentsStatus === AssessmentsStatus.Complete) {
          Vue.iBox.navigateTo('/assessments/pages/report')
        } else {
          if (this.currItemIndex === 0) {
            this.currData.timeFlag = true
            this.startTimer()
          } else {
            // 显示弹窗
            this.guidePopupComponents.isShow = true
            // wx.showModal({
            //   title: '',
            //   content: '是否继续完成上次测评？',
            //   cancelText: '重新测评',
            //   cancelColor: '#333333',
            //   confirmText: '继续测评',
            //   confirmColor: '#f8a91f',
            //   success: function (res) {
            //     if (res.confirm) {
            //       _this.startAssements(AssessmentsStatus.Started)
            //     } else if (res.cancel) {
            //       _this.startAssements(AssessmentsStatus.Restart)
            //     }
            //   }
            // })
          }
        }
      }),

      startAssements: Vue.iBox.debounce(async function (status) {
        if (status === AssessmentsStatus.Restart) {
          await this.reCreateAssessments()
          await this.getUserAssessmentsStatus()
        } else if (status === AssessmentsStatus.Started) {
          if (Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Assessments).UserEvaluationID === AssessmentsStatus.Default) {
            await this.createAssessments()
            await this.getUserAssessmentsStatus()
          }
        }

        this.currData.timeFlag = true
        this.guidePopupComponents.isShow = false
        this.startTimer()
      }, 300),

      stepIntoCurrItem () {
        const currItem = this.assessmentsItems[this.currItemIndex]
        const itemTypeName = getAssessmentsCategoryByQuestionTypes(currItem.itemType)
        const path = `/assessments/pages/${itemTypeName}?id=${this.currItemIndex}`

        this.startTimerOnAssessments()
        Vue.iBox.redirectTo(path)
      },

      async cacheFormId (event) {
        try {
          await this.saveFormId(event)
        } catch (e) {
          console.log(`测评引导页保存formID异常：${JSON.stringify(e)}`)
        }
      },

      startTimer: function () {
        const _this = this

        setTimeout(function () {
          _this.stepIntoCurrItem()
        }, 3000)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/global.scss';

  .guide {
    background-color: #fff;
    box-sizing: border-box;

    &__inner {
      width: 100%;
      /*height: 100vh;*/
      padding-top: 88px;
    }

    &__title {
      margin-bottom: 88px;

      color: #333;
      font-size: 64px;
      text-align: center;
    }

    &__notice {
      height: 470px;
      margin-left: 77px;
      padding-left: 56px;

      background: url('~@/assets/images/assessments/guide_verticle_align@3x.png') no-repeat;
      background-position: left 6px;
      background-size: 20px 464px;
      box-sizing: border-box;

      &-area {
        position: relative;
        margin-bottom: 70px;
      }

      &-question {
        position: relative;
        z-index: 10;
        margin-bottom: 12px;

        color: #666;
        font-size: 28px;
        line-height: 40px;
      }

      &-answer {
        position: relative;
        z-index: 10;

        color: #333;
        font-size: 32px;
        line-height: 50px;
      }

      &-background {
        position: absolute;
        left: -20px;
        top: 20px;

        width: 566px;
        height: 110px;

        background-color: #f9f7f8;
        border-radius: 2px;
      }
    }

    &__tips {
      display: flex;
      justify-content: space-between;
      margin: 58px 95px 0 66px;

      box-sizing: border-box;

      &-icon {
        width: 40px;
        height: 40px;
        margin-right: 20px;

        background: url('~@/assets/images/assessments/guide_prompt_icon@3x.png') no-repeat;
        background-size: cover;
      }

      &-content {
        width: 100%;

        color: #666;
        font-size: 28px;
        line-height: 50px;

        b {
          display: inline-block;
        }
      }
    }

    &_btn {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 98px;

      color: #fff;
      font-size: 32px;
      line-height: 98px;

      background-color: $highlight-color;
      border-radius: 0;
      box-shadow: none;
    }

    &__count-down {
      position: fixed;
      top: 0;
      z-index: 10;
      width: 100%;
      height: 100%;
      background: #fff url('~@/assets/images/assessments/guide_bg_countdown.png') no-repeat;
      background-size: contain;
      img {
        display: block;
        width: 260px;
        height: 356px;
        margin: 360px auto 90px;
      }
      p {
        font-size: 32px;
        color: #FF8D00;
        letter-spacing: 2px;
        text-align: center;
        line-height: 50px;
      }
    }
  }
</style>
