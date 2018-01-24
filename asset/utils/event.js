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

  var addLastEventListener = (name, listener) => {
    console.log('addLastEventListener: ' + name)

    if (typeof window.lastEventListener === 'undefined') {
      window.lastEventListener = []
    }

    if (window.lastEventListener[name]) {
      window.removeEventListener(name, window.lastEventListener[name], false)
    }

    window.lastEventListener[name] = function (event) {
      listener(event)
    }
    window.addEventListener(name, window.lastEventListener[name], false)
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
      window.addEventListener(name, newCallback, true)
    }
  }

  return {
    addEventListener: addEventListener,
    addOnceEventListener: addOnceEventListener,
    addIntervalOnceEventListener: addIntervalOnceEventListener,
    addLastEventListener: addLastEventListener
  }
}

export default EventObj()
