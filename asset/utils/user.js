import localEvent from '../stores/localStorage';
import { createAPI, addAccessToken } from '../utils/request';
import errorCodes from '../stores/errorCodes';
import getImage from './getImage';
import defaultAvatar from '../statics/images/msg_box_remind@3x.png';
function followingUser(user_id, cb) {
  addAccessToken().post(
    createAPI('users/follow'),
    {
      user_id
    },
    {
      validate: status => status === 200
    }
  )
  .then(response => {
    cb(response.data);
  })
  .catch(error => {
    cb(error.response.data);
  })
};

function unFollowingUser(user_id, cb) {
  addAccessToken().delete(
    createAPI(`users/unFollow?user_id=${user_id}`),
    {},
    {
      validate: status => status === 204
    }
  )
  .then(response => {
    cb(response.data);
  })
  .catch(error => {
    cb(error.response.data);
  })
};

function getAvatar (userInfo, process, cb) {
  // let localUser = localEvent.getLocalItem('user_' + user_id);
  // 已有本地用户
  userInfo.avatar = {};
  if(userInfo.hasOwnProperty('datas')) { // 有datas属性
    if(userInfo.datas.hasOwnProperty('avatar')) { // 有avatar属性
      if(userInfo.datas.avatar.hasOwnProperty('value')) { // 有上传过avatar
        if(userInfo.datas.avatar.hasOwnProperty('urls')) { // 没有本地图片
          if(!userInfo.datas.avatar.urls.hasOwnProperty(process)) {
            userInfo.datas.avatar.urls[process] = userInfo.avatar[process] = getImage(userInfo.datas.avatar.value, process);
          }
        } else {
          userInfo.datas.avatar.urls = {};
          userInfo.datas.avatar.urls[process] = userInfo.avatar[process] = getImage(userInfo.datas.avatar.value, process);
        }
      } else {
        userInfo.datas.avatar.urls = {};
        userInfo.datas.avatar.urls[process] = userInfo.avatar[process] = defaultAvatar;
      }
    } else {
      userInfo.datas.avatar = {};
      userInfo.datas.avatar.urls = {};
      userInfo.datas.avatar.urls[process] = userInfo.avatar[process] = defaultAvatar;
    }
  } else { // 没有本地用户
    userInfo.datas.avatar = {};
    userInfo.datas.avatar.urls = {};
    userInfo.datas.avatar.urls[process] = userInfo.avatar[process] = defaultAvatar;
  }
  cb(userInfo);
};

function updateUserInfoCache(user) {
  let userLocal = {
    user_id: 0,
    name: '',
    phone: '',
    email: '',
    gender: '',
    birthday: '',
    province: '',
    city: '',
    address_detail: '',
    title: '',
    company: '',
    industry_tags: '',
    description: '',
    tags: '',
    status: '',
    avatar_url:'',
    counts: {},
    account_info_complete_percent:'',
    is_expert:0,
    total_money: '-',
    datas: {},
    questions:0,
    answers:0,
    tasks:0,
    projects:0,
    user_level:0,
    user_credits:0,
    user_coins:0
  };
  userLocal.user_id = user.id;
  userLocal.name = user.name;
  userLocal.phone = user.mobile;
  userLocal.avatar_url = user.avatar_url?user.avatar_url:'images/uicon.jpg';
  userLocal.email = user.email;
  userLocal.gender = user.gender;
  userLocal.birthday = user.birthday;
  userLocal.province = user.province;
  userLocal.city = user.city;
  userLocal.address_detail = user.address_detail;
  userLocal.title = user.title;
  userLocal.company = user.company;
  userLocal.industry_tags = user.industry_tags;
  userLocal.description = user.description;
  userLocal.tags = user.tags;
  userLocal.status = user.status;
  userLocal.account_info_complete_percent = user.account_info_complete_percent;
  userLocal.is_expert  = user.is_expert;
  userLocal.total_money = user.total_money;

  userLocal.user_level = user.user_level;
  userLocal.user_credits = user.user_credits;
  userLocal.user_coins = user.user_coins;
  userLocal.questions = user.questions;
  userLocal.answers = user.answers;
  userLocal.tasks = user.tasks;
  userLocal.projects = user.projects;

  /*
   user.counts.map(function (count, index) {
   let keyName = count.key;
   let value = count.value;
   userLocal.counts = Object.assign({}, userLocal.counts, { [keyName]:  value });
   });
   */
  let newData = {};
  /*
   user.datas.forEach(data => {
   newData[data.profile] = {
   display: data.profile_name,
   value: data.pivot.user_profile_setting_data,
   type: data.type,
   options: data.default_options,
   updated_at: data.updated_at
   };
   });
   */
  userLocal.datas = newData;
  /*
   getAvatar(userLocal, 20, newUserLocal => {
   userLocal = newUserLocal;
   });
   */
  localEvent.setLocalItem('UserInfo', userLocal);
  return userLocal;
}


function getUserInfo (user_id, cb) {
  addAccessToken().post(createAPI('profile/info'), {
      user_ids: [ user_id ]
    }
  )
  .then(response => {

    var code = response.data.code;
    if (code !== 1000) {
      let message = errorCodes[code]
      return {
        status: false,
        user: null,
        message: message
      };
    }

    let user = response.data.data.info;

    var userLocal = updateUserInfoCache(user);

    cb(response.data.data);
  })
  .catch(({ response: { data = {} } = {} } ) => {
    const { code = 'xxxx' } = data;
    let message = errorCodes[code]
    return {
      status: false,
      user: null,
      message: message
    };
  })
};

function getUsersInfo (user_ids, cb) {
  let user_ids_need_to_request = [];
  let users = {};

  // 检查已有的本地用户
  user_ids.map((user_id) => {
    let oldUserLocal = localEvent.getLocalItem(`user_${user_id}`);
    if(!Object.keys(oldUserLocal).length) {
      user_ids_need_to_request.push(user_id);
    }
    users[user_id] = oldUserLocal;
  });
  if(user_ids_need_to_request.length) {
    addAccessToken().post(createAPI('users'), {
        user_ids: user_ids_need_to_request
      },
      {
        validate: status => status === 200
      }
    )
    .then(response => {
      let users_service = response.data.data;
      let userLocal = {
        user_id: 0,
        name: '',
        phone: '',
        counts: {},
        datas: {},
        avatar: ''
      };
      // 组装数据
      users_service.map((user) => {
        let current_local_user = { ...userLocal };
        current_local_user.user_id = user.id;
        current_local_user.name = user.name;
        current_local_user.phone = user.phone;
        if(user.counts.length) {
          user.counts.map((count) => {
            let keyName = count.key;
            let value = count.value;
            current_local_user.counts = { ...current_local_user.counts, ...{ [keyName]:  value } };
          });
        }
        if(user.datas.length) {
          let newData = {};
          user.datas.forEach(data => {
            newData[data.profile] = {
              display: data.profile_name,
              value: data.pivot.user_profile_setting_data,
              type: data.type,
              options: data.default_options,
              updated_at: data.updated_at
            };
          });
          current_local_user.datas = newData;
        }
        getAvatar(current_local_user, 20, newUserLocal => {
          current_local_user = newUserLocal;
        });
        localEvent.setLocalItem('user_' + current_local_user.user_id, current_local_user);
        users[user.id] = current_local_user;
      });
      cb(users);
    })
    .catch(({ response: { data = {} } = {} } ) => {
      const { code = 'xxxx' } = data;
      let message = errorCodes[code]
      return {
        status: false,
        user: null,
        message: message
      };
    })
  } else {
    // 返回本地数据
    cb(users);
  }
};

export {
  getUserInfo,
  getUsersInfo,
  updateUserInfoCache,
  getAvatar,
  unFollowingUser,
  followingUser
};
