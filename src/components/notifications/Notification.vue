<template lang="pug">
  .notification(@click="markAsRead(id, urlTo)", :class="{'unread': status === 'unread'}")
    .icon
      i(:class="icon")
    .title {{title}}
    .notify-content {{message}}
    .date {{fromDate}}
</template>

<script>
import moment from 'moment-timezone'
import {mapState} from 'vuex'
import Notifications from '@/services/Notifications'
export default {
  mounted () {
    this.fromNow()
    setInterval(() => {
      this.fromNow()
    }, 10000)
    this.setIcons()
  },
  data() {
    return {
      fromDate: '',
      icon: ''
    }
  },
  props: {
    id: {
      type: Number
    },
    urlTo: {
      type: String
    },
    title: {
      type: String
    },
    message: {
      type: String
    },
    createdAt: {
      type: String
    },
    type: {
      type: Number
    },
    status: {
      type: String
    }
  },
  methods: {
    async markAsRead (id, url) {
      try {
        if (this.status === 'unread') Notifications.read({id})
        this.$router.push({path: `/${this.userData.username}${url}`})
        this.$emit('hideNotifications')
      } catch (e) {
        console.log(e.data)
      }
    },
    fromNow () {
      let fromDate = this.$options.filters.capitalize(moment(this.createdAt).fromNow())
      this.fromDate = fromDate
    },
    setIcons () {
      switch (this.type) {
        case 5:
          this.icon = 'fab fa-bitcoin'
          break
        case 4:
          this.icon = 'fa fa-file-contract'
          break
        case 3:
          this.icon = 'fa fa-check'
          break
        case 2:
          this.icon = 'fa fa-file-invoice-dollar'
          break
        case 1:
          this.icon = 'fa fa-money-check-alt'
          break
        default:
          this.icon = 'fa fa-bell'
      }
    }
  },
  computed: {
    ...mapState('user', ['socket', 'userData'])
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/main.scss';

.notification{
  color: #606060;
  text-shadow: none;
  width: 100%;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  display: grid;
  padding:  5px;
  font-size: 12px;
  grid-template-columns: 30px 4fr 2fr;
  grid-template-rows: 30px auto auto;
  grid-template-areas:
    'icon title title'
    'content content content'
    '. date date'
  ;
  .icon{
    grid-area: icon;
    display: flex;
    color:$primary-color;
    align-items: center;
    justify-content: center;
  }
  .title{
    grid-area: title;
    display: flex;
    align-items: center;
    color:$primary-color;
    justify-content: flex-start;
  }
  .notify-content{
    padding: 2px 10px;
    grid-area: content;
    display: flex;
    justify-content: flex-start;
  }
  .date{
    font-size: 10px;
    text-align: right;
    padding-right: 10px;
    color:$primary-color;
    grid-area: date;
  }
}
.unread{
  background-color: rgba($primary-color,.15);
  border-bottom: 1px solid white;
}
</style>
