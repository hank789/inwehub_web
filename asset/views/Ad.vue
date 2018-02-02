<template>
  <div>
    <div class="time" @tap.stop.prevent="toHome">
        <span id="micTime">3</span>s 跳过
    </div>
    <img src="../statics/images/time_m@2x.png" class="time_m">
    <img src="../statics/images/time_b@2x.png" class="time_b"/>
  </div>
</template>

<script>
  import { openFullscreen, closeFullscreen } from '../utils/plus'
  export default {
    created () {
      openFullscreen()
    },
    methods: {
      toHome () {
        closeFullscreen()
        this.$router.replace('/home')
      }
    },
    mounted () {
      var endTime = 3  // 倒计时时间
      function setTime () {
        if (endTime < 0) {
          return
        }
        if (document.getElementById('micTime')) {
          document.getElementById('micTime').innerHTML = endTime.toString()
        }
      }
      setTime()
      var intervalObj = setInterval(() => {
        endTime--
        setTime()
        if (endTime < 0) {
          clearInterval(intervalObj)
          this.toHome()
        }
      }, 1000)
    }
  }
</script>

<style scoped="scoped">
  .time {
    width: 83px;
    height: 34px;
    background: rgba(68, 68, 68, 0.68);
    border-radius: 50px;
    text-align: center;
    line-height: 34px;
    font-size: 14px;
    color: #ffffff;
    position: absolute;
    top: 40px;
    right: 16px;
  }
  .time_m{
    position: absolute;
    width:75px;
    top:25%;
    left:0;
    right:0;
    margin: auto;

  }
  .time_b{
    position: fixed;
    width:100%;
    bottom: 0;
  }
</style>
