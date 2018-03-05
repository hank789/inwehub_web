<template>
  <div>
    <!--手机端-->
    <div class="suspend" v-if="isH5">
      <p>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="close('isH5')">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
      </p>
      <p>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-logotuxing"></use>
        </svg>
      </p>
      <p>
        <span>下载APP</span>
        <span>查看更多专家信息</span>
      </p>
      <p>
        <a id="btnOpenAppH5" :href="url" target="_blank">立即打开</a>
      </p>
    </div>

    <!--微信端-->
    <div class="suspension" v-if="isWeixin">
      <!--<p>-->
        <!--<svg class= "icon" aria-hidden="true" @tap.stop.prevent="close('isWeixin')">-->
          <!--<use xlink:href="#icon-guanbi"></use>-->
        <!--</svg>-->
      <!--</p>-->
      <p @tap.stop.prevent="$router.push('/home')">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-logotuxing"></use>
        </svg>
      </p>
      <p @tap.stop.prevent="$router.push('/home')">首页</p>
      <p><a id="btnOpenAppWeixin" :href="url" target="_blank">APP内打开</a></p>
    </div>
  </div>
</template>

<script type="text/javascript">
  /* eslint no-unused-vars: ["error", { "varsIgnorePattern": "link" }] */

  import localEvent from '../stores/sessionStorage'

  export default {
    created () {
      this.showOpenApp()
    },
    mounted () {
      var mlink = 'https://adsolj.mlinks.cc/' + process.env.DEEP_LINK_KEY

      var Mlink = null

      if (this.isH5) {
        // 深度链接
        Mlink = new window.Mlink({
          mlink: mlink + '?name=1', // 短链地址
          button: document.querySelector('a#btnOpenAppH5'),
          params: {url: 'test'},
          cparams: {path: 'my'}
        })
      }

      if (this.isWeixin) {
        // 深度链接
        Mlink = new window.Mlink({
          mlink: mlink + '?name=2', // 短链地址
          button: document.querySelector('a#btnOpenAppWeixin'),
          params: {url: 'test'},
          cparams: {path: 'my'}
        })
      }
    },
    watch: {
      $route () {
        if (this.$route.path === '/share/resume') {
          this.check()
        } else {
          this.showOpenApp()
        }
      }
    },
    methods: {
      stopShowOpenApp () {
        if (this.$route.path === '/invitation/image') {
          return true
        }
        var stopShowOpenApp = localEvent.getLocalItem('stopShowOpenApp')
        if (stopShowOpenApp.stop && stopShowOpenApp.stop === true) {
          return true
        }
        return false
      },
      showOpenApp () {
        var isStop = this.stopShowOpenApp()
        if (!isStop) {
          // 显示
          this.check()
        } else {
          // 不显示
          this.hideOpenApp()
        }
      },
      hideOpenApp () {
        this.isWeixin = false
        this.isH5 = false
        document.body.classList.remove('openAppWechat')
        document.body.classList.remove('openAppH5')
      },
      check () {
        if (!window.mui.os.plus) {
          if (window.__wxjs_environment === 'miniprogram') {
            this.isWeixin = false
            this.isH5 = false
          } else if (window.mui.os.wechat) {
            this.isWeixin = true
            document.body.classList.add('openAppWechat')
          } else {
            document.body.classList.add('openAppH5')
            this.isH5 = true
          }
        }
      },
      close (type) {
        if (this.$route.path === '/share/resume') {
          return false
        }

        switch (type) {
          case 'isWeixin':
            this.isWeixin = false
            localEvent.setLocalItem('stopShowOpenApp', {stop: true})
            document.body.classList.remove('openAppWechat')

            var iframe = document.querySelector('#show-iframe')
            if (iframe) {
              var height = parseInt(iframe.style.height)
              iframe.style.height = (height + 49) + 'px'
            }

            break
          case 'isH5':
            this.isH5 = false
            localEvent.setLocalItem('stopShowOpenApp', {stop: true})
            document.body.classList.remove('openAppH5')
            break
        }
      }
    },
    data () {
      return {
        url: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.inwehub.InwehubApp',
        isWeixin: false,
        isH5: false
      }
    }
  }
</script>

<style scoped="scoped">
  /*手机端*/
  .suspend {
    width: 100%;
    height: 1.44rem;
    /* border-radius:0.106rem;*/
    background: #252525;
    position: fixed;
    opacity: 0.9;
    top: 0;
    z-index: 999;
  }

  .suspend p:nth-of-type(1) {
    float: left;
    margin-left: 0.613rem;
    width: 0.8rem;
    height: 1.253rem;
    margin-top: 0.186rem;

  }

  .suspend p:nth-of-type(1) svg {
    font-size: 0.48rem;
    color: #FFFFFF;
    margin-top: 0.32rem;
  }

  .suspend p:nth-of-type(2) {
    float: left;
    width: 1.066rem;
    height: 1.066rem;
    border-radius: 0.32rem;
    background: #F3F4F6;
    margin-top: 0.186rem;

    text-align: center;
  }

  .suspend p:nth-of-type(2) > svg {
    font-size: 0.906rem;
    margin-top: 0.16rem;
    color: #009fe8;
  }

  .suspend p:nth-of-type(3) {
    width: 2.56rem;
    height: 1.253rem;
    margin-top: 0.186rem;
    margin-left: 0.266rem;
    /* padding-top: 0.133rem;*/
    float: left;
  }

  .suspend p:nth-of-type(3) > span {
    display: block;
    color: #FFFFFF;
    font-size: 0.32rem;
  }

  .suspend p:nth-of-type(3) > span:nth-of-type(1) {
    font-size: 0.426rem
  }

  .suspend p:nth-of-type(3) > span:nth-of-type(2) {
    margin-top: 0.013rem;
  }

  .suspend a {
    float: right;
    width: 2.026rem;
    height: 0.8rem;
    border-radius: 0.106rem;
    background: #3c95f9;
    text-align: center;
    line-height: 0.8rem;
    color: #FFFFFF;
    margin-top: 0.32rem;
    margin-right: 0.28rem;
  }

  /*微信端*/
  .mui-wechat .suspension {
    width: 100%;
    height: 1.306rem;
    position: fixed;
    opacity: 0.9;
    top: 0rem;
    background: #FFFFFF;
    z-index: 997;
    box-shadow: 0rem 0.08rem 0.133rem #b4b4b6;
    -webkit-box-shadow: 0rem 0.08rem 0.133rem #b4b4b6;
    -moz-box-shadow: 0rem 0.08rem 0.133rem #b4b4b6;
  }

  .suspension {
    width: 100%;
    height: 1.306rem;
    position: absolute;
    top: 1.173rem;
    background: #FFFFFF;
    z-index: 997;
    box-shadow: 0rem 0.08rem 0.133rem #b4b4b6;
    -webkit-box-shadow: 0rem 0.08rem 0.133rem #b4b4b6;
    -moz-box-shadow: 0rem 0.08rem 0.133rem #b4b4b6;
  }

  /*.suspension p:nth-of-type(1) {*/
    /*float: left;*/
    /*color: #b4b4b6;*/
    /*margin-left: 0.613rem;*/
    /*margin-top: 0.4rem;*/
    /*margin-right: 0.533rem;*/
    /*font-size: 0.426rem;*/

  /*}*/

  .suspension p:nth-of-type(1) {
    float: left;
    width: 0.933rem;
    height: 0.933rem;
    border-radius: 0.24rem;
    background: #f3f4f6;
    margin-top: 0.186rem;
    text-align: center;
    margin-left: 0.373rem;
  }

  .suspension p:nth-of-type(1) svg {
    font-size: 0.666rem;
    margin-top: 0.16rem;
    color: #009fe8;
  }

  .suspension p:nth-of-type(2) {
    float: left;
    font-size: 0.426rem;
    color: #171616;
    margin-top: 0.373rem;
    margin-left: 0.266rem;
  }

  .suspension a {
    float: right;
    width: 2.346rem;
    height: 0.8rem;
    border-radius: 0.106rem;
    background: #3c95f9;
    font-size: 0.373rem;
    color: #FFFFFF;
    text-align: center;
    line-height: 0.8rem;
    margin-top: 0.266rem;
    margin-right: 0.373rem;
  }
</style>
