import localEvent from '../stores/localStorage';
import router from '../modules/index/routers/index';

// 判断是否可以进入目标路由
function requestAuth (to, from, next) {
  let UserLoginInfo = localEvent.getLocalItem('UserLoginInfo');
  if(UserLoginInfo.token) {
    next();
  } else {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    });
  }
}

// 登录状况不能进入的页面
function CanNotGetInWhenLogged (to, from, next) {
  let UserLoginInfo = localEvent.getLocalItem('UserLoginInfo');
  if(UserLoginInfo.token) {
    next({
      path: '/my',
      query: {
        redirect: to.fullPath
      }
    });
  } else {
    next();
  }
}

// 退出登录
function logout () {
  localEvent.clearLocalItem('UserLoginInfo');
  localEvent.clearLocalItem('UserInfo');
  router.pushPlus('/login',true,'none','none');
}

export {
  requestAuth,
  CanNotGetInWhenLogged,
  logout
};
