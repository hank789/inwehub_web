function toast(message,options) {
  var durations = {
    'long': 3500,
    'short': 2000
  };

  var $ = mui;
  var duration;
  var CLASS_ACTIVE = 'mui-active';

  //计算显示时间
  options = $.extend({
    duration: 'short'
  }, options || {});

  console.red(options);

  if ($.os.plus && options.type !== 'div') {
    //默认显示在底部；
    $.plusReady(function() {
      plus.nativeUI.toast(message, {
        verticalAlign: 'bottom',
        duration:options.duration
      });
    });
  } else {
    if (typeof options.duration === 'number') {
      duration = options.duration>0 ? options.duration:durations['short'];
    } else {
      duration = durations[options.duration];
    }
    if (!duration) {
      duration = durations['short'];
    }
    var toast = document.createElement('div');
    toast.classList.add('mui-toast-container');
    toast.innerHTML = '<div class="' + 'mui-toast-message' + '">' + message + '</div>';
    toast.addEventListener('webkitTransitionEnd', function() {
      if (!toast.classList.contains(CLASS_ACTIVE)) {
        toast.parentNode.removeChild(toast);
        toast = null;
      }
    });

    document.body.appendChild(toast);

    toast.offsetHeight;
    toast.classList.add(CLASS_ACTIVE);
    setTimeout(function() {
      toast && toast.classList.remove(CLASS_ACTIVE);
    }, duration);

    return {
      isVisible: function() {return !!toast;}
    }
  }
};

export {
   toast
};

