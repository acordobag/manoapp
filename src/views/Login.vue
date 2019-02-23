<template lang="pug">
  .main-login
    transition(name="fade")
      .message(v-show="error")
        .error
          span {{errorMessage}}
    .login-container
      .login-box
        .login-form
          form.form-horizontal(role='form', @submit.prevent="userlogin")
            .title-login
              | Ingreso a plataforma
            .pk-input-group
              label.pk-input-label(for='username')
                | Usuario
              input#username.pk-input.bordered(type='text', v-model="login.username", autocomplete="off", autocapitalize="off", placeholder='Usuario', required='')
            .pk-input-group
              label.pk-input-label(for='password')
                | Contraseña
              input#password.pk-input.bordered(type='password', v-model="login.password", autocomplete="off", autocapitalize="off", placeholder='Contraseña', required='')
            .pk-form-actions
              button.btn.btn-strategic.btn-block(type='submit')
                | Ingresar
            //- .pk-form-actions
              //- .btn.btn-fb.btn-block(@click="fbAuthUser")
              //-   i.fab.fa-facebook-square
              //-   =' '
              //-   | Ingresar con Facebook
            //- p.margin-top-10(href="")
            //-   a(href="#") ¿Olvido su usuario o contraseña?
      .overlay-slideshow
</template>

<script>
import User from '@/services/User'
// Libraries
import * as backstrech from '@/plugins/backstrech'
import {mapMutations, mapState, mapActions} from 'vuex'

// Images
import slide1 from '@/assets/slide-1.jpg'
import slide2 from '@/assets/slide-2.jpg'
import slide3 from '@/assets/slide-3.jpg'

export default {
  data() {
    return {
      login: {
        username: '',
        password: ''
      },
      error: false,
      errorMessage: false
    }
  },
  mounted () {
    this.sIsLoading(true)
    $(".login-container").backstretch([
      slide1,
      slide2,
      slide3
    ], {duration: 4000, fade: 750})
  },
  methods: {
    // fbAuthUser () {
    //   this.sIsLoading(true)
    //   FB.getLoginStatus(response => {
    //     if (response.status === 'connected') {
    //       FB.api('/me',
    //         async (response) => {
    //           let data = {
    //             facebookId: response.id
    //           }
    //           this.fbLogin(data)
    //         }
    //       );
    //     } else {
    //       FB.login(response => {
    //         if (response.status === 'connected') {
    //           let data = {
    //             facebookId: response.authResponse.userID
    //           }
    //           this.fbLogin(data)
    //         } else {
    //           this.$alertify().alert('Debe autorizar a nuestra aplicación para poder acceder a sus datos de Facebook')
    //           this.sIsLoading(false)
    //         }
    //       }, {scope: 'email'})
    //     }
    //   })
    // },
    // async fbLogin (data) {
    //   try {
    //     let res = await Auth.facebookLogin(data)
    //     if (res.data.resultCode) return this.authUser(res)
    //   } catch (e) {
    //     this.loginError(e)
    //   } finally {
    //     this.sIsLoading(false)
    
    //   }
    // },
    async userlogin() {
      this.sIsLoading(true)
      try {
        let {data} =  await User.auth(this.login)
        if (data.resultCode) return this.authUser(data)
      } catch (e) {
        this.loginError(e)
      } finally {
        this.sIsLoading(false)
      }
    },
    authUser (data) {
      let {token, user} = data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      this.setUser(user)
      this.setSocket(user)
      this.$router.push(`/${user.username}`)
    },
    loginError (e) {
      this.error = true
      if(!e.data || !e.data.resultCode) return this.errorMessage = 'Ocurrio un error inesperado, por favor revise su conexión a internet o intente mas tarde'
      switch (e.data.resultCode) {
        case 6:
          this.errorMessage = 'Su usuario o contraseña son incorrectos, revise su información e intente de nuevo'
          break;
        default:
          this.errorMessage = 'Ocurrio un error inesperado, por favor revise su conexión a internet o intente mas tarde'
      }
    },
    ...mapMutations('app', ['sIsLoading']),
    ...mapActions('user', ['setUser', 'setSocket'])
  },
  computed: {
    username () {
      return this.login.username
    },
    ...mapState('app', ['date'])
  },
  watch: {
    username () {
      this.login.username = this.login.username.toLowerCase()
    },
    error () {
      setTimeout(() => {
        this.error = false
      }, 10000);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/main.scss';
.main-login{
  height: 100%;
}

.mainteinance{
  display: flex;
  padding: 40px;
  background: $main-color;
  color: white;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.login-container{
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-box{
    z-index: 2;
    background: white;
    box-shadow: 0 0 10px black;
    height: auto;
    width: 350px;
    .login-logo{
      height: 90px;
      padding: 40px;
      background-image: url('~assets/logo-login.png');
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      border-bottom: 1px solid #eee;
    }
    .login-form{
      padding: 20px;
      .title-login{
        font-size: 1.3em;
        margin-bottom: 5px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
    }
  }
}

// Error message

.message{
  position: fixed;
  display: flex;
  height: auto;
  width: 100vw;
  padding: 10px;
  z-index: 99999;
  .error{
    width: 100%;
    flex: auto;
    background-color: #CD3C3C;
    border-radius: 5px;
    box-shadow: 0 0 10px black;
    color: white;
    padding: 10px;
  }
}

</style>
