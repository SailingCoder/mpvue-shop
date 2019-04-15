<template>
  <div class="bottom j-next">
    <p class="bottom__progress">
        <span>当前进度：</span>
        <span class="bottom__target-current">{{currItemIndex}}</span>
        <span>/</span>
        <span class="bottom__target-total">{{assessmentsTotal}}</span>
    </p>
    <span v-if="!isLastItem" class="bottom__btn" :class="{'active': isActive}" @click.stop="stepToNextQuest">下一题</span>
    <span v-if="isLastItem" class="bottom__btn" :class="{'active': isActive}" @click.stop="finish">查看测评报告</span>
    <div class="coverlay" v-if="isShow">
      <div class="coverlay__inner">
        <img src="https://lb-static.oss-cn-beijing.aliyuncs.com/freeTrialMP/images/bg_create.gif">
        <p>测评已完成，正在生成测评结果…</p>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    name: 'BottomBar',
    data () {
      return {
        isShow: false
      }
    },
    props: {
      isActive: {
        type: Boolean,
        default: false
      },
      answer: {
        type: String,
        require: true
      },
      redirectToUrl: {
        type: String,
        default: '/assessments/pages/report'
      },
      sceneId: {
        type: Number
      }
    },
    computed: {
      ...mapState({
        currItemIndex: state => state.assessments.assessmentsInfo.currItemIndex + 1,
        assessmentsTotal: state => state.assessments.assessmentsTotal,
        userStatus: state => state.home.userStatus
      }),
      ...mapGetters('assessments', [
        'nextQuestionPath',
        'isLastItem',
        'currAssessmentsItem'
      ])
    },
    methods: {
      ...mapActions('assessments', [
        'saveUserAnswer',
        'complete'
      ]),
      stepToNextQuest: Vue.iBox.debounce(async function () {
        if (this.isActive) {
          this.isActive = false
          await this.save()
          Vue.iBox.redirectTo(this.nextQuestionPath)
        }
      }),
      finish: Vue.iBox.debounce(async function () {
        if (this.isActive) {
          this.isActive = false
          this.isShow = true

          try {
            await this.save()
            await this.complete()
          } catch (e) {
            console.log(`保存答案并完成错误捕获： ${JSON.stringify(e)}`)
          }

          if (this.userStatus.freeTrialConf.needShare === Vue.iBox.ShareNeedShare.YES) {
            Vue.iBox.reLaunch(this.redirectToUrl)
          } else if (this.userStatus.freeTrialConf.needShare === Vue.iBox.ShareNeedShare.NO) {
            Vue.iBox.redirectTo(this.redirectToUrl)
          }
          this.isShow = false
        }
      }, 300),
      async save () {
        await this.saveUserAnswer({
          questionID: parseInt(this.currAssessmentsItem.id, 10),
          itemType: parseInt(this.currAssessmentsItem.itemType, 10),
          userAnswer: this.answer.toString()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/global.scss';

  .bottom {
    position: fixed;
    bottom: 0;
    z-index: 5;
    width: 100%;
    height: 98px;

    background-color: #fff;
    border-top: 1px solid rgba(0,0,0,.1);
    box-sizing: border-box;

    &__progress {
      display: inline-block;
      height: 98px;
      margin-left: 30px;

      color: #333;
      font-size: 32px;
      line-height: 98px;
    }

    &__target-current {
      margin-right: 4px;

      color: #151515;
      font-size: 48px;
      line-height: 34px;
    }

    &__target-total {
      margin-left: 4px;
    }

    &__btn {
      position: fixed;
      bottom: 0;
      right: 0;
      width: 350px;
      height: 98px;

      color: #fff;
      font-size: 32px;
      line-height: 98px;
      text-align: center;

      background-color: #ddd;
      box-sizing: border-box;

      &.active {
        background-color: $highlight-color;
      }
    }
  }

  .coverlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;

    background: rgba(0, 0, 0, .65);

    &__inner {
      position: absolute;
      z-index: 1001;
      top: 35%;
    }

    img {
      width: 244px;
      height: 272px;
      margin-left: 50%;
    }

    p {
      width: 100%;
      margin-left: 25%;

      color: #fff;
      font-size: 32px;
      line-height: 32px;
      text-align: center;
    }
  }
</style>
