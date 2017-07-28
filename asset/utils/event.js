function addEventListener(name, callback)
{
  var listener = function (e) {
    var result = callback(e);
    window.removeEventListener(name, listener, false);
    return result;
  };

  window.addEventListener(name, listener, false);
}

export {
  addEventListener
};
