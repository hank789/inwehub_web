/**
 * 事件管理
 * @type {{events: Array, addEventListener: ((p1?:*, p2?:*)), addOnceEventListener: ((p1?:*, p2:*))}}
 */
var EventObj = () => {
   var events = [];
   var addEventListener = (name, callback) => {

       if (events[name] !== undefined) {
           return -1;
       } else {

           events[name] = callback;

           window.addEventListener(name, callback, false);
       }
   };

   var addOnceEventListener = (name, callback) => {
       if (events[name]) {
         return -1;
       } else {
         var listener = function (e) {
           var result = callback(e);
           window.removeEventListener(name, listener, false);
           return result;
         };

         window.addEventListener(name, listener, false);
       }
   };

   return {
     addEventListener:addEventListener,
     addOnceEventListener:addOnceEventListener,
   };
};



export default EventObj();
