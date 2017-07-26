import localEvent from '../stores/localStorage';

function getCacheInfo()
{
  var info = localEvent.getLocalItem('ProjectInfo');

  if (typeof info === 'object') {
      if (!info.basic) {
         return false;
      }
  }

  return info;
}

function setCacheInfo(pageName, projectObj)
{
  var obj = getCacheInfo();
  if (!obj) {
    obj = {};
  }
  obj[pageName] = projectObj;
  localEvent.setLocalItem('ProjectInfo', obj);
}

function clearCacheIno()
{
  localEvent.clearLocalItem('ProjectInfo');
}

export {
  getCacheInfo,
  setCacheInfo,
  clearCacheIno,
};
