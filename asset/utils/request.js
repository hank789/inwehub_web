import axios from 'axios';
import localEvent from '../stores/localStorage';

const baseURL = `http://47.92.24.67/`;
const api = `http://47.92.24.67/api`;

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
  }
  return addAccessToken().post(createAPI(url), data,
    {
      validateStatus: status => status === 200
    }
  )
    .then(response => {
      if (mui.os.plus){
        plus.nativeUI.closeWaiting();
      }
      var code = response.data.code;
      // 参数错误
      if (code === 1008) {
        var errMsg = '';
        for (var i in response.data.data) {
          errMsg = errMsg + response.data.data[i] + '<br>';
        }
        mui.toast(errMsg,{type: "div"});
        return false;
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
      }
      mui.toast(message);
      return false;
    })
}


export function postRequest (url, data) {
  if (mui.os.plus){
    plus.nativeUI.showWaiting();
  }
  return addAccessToken().post(createAPI(url), data,
    {
      validateStatus: status => status === 200
    }
  )
    .then(response => {
      if (mui.os.plus){
        plus.nativeUI.closeWaiting();
      }
      var code = response.data.code;

      // 参数错误
      if (code === 1008) {
        var errMsg = '';
        for (var i in response.data.data) {
          errMsg = errMsg + response.data.data[i] + '<br>';
        }
        mui.toast(errMsg,{type: "div"});
        return false;
      }
      return response;
    })
    .catch(e => {
      if (mui.os.plus){
        plus.nativeUI.closeWaiting();
      }
      return {data:{message: '网络状况堪忧', code:0}};
    })
}
