<template lang="pug">
  main
    .pk-tile(v-if="!annexes.length && selectedAccount.status !== 'receiver'")
      .pk-tile-body.padding-20.txt-center No se encontraron Annexos en su cuenta
    .pk-tile(v-if="!annexes.length && selectedAccount.status === 'receiver'")
      .pk-tile-body.activate-annex
        i.fa.fa-handshake
        .padding-20.txt-center  Felicidades {{userData.name}}. Ya puedes activar tu Anexo!
        .btn.btn-block.padding-10(@click="activateAnnex") Activar Anexo
    .pk-tile(v-for="annex in annexes")
      .pk-tile-header.dark
        .pk-tile-title Anexo de {{annex.type.amount | moneyFormat}}
      .pk-tile-body(v-if="annex.legacies")
        .legacies
          pLegacy(
            v-for="legacy in annex.legacies", 
            :legacy="legacy",
            :amount="legacy.amount",
            :to="{name: 'annex/legacy/detail', params: {hash: legacy.hash, id: legacy.id}, query: {o: true}}"
          )
    PopWindow(:open="open")
</template>

<script>
import Annex from '@/services/Annex'
import { mapGetters, mapMutations } from 'vuex';

export default {
  data () {
    return {
      annexes: []
    }
  },
  mounted () {
    this.getAnnexes()
  },
  methods: {
    async activateAnnex () {
      try {      
        let {data} = await Annex.activate(this.selectedAccount)
        if (data.newAnnex) {
          await this.getAnnexes()
        }
      } catch (e) {
        console.log(e)
      }
    },
    async getAnnexes () {
      try {
        let {data} = await Annex.get(this.selectedAccount.id)
        this.annexes = data
      } catch (e) {
        next(e)
      }
    }
  },
  computed: {
    open() {
      return this.$route.query.o
    },
    ...mapGetters('user', ['userData', 'selectedAccount'])
  },
  components: {
    pLegacy: () => import('@/components/annex/Single.vue')
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/main.scss';

.activate-annex{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  i{
    color: $main-color;
    padding: 20;
    font-size: 6em;
  }
}
</style>

