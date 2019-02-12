<template lang="pug">
  router-link.legacy(:to="to")
    .amount
      .badge(:class="color") $ {{amount}}
    .data
      .hash.link {{owner.fullName}}
      .timeBack(v-if="!legacy.paid")
        backClock(:date="legacy.assignedAt")
      .timeBack(v-else)
        .p Esperando Confirmación
    .action(:class="color")
      i.fa.fa-angle-right
</template>


<script>
export default {
  props: ['legacy', 'to'],
  data () {
    return {

    }
  },
  computed: {
    owner () {
      return this.legacy.annex.owner
    },
    amount () {
      return this.legacy.annex.type.amount
    },
    color () {
      return {
        red: false,
        green: true
      }
    }
  }
}
</script>


<style lang="scss" scoped>
  .legacy{
    display: grid;
    font-size: .7em;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto;
    grid-template-areas: 'wl data action';
    background: white;
    &:hover{
      cursor: pointer;
      text-decoration: none;
    }
    border-bottom: 1px solid #eee;
    &:last-child{
      border-bottom: none;
    }
    .amount{
      grid-area: wl;
      color: white;
      font-size: .8em;
      display: flex;
      justify-content: center;
      align-items: center;
      .badge{
        padding: 5px;
        border-radius: 4px;
        margin: 5px;
        display: flex;
        flex-direction: column;
        &.green{
          background: green;
        }
        &.red{
          background: red;
        }
      }
    }
    .data{
      grid-area: data;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      grid-template-areas: 'h tb';
      color: black;
      margin-left: 10px;
      &>*{
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .hash{
        grid-area: h;
        font-size: 1.2em;
      }
      .timeBack{
        padding-left: 10px;
        font-size: 1.2em;
        grid-area: tb;
      }
    }
    .action{
      grid-area: action;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      border-right: 3px solid;
      &.red{
        border-color: red;
      }
      &.green{
        border-color: green;
      }
    }
  }
</style>
