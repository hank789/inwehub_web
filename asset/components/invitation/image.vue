<template>
  <div>
    <div id="scaleWrapper">
      <div id="shareContentWrapper" style="display:none; width:750px; background: #EBECED;">
        <div style="width:750px;">
          <div id="images_t"
               style="width:100%; height:890px;  background:-webkit-gradient(linear, 0 0, 0 bottom, from(#44474B), to(rgba(113, 117, 120, 1))); position: relative">
            <img src="../../statics/images/logo_blue@3x.png" style="height:48px; margin-top: 20px; margin-left: 17px"/>
            <div style="width: 100%; height:183px;  position: relative;">
              <img id="shareAvatar" src="../../statics/images/balance2.png"
                   style="width:137.5px; height: width:137.5px; border-radius: 50%; position: absolute; left: 0; right:0; top: 0; bottom: 0; margin: auto; border: 2px solid #DBDCDB;">
            </div>
            <div
              style="width:92%; height:144px; margin-left: 4%; background:#fcc816; border-radius:14px; position: relative; padding-top:40px">
          <span style="display:block; font-size:36px; color:#444444; font-weight: 600; text-align: center; ">章顾问向你发送了特权～
          </span>
              <span style="display:block; font-size:28px; color:#444444; text-align: center;  margin-top:25px">邀请好友注册立享5%现金分红</span>
              <i
                style="content: ''; display: block; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 10px solid #fcc816; position: absolute; -webkit-transform: rotate(0deg); transform: rotate(0deg); left: 0px; right: 0; top: -10px; margin: auto;"></i>
            </div>
            <div style="width: 100%; height:234px;  position: relative;">
              <div
                style="width:440px; height: 168px;  position: absolute; left: 0; right: 0; top: 0; bottom: 0; margin: auto">
                <qr-code :text="'sfdfsfsfsfs'" :size="168" error-level="M" style="border-radius: 10px; border:9px solid #FFFFFF; float: left;"></qr-code>
                <div style="float:right; margin-top:50px;">
                  <span style="display: block; font-size:30px; color: #ffffff;">扫描前往领取特权</span>
                  <span style="display: block; font-size:24px; color: #ffffff; margin-top: 20px">（首次登陆1元提问）</span>
                </div>
              </div>
            </div>

          </div>
          <img src="../../statics/images/invitation_img@3x.png" style="width: 100%; position: relative; top: -260px; ">
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
        rcCode: '',
        inviterName: '',
        inviterAvatar: ''
      }
    },
    components: {},

    methods: {
      downloadUrl (uri) {
        dowloadFile(uri, '_downloads/shareavatar.jpeg', (url) => {
          document.getElementById('shareAvatar').src = url
        })
      }
    },
    mounted () {

    },
    created () {
      var user = getLocalUserInfo()
      this.rcCode = user.rc_code || 0
      this.inviterName = user.name
      this.inviterAvatar = user.avatar_url
      this.downloadUrl(this.inviterAvatar)
    }
  }
</script>
<style scoped>
  #scaleWrapper {
    transform-origin: left top;
    -webkit-transform: scale(.5);
    transform: scale(.5);
  }

</style>
