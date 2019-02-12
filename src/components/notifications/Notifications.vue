<template lang="pug">
  main
    //- pre {{this.$data}}
    .close
      a(@click="$emit('close')").link-white Cerrar
    .notifications(v-if="notifications.length > 0")
      pNotification(
        v-for="notification in notifications"
        :id="notification.id",
        :key="notification.id",
        :urlTo="notification.url",
        :title="notification.title",
        :message="notification.message",
        :status="notification.status",
        :type="notification.type",
        :createdAt="notification.createdAt",
        @hideNotifications="$emit('hideNotifications')"
      )
    .notifications.no-notifications(v-else) No tienes notificaciones
</template>

<script>
import {mapState} from 'vuex'
import pNotification from '@/components/notifications/Notification.vue'
import Notifications from '@/services/Notifications'

export default {
  data () {
    return {
      notifications: []
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {
      setTimeout(() => {
        this.listenNotifications()
      }, 1000)
      this.getNotifications()
    },
    listenNotifications () {
      this.socket.on('newNotification', notification => {
        this.$iziToast.show({
          title: notification.title,
          message: notification.message,
          backgroundColor: '#004F88'
        })
      })

      this.socket.on('update/notifications', () => {
        this.getNotifications()
      })
    },
    async getNotifications () {
      try {
        let {data} = await Notifications.get()
        let {notifications, unread} = data
        this.notifications = notifications
        this.$emit('updateBadge', unread)
      } catch (e) {
        console.log(e)
      }
    }
  },
  components: {
    pNotification
  },
  computed: {
    ...mapState('user', ['socket'])
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/main.scss';
.close{
  display: flex;
  justify-content: flex-end;
  width: 100vw;
  height: 40px;
  border-bottom: 1px solid #eee;
  position: fixed;
  padding: 10px;
  background: $main-color;
  color: white;
}
.notifications{
  padding-top: 40px;
}
.no-notifications{
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
