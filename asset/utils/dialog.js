/**
 * 放大镜
 */
function alertZoom(titleHtml, contentHtml = '', btnString = '确定', callback = null)
{
  mui.alert(contentHtml, titleHtml, btnString, callback, 'div');
  mui('.mui-popup-in')[0].classList.add('alertZoom');
  var titlePre = document.createElement('div');
  titlePre.className = 'titlePre';
  mui('.mui-popup-in')[0].insertBefore(titlePre, mui('.mui-popup-in')[0].firstChild);
  var titlePre2 = document.createElement('div');
  titlePre2.className = 'titlePre2';
  mui('.mui-popup-in')[0].insertBefore(titlePre2, mui('.mui-popup-in')[0].firstChild);
}


/**
 * 带问号的
 */
function alertSky(titleHtml, contentHtml = '', iconType = '', btnString = '确定', callback = null, close = true, classname = 'alertSkyTwo' )
{
  mui.alert(contentHtml, ' ', btnString, callback, 'div');
  for (var i in classname) {
    mui('.mui-popup-in')[0].classList.add(classname[i]);
  }

  var titlePre = document.createElement('div');
  titlePre.className = 'titlePre';
  titlePre.innerHTML=titleHtml;
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
  }
}

function alertSkyOne(titleHtml, contentHtml = '', iconType = '', btnString = '确定', callback = null, close = true)
{
  alertSky(titleHtml, contentHtml, iconType, btnString, callback, close, ['alertSkyTwo','alertSkyTwo-one']);
}

function alertSkyTwo(titleHtml, contentHtml = '', iconType = '', btnString = '确定', callback = null, close = true)
{
  alertSky(titleHtml, contentHtml, iconType, btnString, callback, close, ['alertSkyTwo']);
}

export {
  alertZoom,
  alertSkyOne,
  alertSkyTwo
};
