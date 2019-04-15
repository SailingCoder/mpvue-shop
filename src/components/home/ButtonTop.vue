<template>
  <div class="activity">
    <button-top></button-top>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapState, mapActions } from 'vuex'

  import buttonTop from '@/components/common/Button'

  export default {
    data () {
      return {
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
</style>
