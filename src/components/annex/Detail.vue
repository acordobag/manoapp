<template lang="pug">
  main
    .detailOfLegacy(v-if="!legacy.confirmed")
      .text Buenas noticias {{userData.name}} tienes a alguien que te va a hacer un legado de {{amount | moneyFormat}}
      .payerData(v-if='payer')
        .prename Tu legado debe ser entregado por:
        .name {{payer.fullName}}
      .contacts(v-if='payer')
        .no-contacts Los contactos de {{payer.fullName}} van a estar disponibles faltando 6 horas para que se acabe el tiempo establecido para le pago del legado
      .clock
        .txt-sm Tiempo restante para la expiración
        .timer
          backClock(:date="legacy.assignedAt")
      .btn.margin-20.btn-block.padding-15(@click="confirmLegacy", v-if="legacy.paid") Confirmar Legado
    .confirmed.padding-20(v-else)
      .text Excelentes noticias:
      .text.margin-top-20 {{payer.name}} ya te pago el legado de {{amount | moneyFormat}} y lo confirmaste el {{legacy.confirmedAt | exactDateTime}}
</template>

<script>
import Annex from '@/services/Annex'
import Legacies from '@/services/Legacies'
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
      legacy: {}
    }
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    async getDetail () {
      try {
        let {data} = await Annex.detail(this.hash, this.legacyId)

        this.legacy = data
      } catch (e) {
        console.log(e)
      }
    },
    confirmLegacy () {
      this.$alertify.confirm('Seguro que desea confirmar el legado? si lo hace no hay vuelta atrás', async () => {
        try {
          let {data} = await Legacies.confirm({hash: this.hash, id: this.legacyId})
          this.$alertify.alert('Se confirmó su legado con éxito', () => {
            this.$router.go(-1)
          })
        } catch (e) {
          this.$alertify.error('Ocurrio un error confirmando su legado, puede que ya esté confirmado o hay un error de conexión, por favor recargue la página para continuar')
        }
      })
    }
  },
  computed: {
    payer () {
      return this.legacy.payer.owner
    },
    amount () {
      if (this.legacy.annex) return this.legacy.amount
      return {}
    },
    hash () {
      return this.$route.params.hash
    },
    legacyId () {
      return this.$route.params.id
    },
    ...mapGetters('user', ['userData'])
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/main.scss';
.detailOfLegacy{
  display: flex;
  padding: 20px;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center
}
.clock{
  padding: 20px;
}

.no-contacts{
  font-size: .9em;
  color: gray;
}

.timer{
  padding: 0 20px;
  color: $main-color;
  font-size: 2em;
}
.payerData{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-size: 1.2em;
  .name{
    margin-top: 5px;
    padding: 10px;
    background: $main-color;
    border-radius: 10px;
    color: white;
  }
}
</style>
