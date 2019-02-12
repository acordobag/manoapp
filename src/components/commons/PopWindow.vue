<template lang="pug">
  .pop-window-tab(:class='{open: open}')
      .actions
        a.action(href="javascript:;", @click="close")
          i.fa.fa-angle-left
          a {{backButton}}
      .content
        router-view(v-if="$route.query.rn === routerName && type === 'router-link'")
        slot(v-else)
</template>

<script>
export default {
  props: {
    open: {
      default: false
    },
    backButton:{
      type: String,
      default: 'Atras'
    },
    backTo: {
      type: String
    },
    querys: {
      type: Object,
      default: () => {
        return {}
      }
    },
    routerName: {
      type: String
    },
    type: {
      type: String,
      default: 'router-link'
    }
  },
  methods: {
    close () {
      this.$emit('close')

      if (this.type === 'router-link') {
        if (this.backTo) {
          this.$router.push({name: this.backTo, query: this.querys})
        } else {
          this.$router.go(-1)
        }
      } else if (this.backTo) {
        return this.$router.push({name: this.backTo, query: this.querys})
      }
    }
  }
}
</script>


<style lang="scss">
@import '~styles/main.scss';

.pop-window-tab{
  position: fixed;
  top: 0;
  left: 0;
  background: $bg-color;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  transition: all .5s;
  transform: translateX(101vw);
  &.open{
    transform: none;
  }
  .actions{
    display: flex;
    padding: 10px;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    background: #f7f7f7;
    border-bottom: 1px solid $border-color;
    a{
      color: $link-color;
    }
    i{
      margin-right: 5px;
    }
  }
  .content{
    overflow: scroll;
    height: calc(100% - 50px);
  }
}
</style>
