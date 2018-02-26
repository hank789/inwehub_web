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
    height: 5.4rem;
    /* border-radius:0.4rem;*/
    background: #252525;
    position: fixed;
    opacity: 0.9;
    top: 0;
    z-index: 999;
  }

  .suspend p:nth-of-type(1) {
    float: left;
    margin-left: 2.3rem;
    width: 3rem;
    height: 4.7rem;
    margin-top: 0.7rem;

  }

  .suspend p:nth-of-type(1) svg {
    font-size: 1.8rem;
    color: #FFFFFF;
    margin-top: 1.2rem;
  }

  .suspend p:nth-of-type(2) {
    float: left;
    width: 4rem;
    height: 4rem;
    border-radius: 1.2rem;
    background: #F3F4F6;
    margin-top: 0.7rem;

    text-align: center;
  }

  .suspend p:nth-of-type(2) > svg {
    font-size: 3.4rem;
    margin-top: 0.6rem;
    color: #009fe8;
  }

  .suspend p:nth-of-type(3) {
    width: 9.6rem;
    height: 4.7rem;
    margin-top: 0.7rem;
    margin-left: 1rem;
    /* padding-top: 0.5rem;*/
    float: left;
  }

  .suspend p:nth-of-type(3) > span {
    display: block;
    color: #FFFFFF;
    font-size: 1.2rem;
  }

  .suspend p:nth-of-type(3) > span:nth-of-type(1) {
    font-size: 1.6rem
  }

  .suspend p:nth-of-type(3) > span:nth-of-type(2) {
    margin-top: 0.05rem;
  }

  .suspend a {
    float: right;
    width: 7.6rem;
    height: 3rem;
    border-radius: 0.4rem;
    background: #3c95f9;
    text-align: center;
    line-height: 3rem;
    color: #FFFFFF;
    margin-top: 1.2rem;
    margin-right: 1.05rem;
  }

  /*微信端*/
  .mui-wechat .suspension {
    width: 100%;
    height: 4.9rem;
    position: fixed;
    opacity: 0.9;
    top: 0rem;
    background: #FFFFFF;
    z-index: 997;
    box-shadow: 0rem 0.3rem 0.5rem #b4b4b6;
    -webkit-box-shadow: 0rem 0.3rem 0.5rem #b4b4b6;
    -moz-box-shadow: 0rem 0.3rem 0.5rem #b4b4b6;
  }

  .suspension {
    width: 100%;
    height: 4.9rem;
    position: absolute;
    top: 4.4rem;
    background: #FFFFFF;
    z-index: 997;
    box-shadow: 0rem 0.3rem 0.5rem #b4b4b6;
    -webkit-box-shadow: 0rem 0.3rem 0.5rem #b4b4b6;
    -moz-box-shadow: 0rem 0.3rem 0.5rem #b4b4b6;
  }

  /*.suspension p:nth-of-type(1) {*/
    /*float: left;*/
    /*color: #b4b4b6;*/
    /*margin-left: 2.3rem;*/
    /*margin-top: 1.5rem;*/
    /*margin-right: 2rem;*/
    /*font-size: 1.6rem;*/

  /*}*/

  .suspension p:nth-of-type(1) {
    float: left;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 0.9rem;
    background: #f3f4f6;
    margin-top: 0.7rem;
    text-align: center;
    margin-left: 1.4rem;
  }

  .suspension p:nth-of-type(1) svg {
    font-size: 2.5rem;
    margin-top: 0.6rem;
    color: #009fe8;
  }

  .suspension p:nth-of-type(2) {
    float: left;
    font-size: 1.6rem;
    color: #171616;
    margin-top: 1.4rem;
    margin-left: 1rem;
  }

  .suspension a {
    float: right;
    width: 8.8rem;
    height: 3rem;
    border-radius: 0.4rem;
    background: #3c95f9;
    font-size: 1.4rem;
    color: #FFFFFF;
    text-align: center;
    line-height: 3rem;
    margin-top: 1rem;
    margin-right: 1.4rem;
  }
</style>
