<template lang="pug">
main.settings
  router-link.pk-app-option(:to="{name: 'profile/settings/changePassword', query: {oc: true, op: true}}")
    .text Cambiar Contraseña
    i.fa.fa-angle-right.angle
  router-link.pk-app-option(:to="{name: 'profile/settings/changeUsername', query: {oc: true, op: true}}")
    .text Cambiar Usuario
    i.fa.fa-angle-right.angle
  PopWindow(:open="open", backButton="Configuraciones")
</template>

<script>
import Setting from '@/services/Setting'
import {mapGetters} from 'vuex'
export default {
  methods: {
    async updateSetting (field, value) {
      try {
        let setting = await Setting.update({field, value})
      } catch (e) {
        console.log(e)
      }
    }
  },
  computed: {
    open () {
      return this.$route.query.oc
    },
    ...mapGetters('user', ['userData'])
  }
}
</script>


<style lang="scss" scoped>
@import '~styles/_variables.scss';

</style>
