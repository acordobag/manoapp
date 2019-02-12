<template lang="pug">
main
  .countdown.al-center(v-if="days === 0 && hours === 0 && minutes === 0 && seconds === 0")
    .txt-red Expirado
  .countdown(v-else)
    .block
      p.digit {{ days | two_digits }}
      p.text d
    .block
      p.digit {{ hours | two_digits }}
      p.text h
    .block
      p.digit {{ minutes | two_digits }}
      p.text m
    .block
      p.digit {{ seconds | two_digits }}
      p.text s
</template>

<script>
import moment from 'moment'

export default {
  mounted() {
    setInterval(() => {
      this.now = Math.trunc((new Date()).getTime() / 1000);
    },1000);
  },
  data() {
    return {
      now: Math.trunc((new Date()).getTime() / 1000)
    }
  },
  props: {
    date: {
      type: String
    }
  },
  computed: {
    dateInMilliseconds() {
      var expitarionDate = new Date(this.date)
      expitarionDate.setHours(expitarionDate.getHours()+48)
      return Math.trunc(Date.parse(expitarionDate) / 1000)
    },
    seconds() {
      return (this.dateInMilliseconds - this.now) % 60;
    },
    minutes() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60) % 60;
    },
    hours() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60) % 24;
    },
    days() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60 / 24);
    }
  },
  filters: {
    two_digits: (value) => {
      if (value < 0) {
        return '00';
      }
      if (value.toString().length <= 1) {
        return `0${value}`;
      }
      return value;
    }
  }
}
</script>

<style lang="scss" scoped>
.countdown{
  display: flex;
  .block{
    margin: 0 1px;
    display: flex;
    .text{
      opacity: .3;
    }
  }
}

.al-center{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>


