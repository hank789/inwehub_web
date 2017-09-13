/**
 * 放大镜
 * 确定class .alertConfirm
 */
function alertZoom(contentHtml = '', callback = null, close = true)
{
  var alertObj = mui.alert(contentHtml, null, null, callback, 'div');
  mui('.mui-popup-in')[0].classList.add('alertZoom');

  var titlePre = document.createElement('div');
  titlePre.className = 'titlePre';
  mui('.mui-popup-in')[0].insertBefore(titlePre, mui('.mui-popup-in')[0].firstChild);

  var titlePre2 = document.createElement('div');
  titlePre2.className = 'titlePre2';
  mui('.mui-popup-in')[0].insertBefore(titlePre2, mui('.mui-popup-in')[0].firstChild);

  if (close) {
    var closeDiv = document.createElement('div');
    closeDiv.className = 'alertClose';
    closeDiv.innerHTML='<svg class="icon" aria-hidden="true"><use xlink:href="#icon-guanbi"></use></svg>';
    mui('.mui-popup-in')[0].insertBefore(closeDiv, mui('.mui-popup-in')[0].firstChild);

    closeDiv.onclick = () => {
      alertObj.close(-1, '');
    };
  }

  var alertConfirm = alertObj.element.querySelector('.alertConfirm');
  if (alertConfirm) {
    alertObj.element.querySelector('.alertConfirm').onclick = () => {
      alertObj.close(0, '');
    }
  }

}


/**
 * 带问号的
 * 确定class .alertConfirm
 */
function alertSky(titleHtml, contentHtml = '', iconType = '', callback = null, close = true, classname = 'alertSkyTwo' )
{
  var alertObj = mui.alert(contentHtml, ' ', null, callback, 'div');

  for (var i in classname) {
    mui('.mui-popup-in')[0].classList.add(classname[i]);
  }

  var titlePre = document.createElement('div');
  titlePre.className = 'titlePre';
  titlePre.innerHTML = titleHtml;
  mui('.mui-popup-in')[0].insertBefore(titlePre, mui('.mui-popup-in')[0].firstChild);

  if (iconType) {
    var titlePreIcon = document.createElement('div');
    titlePreIcon.className = 'titlePreIcon';
    titlePreIcon.innerHTML='<svg class="icon" aria-hidden="true"><use xlink:href="#' + iconType + '"></use></svg>';
    mui('.mui-popup-in')[0].insertBefore(titlePreIcon, mui('.mui-popup-in')[0].firstChild);
  }

  if (close) {
    var closeDiv = document.createElement('div');
    closeDiv.className = 'alertClose';
    closeDiv.innerHTML='<svg class="icon" aria-hidden="true"><use xlink:href="#icon-guanbi"></use></svg>';
    mui('.mui-popup-in')[0].insertBefore(closeDiv, mui('.mui-popup-in')[0].firstChild);

    closeDiv.onclick = () => {
      alertObj.close(-1, '');
    };
  }

  var alertConfirm = alertObj.element.querySelector('.alertConfirm');
  if (alertConfirm) {
    alertObj.element.querySelector('.alertConfirm').onclick = () => {
      alertObj.close(0, '');
    }
  }
}

function alertSkyOne(titleHtml = '', contentHtml = '', iconType = '', callback = null, close = true)
{
  alertSky(titleHtml, contentHtml, iconType, callback, close, ['alertSkyTwo','alertSkyTwo-one']);
}

function alertSkyTwo(titleHtml = '', contentHtml = '', iconType = '', callback = null, close = true)
{
  alertSky(titleHtml, contentHtml, iconType, callback, close, ['alertSkyTwo']);
}

export {
  alertZoom,
  alertSkyOne,
  alertSkyTwo
};
