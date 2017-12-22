/**
 * 事件管理
 * @type {{events: Array, addEventListener: ((p1?:*, p2?:*)), addOnceEventListener: ((p1?:*, p2:*))}}
 */
var prevEventTime = new Date().getTime()

var EventObj = () => {
  var events = []
  var addEventListener = (name, callback) => {
    if (events[name] !== undefined) {
      return -1
    } else {
      events[name] = 1
      console.log('bindEvent: ' + name)
      window.addEventListener(name, callback, false)
    }
  }

  var addOnceEventListener = (name, callback) => {
    if (events[name]) {
      return -1
    } else {
      var listener = function (e) {
        var result = callback(e)
        window.removeEventListener(name, listener, false)
        return result
      }

      window.addEventListener(name, listener, false)
    }
  }

  var addIntervalOnceEventListener = (name, callback) => {
    if (events[name] !== undefined) {
      return -1
    } else {
      events[name] = 1
      console.log('bindEvent: ' + name)
      var newCallback = function () {
        var nowEventTime = new Date().getTime()
        console.log('event: nowEventTime:' + nowEventTime + ', prevEventTime:' + prevEventTime + ', 间隔:' + (nowEventTime - prevEventTime))
        if ((nowEventTime - prevEventTime) < 1000) {
          return
        }
        prevEventTime = new Date().getTime()
        callback()
      }
      window.addEventListener(name, newCallback, false)
    }
  }

  return {
    addEventListener: addEventListener,
    addOnceEventListener: addOnceEventListener,
    addIntervalOnceEventListener: addIntervalOnceEventListener
  }
}

export default EventObj()
