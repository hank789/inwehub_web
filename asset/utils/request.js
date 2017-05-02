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
  return addAccessToken().post(createAPI(url), data,
    {
      validateStatus: status => status === 200
    }
  )
    .then(response => {

      var code = response.data.code;
      if (code !== 1000) {
        mui.toast(response.data.message);
        return false;
      }
      return response.data.data;
    })
    .catch(({response: {message = '网络状况堪忧'} = {}}) => {
      this.$store.dispatch('notice', cb => {
        cb({
          text: message,
          time: 2000,
          status: false
        });
      });
    })
}


export function postRequest (url, data) {
  return addAccessToken().post(createAPI(url), data,
    {
      validateStatus: status => status === 200
    }
  )
    .then(response => {
      return response;
    })
    .catch(({response: {message = '网络状况堪忧'} = {}}) => {
      this.$store.dispatch('notice', cb => {
        cb({
          text: message,
          time: 2000,
          status: false
        });
      });
    })
}
