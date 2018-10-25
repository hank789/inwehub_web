<template>
  <div>
    <!--手机端-->
    <!--<div class="suspend" v-if="isH5">-->
      <!--<p>-->
        <!--<svg class="icon" aria-hidden="true" @tap.stop.prevent="close('isH5')">-->
          <!--<use xlink:href="#icon-guanbi"></use>-->
        <!--</svg>-->
      <!--</p>-->
      <!--<p>-->
        <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-logotuxing"></use>-->
        <!--</svg>-->
      <!--</p>-->
      <!--<p>-->
        <!--<span>下载APP</span>-->
        <!--<span>查看更多专家信息</span>-->
      <!--</p>-->
      <!--<p>-->
        <!--<a id="btnOpenAppH5" :href="url" target="_blank">立即打开</a>-->
      <!--</p>-->
    <!--</div>-->

    <!--微信端-->

    <div id="OpenAppSlider" class="homeMuiSlider mui-slider" v-if="isWeixin || isH5">
      <div class="mui-slider-group  mui-slider-loop">
        <div class="mui-slider-item mui-slider-item-duplicate">

          <div class="suspension backgroundGrey" v-if="shareUuid">
            <div class="component-wechat-top">
              <div class="left" @tap.stop.prevent="$router.push('/home')">
                <div class="userImg">
                  <img :src="shareInfo.avatar_url" alt="">
                </div>
                <div class="userName">{{shareInfo.name}}</div>
                <div class="desc userSlogen">我觉得InweHub不错，推荐你试试</div>
              </div>
              <div class="right"><a class="downloadApp AppFour1" :href="url" target="_blank" @tap.stop.prevent="downloadApp">下载APP</a></div>
            </div>
          </div>

          <div class="mui-slider-item" v-else>
            <div class="suspension">
              <div class="component-wechat-top">
                <div class="left" @tap.stop.prevent="$router.push('/home')">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-logotuxing"></use>
                  </svg>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-logowenzi"></use>
                  </svg>
                  <div class="desc">聚焦行业解决方案，共筑人脉圈子</div>
                </div>
                <div class="right"><a class="downloadApp AppThree" :href="url" target="_blank" @tap.stop.prevent="downloadApp">下载APP</a></div>
              </div>
            </div>
          </div>

        </div>
        <div class="mui-slider-item">
          <div class="suspension">
            <div class="component-wechat-top">
              <div class="left" @tap.stop.prevent="$router.push('/home')">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-logotuxing"></use>
                </svg>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-logowenzi"></use>
                </svg>
                <div class="desc">企业级应用＆服务广场</div>
              </div>
              <div class="right"><a class="downloadApp AppOne" :href="url" target="_blank" @tap.stop.prevent="downloadApp">下载APP</a></div>
            </div>
          </div>
        </div>
        <div class="mui-slider-item">
          <div class="suspension backgroundGrey">
            <div class="component-wechat-top">
              <div class="left" @tap.stop.prevent="$router.push('/home')">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-logotuxing"></use>
                </svg>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-logowenzi"></use>
                </svg>
                <div class="desc">追踪每日企服行业新热点</div>
              </div>
              <div class="right"><a class="downloadApp AppTwo" :href="url" target="_blank" @tap.stop.prevent="downloadApp">下载APP</a></div>
            </div>
          </div>
        </div>

        <div class="mui-slider-item">
          <div class="suspension">
            <div class="component-wechat-top">
              <div class="left" @tap.stop.prevent="$router.push('/home')">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-logotuxing"></use>
                </svg>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-logowenzi"></use>
                </svg>
                <div class="desc">聚焦行业解决方案，共筑人脉圈子</div>
              </div>
              <div class="right"><a class="downloadApp AppThree" :href="url" target="_blank" @tap.stop.prevent="downloadApp">下载APP</a></div>
            </div>
          </div>
        </div>

        <div class="mui-slider-item" v-if="shareUuid">
          <div class="suspension backgroundGrey">
            <div class="component-wechat-top">
              <div class="left" @tap.stop.prevent="$router.push('/home')">
                <div class="userImg">
                  <img :src="shareInfo.avatar_url" alt="">
                </div>
                <div class="userName">{{shareInfo.name}}</div>
                <div class="desc userSlogen">我觉得InweHub不错，推荐你试试</div>
              </div>
              <div class="right"><a class="downloadApp AppFour" :href="url" target="_blank" @tap.stop.prevent="downloadApp">下载APP</a></div>
            </div>
          </div>
        </div>
        <div class="mui-slider-item mui-slider-item-duplicate">
          <div class="mui-slider-item">

            <div class="suspension">
              <div class="component-wechat-top">
                <div class="left" @tap.stop.prevent="$router.push('/home')">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-logotuxing"></use>
                  </svg>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-logowenzi"></use>
                  </svg>
                  <div class="desc">企业级应用＆服务广场</div>
                </div>
                <div class="right"><a class="downloadApp AppOne1" :href="url" target="_blank" @tap.stop.prevent="downloadApp">下载APP</a></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script type="text/javascript">
  /* eslint no-unused-vars: ["error", { "varsIgnorePattern": "link" }] */

  import localEvent from '../stores/sessionStorage'
  import { isLogined } from '../utils/auth'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { postRequest } from '../utils/request'

  export default {
    data () {
      return {
        url: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.inwehub.InwehubApp',
        isWeixin: false,
        isH5: false,
        isLogined: isLogined(),
        shareUuid: '',
        shareInfo: {}
      }
    },
    created () {
      this.showOpenApp()
    },
    mounted () {
      this.shareUuid = this.$route.query.uuid
      console.log('shareUUid:' + JSON.stringify(this.$route.query))
      if (this.shareUuid) {
        this.getShareInfo()
      }
      var mlink = 'https://adsolj.mlinks.cc/' + process.env.DEEP_LINK_KEY

      var Mlink = null

      if (this.isH5) {
        // 深度链接
        Mlink = new window.Mlink({
          mlink: mlink + '?name=1', // 短链地址
          button: document.querySelector('.AppOne'),
          params: {url: 'test'},
          cparams: {path: 'my'}
        })

        Mlink = new window.Mlink({
          mlink: mlink + '?name=1', // 短链地址
          button: document.querySelector('.AppTwo'),
          params: {url: 'test'},
          cparams: {path: 'my'}
        })

        Mlink = new window.Mlink({
          mlink: mlink + '?name=1', // 短链地址
          button: document.querySelector('.AppThree'),
          params: {url: 'test'},
          cparams: {path: 'my'}
        })
        if (this.shareUuid) {
          Mlink = new window.Mlink({
            mlink: mlink + '?name=1', // 短链地址
            button: document.querySelector('.AppFour'),
            params: {url: 'test'},
            cparams: {path: 'my'}
          })
          Mlink = new window.Mlink({
            mlink: mlink + '?name=1', // 短链地址
            button: document.querySelector('.AppFour1'),
            params: {url: 'test'},
            cparams: {path: 'my'}
          })
        }
        Mlink = new window.Mlink({
          mlink: mlink + '?name=1', // 短链地址
          button: document.querySelector('.AppOne1'),
          params: {url: 'test'},
          cparams: {path: 'my'}
        })
      }

      if (this.isWeixin) {
        // 深度链接
//        Mlink = new window.Mlink({
//          mlink: mlink + '?name=2', // 短链地址
//          button: document.querySelector('a#btnOpenAppWeixin'),
//          params: {url: 'test'},
//          cparams: {path: 'my'}
//        })
      }

      window.mui('#OpenAppSlider').slider({
        interval: 5000
      })
    },

    components: {
      swiper,
      swiperSlide
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
      getShareInfo () {
        postRequest('profile/resumeInfo', {uuid: this.shareUuid}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.shareInfo = response.data.data.info
        })
      },
      downloadApp () {
        window.location.href = this.url
      },
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
      },
      refreshData () {
        console.log('openApp refreshData() fired')
        this.isLogined = isLogined()
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
  .mui-wechat .suspension.backgroundGrey {
    background: #F3F4F6;
    box-shadow:0rem 0.053rem 0.693rem 0rem #F0F2F5;
  }
  .openAppH5 .suspension.backgroundGrey {
    background: #F3F4F6;
    box-shadow:0rem 0.053rem 0.693rem 0rem #F0F2F5;
  }
  .suspension.backgroundGrey {
    background: #F3F4F6;
    box-shadow:0rem 0.053rem 0.693rem 0rem #F0F2F5;
  }
  .mui-wechat .suspension {
    width: 100%;
    height: 1.306rem;
    position: fixed;
    opacity: 0.9;
    top: 0rem;
    background: #FFFFFF;
    z-index: 997;
    box-shadow:0rem 0.053rem 0.693rem 0rem #F0F2F5;
    -webkit-box-shadow:0rem 0.053rem 0.693rem 0rem #F0F2F5;
    -moz-box-shadow:0rem 0.053rem 0.693rem 0rem #F0F2F5;
  }
  .openAppH5 .suspension {
    width: 100%;
    height: 1.306rem;
    position: fixed;
    opacity: 0.9;
    top: 0rem;
    background: #FFFFFF;
    z-index: 997;
    box-shadow:0rem 0.053rem 0.693rem 0rem #F0F2F5;
    -webkit-box-shadow:0rem 0.053rem 0.693rem 0rem #F0F2F5;
    -moz-box-shadow:0rem 0.053rem 0.693rem 0rem #F0F2F5;
  }

  .suspension {
    width: 100%;
    height: 1.306rem;
    position: absolute;
    top: 1.173rem;
    background: #FFFFFF;
    z-index: 997;
    box-shadow:0rem 0.053rem 0.693rem 0rem #F0F2F5;
    -webkit-box-shadow:0rem 0.053rem 0.693rem 0rem #F0F2F5;
    -moz-box-shadow:0rem 0.053rem 0.693rem 0rem #F0F2F5;
  }

  .component-wechat-top {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    height: 1.306rem; }
  .component-wechat-top .left {
    position: relative; }
  .component-wechat-top .left .userImg {
    position: absolute;
    left: 0.293rem;
    top: 0.213rem;
    width: 0.88rem;
    height: 0.88rem;}
  .component-wechat-top .left .userImg img {
    width: 100%;
    height: 100%;
    border-radius: 50%;}
  .component-wechat-top .left .userName {
    position: absolute;
    top: 0.213rem;
    left: 1.493rem;
    color: #444444;
    font-size: 0.346rem;
  }
  .component-wechat-top .left .icon:nth-child(1) {
    position: absolute;
    left: 0.293rem;
    top: 0.133rem;
    font-size: 1.08rem; }
  .component-wechat-top .left .icon:nth-child(2) {
    position: absolute;
    left: 1.44rem;
    top: -0.533rem;
    font-size: 2.186rem; }
  .component-wechat-top .left .desc {
    color: #808080;
    font-size: 0.266rem;
    position: relative;
    top: 0.666rem;
    left: 1.546rem; }
  .component-wechat-top .left .desc.userSlogen {
    left: 1.493rem ;
  }
  .component-wechat-top .right {
    height: 1.306rem;
    line-height: 1.306rem;
    padding-right: 0.426rem;
    color: #03AEF9;
    font-size: 0.373rem; }
  .component-wechat-top .right .downloadApp {
    width: 1.893rem;
    height: 0.693rem;
    text-align: center;
    line-height: 0.693rem;
    color: #FFFFFF;
    font-size: 0.346rem;
    background: #03AEF9;
    border-radius: 0.213rem;
    display: inline-block;
  }
  .component-wechat-top .right a {
    color: #03AEF9; }
  .component-wechat-top .right .line-wall {
    margin: 0 0.266rem;
    position: relative;
    width:0.026rem;
    top: 0.026rem;
    height: 0.346rem; }

  .line-wall{
    display: inline-block;
    position: relative;
    width: 0.026rem;
    height: 0.266rem;
    background-color: #dcdcdc;
  }
  .mui-slider .mui-slider-group .mui-slider-item {
    height: 1.306rem !important;
  }
</style>
