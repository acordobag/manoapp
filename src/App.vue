<template lang="pug">
div
  transition(name="fade")
    pMainLoader(v-show="isLoading")
  router-view
</template>

<script>
import {mapState, mapActions} from 'vuex'
import { register } from 'register-service-worker'

  export default {
    mounted () {
      this.initialize()
    },
    methods: {
      initialize () {
        // let $this = this
        // if (process.env.NODE_ENV === 'production') {
        //   register(`${process.env.BASE_URL}service-worker.js`, {
        //     ready () {
        //       console.log(
        //         'App is being served from cache by a service worker.\n' +
        //         'For more details, visit https://goo.gl/AFskqB'
        //       )
        //     },
        //     cached () {
        //       console.log('Content has been cached for offline use.')
        //     },
        //     updated (registration) {
        //       console.log(registration)
        //     },
        //     offline () {
        //       console.log('No internet connection found. App is running in offline mode.')
        //     },
        //     error (error) {
        //       console.error('Error during service worker registration:', error)
        //     }
        //   })
        // }
      },
      ...mapActions('app', ['newVersion'])
    },
    computed: {
      ...mapState('app', ['isLoading'])
    },
    components: {
      pMainLoader: () => import('@/components/loaders/mainLoader.vue')
    }
  }
</script>
