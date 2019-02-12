<template lang="pug">
  main.profile-data
    PopWindow(:open="editPhoto", @close="editPhoto = !editPhoto", backButton="Información Personal")
    .top
      .image-container
        router-link.profile-image(
          :to="{name: 'profile/data/photo'}",
          @click.native="editPhoto = !editPhoto",
          v-if="userData.images && userData.images.profile",
          v-profile-image='userData.images.profile'
        )
          .edit-photo Editar
        router-link.profile-image(:to="{name: 'profile/data/photo'}", @click.native="editPhoto = !editPhoto", v-else)
          .edit-photo Editar
    //pre {{userData}}
    .pk-data-input
      label Numero de Usuario
      input(type="text", v-model="userData.id" disabled)
    .pk-data-input
      label Nombre
      input(type="text", v-model="userData.name" disabled)
    .pk-data-input
      label Apellidos
      input(type="text", v-model="userData.lastname" disabled)
    .pk-data-input
      label Nombre de usuario
      input(type="text", v-model="userData.username" disabled)
    .pk-data-input
      label Correo electrónico
      input(type="text", v-model="userData.email" disabled)
    .pk-setting-title Contactos
    .contacts(v-if="userData.contacts")
      .pk-data-input(v-for="contact in userData.contacts")
        label Teléfono
        input(type="text", :value="contact.value", disabled)
    .no-contacts.padding-20.txt-gray(v-else) No hay contactos asociados
    //- .pk-setting-title Cuentas Conectadas
    // OLD STYLE
    //- .facebook-link(v-if="facebookSDKReady")
    //-   .data-from-facebook(v-if="userData.facebookId && facebookInfo")
    //-     .photo(v-if="facebookInfo.picture", :style="{ 'background-image': 'url(' + facebookInfo.picture.data.url + ')' }")
    //-     .data
    //-       .fb-name {{facebookInfo.name}}
    //-         ='  '
    //-         i.fab.fa-facebook
    //-       .link.text-danger(@click="unlinkFacebookAccount") Eliminar cuenta asociada
    //-   .data(v-else, v-show="facebookSDKReady")
    //-     .data.no-facebook-link No posee cuenta de Facebook enlazada para el inicio de sesión
    //-     .btn.btn-block.btn-fb(@click="authFacebookUser")
    //-       i.fab.fa-facebook-square
    //-       =' '
    //-       | Enlazar cuenta de facebook
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import User from '@/services/User'
import config from '@root/config/vue'
export default {
  data () {
    return {
      editPhoto: false,
      facebookSDKReady: false,
      facebookInfo: null
    }
  },
  async mounted () {
    this.sIsLoading(true)
    this.getUserData()
    if (typeof FB !== 'undefined') {
      await this.getFacebookInfo()
      this.facebookSDKReady = true
    } else {
      window.addEventListener('fb-sdk-ready', async () => {
        await this.getFacebookInfo()
        this.facebookSDKReady = true
      })
    }
  },
  methods: {
    async getUserData () {
      try {
        let {data} = await User.data()
        localStorage.setItem('user', JSON.stringify(data))
        this.setUser(data)
      } catch (e) {
        console.log(e)
      }
    },
    async unlinkFacebookAccount() {
      this.$alertify.okBtn('Si, Eliminar').cancelBtn('No').confirm('¿Seguro que desea eliminar su cuenta de facebook asociada?', async () => {
        let data = {
          facebookId: null
        }
        this.updateFacebookId(data, 'unlink')
      })
    },
    authFacebookUser () {
      FB.getLoginStatus(response => {
        if (response.status === 'connected') {
          FB.api('/me',
            {fields: 'email, name, first_name, last_name, middle_name, picture.width(1500).heigth(1500)'},
            async (response) => {
              let data = {
                name: response.first_name,
                lastname: response.last_name,
                email: response.email,
                facebookId: response.id,
                photo: response.picture.data.url
              }
              // NEW FROM FACEBOOK
              this.updateFacebookId(data, 'link')
            }
          );
        } else {
          FB.login(response => {
            if (response.status === 'connected') {
              FB.api('/me',
                {fields: 'email, name, first_name, last_name, middle_name, picture.width(1500).heigth(1500)'},
                async (response) => {
                  let data = {
                    name: response.first_name,
                    lastname: response.last_name,
                    email: response.email,
                    facebookId: response.id,
                    photo: response.picture.data.url
                  }
                  // NEW FROM FACEBOOK
                  this.updateFacebookId(data, 'link')
                }
              );
            } else {
              this.$alertify().alert('Debe autorizar a nuestra aplicación para poder acceder a sus datos de Facebook')
              this.sIsLoading(false)
            }
          }, {scope: 'email'})
        }
      })
    },
    async updateFacebookId (fbData, type) {
      try {
        let {data} = await User.updateFacebookId(fbData)
        if (data && data.status === 1) {
          let user = window.localStorage.user
          if (user) {
            user = JSON.parse(user)
            user.facebookId = data.facebookId
            window.localStorage.setItem('user', JSON.stringify(user))
            this.setUser(user)
          }
          if(type === 'link') {
            this.$alertify().alert('Su cuenta de facebook fue enlazada correctamente.', () => {
              this.getFacebookInfo()
            })
          } else {
            this.$alertify().alert('Su cuenta de facebook fue eliminada correctamente.', () => {
              this.getFacebookInfo()
            })
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    getFacebookInfo () {
      try {
        if(this.userData.facebookId) {
          FB.api(`/${this.userData.facebookId}?fields=id,name,picture.width(800).heigth(800)&access_token=${config.FB_ACCESS_TOKEN}`,
            async response => {
              this.facebookInfo = response
            }
          )
        }
      } catch (e){
        console.log(e)
      } finally {
        this.sIsLoading(false)
      }
    },
    ...mapActions('user', ['setUser']),
    ...mapMutations('app', ['sIsLoading'])
  },
  computed: {
    ...mapGetters('user', ['userData'])
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/main.scss';
  .top{
    height: 100px;
    margin-bottom: 80px;
    position: relative;
    background: $main-color;
    .image-container{
      position: absolute;
      height: 140px;
      left: 0;
      bottom: -70px;
      width: 100vw;
      display: flex;
      justify-content: center;
      align-items: center;
      .profile-image{
        background-image: url('~assets/no-photo.png');
        border-radius: 50%;
        border: 3px solid white;
        background-position: center;
        background-size: cover;
        height: 130px;
        width: 130px;
        box-shadow: 0 0 5px rgb(58, 58, 58);
        position: relative;
        overflow: hidden;
        &:hover .edit-photo{
          opacity: 1;
        }
        .edit-photo{
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
          border-radius: 50%;
          color: white;
          transition: .5s;
          cursor: pointer;
          background: rgba(0, 0, 0, .8);
          opacity: 0;
        }
      }
    }
  }

.title{
  margin: 10px 0;
  padding: 10px;
  font-size: 1.1em;
  color: $custom-gray;
}

.facebook-link{
  background: white;
  padding: 10px;
}

.data-from-facebook{
  display: flex;
  .photo{
    width: 50px;
    height: 50px;
    margin-right: 20px;
    background-position:center;
    background-size: cover;
    border-radius: 50%;
  }
  .data{
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .fb-name{
    font-size: 1.1em;
    i{
      margin-left: 10px;
    }
  }
  .link{
    &:hover{
      text-decoration: underline;
      cursor: pointer;
    }
  }
  &>*{
    flex: 0 1 auto;
  }
}
.no-facebook-link{
  margin: 10px 0;
}
</style>
