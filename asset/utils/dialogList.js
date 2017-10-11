import {alertZoom, alertSkyOne, alertSkyTwo, alertSimple, getDialogObj} from '../utils/dialog';


function alertFenhongxize(context)
{
  var dialogObj = getDialogObj(context);
  if (dialogObj) {
    dialogObj.getHtml('fenhongxize', {}, (html) => {
      alertSimple(html, '确定', () => {
          //...
      }, false);
    });
  }
}

/**
 * 问答社区详情分享成功后弹窗
 */
function alertAskCommunityDetailShareSuccess(context)
{
  var dialogObj = getDialogObj(context);
  if (dialogObj) {
    dialogObj.getHtml('askCommunityDetailShare_title', {}, (titlehtml) => {
      dialogObj.getHtml('askCommunityDetailShare_body', {}, (contenthtml) => {
        alertSkyTwo(titlehtml,  contenthtml, 'icon-fenxiangchenggong', (num) => {

        }, true);
      });
    });
  }
}

export {
  alertFenhongxize,
  alertAskCommunityDetailShareSuccess
};
