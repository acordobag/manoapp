<template lang="pug">
  main
    .legacyDetail(v-if="legacy.status === 'confirmed'")
      .padding-20.txt-center Su legado ya fue confirmado.
    .legacyDetail(v-else)
      .title Pago de legado de {{amount | moneyFormat}}
      .accounts(v-if="!legacy.paid")
        .txt-small Puedes realizar el pago a las siguientes cuentas, o bien contactar a {{owner.name}} para coordinar el pago
        .account.bank(v-for="account in accounts")
          i.fa.fa-university
          .title {{account.title}}
          .value {{account.value}}
        .account.identification(v-for="contact in contacts")
          i.fa.fa-user
          .title {{contact.title}}
          .value {{contact.value}}
      .accounts(v-else)
        .padding-top-20.txt-center.main-color  Ya marcaste este legago como pagado, solo falta esperar que {{owner.name}} confirme el pago para continuar
        .padding-top-20.txt-center.main-color  Marcaste este legado pagado el {{legacy.paidAt | exactDateTime}}
      .clock(v-if="!legacy.paid")
        .txt-sm Tiempo restante para la expiración
        .timer
          backClock(:date="legacy.assignedAt")
      .clock.waiting(v-else)
        .p Esperando Confirmación
      .btn.margin-20.btn-block.padding-15(@click="paidlegacy" v-if="!legacy.paid") He pagado
</template>

<script>
import Legacies from '@/services/Legacies'
import { mapGetters } from 'vuex';

export default {
  data () {
    return {
      legacy: {}
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {
      this.getlegacyDetail()
      this.startRealTime()
    },
    async startRealTime () {
      setTimeout(() => {
        this.socket.on('update/legacies', () => {
          this.getlegacyDetail()
        })
      }, 100)
    },
    async paidlegacy () {
      this.$alertify.okBtn('Si, estoy seguro').confirm(`Seguro que desea marcar su legado pendiente como pagado, es posible que ${this.owner.name} te solicite un comprobante de pago`, async () => {
        try {
          let {data} = await Legacies.paid({hash: this.hash, id: this.legacyId})
          console.log(data)
          this.$alertify.okBtn('Entendido').alert(`Se marco su legado pendinte como pagado, por favor espere a que ${this.owner.name} verifique la información`, () => {
            this.$router.go(-1)
          })
        } catch (e) {
          console.log(e)
        }
      })
    },
    async getlegacyDetail () {
      try {
        let {data} = await Legacies.detail(this.hash, this.legacyId)
        this.legacy = data
      } catch (e) {
        console.log(e)
      }
    }
  },
  computed :{
    owner() {
      if (this.legacy.annex) {
        return this.legacy.annex.membership.owner
      } 
      return {}
    },
    amount () {
      if (this.legacy.annex) {
        return this.legacy.amount
      }
      return {}
    },
    accounts() {
      return this.owner.accounts
    },
    contacts() {
      return this.owner.contacts
    },
    legacyId () {
      return this.$route.params.id
    },
    hash () {
      return this.$route.params.hash
    },
    ...mapGetters('user', ['socket'])
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/main.scss';
  .legacyDetail{
    display: flex;
    padding: 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center
  }
  .clock{
    padding: 20px;
  }
  .timer{
    padding: 0 20px;
    color: $main-color;
    font-size: 2em;
  }

  .waiting{
    font-size: 1.3em;
  }

  .accounts{
    .account{
      position: relative;
      overflow: hidden;
      i{
        font-size: 7em;
        opacity: .1;
        left: 0;
        position: absolute
      }
      display: flex;
      padding: 20px;
      margin: 10px;
      border-radius: 10px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &.bitcoin{
        background-color: goldenrod;
        color: rgb(83, 32, 3)
      }
      &.bank{
        background-color: #1DABEC;
        color: rgb(0, 7, 109);
      }
      &.identification{
        background-color: rgb(204, 204, 204);
        color: rgb(48, 48, 48);
      }
    }
  }
</style>

