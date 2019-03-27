<template lang="pug">
  main
    .subscriptionDetail(v-if="subscription.status === 'confirmed'")
      .padding-20.txt-center Su suscripción ya fue confirmada.
    .subscriptionDetail(v-else)
      .title Pago de Suscripción de {{subscription.amount | moneyFormat}}
      .accounts(v-if="!subscription.paid")
        .account.bitcoin
          i.fab.fa-bitcoin
          .title Bitcoin Wallet
          .value 17Z9W5npLMJRdoQhLRfSZVbZ6pDQK4CJXx
        .account.bank
          i.fa.fa-university
          .title Banco BCR - Cuenta de Ahorros
          .value 001-2138816-4
        .account.bank
          i.fa.fa-university
          .title Banco BCR - Cuenta Cliente
          .value 15202001213881649
        .account.identification
          i.fa.fa-id-card
          .title Banco BCR - Identificación
          .value 7-0134-0910
      .accounts(v-else)
        .padding-top-20.txt-center.main-color  Ya marcaste esta suscripción como pagada, solo falta esperar que el equipo contable de ManoApp confirme el pago para continuar
        .padding-top-20.txt-center.main-color  Marcaste esta suscripción pagada el {{subscription.paidAt | exactDateTime}}
      .clock(v-if="!subscription.paid")
        .txt-sm Tiempo restante para la expiración
        .timer
          backClock(:date="subscription.assignedAt")
      .clock.waiting(v-else)
        .p Esperando Confirmación
      .btn.margin-20.btn-block.padding-15(@click="paidSubscription" v-if="!subscription.paid") He pagado
      br
      br
      br
      br
</template>

<script>
import Subscription from "@/services/Subscriptions";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      subscription: {}
    };
  },
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.getSubscriptionDetail();
      this.startRealTime();
    },
    async startRealTime() {
      setTimeout(() => {
        this.socket.on("update/subscription", () => {
          this.getSubscriptionDetail();
        });
      }, 100);
    },
    async paidSubscription() {
      this.$alertify
        .okBtn("Si, estoy seguro")
        .confirm(
          "Seguro que desea marcar su suscripción como pagada, es posible que el equipo contable de ManoApp te solicite un comprobante de pago",
          async () => {
            try {
              let { data } = await Subscription.paid({ hash: this.hash });
              this.$alertify
                .okBtn("Entendido")
                .alert(
                  "Se marco la suscripción como pagada, por favor espere a que un asesor de ManoApp verifique la información",
                  () => {
                    this.$router.go(-1);
                  }
                );
            } catch (e) {
              console.log(e);
            }
          }
        );
    },
    async getSubscriptionDetail() {
      try {
        let { data } = await Subscription.detail(this.hash);
        this.subscription = data;
      } catch (e) {
        console.log(e);
      }
    }
  },
  computed: {
    hash() {
      return this.$route.params.hash;
    },
    ...mapGetters("user", ["socket"])
  }
};
</script>

<style lang="scss" scoped>
@import "~styles/main.scss";
.subscriptionDetail {
  display: flex;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.clock {
  padding: 20px;
}
.timer {
  padding: 0 20px;
  color: $main-color;
  font-size: 2em;
}

.waiting {
  font-size: 1.3em;
}

.accounts {
  .account {
    position: relative;
    overflow: hidden;
    i {
      font-size: 7em;
      opacity: 0.1;
      left: 0;
      position: absolute;
    }
    display: flex;
    padding: 20px;
    margin: 10px;
    border-radius: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &.bitcoin {
      background-color: goldenrod;
      color: rgb(83, 32, 3);
    }
    &.bank {
      background-color: #1dabec;
      color: rgb(0, 7, 109);
    }
    &.identification {
      background-color: rgb(204, 204, 204);
      color: rgb(48, 48, 48);
    }
  }
}
</style>

