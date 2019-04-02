<template lang="pug">
main.buy-contracts
  //- Ultimos movimientos
  .pk-tile
    .pk-tile-header.dark
      .pk-tile-title Nuevo Enlace
    .pk-tile-body
      h3.control-label(for='isNew')
        | ¿Es un usuario ya registrado?
      label.switch
        input(type="checkbox", v-model="isCurrentUser")
        span.slider.round
      form.form-horizontal(v-if="isCurrentUser", role='form', @submit.prevent="newLink")
        .pk-input-group
          label.control-label(for='email')
            | Email
          input.pk-input.bordered(type="email", placeholder="Email", v-model="email")
        button.btn.btn-strategic.btn-block(type='submit')
          | Enlazar
      form.form-horizontal(v-else, role='form', @submit.prevent="newLink")
        .pk-input-group
          label.control-label(for='name')
            | Nombre
          input.pk-input.bordered(type="text", placeholder="Nombre", v-model="name")
        .pk-input-group
          label.control-label(for='lastname')
            | Apellidos
          input.pk-input.bordered(type="text", placeholder="Apellidos", v-model="lastname")
        .pk-input-group
          label.control-label(for='email')
            | Email
          input.pk-input.bordered(type="email", placeholder="Email", v-model="email")
        .pk-input-group
          label.control-label(for='identification')
            | Identificación
          input.pk-input.bordered(type="text", placeholder="Identificación", v-model="identification")
        .pk-input-group
          label.control-labell País
          select.pk-input.bordered(v-model="countryId")
            option(:value="0", disabled) Seleccione un pais
            option(v-for="country in countries", :value="country.id") {{country.name}}
        button.btn.btn-strategic.btn-block(type='submit')
          | Enlazar
        br 
        br 
        br 
        br
</template>

<script>
import Utils from '@/services/Utils'
import User from '@/services/User'
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
      name: null,
      lastname: null,
      email: null,
      identification: null,
      countryId: 0,
      countries: [],
      isCurrentUser: false
    }
  },
  mounted () {
    this.getCountrysList()
  },
  methods: {
    async getCountrysList () {
      try {
        let {data} = await Utils.getCountries()
        this.countries = data
      } catch (e) {
        console.log(e)
      }
    },
    newLink () {
      let linkData = {
        name: this.name,
        lastname: this.lastname,
        email: this.email,
        countryId: this.countryId,
        identification: this.identification,
        parentId : this.selectedAccount.id,
        isCurrentUser: this.isCurrentUser
      }
      this.$alertify.okBtn('Si, enlazar').confirm(`Seguro que desea enlazar a ${this.name}?.
      Este proceso no puede ser revertido,
      ${this.name} recibirá un correo electrónico a ${this.email} para la confirmación de la cuenta`, async () => {
        try {
          let result = await User.create(linkData)
          this.$alertify.okBtn('Ok').alert('Se creó su enlace correctamente, puedes revisar tus enlaces para confirmarlo', () => {
            this.$router.push({name: 'links'})
          })
        } catch (e) {
          if (e.data.type === 'validation') {
            return this.handleError(e.data)
          }
          return this.$alertify.okBtn('Entendido').alert(e.data.error)
        }
      })
    },
    handleError (e) {
      console.log(e)
      if (e.error) {
        if (e.errors.length) {
          switch (e.errors[0].field) {
            case 'email':
              return this.$alertify.okBtn('Entendido').alert(`Parece que ${this.name} ${this.lastname} ya es parte de nuestro sistema, por favor seleciona la opción de enlazar usuario ya registrado`)
            case 'identification':
              return this.$alertify.okBtn('Entendido').alert(`No se puede enlazar a ${this.name} ${this.lastname} ya que la identifciación ${this.identification} ya se encuentra en nuestra base de datos`)
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters('user', ['userData', 'selectedAccount'])
  },
}
</script>
<style>
.switch {
  margin-top: 10px;
  position: relative;
  display: inline-block;
  width: 45px;
  height: 28px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #712887;
}

input:focus + .slider {
  box-shadow: 0 0 1px #712887;
}

input:checked + .slider:before {
  -webkit-transform: translateX(16px);
  -ms-transform: translateX(16px);
  transform: translateX(16px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
