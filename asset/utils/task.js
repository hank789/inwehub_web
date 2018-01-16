import localEvent from '../stores/localStorage'

/**
 * 每日执行一次任务
 * @param type
 * @param successCallback
 * @param failCallback
 */
function onceADayTask (type, successCallback, failCallback) {
  var currentUser = localEvent.getLocalItem('UserInfo')
  var date = new Date()
  var today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  var localKey = 'task_day_' + currentUser.user_id
  var tasks = localEvent.getLocalItem(localKey)

  var runTask = function () {
    tasks[type] = today
    localEvent.setLocalItem(localKey, tasks)
    successCallback()
  }

  if (tasks[type] === undefined) {
    // 第一次, 可以执行
    console.log('onceADayTask: 第一次, 可以执行')
    if (successCallback) {
      runTask()
    }
  } else if (tasks[type] !== today) {
    // 非当日首次， 可以执行
    console.log('onceADayTask: 非当日首次， 可以执行')
    runTask()
  } else {
    // 不可以执行
    console.log('onceADayTask: 不可以执行')
    failCallback()
  }
}

export {
  onceADayTask
}

