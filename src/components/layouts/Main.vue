<template lang="pug">
.main-layout
  .pre-header
    .social
    .links(v-if="!userData.name")
    .links(v-else)
      router-link(:to="{name: 'login'}").white {{userData.name | capitalize}}
  .header
    router-link.logo(:to="{ path: `/` }")
      img(src="~assets/logo-login.png")
    .menu-bars(@click="toggleMenu")
      i.fa.fa-bars(v-if="!isOpen")
      i.fa.fa-times(v-else)
    .overlay-menu(@click="isOpen = !isOpen", v-show="isOpen")
    .nav(:class="{open : isOpen}")
      router-link(v-for="link, index in links", @click.native="toggleMenu", :key="index" ,:to="{ path: `${link.path}` }") {{link.name}}
  .main-content
    router-view
  .footer
    .copyrigth © All Rights Reserved by ManoApp S.A
    .links
      //- router-link(:to="{ path: '/disclaimer' }") Terminos
      //- router-link(:to="{ path: '/privacy' }") Privacidad
      //- router-link(:to="{ path: '/cookies' }") Cookies
  //- .scroll-down
  //-   .circle
  //-     i.fa.fa-angle-down
  //- .scroll-top(@click="scrollTop")
  //-   .circle
  //-     i.fa.fa-angle-up
</template>

<script>
import {mapMutations, mapActions, mapGetters} from 'vuex'

export default {
  metaInfo: {
    title: 'Strategic WMP'
  },
  data () {
    return {
      isOpen: false,
      links: [
        {name: 'Ingresar', path: '/'}
      ]
    }
  },
  mounted () {
    this.initialize()
  },
  beforeUpdate () {
    this.scrollTop()
  },
  methods: {
    scrollTop () {
      let c = document.documentElement.scrollTop || document.body.scrollTop;
      if (c > 0) {
        window.requestAnimationFrame(this.scrollTop);
        window.scrollTo(0, c - c / 8);
      }
    },
    initialize () {
      this.handleScrollEvents()
      this.detectScrollHeight()
      this.sIsLoading(false)
      window.addEventListener('resize', () => {
        this.detectScrollHeight()
      })
    },
    toggleMenu () {
      this.isOpen = !this.isOpen
    },
    detectScrollHeight () {
      let windowH = window.innerHeight
      let contentH = document.querySelector('.main-layout').offsetHeight
      let el = document.querySelector('.scroll-down')
      if (!el) return 
      if (windowH > contentH) {
        el.style.display = 'block'
      } else {
        el.style.display = 'none'
      }
    },
    handleScrollEvents () {
      window.addEventListener('scroll', () => {
          let scrollDown = document.querySelector('.scroll-down')
          let scrollTop = document.querySelector('.scroll-top')
          let scroll = window.scrollY

          if (!scrollDown || !scrollTop) return

          if (scroll > 30) {
            scrollDown.style.display = 'none'
            scrollTop.style.display = 'block'
          } else {
            scrollDown.style.display = 'block'
            scrollTop.style.display = 'none'
          }
          const Header = document.querySelector('.header')
          if (scroll > 30) {
            Header.classList.add('sticky')
          } else {
            Header.classList.remove('sticky')
          }
      })
    },
    ...mapMutations('app', ['sIsLoading']),
    ...mapActions('user', 'setUser')
  },
  computed: {
    ...mapGetters('user', ['userData'])
  },
  watch: {
    '$route' (to, from) {
      setTimeout(() => {
        this.detectScrollHeight()
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/main.scss';

.main-layout{
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  //-- Grid
  display: grid;
  //-- grid template
  grid-template-columns: 100%;
  grid-template-rows: 35px 55px 1fr 25px;
  grid-template-areas:
    'pre-header'
    'header'
    'content'
    'footer'
  ;
}
%circle-template{
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: $main-color;
  border-radius: 20%;
  color: white;
  border: 1px solid white;
}
.scroll-down{
  position: fixed;
  z-index: 2;
  bottom: 20px;
  transform: translate(-50%);
  left: 50%;
  .circle{
    @extend %circle-template;
    animation-name: bounce;
    animation-timing-function: ease-in-out;
    animation-duration: .5s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
}

.scroll-top{
  position: fixed;
  z-index: 9;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  display: none;
  .circle{
    @extend %circle-template;
  }
}

@keyframes bounce {
  from {
    transform: translateY(0) scale(1);
  }
  to {
    transform: translateY(-10px) scale(1.1)
  }
}

.pre-header{
  grid-area: pre-header;
  background-color: $main-color;
  display: flex;
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
  background-color: white;
  display: flex;
  justify-content: space-between;
  z-index: 3;
  transition: all .5s;
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
    z-index: 3;
    background-color: rgba(white, .9);
    transition: all .5s;
  }
  .logo{
    height: 55px;
    padding: 10px;
    img {
      height: 100%;
    }
  }
  .menu-bars{
    display: flex;
    color: $main-color;
    width: 50px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    @include pk-media(tablet-landscape-up) {
      display: none;
    }
  }
  .nav{
    background: white;
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    height: 100vh;
    width: 70vw;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-shadow: 0 0 20px black;
    transition: .5s;
    transform: translateX(-80vw);
    @include pk-media(tablet-landscape-up) {
      transform: none;
      background: none;
    }
    &.open{
      transform: translateX(0)
    }
    a {
      height: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #eee;
      width: 100%;
      transition:.5s;
      &:hover{
        background-color: $main-color;
        text-decoration: none;
        color: white;
      }
      &.router-link-exact-active{
        background-color: $main-color;
        color: white;
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
      a {
        flex: 0 1 auto;
        height: 100%;
        width: 120px;
        border-right: 1px solid #eee;
        border-bottom: none;
        &:last-child{
          border-right: none;
        }
      }
    }
  }
  .overlay-menu{
    background: rgba(253, 253, 253, 0.075);
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    user-select: none;
  }
}

.main-content{
  grid-area: content;
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
