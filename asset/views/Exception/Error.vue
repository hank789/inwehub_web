<template>
  <div>
    <div class="mui-content absolute">

      <header class="hidewechattitle">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-logowenzi"></use>
        </svg>
      </header>

      <div class="cont">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xitongbengkuimeiyouwangluo"></use>
        </svg>
        <!--<p>这可能是你手机的问题！不是bug！！</p>-->
        <p>{{error}}</p>

      </div>

      <div class="refresh" @tap.stop.prevent="refresh">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shuaxin"></use>
        </svg>
        <p>点击刷新</p>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      error: '您的网络异常！'
    }),
    methods: {
      refresh () {
        window.mui.back()
      }
    },
    created () {
      if (this.$route.query.msg) {
        this.error = this.$route.query.msg
      }
    }
  }
</script>

<style lang="less" scoped>
  div,
  span,
  p,
  ul,
  li,
  i,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /*头部样式*/

  header {
    width: 100%;
    height: 1.173rem;
    background: #f3f4f6;
    text-align: center;
  }

  header svg {
    font-size: 2.133rem;
    color: #3c3e44;
    margin-top: -0.346rem;
  }

  .mui-content {
    background: #FFFFFF;
  }

  .cont {
    width: 100%;
    height: 2.666rem;
    /*background: #CCCCCC;*/
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .cont svg {
    font-size: 1.6rem;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
  }

  .cont p {

    margin-top: 1.866rem;
    font-size: 0.373rem;
    color: #B4B4B6;
    text-align: center;

  }

  .refresh {
    width: 100%;
    height: 1.333rem;
    /*border: 0.026rem solid #CCCCCC;*/
    position: fixed;
    bottom: 0.8rem;
  }

  .refresh svg {
    color: #03aef9;
    font-size: 0.693rem;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
  }

  .refresh p {

    margin-top: 0.8rem;
    font-size: 0.373rem;
    color: #B4B4B6;
    text-align: center;

  }
</style>
