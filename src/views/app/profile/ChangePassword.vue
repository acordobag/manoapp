<template lang="pug">
  main.change-pass
    //- Pop Window Actions
    .popwindow-tab-actions
      a.link(href="javascript:;", @click="changePassword") Guardar
    form#change-password(role='form')
      .pk-data-input
        label Antigua contraseña
        input(type="password", v-model="oldPass", autocomplete="current-password", placeholder="Antigua Contraseña", autocapitalize="off")
      .pk-data-input
        label Nueva contraseña
        input(type="password", v-model="newPass",autocomplete="new-password" placeholder="Nueva Contraseña", autocapitalize="off")
      transition(name="fade")
        .pk-data-input(v-show="newPass")
          label Confirme su contraseña
          input(type="password", v-model="confirmPassword",autocomplete="new-password" placeholder="Confirme su Contraseña", autocapitalize="off")
      transition(name="fade")
        .passwordHint(v-show="passwordCheck.passwordHint", :class="hintStyles") {{passwordCheck.passwordHintMsg}}
</template>

<script>
import passwordChecker from '@/helpers/passwordChecker'
import User from '@/services/User'

export default {
  mixins: [passwordChecker],
  data () {
    return {
      oldPass: '',
      newPass: '',
      confirmPassword: '',
      passwordCheck: {
        passwordHint: false,
        passwordHintMsg: '',
        hintType: null
      },
      timer: null,
      submitReady: false
    }
  },
  methods: {
    async changePassword () {
      if (!this.submitReady) return this.$alertify.alert('Por favor verifique que todos los datos sean correctos')
      try {
        let data = {
          oldPass: this.oldPass,
          newPass: this.newPass
        }
        let {data: result} = await User.password(data)
        this.$alertify.okBtn('Ok').alert('Su contraseña fue actualizada con éxito')
        this.oldPass = ''
        this.newPass = ''
        this.confirmPassword = ''
      } catch (e) {
        if (e.data && e.status === 401) {
          return this.$alertify.alert('Su contraseña no puede ser actualizada en este momento. Por favor verifique que la información proporcionada sea correcta')
        }
        return this.$alertify.error('Ocurrio un error inesperado, por favor intente de nuevo más tarde')
      }
    },
    confirmationPass () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.newPass === '' || this.confirmPassword === '') {
          this.passwordCheck.hintType = null
          this.passwordCheck.passwordHint = false
          this.passwordCheck.passwordHintMsg = ''
        } else if (this.newPass !== this.confirmPassword) {
          this.passwordCheck.hintType = 'error'
          this.passwordCheck.passwordHint = true
          this.passwordCheck.passwordHintMsg = 'Las constraseñas no coinciden'
          this.passwordCheck.submitReady = false
        } else {
          this.passwordCheck.hintType = null
          this.passwordCheck.passwordHintMsg = ''
          this.passwordCheck.passwordHint = false
          this.submitReady = true
        }
      }, 1000);
    }
  },
  watch: {
    newPass (value) {
      let strength = this.passwordChecker(value)
      if (strength === 10) {
        this.passwordCheck.hintType = 'warn'
        this.passwordCheck.passwordHintMsg = 'Su nueva contraseña es muy debil, por favor use una mas segura'
        this.passwordCheck.passwordHint = true
      } else if (strength === 15) {
        this.passwordCheck.hintType = 'warn'
        this.passwordCheck.passwordHintMsg = 'Su nueva contraseña es muy debil, ya que esta dentro de las mas usadas, Por favor utilice una mas segura'
        this.passwordCheck.passwordHint = true
      } else {
        this.passwordCheck.hintType = 'error'
        this.passwordCheck.passwordHintMsg = ''
        this.passwordCheck.passwordHint = false
      }
      if (this.confirmPassword !== '') {
        this.confirmationPass()
      }
    },
    confirmPassword (val) {
      this.confirmationPass()
    }
  },
  computed: {
    hintStyles() {
      return {
        error: this.passwordCheck.hintType === 'error',
        warn: this.passwordCheck.hintType === 'warn'
      }
    }
  }
}
</script>

