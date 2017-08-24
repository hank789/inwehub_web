function setAppBadgeNumber(number)
{
  if (mui.os.plus) {
    mui.plusReady(function () {
        plus.runtime.setBadgeNumber( number );
    });
  }
}

export {
  setAppBadgeNumber
};
