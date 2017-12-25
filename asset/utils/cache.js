/**
 * 临时存储业务
 */
import localEvent from '../stores/localStorage'

function onceSave (component, key = '', saveData = null) {
  var url = component.$route.fullPath
  if (!saveData) {
    saveData = component.$data
  }
  var cacheData = {
    url,
    data: saveData
  }

  var localKey = 'onceCache' + key
  console.log('onceCache:save key:' + localKey + ', data:' + JSON.stringify(cacheData))
  localEvent.setLocalItem(localKey, cacheData)
}

function onceClear (key = '') {
  console.log('onceCache:clear key:' + key)
  var localKey = 'onceCache' + key
  localEvent.clearLocalItem(localKey)
}

function onceGet (component, key = '') {
  var localKey = 'onceCache' + key
  var url = component.$route.fullPath
  var cacheData = localEvent.getLocalItem(localKey)
  console.log('onceCache:get key:' + localKey + ', data:' + JSON.stringify(cacheData))
  if (cacheData.url === undefined) {
    return null
  } else {
    if (cacheData.url === url) {
      for (var i in cacheData.data) {
        if (component.$data.hasOwnProperty(i)) {
          component.$data[i] = cacheData.data[i]
        }
      }
      onceClear(key)
      return true
    }
    return null
  }
}

export {
  onceSave,
  onceGet,
  onceClear
}
