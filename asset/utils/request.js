import axios from 'axios';
import localEvent from '../stores/localStorage';
import { logout } from '../utils/auth';

const baseURL = process.env.API_ROOT;
const api = process.env.API_ROOT + `api`;

// Export a method to create the requested address.
export const createRequestURI = PATH => `${baseURL}/${PATH}`;

// Created the request address of API.
export const createAPI = PATH => `${api}/${PATH}`;

// 注入access-token验证
export const addAccessToken = () => {
  const UserLoginInfo = localEvent.getLocalItem('UserLoginInfo');
  axios.defaults.headers.common = {
    'Authorization': 'bearer ' + UserLoginInfo.token
  };
  return axios;
};

export default axios;

export function apiRequest (url, data, showWaiting = true) {
  if (showWaiting){
    if (mui.os.plus){
      mui.plusReady(() => {
        plus.nativeUI.showWaiting();
      });
    } else {
      mui.waiting();
    }
  }
  var app_version = localEvent.getLocalItem('app_version');
  if (app_version) {
    data.current_version = app_version.version;
  }

  return addAccessToken().post(createAPI(url), data,
    {
      validateStatus: status => status === 200
    }
  )
    .then(response => {
      if (showWaiting){
        if (mui.os.plus){
          mui.plusReady(() => {
            plus.nativeUI.closeWaiting();
          });
        } else {
          mui.closeWaiting();
        }
      }
      var code = response.data.code;
      // 参数错误
      if (code === 1008) {
        var errMsg = '';
        for (var i in response.data.data) {
          errMsg = errMsg + response.data.data[i] + '\n';
        }
        var s = errMsg.substring(0,errMsg.lastIndexOf('\n'));
        mui.toast(s);
        return false;
      }

      if (!mui.os.wechat){

        if (code === 1001 || code === 1002 || code === 1004 || code === 1102) {
          mui.toast(response.data.message);
          logout();
          return;
        }
      }

      if (code !== 1000) {
        mui.toast(response.data.message);
        return false;
      }

      return response.data.data;
    })
    .catch(({response: {message = '网络状况堪忧'} = {}}) => {
      if (showWaiting){
        if (mui.os.plus){
          mui.plusReady(() => {
            plus.nativeUI.closeWaiting();
          });
        } else {
          mui.closeWaiting();
        }
      }
      mui.toast(message);
      return false;
    })
}

//对后端数据进行请求；（showWaiting = true 加载gif）
export function postRequest (url, data, showWaiting = true, options = {}) {
  if (showWaiting){
    if (mui.os.plus){
      mui.plusReady(() => {
        plus.nativeUI.showWaiting();
      });
    } else {
      mui.waiting();
    }
  }
  var app_version = localEvent.getLocalItem('app_version');
  if (app_version) {
    data.current_version = app_version.version;
  }



  var config = {};
  config.validateStatus = status => status === 200;

  if (options.onUploadProgress) {
    config.onUploadProgress = options.onUploadProgress;
  }

  return addAccessToken().post(createAPI(url), data, config)
    .then(response => {

      if (options.onUploadProgress) {
           mui.closeUploadWaiting();
      }

      if (showWaiting) {
        if (mui.os.plus){
          mui.plusReady(() => {
            plus.nativeUI.closeWaiting();
          });
        } else {
          mui.closeWaiting();
        }
      }

      var code = response.data.code;

      if (!mui.os.wechat){
        if (code === 1001 || code === 1002 || code === 1004 || code === 1102) {
          mui.toast(response.data.message);
          logout();
          return;
        }
      }

      return response;
    })
    .catch(e => {
      if (showWaiting) {
        if (mui.os.plus){
          mui.plusReady(() => {
            plus.nativeUI.closeWaiting();
          });
        } else {
          mui.closeWaiting();
        }
      }
      return {data:{message: '网络状况堪忧', code:0}};
    })
}
