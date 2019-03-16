<template lang="pug">
  main
    .subscriptions
      .sub(v-for="sub in subscriptions")
        .date
          backClock(:date="sub.assignedAt")
        .userId {{sub.membership.id}}
        .name {{sub.membership.owner.fullName}}
        .amount {{sub.amount}}
        .status {{sub.status}}
        .action(v-if="sub.paid")
          .btn(@click="confirmSubscription(sub.membership.owner, sub.hash)") Confirmar
</template>

<script>
import Subscriptions from '@/services/Subscriptions'

export default {
  data () {
    return {
      subscriptions: []
    }
  },
  mounted () {
    this.initialize ()
  },
  methods: {
    initialize () {
      this.getSubscriptions()
    },
    async getSubscriptions () {
      try {
        let {data} = await Subscriptions.pendingsAdmin()
        this.subscriptions = data
      } catch (e) {
        console.log(e)
      }
    },
    confirmSubscription (payer, hash) {
      this.$alertify.okBtn('Si, estoy seguro').confirm(`Seguro que desea confirmar la suscripcion de ${payer.fullName}`, async () => {
        try {
          let {data} = await Subscriptions.confirm({hash})
          this.getSubscriptions();
          console.log(data)
        } catch (e) {
          console.log(e)
        }  
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.subscriptions{
  background: white;
}
.sub{
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #eee;
  *{
    margin: 5px;
    display: flex;
    flex: 1 1 auto;
    justify-content: center;
    align-items: center;
  }
}
</style>

