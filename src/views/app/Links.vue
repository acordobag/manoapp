<template lang="pug">
  .pk-tile
    .pk-tile-header.dark
      .pk-tile-title Sus Enlaces
      .pk-tile-actions
        router-link.btn.btn-white.btn-small(v-if="userData.status !== 'confirmed' && userData.status !== 'subscriber'" ,:to="{name: 'newLink', query: {o: true}}") Enlazar
    .pk-tile-body(v-if="userData.status === 'confirmed' || userData.status === 'subscriber'")
      .padding-20.txt.center
        p Aún no puedes enlazar amigos, primero debes realizar tus legados para empezar a crear tu comunidad de ayuda
    .pk-tile-body(v-else)
      .links(v-if="links.length")
        .link-person(v-for="link in links")
          .photo
            .profile-image(v-if="link.images && link.images.profile", v-profile-image='userData.images.profile')
            .profile-image(v-else)
          .data
            .name.txt-center {{link.fullName}} ({{link.id}})
            .email.txt-center {{link.email}}
            .username.txt-center Usuario: {{link.username}}
            .status.txt-center(:class="setColors(link.status)") {{setStatus(link.status)}}
            .country.txt-center {{link.country.name}}
      .no-links(v-else)
        .padding-30.txt-center No tienes ningun enlace
          br
          router-link.link(:to="{name: 'newLink', query: {o: true}}") Enlaza un amigo
      //- pre {{links}}
    PopWindow(:open="open", backButton="Enlaces")
</template>


<script>
import User from '@/services/User'
import { mapGetters } from 'vuex';

export default {
  data () {
    return {
      links: []
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {
      this.getLinks()
    },
    async getLinks () {
      try {
        let {data} = await User.getLinks()
        this.links = data
      } catch (e) {
        console.log(e)
      }
    },
    setColors (val) {
      switch (val) {
        case 'created':
          return {'txt-orange': true}
        case 'giver':
          return {'txt-cyan': true}
        case 'confirmed':
          return {'txt-green': true}
        case 'active':
          return {'txt-blue': true}
        case 'receiver':
          return {'txt-manoapp': true}
      }
    },
    setStatus (val) {
      switch (val) {
        case 'created':
          return 'Sin Confirmar'
        case 'giver':
          return 'Legador'
        case 'confirmed':
          return 'Confirmada'
        case 'active':
          return 'Activo'
        case 'receiver':
          return 'Receptor'
      }
    }
  },
  computed: {
    open () {
      return this.$route.query.o
    },
    ...mapGetters('user', ['userData'])
  },
  watch: {
    '$route' (to, from) {
      this.initialize()
    }
  }
}
</script>

<style lang="scss" scoped>
  .links{
    display: flex;
    flex-wrap: wrap;
  }
  .link-person{
    font-size: .8em;
    margin: 10px;
    background: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    width: 44%;
    .photo{
      height: 140px;
      width: 100%;
      .profile-image{
        height: 140px;
        width: auto;
        background-image: url('~assets/no-photo.png');
        background-position: center;
        background-size: cover;
      }
    }
    .data{
      *{
        margin: 2px;
      }
      .name{
        font-size: 1.2em;
        color: blue;
      }
      padding: 5px;
    }
  }
</style>
