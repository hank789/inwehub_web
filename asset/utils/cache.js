/**
 * 临时存储业务
 */
import localEvent from '../stores/localStorage'

function onceSave (component) {
  var url = component.$route.fullPath
  var cacheData = {
    url,
    data: component.$data
  }
  console.log('onceCache:save:' + JSON.stringify(cacheData))
  localEvent.setLocalItem('onceCache', cacheData)
}

function onceGet (component) {
  var url = component.$route.fullPath
  var cacheData = localEvent.getLocalItem('onceCache')
  console.log('onceCache:get:' + JSON.stringify(cacheData))
  if (cacheData.url === undefined) {
    return null
  } else {
    if (cacheData.url === url) {
      for (var i in cacheData.data) {
        if (component.$data.hasOwnProperty(i)) {
          component.$data[i] = cacheData.data[i]
        }
      }
    }
    return null
  }
}

function onceClear () {
  console.log('onceCache:clear')
  localEvent.clearLocalItem('onceCache')
}

export {
  onceSave,
  onceGet,
  onceClear
}
