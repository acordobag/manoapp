<template lang="pug">
  p 
</template>


<script>
  import {mapActions} from 'vuex'
  export default {
    mounted () {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      this.setUser({})
      this.unsetSocket({})
      this.$router.push({name: 'login'})
    },
    methods: {
      ...mapActions('user', ['setUser', 'unsetSocket'])
    }
  }
</script>
