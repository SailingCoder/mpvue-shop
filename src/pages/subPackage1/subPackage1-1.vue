<template>
  <div class="activity">
    <div>
      <button-top v-if="currData.button.state"></button-top>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapState, mapActions } from 'vuex'

  import buttonTop from '@/components/subPackage1/ButtonTop'

  import { ButtonTxt, ButtonCount } from '@/defines/assessments'

  export default {
    data () {
      return {
        currData: {
          button: {
            state: false
          },
          pageTitle: ButtonTxt.text
        },
        guidePopupComponents: {
          isShow: false
        }
      }
    },

    components: {
      buttonTop
    },

    async onLoad (res) {
      this.currData.button.state = true
    },

    computed: {
    },

    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/global.scss';

  .activity {
    background-color: #fff;
    box-sizing: border-box;

    div {
      width: 100%;
      /*height: 100vh;*/
      padding-top: 88px;
    }
  }
</style>
