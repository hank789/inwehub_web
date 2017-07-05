import localEvent from '../stores/localStorage';
import { createAPI, addAccessToken } from '../utils/request';
import errorCodes from '../stores/errorCodes';
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
    user_coins:0,
    is_company:0,
    show_my_wallet:false
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
  userLocal.expert_level = user.expert_level;
  userLocal.is_company = user.is_company;
  userLocal.show_my_wallet = user.show_my_wallet;
  userLocal.uuid = user.uuid;

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

    localEvent.setLocalItem('UserInfoReal', response.data.data);

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

export {
  getUserInfo,
  updateUserInfoCache,
  unFollowingUser,
  followingUser
};
