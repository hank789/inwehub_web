<template>
  <div>
    <div id="scaleWrapper">
      <div class="loadding">图片生成中...</div>
      <div id="scaleDivWrapper">
        <div id="shareContentWrapper" style="display:block; width:75rem; background: #EBECED; ">
          <div style="width:75rem;position: relative">
            <div id="images_t"
                 style="width:100%; height:89rem;  background:-webkit-gradient(linear, 0 0, 0 bottom, from(#44474B), to(rgba(113, 117, 120, 1))); position: relative">
              <img src="../../statics/images/logo_blue@3x.png"
                   style="height:4.8rem; margin-top: 2rem; margin-left: 1.7rem"/>
              <div style="width: 100%; height:18.3rem;  position: relative;">
                <img id="shareAvatar" :src="inviterAvatar"
                     style="width:137.0.5rem; height: 137.0.5rem; border-radius: 50%; position: absolute; left: 0; right:0; top: 0; bottom: 0; margin: auto; border: 0.2rem solid #DBDCDB;">
              </div>
              <div
                style="width:92%; height:14.4rem; margin-left: 4%; background:#fcc816; border-radius:1.4rem; position: relative; padding-top:4rem">
          <span style="display:block; font-size:3.6rem; color:#444444; font-weight: 600; text-align: center; ">{{inviterName}}向你发送了特权～
          </span>
                <span style="display:block; font-size:2.8rem; color:#444444; text-align: center;  margin-top:2.5rem">受邀注册可获随机现金奖励-可用于付费围观等</span>
                <i
                  style="content: ''; display: block; width: 0; height: 0; border-left: 1rem solid transparent; border-right: 1rem solid transparent; border-bottom: 1rem solid #fcc816; position: absolute; -webkit-transform: rotate(0deg); transform: rotate(0deg); left: 0rem; right: 0; top: -1rem; margin: auto;"></i>
              </div>
              <div style="width: 100%; height:23.4rem;  position: relative;">
                <div
                  style="width:44rem; height: 16.8rem;  position: absolute; left: 0; right: 0; top: 0; bottom: 0; margin: auto">
                  <qr-code :text="link" :size="168" error-level="M"
                           style="border-radius: 1rem; border:0.9rem solid #FFFFFF; float: left;"></qr-code>
                  <div style="float:right; margin-top:5rem;">
                    <span style="display: block; font-size:3rem; color: #ffffff;">扫描前往领取特权</span>
                    <span style="display: block; font-size:2.4rem; color: #ffffff; margin-top: 2rem">（随机现金奖励）</span>
                  </div>
                </div>
              </div>

            </div>
            <div style="width: 100%; height:98.3rem;">

            </div>
            <img src="../../statics/images/invitation_img@3x.png"
                 style="width: 100%;  position: absolute;bottom:0;">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getLocalUserInfo } from '../../utils/user'
  import { dowloadFile } from '../../utils/plus'

  export default {
    data () {
      return {
        createImaged: false,
        rcCode: '',
        inviterName: '',
        inviterAvatar: '',
        link: ''
      }
    },
    components: {},

    methods: {
      downloadUrl (uri) {
        dowloadFile(uri, '_downloads/shareavatar.jpeg', (url) => {
          document.getElementById('shareAvatar').src = url
          this.$emit('imageMounted')
        })
      },
      changeImage (url) {
        console.log('changeimage:' + url)
        this.createImaged = true
        document.getElementById('scaleWrapper').innerHTML = '<div style="background-image:url(' + url + ');width:100%;height:100rem;background-size: contain;background-repeat: no-repeat;"/>'
      }
    },
    mounted () {

    },
    created () {
      var user = getLocalUserInfo()
      this.rcCode = user.rc_code || 0
      this.inviterName = user.name
      this.inviterAvatar = user.avatar_url
      this.link = process.env.API_ROOT + 'wechat/oauth?redirect=/invitation/register?rc_code=' + this.rcCode
      if (window.mui.os.android) {
        this.downloadUrl(this.inviterAvatar)
      }
    }
  }
</script>
<style scoped>

  #scaleWrapper {
    padding: 2rem;
  }

  #scaleDivWrapper {
    position: relative;
    top:-200rem;
    transform-origin: left top;
    -webkit-transform: scale(.5);
    transform: scale(.5);
  }

  .onlyImage #scaleWrapper{
    padding:0;
    height:213.8rem;
    overflow-y: hidden;
  }
  .onlyImage #scaleDivWrapper{
    top:0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  .onlyImage .loadding{
    display: none;
  }
</style>
