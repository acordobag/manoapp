<template lang="pug">
  main
    .popwindow-tab-actions
      a(@click="openNewContact = !openNewContact") Nuevo Contacto
    .no-contacts(v-if="contacts.lenght")
      .padding-20 No hay contactos asociados a su cuenta
      router-link(:to="{name: 'profile/contacts/add', query:{oac: true, op: true}}", @click.native="open = !open").btn.btn-block Añadir Contacto
    .contacts(v-else)
      .padding-20.txt-small Estos contactos son los que ven los usuarios de ManoApp cuando te van a realizar un legado
      .contact(v-for="contact in contacts")
        .data
          .title {{contact.title}}
          .value {{contact.value}}
        .actions-contact
          a(@click="deleteContact(contact.id)")
            i.fa.fa-times
    PopWindow(:open='openNewContact', type='slot', @close="openNewContact = !openNewContact")
      .popwindow-tab-actions
        a(@click="addNewContact") Guardar
      .add-contact
        .padding-10.txt-gray Añade un nuevo contacto para tu cuenta
        .pk-data-input
          label Titulo
          input(type="text", placeholder="Whatsapp, Telefono Fijo, Instagram, etc", v-model="title")
        .pk-data-input
          label Valor 
          input(type="text", placeholder="+1 0101 010101", v-model="value")
</template>

<script>
import User from '@/services/User'
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
      title: null,
      value: null,
      openNewContact: false
    }
  },
  methods: {
    deleteContact (id) {
      this.$alertify.okBtn('Si, Eliminar').confirm('Seguro que desea eliminar este contacto', async () => {
        try {
          let {data} = await User.deleteContact(id)
          this.$alertify.alert('Se eliminó su contacto con éxito!')
        } catch (error) {
          this.$alertify.error('Ocurrio un error eliminando su contacto')
        }
      })
    },
    async addNewContact () {
      try {
        let {data} = await User.createContact({value: this.value, title: this.title})
        this.$alertify.alert('Se añadió su contacto con éxito!')
        this.value = null
        this.title = null
        this.openNewContact = false
      } catch (e) {
        this.$alertify.error('Ocurrio un error procesando su contacto')
      }
    }
  },
  computed: {
    open () {
      return this.$route.query.oac
    },
    contacts () {
      return this.userData.contacts
    },
    ...mapGetters('user', ['userData'])
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/main.scss';

  .no-contacts{
    @include white-box(20px, none);
  }

  .contact{
    display: grid;
    grid-template-columns: 1fr 30px;
    padding: 20px;
    background: white;
    margin: 10px;
    box-shadow: $shadow;
    .actions-contact{
      display: flex;
      justify-content: center;
      align-items: center;
      color: red;
      a{
        padding: 10px;
      }
    }
    .title{
      font-size: 1.2em;
      color: $main-color;
      margin: 5px 5px 5px 0;
    }
    .value {
    }

  }
</style>

