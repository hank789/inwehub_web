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
          '2018-03-05 17:48:25',
          '2018-03-04 17:48:25',
          '2018-03-03 17:48:25',
          '2018-03-01 14:03:00',
          '2018-03-01 00:00:00',
          '2018-02-28 08:00:00',
          '2018-02-22 08:00:00'
        ],
        timeNow: '',
        publishTime: '',
        date: '',
        d_days: '',
        d_hours: '',
        d_minutes: '',
        d_seconds: ''
      }
    },
    computed: {
    },
    methods: {
      getDateDiff (dateStr) {
//        this.publishTime = this.getDateTimeStamp(dateStr) / 1000
//        this.timeNow = parseInt(new Date().getTime() / 1000)
//        this.date = new Date(this.publishTime * 1000)
//        var Y = this.date.getFullYear()
//        var M = this.date.getMonth() + 1
//        var D = this.date.getDate()
//        var H = this.date.getHours()
//        var m = this.date.getMinutes()
//        var s = this.date.getSeconds()
//        // 小于10的在前面补0
//        if (M < 10) {
//          M = '0' + M
//        }
//        if (D < 10) {
//          D = '0' + D
//        }
//        if (H < 10) {
//          H = '0' + H
//        }
//        if (m < 10) {
//          m = '0' + m
//        }
//        if (s < 10) {
//          s = '0' + s
//        }
//        var d = this.timeNow - this.publishTime
//       // 计算天数
//        this.d_days = parseInt(d / 86400)
//        this.d_hours = parseInt(d / 3600)
//        this.d_minutes = parseInt(d / 60)
//        this.d_seconds = parseInt(d)
//        if (this.d_days < 0) {
//          return H + ':' + m
//        } else if (this.d_days >= 0 && this.d_days < 1) {
//          return '昨天' + H + ':' + m
//        } else if (this.d_days >= 1 && this.d_days < 2) {
//          return '前天' + H + ':' + m
//        } else {
//          return Y + '-' + M + '-' + D + ' ' + H + ':' + m
//        }
//        //  原始代码
//        if (this.d_days > 0 && this.d_days < 3) {
//          return this.d_days + '天前'
//        } else if (this.d_days <= 0 && this.d_hours > 0) {
//          return this.d_hours + '小时前'
//        } else if (this.d_hours <= 0 && this.d_minutes > 0) {
//          return this.d_minutes + '分钟前'
//        } else if (this.thisd_seconds < 60) {
//          if (this.d_seconds <= 0) {
//            return '刚刚'
//          } else {
//            return this.d_seconds + '秒前'
//          }
//        } else if (this.d_days >= 3 && this.d_days < 30) {
//          return M + '-' + D + ' ' + H + ':' + m
//        } else if (this.d_days >= 30) {
//          return Y + '-' + M + '-' + D + ' ' + H + ':' + m
//        }
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
