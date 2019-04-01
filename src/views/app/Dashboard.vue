<template lang="pug">
  main.dashboard
    // Account Resume
    .account-resume
      .user-data
        .text
          .welcome {{welcomeText}} {{userData.name | capitalize}}
          .account-details
            .account-number Nº de Usuario: {{userData.id}}  | 
              | Usuario: 
              router-link(:to="{name: 'profile/settings/changeUsername', query: {oc: true, op: true}}") {{userData.username}}
            
            div
              label Cuenta
              select(v-model="selectedMembership", @change="accountChanged()") 
                option(:value="null", disabled) Seleccione una cuenta
                option(v-for="m in memberships", :value="m.id") {{m.type.name}}           
            
            .details
              .cash-balance
                .title Beneficios
                .number {{benefits | moneyFormat}}
              .active-contracts
                .title Enlaces
                .number {{linksCount}}
              .active-stocks
                .title Pendientes
                .number {{pendingLegacies}}
        .image
          .profile-image(v-if="userData.images && userData.images.profile", v-profile-image='userData.images.profile')
          .profile-image(v-else)
    // pending legacies
    // Initialize Process
    .pk-spacer(v-if="!nullInSet")
    .waitingEmptyLegacy(v-if="nullInSet")
      .explication
        strong Hola {{userData.name}}, tuvimos un problema encontrando receptor para tu legado... 
        .pk-spacer
        p.txt-small.
          Pero no te preocupes estamos esperando que alguno de los usuarios de ManoApp se haga receptor para 
          que puedas continuar con tu proceso.
    .initializeProcess(v-if="!nullInSet && selectedAccount.status === 'subscriber' && pendingLegacies === 0 && contentLoad")
      .init Ya puedes empezar el proceso para activarte como ejecutivo ManoApp
      .btn.btn-block.margin-top-10.padding-10(@click="initializeProcess") Empezar
    pPendingLegacies(@setLegaciesNumber="setLegaciesNumber")
    .pk-spacer
    pPendingSubscriptions
</template>

<script>
// Libraries
import { mapGetters, mapMutations, mapActions } from "vuex";
// Services
import User from "@/services/User";
import Legacies from "@/services/Legacies";
import Membership from "@/services/Membership";

export default {
  mounted() {
    this.initialize();
  },
  data() {
    return {
      welcomeText: null,
      linksCount: 0,
      pendingLegacies: 0,
      benefits: 0,
      nullInSet: false,
      contentLoad: false,
      selectedMembership: null,
      memberships: null
    };
  },
  methods: {
    initialize() {
      this.getLinks();
      this.getBenefits();
      this.sayHi();
      this.getNulls(), this.getMemberhips();
      this.selectedMembership = this.selectedAccount.id
      this.refreshSelected()
      this.$refs.pPendingLegacies.initialize();
      this.$refs.pPendingSubscriptions.initialize();
    },
    goToChange() {},
    initializeProcess() {
      this.$alertify
        .okBtn("Si, seguro")
        .confirm(
          "Seguro que desea empezar su proceso en ManoApp, al aceptar a usted se le asignarán 2 Legados pendientes de $20 para empezar su proceso de activación",
          async () => {
            try {
              let { data } = await Legacies.initialize(this.selectedAccount);
              //window.location.reload()
              this.initialize();
            } catch (e) {
              this.$alertify.console.error(e);
              console.log(e);
            }
          }
        );
    },
    async getNulls() {
      try {
        let { data } = await Legacies.nulls(this.selectedAccount.id);
        this.nullInSet = data.nullInSet;
      } catch (e) {
        console.log(e);
      }
    },
    async getBenefits() {
      try {
        let { data } = await Legacies.benefits(this.selectedAccount.id);
        this.benefits = data.benefits;
      } catch (e) {
        console.log(e);
      }
    },
    async getMemberhips() {
      try {
        let { data } = await Membership.userAccounts();
        this.memberships = data;
      } catch (e) {
        console.log(e);
      }
    },
    async getLinks() {
      try {
        let { data } = await User.getLinks(this.selectedAccount.id);
        this.linksCount = data.length;
      } catch (e) {
        console.log(e);
      }
    },
    setLegaciesNumber(value) {
      this.pendingLegacies = value;
      this.contentLoad = true;
    },
    sayHi() {
      let now = new Date();
      let hour = now.getHours();
      if (hour < 12) {
        this.welcomeText = "Buenos Días";
      } else if (hour >= 18) {
        this.welcomeText = "Buenas Noches";
      } else if (hour >= 12) {
        this.welcomeText = "Buenas Tardes";
      }
    },
    async accountChanged(m) {
      await this.refreshSelected();
      this.initialize();
    },
    async refreshSelected() {
      let { data } = await Membership.findById(this.selectedMembership);
      this.setSelectedAccount(data);
    },
    ...mapActions("user", ["setSelectedAccount"])
  },
  components: {
    pPendingLegacies: () =>
      import("@/components/pending-legacies/PendingLegacies.vue"),
    pPendingSubscriptions: () =>
      import("@/components/subscriptions/Pendings.vue")
  },
  computed: {
    ...mapGetters("user", ["userData", "selectedAccount"])
  },
  watch: {
    $route(to, from) {
      if (to.name == "home/app") {
        this.initialize();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~styles/main.scss";
.waitingEmptyLegacy {
  background: $main-color;
  padding: 20px;
  margin: 10px;
  color: white;
  border-radius: 5px;
  box-shadow: $shadow;
}
.initializeProcess {
  margin: 10px;
  background: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dashboard {
  .account-resume {
    color: white;
    overflow: hidden;
    background: $main-color;
    display: grid;
    grid-template-columns: 1fr;
    a {
      color: white;
      text-decoration: underline;
    }
    .user-data {
      height: 100%;
      display: flex;
      & > * {
        height: 100%;
      }
      .text {
        * {
          margin: 2px 0;
        }
        .welcome {
          font-size: 2em;
          margin-bottom: 5px;
        }
        .details {
          padding: 5px 0;
          display: flex;
          & > * {
            margin-right: 10px;
            padding-right: 20px;
            border-right: 1px solid darken($main-color, 4);
          }
          & > :last-child {
            border-right: none;
          }

          .number {
            font-size: 1.5em;
            font-family: $console-font;
          }
        }
        font-size: 0.7em;
        padding: 10px;
        width: 70%;
      }
      .image {
        width: 30%;
        display: flex;
        padding-top: 15px;
        justify-content: center;
        align-items: flex-start;
        .profile-image {
          height: 80px;
          width: 80px;
          border-radius: 50%;
          background-image: url("~assets/no-photo.png");
          background-position: center;
          background-size: cover;
        }
      }
    }
  }
}
</style>
