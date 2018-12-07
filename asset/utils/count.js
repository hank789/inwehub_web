import { getLocalUuid } from './user'
import localEvent from '../stores/localStorage'

/* callback只会运行一次 */
var onceRun = (key, callback) => {
  var cacheKey = 'onceRun_' + key + '_' + getLocalUuid()
  var history = parseInt(localEvent.getLocalItem(cacheKey))
  if (!history) {
    localEvent.setLocalItem(cacheKey, 1)
    callback()
  }
}

export {
  onceRun
}
