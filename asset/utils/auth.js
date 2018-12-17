import localEvent from '../stores/localStorage'
// 用户浏览行为；
import router from '../modules/index/routers/index'

// 判断是否可以进入目标路由
function requestAuth (to, from, next) {
  let UserLoginInfo = localEvent.getLocalItem('UserLoginInfo')
  if ((!window.mui.os.plus && window.mui.os.wechat === undefined) || UserLoginInfo.token) {
    next()
  } else {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  }
}

// 登录状况不能进入的页面
function CanNotGetInWhenLogged (to, from, next) {
  let UserLoginInfo = localEvent.getLocalItem('UserLoginInfo')
  if (UserLoginInfo.token) {
    next({
      path: '/my',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    next()
  }
}

// 退出登录
function logout () {
  localEvent.clearLocalItem('UserLoginInfo')
  localEvent.clearLocalItem('UserInfo')
  router.pushPlus('/login', '', true, 'none', 'none')
}

function isLogined () {
  let UserLoginInfo = localEvent.getLocalItem('UserLoginInfo')
  if (UserLoginInfo.token) {
    return true
  }
  return false
}

/* 判断是否登录状态，没登录进入登录页面 */
function needLogin (context) {
  var fullPath = context.$route.fullPath
  console.log('fullPath' + fullPath)
  let UserLoginInfo = localEvent.getLocalItem('UserLoginInfo')
  if (!UserLoginInfo.token) {
    context.$router.pushPlus('/login?redirect=' + fullPath, '', true, 'none', 'none')
    return true
  }
  return false
}

export {
  requestAuth,
  CanNotGetInWhenLogged,
  logout,
  isLogined,
  needLogin
}
