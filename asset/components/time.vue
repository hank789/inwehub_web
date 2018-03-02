<template>
  <div>
    <div class="mui-content">
      <p v-for="(item, index) in time">
        {{getDateDiff(item)}}
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        time: [
          '2018-03-02 17:48:25',
          '2018-03-01 14:03:00',
          '2018-03-01 00:00:00',
          '2018-02-28 08:00:00',
          '2018-02-22 08:00:00'
        ]
      }
    },
    computed: {
    },
    methods: {
      getDateDiff (dateStr) {
        var publishTime = this.getDateTimeStamp(dateStr) / 1000
        d_seconds,
        d_minutes,
        d_hours,
        d_hours,
        timeNow = parseInt(new Date().getTime() / 1000),
        d,
        date = new Date(publishTime * 1000),
        Y = date.getFullYear(),
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds()
        // 小于10的在前面补0
        if (M < 10) {
          M = '0' + M
        }
        if (D < 10) {
          D = '0' + D
        }
        if (H < 10) {
          H = '0' + H
        }
        if (m < 10) {
          m = '0' + m
        }
        if (s < 10) {
          s = '0' + s
        }
        d = timeNow - publishTime
        // 天数
        var d_days = parseInt(d / 86400)
        // 小时
        var d_hours = parseInt(d / 3600)
        // 分钟
        var d_minutes = parseInt(d / 60)
        // 秒
        var d_seconds = parseInt(d)
        if (d_days < 1) {
          return H + ':' + m
        } else if (d_days >= 1 && d_days < 2) {
          return '昨天' + H + ':' + m
        } else if (d_days >= 2 && d_days < 3) {
          return '前天' + H + ':' + m
        } else {
          return Y + '-' + M + '-' + D + ' ' + H + ':' + m
        }
      },
      getDateTimeStamp (dateStr) {
        return Date.parse(dateStr.replace(/-/gi, '/'))
      }
    },
    watch: {
    },
    mounted () {
    }
  }

</script>

<style scoped>
  .mui-content{
    background: #ffffff;
  }

</style>
