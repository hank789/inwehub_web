import { getLocalName } from './user'

/* 手机注册用户引导保定微信 */
var bindWechat = (context) => {
  if (!window.mui.os.plus) {
    return
  }

  var name = getLocalName()
  if (/^手机用户/.test(name)) {
    window.mui.alert('补全头像和昵称', () => {
      if (!context.$refs.oauth) {
        window.mui.toast('缺少oauth组件')
        return
      }
      context.$refs.oauth.setBindType(3)
      context.$refs.oauth.login('weixin')
    })
  }
}

export {
  bindWechat
}
