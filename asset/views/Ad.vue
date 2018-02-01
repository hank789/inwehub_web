<template>
  <div>
    <div class="time">
        <span id="micTime">3</span>s 跳过
    </div>
  </div>
</template>

<script>
  export default {
    created () {
    },
    mounted () {
      var endTime = 3  // 倒计时时间
      function setTime () {
        document.getElementById('micTime').innerHTML = endTime.toString()
      }
      setTime()
      var intervalObj = setInterval(() => {
        endTime--
        setTime()
        if (endTime <= 0) {
          clearInterval(intervalObj)
          window.location.href = 'index.html'
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
    top: 20px;
    right: 16px;
  }
</style>
