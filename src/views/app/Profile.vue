<template lang="pug">
  main.profile
    .profile-menu
      router-link(:to="{name: 'profile/data', query:{op: true}}", @click.native="open = !open")
        pMenuOption(text="Información Personal", icon="user")
      router-link(:to="{name: 'profile/contacts', query:{op: true}}", @click.native="open = !open")
        pMenuOption(text="Contactos", icon="mobile-alt")
      //- router-link(:to="{name: 'profile/accounts', query:{op: true}}", @click.native="open = !open")
      //-   pMenuOption(text="Cuentas", icon="university")
      router-link(:to="{name: 'profile/settings', query:{op: true}}", @click.native="open = !open")
        pMenuOption(text="Configuraciones", icon="cog")
      a(href="javascript:;", @click="logout")
        pMenuOption(text="Cerrar Sesión", icon="sign-out-alt")
      PopWindow(:open="open", @close="open = !open", backButton="Perfil")
    .txt-center.version ManoApp Develop by PulseKreative - App Version {{version}}
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {version} from '@root/package.json'
export default {
  mounted () {
    this.initialize()
  },
  data () {
    return {
      version,
      open: false
    }
  },
  methods: {
    initialize () {
      let {op: open} = this.$route.query
      setTimeout(() => {
        this.open = (open === 'true' || open === true) ? true : false
      }, 200);
    },
    logout () {
      this.$alertify.okBtn('Si, Salir').cancelBtn('No').confirm('¿Seguro que desea salir?', () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        this.setUser({})
        this.unsetSocket({})
        this.$router.push({name: 'login'})
      })
    },
    ...mapActions('user', ['setUser', 'unsetSocket'])
  },
  computed: {
    ...mapGetters('user', ['userData', 'socket'])
  },
  components: {
    pMenuOption: () => import('@/components/profile/MenuOption.vue')
  }
}
</script>

<style lang="scss">
@import '~styles/main.scss';

.profile-menu{
  a{
    &:hover{
      text-decoration: none;
    }
  }
}
.version{
  font-size: .7em;
}
</style>
