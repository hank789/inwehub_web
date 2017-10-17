import {alertZoom, alertSkyOne, alertSkyTwo, alertSimple, getDialogObj} from '../utils/dialog';
import { createAPI, addAccessToken, postRequest } from '../utils/request';

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
 * 问答社区详情分享成功后弹窗；
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
//互动问答 答案提交成功弹窗；
function alertAskCommunityInteractiveAnswer(context)
{
var id = parseInt(context.$route.params.id);
	   //请求数据；
	  postRequest(`question/relatedQuestion`, {id:id}).then(response => {
			var code = response.data.code;
			if(code !== 1000) {
				mui.alert(response.data.message);
				mui.back();
				return;
			}
	  var answerlist = response.data.data;
	   var dialogObj = getDialogObj(context); 
	  if (dialogObj) {
	    dialogObj.getHtml('community_t', {}, (titlehtml) => {
	      dialogObj.getHtml('community_b', {answerlist:answerlist}, (contenthtml) => {
		    alertSkyTwo(titlehtml,  contenthtml, 'icon-tiwenchenggongdaantijiaochenggongpingjiatijiaochenggong', (num) => {
		    	 if (num.index === 0) {
	  			context.$router.pushPlus('/askCommunity/major/' + id);
		    	 }else if(num.index === 1){
		    	 	 if (context.share) {
			      	     context.share();
			         }
		    	 }
				    
		    }, true);
	      });
	    });
	  } 
	      
	  });


  
}
//专家认证提示;

function expertcertification(context)
{
   var dialogObj = getDialogObj(context); 
  if (dialogObj) {
     dialogObj.getHtml('expertapplication-t', {}, (titlehtml) => {
        dialogObj.getHtml('expertapplication-b', {}, (contenthtml) => {
		  alertSkyTwo(titlehtml,  contenthtml, 'icon-chengweizhuanjia1', (num) => {
			    if (num.index === 0) {
	              context.$router.pushPlus('/my/resume');
	            }        		
       }, true);
      });
    });
  }
}
//提问完成；
 
function alertAskCommunityQuestioningSuccess(context)
{
	var id = parseInt(context.$route.params.id);
	   //请求数据；
	  postRequest(`question/relatedQuestion`, {id:id}).then(response => {
			var code = response.data.code;
			if(code !== 1000) {
				mui.alert(response.data.message);
				mui.back();
				return;
			}
	      var questList = response.data.data;
	      var dialogObj = getDialogObj(context); 
		  if (dialogObj) {
		    dialogObj.getHtml('ask_t', {}, (titlehtml) => {
		      dialogObj.getHtml('ask_b', {questlist:questList}, (contenthtml) => {
			    alertSkyTwo(titlehtml,  contenthtml, 'icon-tiwenchenggongdaantijiaochenggongpingjiatijiaochenggong', (num) => { 
			    	   
			    	        console.log(num.index)
			    	         if (num.index === 0) {
			              context.$router.pushPlus('/askCommunity/major/' + id);
			            } 
					    else if (num.index === 1) {
			              context.$router.pushPlus('/askCommunity/interactions');
			            } 
			    }, true);
		      });
		    });
		  }
         console.log(questList)
  
      });
   

  
}

export {
  alertFenhongxize,
  alertAskCommunityDetailShareSuccess,
  expertcertification,
  alertAskCommunityInteractiveAnswer,
  alertAskCommunityQuestioningSuccess
};
