<template>
  <div>
    {{transFormDates(time)}}
  </div>
</template>

<script>
  export default {
    data () {
      return {
        date: '',
        Year: '',
        Month: '',
        Data: '',
        Hours: '',
        Minutes: '',
        Seconds: ''
      }
    },
    props: {
      time: {
        type: String,
        default: ''
      }
    },
    computed: {
    },
    methods: {
      changeFormat (t) {
        t -= 0
        if (t < 10) {
          return ('0' + t)
        } else {
          return (t + '')
        }
      },
      transFormDates (time) {
        // 转化为毫秒数
        var timer = new Date(time).getTime()
        // 当前的毫秒数
        var dataNow = new Date().getTime()
        // 当天的零点时间戳
        var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
        timer += ''
        if (timer.length === 10) {
          timer -= 0
          timer *= 1000
        } else {
          timer -= 0
        }
        // 转化为标准格式
        this.date = new Date(time)
        // 年
        this.Year = this.date.getFullYear()
        // 月
        this.Month = this.date.getMonth() + 1
        // 日
        this.Data = this.date.getDate()
        // 时
        this.Hours = this.changeFormat(this.date.getHours())
        // 分
        this.Minutes = this.changeFormat(this.date.getMinutes())
        // 秒
        this.Seconds = this.changeFormat(this.date.getSeconds())

        if (timer >= timeStamp && timer < dataNow) {
          return this.Hours + ':' + this.Minutes + ':' + this.Seconds
        } else if (timer < timeStamp && timer >= timeStamp - 86400000) {
          return '昨天' + this.Hours + ':' + this.Minutes + ':' + this.Seconds
        } else if (timer < timeStamp - 86400 && timer >= timeStamp - 86400000 * 2) {
          return '前天' + this.Hours + ':' + this.Minutes + ':' + this.Seconds
        } else if (timer < timeStamp - 86400000 * 2) {
          return this.Year + '-' + this.Month + '-' + this.Data + ' ' + this.Hours + ':' + this.Minutes + ':' + this.Seconds
        }
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
