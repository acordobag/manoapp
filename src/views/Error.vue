<template lang="pug">
  .main-error
    h1 Error 404
    p La página que buscas no existe.
    .btn(@click="$router.go(-1)") Volver
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    mounted () {
      this.sIsLoading(false)
    },
    methods: {
      ...mapMutations('app', ['sIsLoading'])
    }
  }
</script>

<style lang="scss" scoped>
.main-error {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  *{
    margin: 5px;
  }
  h1{
    font-size: 3em;
  }
}
</style>