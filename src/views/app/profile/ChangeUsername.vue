<template lang="pug">
  main.change-pass
    //- Pop Window Actions
    .popwindow-tab-actions
      a.link(href="javascript:;", @click="changeUsername") Cambiar
    form#change-password(role='form')
      .pk-data-input
        label Antiguo usuario
        input(type="text", :value="userData.username", disabled)
      .pk-data-input
        label Nuevo usuario
        input(type="text", v-model="newUsername", autocomplete="username", placeholder="NuevoUsuario")
      .check-username
        .txt-small(v-if="newUsername", :class="colorHint", v-html="checkStatus")
</template>

<script>
import User from '@/services/User'
import { mapGetters } from 'vuex';

export default {
  data () {
    return {
      newUsername: null,
      available: null,
      checkStatus: null
    }
  },
  methods: {
    async changeUsername () {
      this.$alertify.confirm(`Seguro que desea cambiar su nombre de usuario de ${this.userData.username} a ${this.newUsername}?`, async () => {
        try {
          await User.username({username: this.newUsername})
          this.$alertify.alert('Felicidades, Se cambio su nombre de usuario correctamente, usted será redirigido a la pantalla de inicio para que ingrese sus nuevas credenciales', () => {
            this.$router.push({ name: 'logout' })
          })
        } catch (e) {
          console.log(e)
        }
      })
    },
    async checkAvailable (username) {
      if (!username) return
      this.checkStatus = 'Verificando disponibilidad...'
      try {
        let {data} = await User.checkUsername(username)
        if (!data) {
          this.available = true
          this.checkStatus = `${this.newUsername} si se encuentra <strong>disponible</strong>!`
        } else {
          this.checkStatus = `${this.newUsername} <strong>no</strong> se encuentra disponible!`
          this.available = false
        }
      } catch (e) {
        if (e.data && e.data.isJoi) {
          this.available = false
          this.checkStatus = 'Su nombre de usuario no cumple con los requisitos indicados. Debe contener entre 8 y 20 caracteres alfanumericos (a-z 0-9)'
        }
      }
    }
  },
  watch: {
    newUsername (newUser) {
      this.newUsername = newUser.toLowerCase()
      this.checkAvailable(newUser)
    }
  },
  computed: {
    colorHint () {
      return {
        'txt-red': this.available === false,
        'txt-green': this.available === true
      }
    },
    ...mapGetters('user', ['userData'])
  }
}
</script>

<style lang="scss" scoped>
  .check-username{
    padding: 10px;
  }
</style>


