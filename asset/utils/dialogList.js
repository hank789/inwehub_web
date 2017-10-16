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
//互动问答 答案提交成功弹窗 Interactive answer；
function alertAskCommunityInteractiveAnswer(context)
{
   var dialogObj = getDialogObj(context); 
  if (dialogObj) {
    dialogObj.getHtml('community_t', {}, (titlehtml) => {
      dialogObj.getHtml('community_b', {}, (contenthtml) => {
	    alertSkyTwo(titlehtml,  contenthtml, 'icon-chengweizhuanjia1', (num) => {
			          
	    }, true);
      });
    });
  }
}
//专家认证提示;

function expertcertification(context)
{
   var dialogObj = getDialogObj(context); 
  if (dialogObj) {
     dialogObj.getHtml('expertapplication-t', {}, (titlehtml) => {
        dialogObj.getHtml('expertapplication-b', {}, (contenthtml) => {
		  alertSkyTwo(titlehtml,  contenthtml, 'icon-chengweizhuanjia1', (num) => {
//			    if (num.index === 0) {
//	              this.$router.pushPlus('/my/resume');
//	            }        		
       }, true);
      });
    });
  }
}


export {
  alertFenhongxize,
  alertAskCommunityDetailShareSuccess,
  expertcertification,
  alertAskCommunityInteractiveAnswer
};
