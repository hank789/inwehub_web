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

export function apiRequest (url, data) {
  if (mui.os.plus){
    plus.nativeUI.showWaiting();
  } else {
    mui.waiting();
  }
  return addAccessToken().post(createAPI(url), data,
    {
      validateStatus: status => status === 200
    }
  )
    .then(response => {
      if (mui.os.plus){
        plus.nativeUI.closeWaiting();
      } else {
        mui.closeWaiting();
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
      if (mui.os.plus){
        plus.nativeUI.closeWaiting();
      } else {
        mui.closeWaiting();
      }
      mui.toast(message);
      return false;
    })
}


export function postRequest (url, data) {
  if (mui.os.plus){
    plus.nativeUI.showWaiting();
  } else {
    mui.waiting();
  }
  return addAccessToken().post(createAPI(url), data,
    {
      validateStatus: status => status === 200
    }
  )
    .then(response => {
      if (mui.os.plus){
        plus.nativeUI.closeWaiting();
      } else {
        mui.closeWaiting();
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
      if (mui.os.plus){
        plus.nativeUI.closeWaiting();
      } else {
        mui.closeWaiting();
      }
      return {data:{message: '网络状况堪忧', code:0}};
    })
}
