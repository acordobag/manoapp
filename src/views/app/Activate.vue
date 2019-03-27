<template lang="pug">
  main.activate
    transition(name="fade")
      .step-1
        .title ¡Casi listo {{userData.name | capitalize}}!
        .text.
          Ya casi tienes acceso a tu cuenta, para eso necesitamos que nos indiques que estás de acuerdo con nuestros terminos y condiciones
          de uso de nuestra aplicación, al hacer click en el siguiente enlace usted acepta que leyó y comprendió los terminos y condiciones
        .pk-spacer
        .btn.btn-white(@click="confirmAccount") Acepto Terminos y Condiciones
    .cancel-process
      .link.white(@click="cancelProcess") Cancelar Proceso
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Auth from '@/services/Auth'
import User from '@/services/User'
import Membership from '@/services/Membership'

export default {
  data () {
    return {
    }
  },
  async mounted () {
  },
  methods: {
    async checkToken () {
      try {
        await Auth.token()
      } catch (e) {
        this.$router.push({name: 'logout'})
      }
    },
    cancelProcess() {
      this.$alertify.confirm('¿Seguro que desea cancelar el proceso de activación? Si lo hace no tendrá acceso a su cuenta', () => {
        this.$router.push({name: 'logout'})
      })
    },
    async confirmAccount() {
      try {
        let {data} = await Membership.confirm(this.selectedAccount)
        if (data.membership.status === 'confirmed') {
          this.$alertify.alert('Felicidades, su cuenta fue confirmada con éxito!', () => {
            this.setSelectedAccount(data.membership)
            this.setUser(data.owner)
            this.$router.push({name: 'home/app'})
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    ...mapActions('user', ['setSelectedAccount', 'setUser'])
   },
   computed: {
     ...mapGetters('user', ['userData', 'selectedAccount'])
   },
   watch: {
     phoneNumber(val)  {
       if (this.$route.query.phone) return this.phoneNumber = this.$route.query.phone
       this.phoneNumber = val.replace(/[^0-9+!]+/g, '')
     },
     '$route' () {
       this.step = this.$route.query.s || 1
     }
   }
}
</script>

<style lang="scss" scoped>
@import '~styles/_variables';
  .cancel-process{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100vw;
    padding: 20px;
    border-top: 1px solid darken($main-color, 7) ;
    display: flex;
    justify-content: center;
    align-items: center;
  }

 .activate{
   height: 100vh;
   width: 100vw;
   background: $main-color;
   display: flex;
   justify-content: center;
   flex-direction: column;
   align-items: center;
   overflow: hidden;
   padding: 20px;
   color: white;
 }
 .title{
   font-size: 1.3em;
   margin: 10px;
 }
 .text{
   font-size: .9em;
   text-align: center;
 }
 .input{
   margin: 10px 0;
 }

  [class^='step-'] {
    display: flex;
    padding: 20px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
  }
</style>
