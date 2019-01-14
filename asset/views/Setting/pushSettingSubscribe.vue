<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">订阅热点推荐</h1>
    </header>
    <div class="mui-content">
      <div class="notice_b">
        APP推送
        <Switches type-bold="true" theme="custom" color="blue"></Switches>
        <i class="bot"></i>
      </div>
      <div class="notice_b">
        邮件订阅<span class="Email">zmysddh@163.com</span>
        <Switches type-bold="true" theme="custom" color="blue"></Switches>
        <i class="bot"></i>
      </div>
      <div class="notice_b">
        微信订阅
        <Switches type-bold="true" theme="custom" color="blue"></Switches>
        <i class="bot"></i>
      </div>
    </div>
  </div>

</template>

<script>
  import Switches from 'vue-switches'
  export default {
    data () {
      return {}
    },
    components: {
      Switches
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;
  }
  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .notice_b {
    width: 100%;
    height: 1.173rem;
    line-height: 1.173rem;
    font-size: 0.373rem;
    padding: 0 16px;
    position: relative;
    .mui-switch {
      float: right;
      margin-top: 0.186rem;
    }
    span {
      color: #808080;
    }
    .Email {
      color: #03AEF9;
      margin-left: 10px;
    }
  }

  .vue-switcher{
    float: right;
    top: 0.453rem;
  }
</style>
