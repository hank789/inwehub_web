<template>
  <div>
    <div class="mui-content">
      <div style="background-color: #fff"></div>
      <div class="time" @tap.stop.prevent="toHome">
          <span id="micTime">3</span>s 跳过
      </div>
      <div class="time_t"></div>
      <div class="time_b">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-inwehubzuoyou"></use>
        </svg>
        <p>最具品质的咨询顾问社区</p>
      </div>
    </div>
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
  .mui-content{
    background-color: #f3f4f6;
  }
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
  .time_t{
    width: 100%;
    height: 80%;
    background: url("../statics/images/time@2x.png");
    background-size: cover;
    background-position: center;
  }
  .time_b{
    width:100%;
    height:20%;
    text-align: center;
    position: relative;
  }
  .time_b svg{
    font-size: 120px;
    position: absolute;
    left: 0;
    right: 0;
    top:-25px;
    margin: auto;
  }
  .time_b p{
    text-align: center;
    font-size: 14px;
    color: #747576;
    position: absolute;
    top: 55px;
    left: 0;
    right: 0;
    margin: auto;
  }
  .immersed20 .time{
    top:0;
  }
</style>
