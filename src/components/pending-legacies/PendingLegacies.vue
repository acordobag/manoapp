<template lang="pug">
  .pk-tile
    .pk-tile-header.dark
      .pk-tile-title
        p Legados pendientes
    .pk-tile-body
      .pendings(v-if="legacies.length")
        pLegacy(
          v-for="legacy in legacies", 
          :legacy="legacy",
          :to="{name: 'legacy/detail', params: {hash: legacy.hash, id: legacy.id}, query: {os: true}}"
        )
      p.padding-20.txt-center(v-else) No tienes legados pendientes
</template>

<script>
import Legacies from '@/services/Legacies'
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
      legacies: []
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {
      this.getLegacies()
      this.startRealTime()
    },
    startRealTime () {
      setTimeout(() => {
        this.socket.on('update/legacies', () => {
          this.getLegacies()
        })
      }, 100);
    },
    async getLegacies () {
      try {
        let {data} = await Legacies.pending(this.selectedAccount.id)
        this.$emit('setLegaciesNumber', data.length)
        this.legacies = data
      } catch (e) {
        console.log(data)
      }
    }
  },
  computed: {
    ...mapGetters('user', ['socket', 'selectedAccount'])
  },
  components: {
    pLegacy: () => import('@/components/pending-legacies/Single.vue')
  }
}
</script>

<style lang="scss" scoped>

</style>
