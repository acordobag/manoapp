<template lang="pug">
  main
    .pk-tile
      .pk-tile-header.dark
        .pk-tile-title
          p Suscripciones pendientes
      .pk-tile-body
        p.padding-20.txt-center(v-if="!subscriptions.length") No tienes suscripciones pendientes
        .susctiptions(v-else) 
          pSubscription(
            v-for="subscription in subscriptions", 
            :subscription="subscription",
            :to="{name: 'subscription/detail', params: {hash: subscription.hash}, query: {os: true}}"
          )
    PopWindow(:open="open")
</template>

<script>
import Subscriptions from '@/services/Subscriptions'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      subscriptions: []
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {
      this.getSubscriptions()
      this.startRealTime()
    },
    async startRealTime () {
      setTimeout(() => {
        this.socket.on('update/subscription', () => {
          this.getSubscriptions()
        })
      }, 1000)
    },
    async getSubscriptions () {
      try {
        let {data} = await Subscriptions.pending()
        this.subscriptions = data
      } catch (e) {
        console.log(e)
      }
    }
  },
  computed: {
    open () {
      return this.$route.query.os
    },
    ...mapGetters('user', ['socket'])
  },
  components: {
    pSubscription: () => import('@/components/subscriptions/Single.vue')
  }
}
</script>

<style lang="scss" scoped>

  .subscription{
    display: grid;
    font-size: .7em;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto;
    grid-template-areas: 'wl data action';
    background: white;
    &:hover{
      text-decoration: none;
    }
    border-bottom: 1px solid #eee;
    &:last-child{
      border-bottom: none;
    }
    .amount{
      grid-area: wl;
      color: white;
      font-size: .8em;
      display: flex;
      justify-content: center;
      align-items: center;
      .badge{
        padding: 5px;
        border-radius: 4px;
        margin: 5px;
        display: flex;
        flex-direction: column;
        &.green{
          background: green;
        }
        &.red{
          background: red;
        }
      }
    }
    .data{
      grid-area: data;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      grid-template-areas: 'h sp'
                           'd pos';
      color: black;
      margin-left: 10px;
      &>*{
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .hash{
        grid-area: h;
        font-size: 1.2em;
      }
      .detail{
        grid-area: d;
      }
      .position{
        padding-left: 10px;
        grid-area: pos;
      }
      .strike{
        padding-left: 10px;
        grid-area: sp;
      }
    }

    .action{
      grid-area: action;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      border-right: 3px solid;
      &.red{
        border-color: red;
      }
      &.green{
        border-color: green;
      }
    }
  }
</style>
