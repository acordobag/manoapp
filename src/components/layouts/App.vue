<template lang="pug">
.main-app-layout
  .pre-header
    .social
    .links
      router-link(to="profile").white {{userData.name | capitalize}}
      a.white Salir
  .header
    router-link(:to="{ name: 'home/app' }")
      .logo-mobile
        img(src="~assets/logo-mobile.png")
      .logo
        img(src="~assets/logo.png")

    //-       __    __  __    _    ___ _   _   __  __ _____ _   _ _   _
    //-   ____\ \  |  \/  |  / \  |_ _| \ | | |  \/  | ____| \ | | | | |
    //-  |_____\ \ | |\/| | / _ \  | ||  \| | | |\/| |  _| |  \| | | | |
    //-  |_____/ / | |  | |/ ___ \ | || |\  | | |  | | |___| |\  | |_| |
    //-       /_/  |_|  |_/_/   \_|___|_| \_| |_|  |_|_____|_| \_|\___/

    .nav(v-if="viewToLoad === 'normal'", :class="{'open': isOpen}")
      router-link(:to="{ name: 'home/app' }")
        i.fa.fa-tachometer-alt
        | Inicio
      router-link(:to="{ name: 'annexes' }")
        i.fa.fa-file-contract
        | Anexos
      router-link(:to="{ name: 'documents' }")
        //- .pk-badge.custom-top(data-badge="3")
        i.fa.fa-toolbox
        | Documentos
      router-link(:to="{ name: 'links' }")
        // .pk-badge(data-badge="Nuevo")
        i.fa.fa-handshake
        | Enlaces
      router-link(:to="{ name: 'profile' }")
        i.fa.fa-user
        | Perfil

    //-       __       _    ____  __  __ ___ _   _   __  __ _____ _   _ _   _
    //-   ____\ \     / \  |  _ \|  \/  |_ _| \ | | |  \/  | ____| \ | | | | |
    //-  |_____\ \   / _ \ | | | | |\/| || ||  \| | | |\/| |  _| |  \| | | | |
    //-  |_____/ /  / ___ \| |_| | |  | || || |\  | | |  | | |___| |\  | |_| |
    //-       /_/  /_/   \_|____/|_|  |_|___|_| \_| |_|  |_|_____|_| \_|\___/

    .nav(v-if="viewToLoad === 'admin'", :class="{'open': isOpen}")
      router-link(:to="{ name: 'admin/home' }")
        i.fa.fa-toolbox
        | Inicio
    //-   router-link(:to="{ name: 'admin/contracts' }")
    //-     i.fa.fa-file-contract
    //-     | Contratos
    //-   router-link(:to="{ name: 'admin/stocks' }")
    //-     i.fa.fa-chart-line
    //-     | Stocks
    //-   router-link(:to="{ name: 'admin/money' }")
    //-     i.fa.fa-money-check-alt
    //-     | Dineros
    //-   router-link(:to="{ name: 'maintenance' }")
    //-     i.fa.fa-newspaper
    //-     | Noticias


    .menu-tools
      //- .chat-icon
      //-   .bagde-notifications.pk-badge(v-if="unreadMessages !== 0", :data-badge="unreadMessages")
      //-   router-link(:to="{ name: 'chat' }")
      //-     i.fa.fa-comment

      // NOTIFICACIONES
      .notification-icon(@click="notificationsOpen = !notificationsOpen")
          .bagde-notifications.pk-badge(v-if="notificationNumber !== 0", :data-badge="notificationNumber")
          i.fa.fa-bell

      //- // ADMIN
      router-link(:to="{ name: 'admin/home' }", v-if="viewToLoad !== 'admin' && isAdmin")
        i.fas.fa-toolbox
      router-link(:to="{ name: 'home/app' }", v-if="viewToLoad === 'admin' && isAdmin")
        i.fas.fa-arrow-left

  .notifications-container(:class="(notificationsOpen) ? 'open-notifications' : ''")
    pNotifications(@updateBadge="updateBadge", @hideNotifications="notificationsOpen = false", @close="notificationsOpen = !notificationsOpen")
  .main-content
    router-view
</template>

<script>
import {mapMutations, mapActions, mapGetters} from 'vuex'
import Membership from '@/services/Membership'
import { setTimeout } from 'timers';

export default {
  name: 'AppLayout',
  metaInfo: {
    title: 'Strategic WMP'
  },
  data () {
    return {
      isOpen: false,
      notificationNumber: 0,
      unreadMessages: 0,
      notificationsOpen: false
    }
  },
  mounted () {
    this.initialize()
  },
  beforeUpdate () {
    this.scrollTop()
    this.checkAuth()
  },
  methods: {
    hardRefresh () {
      window.location.reload()
    },
    checkAuth () {
      setTimeout(() => {
        if (!this.isAuth) {
          this.$alertify.okBtn('Entendido').alert('Su sessión expiró, por su seguridad ingrese de nuevo', () => {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            this.setUser({})
            this.setSocket({})
            window.location.reload()
          })
        }
      }, 2000)
    },
    scrollTop () {
      let c = document.documentElement.scrollTop || document.body.scrollTop;
      if (c > 0) {
        window.requestAnimationFrame(this.scrollTop);
        window.scrollTo(0, c - c / 8);
      }
    },
    async initialize () {
      this.handleScrollEvents()
      this.startRealTime()
      this.sIsLoading(false)
    },
    startRealTime () {
      setTimeout(() => {
        this.socket.on('update/user', async () => {
          try {
            let {data} = await Membership.findById(this.selectedAccount.id)
            //localStorage.setItem('selectedAccount', JSON.stringify(data))
            this.setSelectedAccount(data)
          } catch (e) {
            console.log(e)
          }
        })
      }, 100)
    },
    toggleMenu () {
      this.isOpen = !this.isOpen
    },
    updateBadge (data) {
      this.notificationNumber = data
    },
    handleScrollEvents () {
      window.addEventListener('scroll', (e) => {
        let scroll = window.scrollY
        const Header = document.querySelector('.header')
        if (scroll > 1) {
          Header.classList.add('sticky')
        } else {
          Header.classList.remove('sticky')
        }
      })
    },
    ...mapMutations('app', ['sIsLoading']),
    ...mapActions('user', ['setUser', 'setSocket', 'setSelectedAccount'])
  },
  computed: {
    isStaff () {
      return this.userData.permissions !== 'user'
    },
    isAdmin () {
      return (this.userData.permissions === 'admin' || this.userData.permissions === 'superadmin') ? true : false
    },
    viewToLoad () {
      return this.$route.meta.view || 'normal'
    },
    ...mapGetters('user', ['userData', 'socket', 'selectedAccount']),
    ...mapGetters('app', ['isAuth', 'newVersion'])
  },
  components: {
    pNotifications: () => import('@/components/notifications/Notifications.vue')
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/main.scss';

$zindex: 5;
.custom-top{
  top: 10px;
}
.new-version{
  position: absolute;
  left: 0;
  top: 0;
  padding: 20px;
  height: auto;
  width: 100vw;
  background: white;
  color: $main-color;
  z-index: $zindex;
  box-shadow: 0px 0px 10px black;
  .title{
    font-size: 1.3em;
  }
  *{
    margin: 10px;
  }
}

.main-app-layout{
  min-height: 100vh;
  width: 100vw;
  min-width: 320px;
  overflow: hidden;
  //-- Grid
  display: grid;
  //-- grid template
  grid-template-columns: 100%;
  grid-template-rows: 55px 1fr;
  grid-template-areas:
    'header'
    'content';
}

.notifications-container{
  max-height: 100vh;
  height: 100vh;
  width: 100vw;
  transform: translateY(-110vh);
  transition: all .5s;
  background: white;
  position: fixed;
  box-shadow: 0 0 10px black;
  z-index: $zindex;
  overflow: scroll;
}

.open-notifications{
  transform: none;
}

.pre-header{
  grid-area: pre-header;
  background-color: $main-color;
  display: none;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: .8em;
  padding: 0 10px;
  z-index: 2;
  @include pk-media(tablet-landscape-up) {
    padding: 0 70px;
  }
  .social{
    a{
      padding: 5px;
      height: 25px;
      width: 25px;
      color: white;
      transition: all .5s;
      cursor: pointer;
      &:hover{
        text-shadow: 0 0 2px black;
      }
    }
  }
  .links {
    a{
      margin: 0 10px;
      color: white;
    }
  }
}

.header{
  grid-area: header;
  background-color: $main-color;
  display: flex;
  justify-content: space-between;
  z-index: $zindex;
  transition: all .5s;
  color: white;
  padding: 0 10px;
  @include pk-media(tablet-landscape-up) {
    padding: 0 50px;
  }
  &.sticky {
    box-shadow: 0 0 10px black;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 55px;
    z-index: $zindex;
    transition: all .5s;
  }
  .logo-mobile{
    height: 100%;
    padding: 10px;
    img {
      height: 80%;
    }
  }
  .logo{
    display: none;
  }
  .menu-tools{
    display: flex;
    width: auto;
    & > *{
      height: 100%;
      padding: 12.5px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
    }
    a{
      &:hover{
        text-decoration: none;
      }
    }
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .notification-icon, .chat-icon{
      &>*{
        color: white;
      }
      position: relative;
    }

  }
  .nav{
    background: #f7f7f7;
    border-top: 1px solid darken(#eee, 4);
    position: fixed;
    display: flex;
    bottom: 0;
    left: 0;
    height: 60px;
    width: 100vw;
    min-width: 320px;
    justify-content: flex-start;
    align-items: center;
    transition: .5s;
    @include pk-media(tablet-landscape-up) {
      transform: none;
      background: none;
    }
    a {
      height: 100%;
      font-size: .5em;
      display: flex;
      color:gray;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      transition:.5s;
      i{
        font-size: 2em;
        margin: 5px;
      }
      &:hover{
        color: $main-color;
        text-decoration: none;
      }
      &.router-link-exact-active{
        color: $main-color;
      }
    }
    @include pk-media(tablet-landscape-up) {
      position: relative;
      width: auto;
      top: auto;
      left: auto;
      justify-content: flex-end;
      flex-direction: row;
      box-shadow: none;
      height: auto;
      border-top: none;
      a{
        flex: 0 1 auto;
        height: 100%;
        width: 120px;
        color: white;
        border-right: 1px solid #eee;
        border-bottom: none;
        &:last-child{
          border-right: none;
        }
        &:hover {
          color: white;
          background-color: darken($main-color, 9);
          text-decoration: none;
        }

        &.router-link-exact-active{
          color: white;
          background-color: darken($main-color, 9);
        }
      }
    }
  }
}

.main-content{
  grid-area: content;
  padding-bottom: 60px;
  @include pk-media(tablet-landscape-up) {
    padding-bottom: 0;
  }
}

.footer{
  grid-area: footer;
  background-color: $main-color;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: .6em;
  padding: 5px;
  z-index: 1;
  @include pk-media(tablet-landscape-up) {
    padding: 0 50px;
  }
  .links{
    display: flex;
    a{
      flex: 1 1 auto;
      color: white;
      margin: 0 10px;
      &:hover{
        text-decoration: underline;
      }
    }
  }
}


</style>
