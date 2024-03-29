import localEvent from '../stores/localStorage'
import { createAPI, addAccessToken } from '../utils/request'
import errorCodes from '../stores/errorCodes'
function followingUser (userId, cb) {
  addAccessToken().post(
    createAPI('users/follow'),
    {
      userId
    },
    {
      validate: status => status === 200
    }
  )
    .then(response => {
      cb(response.data)
    })
    .catch(error => {
      cb(error.response.data)
    })
}

function unFollowingUser (userId, cb) {
  addAccessToken().delete(
    createAPI(`users/unFollow?user_id=${userId}`),
    {},
    {
      validate: status => status === 204
    }
  )
    .then(response => {
      cb(response.data)
    })
    .catch(error => {
      cb(error.response.data)
    })
}

function updateUserInfoCache (user) {
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
    avatar_url: '',
    counts: {},
    account_info_complete_percent: '',
    is_expert: 0,
    expert_apply_status: 0,
    total_money: '-',
    datas: {},
    questions: 0,
    answers: 0,
    tasks: 0,
    projects: 0,
    user_level: 0,
    user_credits: 0,
    user_coins: 0,
    is_company: 0,
    show_my_wallet: false,
    show_ios_resume: false,
    realname: '',
    region_tags: '',
    is_admin: 0
  }
  userLocal.user_id = user.id
  userLocal.name = user.name
  userLocal.phone = user.mobile
  userLocal.avatar_url = user.avatar_url ? user.avatar_url : 'images/uicon.jpg'
  userLocal.email = user.email
  userLocal.gender = user.gender
  userLocal.birthday = user.birthday
  userLocal.province = user.province
  userLocal.city = user.city
  userLocal.address_detail = user.address_detail
  userLocal.title = user.title
  userLocal.company = user.company
  userLocal.company_status = user.company_status
  userLocal.industry_tags = user.industry_tags
  userLocal.description = user.description
  userLocal.tags = user.tags
  userLocal.status = user.status
  userLocal.account_info_complete_percent = user.account_info_complete_percent
  userLocal.is_expert = user.is_expert
  userLocal.expert_apply_status = user.expert_apply_status
  userLocal.total_money = user.total_money

  userLocal.user_level = user.user_level
  userLocal.user_credits = user.user_credits
  userLocal.user_coins = user.user_coins
  userLocal.questions = user.questions
  userLocal.answers = user.answers
  userLocal.tasks = user.tasks
  userLocal.projects = user.projects
  userLocal.expert_level = user.expert_level
  userLocal.is_company = user.is_company
  userLocal.show_my_wallet = user.show_my_wallet
  userLocal.show_ios_resume = user.show_ios_resume
  userLocal.uuid = user.uuid
  userLocal.newbie_unfinish_tasks = user.newbie_unfinish_tasks
  userLocal.my_activity_enroll = user.my_activity_enroll
  userLocal.rc_code = user.rc_code
  userLocal.skill_tags = user.skill_tags
  userLocal.realname = user.realname
  userLocal.region_tags = user.region_tags
  userLocal.is_admin = user.is_admin ? 1 : 0

  /*
   user.counts.map(function (count, index) {
   let keyName = count.key;
   let value = count.value;
   userLocal.counts = Object.assign({}, userLocal.counts, { [keyName]:  value });
   });
   */
  let newData = {}
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
  userLocal.datas = newData

  localEvent.setLocalItem('UserInfo', userLocal)
  return userLocal
}

function getUserInfo (userId, cb, needReport = false) {
  addAccessToken().get(createAPI('profile/info'), {
    params: {
      need_report: needReport
    }
  }
  )
    .then(response => {
      var code = response.data.code
      if (code !== 1000) {
        let message = errorCodes[code]
        window.mui.toast(message)
        return
      }

      let user = response.data.data.info

      localEvent.setLocalItem('UserInfoReal', response.data.data)

      updateUserInfoCache(user)

      cb(response.data.data)
    })
    .catch(({response: {data = {}} = {}}) => {
      const {code = 'xxxx'} = data
      let message = errorCodes[code]
      return {
        status: false,
        user: null,
        message: message
      }
    })
}

function updateUserInfo (options) {
  var UserInfo = localEvent.getLocalItem('UserInfo')
  for (var key in options) {
    UserInfo[key] = options[key]
  }
  localEvent.setLocalItem('UserInfo', UserInfo)
}

/**
 * 是否是专家
 */
function isExpert () {
  var UserInfo = localEvent.getLocalItem('UserInfo')
  return UserInfo.is_expert
}

/**
 * 获取本地用户信息
 */
function getLocalUserInfo () {
  var UserInfo = localEvent.getLocalItem('UserInfo')
  return UserInfo
}

/**
 * 获取本地用户id
 */
function getLocalUserId () {
  var userInfo = getLocalUserInfo()
  if (userInfo && userInfo.user_id) {
    return userInfo.user_id
  }
  return null
}

/**
 * 获取本地用户uuid
 */
function getLocalUuid () {
  var userInfo = getLocalUserInfo()
  if (userInfo && userInfo.uuid) {
    return userInfo.uuid
  }
  return null
}

/**
 * 获取用户级别
 * @returns {null}
 */
function getLocalUserLevel () {
  var userInfo = getLocalUserInfo()
  if (userInfo && userInfo.user_level) {
    return userInfo.user_level
  }
  return null
}

/**
 * 是否通过企业认证
 */
function isCompanyStatus () {
  var userInfo = getLocalUserInfo()
  var companyStatus = parseInt(userInfo.company_status)
  var result = false
  switch (companyStatus) {
    case 0: // 没有认证去认证
    case 1:
    case 3:
      result = false
      break
    case 2:
      result = true
      break
  }
  return result
}

/**
 * 获取用户等级百分比
 */
function getUserLevelPercentage () {
  var levelCredits = [
    0,
    1000,
    5000,
    50000,
    500000,
    5000000
  ]
  var userInfo = getLocalUserInfo()
  var userCredits = userInfo.user_credits
  var userLevel = userInfo.user_level

  console.log('userLevel:' + userLevel)
  console.log('userCredits:' + userCredits)

  var result = (userLevel - 1) * 25 + (userCredits - levelCredits[userLevel - 1]) / (levelCredits[userLevel] - levelCredits[userLevel - 1]) * 25
  console.log('UserLevelPercentage-1:' + (userCredits - levelCredits[userLevel - 1]) / (levelCredits[userLevel] - levelCredits[userLevel - 1]))
  console.log('UserLevelPercentage-2:' + result)
  return result
}

/**
 * 获取本地用户phone
 */
function getLocalPhone () {
  var userInfo = getLocalUserInfo()
  if (userInfo && userInfo.phone) {
    return userInfo.phone
  }
  return null
}

/**
 * 获取本地用户名
 */
function getLocalName () {
  var userInfo = getLocalUserInfo()
  if (userInfo && userInfo.name) {
    return userInfo.name
  }
  return null
}

function isAdmin () {
  var userInfo = getLocalUserInfo()
  if (userInfo && userInfo.is_admin) {
    return true
  }
  return false
}

export {
  getUserInfo,
  updateUserInfoCache,
  unFollowingUser,
  updateUserInfo,
  isExpert,
  followingUser,
  isCompanyStatus,
  getLocalUserInfo,
  getUserLevelPercentage,
  getLocalUserId,
  getLocalUuid,
  getLocalUserLevel,
  getLocalPhone,
  getLocalName,
  isAdmin
}
