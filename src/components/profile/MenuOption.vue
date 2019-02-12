<template lang="pug">
  .pk-app-option
    .icon
      i.fa(:class='iconClass')
    .text {{text}}
    i.fa.fa-angle-right.angle
</template>

<script>
export default {
  props: ['text', 'icon'],
  computed: {
    iconClass () {
      return `fa-${this.icon}`
    }
  }
}
</script>


<style lang="scss" scoped>
@import '~styles/main.scss';
</style>
