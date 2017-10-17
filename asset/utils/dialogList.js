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
function alertAskCommunityInteractiveAnswer(context,coins,credits)
{
	   var dialogObj = getDialogObj(context); 
	  if (dialogObj) {
	    dialogObj.getHtml('community_t', {answercoins:coins,answercredits:credits}, (titlehtml) => {
	      dialogObj.getHtml('community_b', {}, (contenthtml) => {
		    alertSkyTwo(titlehtml,  contenthtml, 'icon-tiwenchenggongdaantijiaochenggongpingjiatijiaochenggong', (num) => {
		    	      
		    	 if (num.index === 0) {
		    	 	
		    	 	if (context.share) {
				   
		      	     context.share();
			      }
		    	 }
				    
		    }, true);
	      });
	    });
	  } 
}
//专家认证提示;

function expertcertification(context,coins,credits)
{
   var dialogObj = getDialogObj(context); 
  if (dialogObj) {
     dialogObj.getHtml('expertapplication-t', {expert_coins:coins,expert_credits:credits}, (titlehtml) => {
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
 
function alertAskCommunityQuestioningSuccess(context, coins,credits,ask)
{
	      var dialogObj = getDialogObj(context); 
		  if (dialogObj) {
		  	
		    dialogObj.getHtml('ask_t', {askcoins:coins,askcredits:credits}, (titlehtml) => {
		      dialogObj.getHtml('ask_b', {}, (contenthtml) => {
			    alertSkyTwo(titlehtml,  contenthtml, 'icon-tiwenchenggongdaantijiaochenggongpingjiatijiaochenggong', (num) => { 
			    	         if (num.index === 0) {
                    context.$router.pushPlus('/contact?id=' + ask.id + '&username=' + ask.user_name + '&title=' + ask.description + '&answernum='+ask.answer_num+'&followednum='+ask.follow_num, 'list-detail-page-contact');
			            } 
					    
			    }, true);
		      });
		    });
		  }
         
  
     
}

//阅读的评论完成;

function readhubCommenSuccess(context,credits)
{
   var dialogObj = getDialogObj(context); 
  if (dialogObj) {
     dialogObj.getHtml('comment_t', {readhub_commen_credits:credits}, (titlehtml) => {
        dialogObj.getHtml('comment_b', {}, (contenthtml) => {
		  alertSkyTwo(titlehtml,  contenthtml, 'icon-huifuchenggong', (num) => {
			    if (num.index === 0) {
	             //分享评论的方法；
	            }        		
       }, true);
      });
    });
  }
}


//完善名片；
/**
   * 完善名片的提示框；
   */
function perfectCard(context,credits)
{
   var dialogObj = getDialogObj(context); 
  if (dialogObj) {
          dialogObj.getHtml('perfectCard-t', {perfectCard_credits:credits}, (titlehtml) => {
        	  dialogObj.getHtml('perfectCard-b', {}, (contenthtml) => {
          	alertSkyTwo(titlehtml,  contenthtml, 'icon-mingpianwanshan', (num) => {
          		if (num.index === 0) {
	              context.$router.pushPlus('/my/resume');
	            }
          	}, true);
          });
        });
    }
	}

  
  
  
  
  
 

export {
  alertFenhongxize,
  alertAskCommunityDetailShareSuccess,
  expertcertification,
  alertAskCommunityInteractiveAnswer,
  alertAskCommunityQuestioningSuccess,
  readhubCommenSuccess,
  perfectCard
};
