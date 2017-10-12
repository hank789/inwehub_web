/**
 * 用户能力
 *
 *  //.step1 导入组件
 import userAbility from 'utils/userAbility'

 //使用
 bool userAbility.canDo(string what) --- 是否可以做某事

 **/
import localEvent from '../stores/localStorage';
import {getLocalUserInfo, isCompanyStatus} from '../utils/user';
import router from '../modules/index/routers/index';
import {alertZoom, alertSkyOne, alertSkyTwo, alertSimple, getDialogObj} from '../utils/dialog';
import { postRequest } from '../utils/request';

var userAbility = () => {

  /**
   * 是否可以做某事
   * @param what
   * @returns {boolean}
   */
  var canDo = (what, context = null) => {
    var result = false;
    switch (what) {
      case 'apply_professor':  //申请专家

        break;
    }
    return result;
  };

  /**
   * 跳转到发布需求
   */
  var jumpToAddProject = (context) => {
    if (isCompanyStatus()) {
      router.push('/project/basic');
    } else {
      router.push('/company/my?back=%2Fmy');
    }
  };

  /**
   * 跳转到申请专家
   */
  var jumpToApplyProfessor = (context) => {
    var userInfo = getLocalUserInfo();
    var expertStatus = parseInt(userInfo.expert_apply_status);
    switch (parseInt(expertStatus)) {
      case 0:
      case 3:
        if (context.$route.path === '/my') {
          router.pushPlus('/my/pilot');
        } else {
          router.push('/my/pilot');
        }
        break;
      case 2:
        mui.toast('您已经是专家');
        break;
      case 1:
        if (context.$route.path === '/my') {
          router.pushPlus('/expert/apply/success?type=0');
        } else {
          router.push('/expert/apply/success?type=0');
        }

        break;
    }
  }

  /**
   * 跳转到专家提问
   */
  var jumpToAddAsk = (context, id = '') => {
    var url = '/ask';
    if (id) {
      url = '/ask/' + id;
    }
    router.push(url);
  };

  /**
   * 跳转到提交文章
   */
  var jumpToAddArticle = (context) => {
    router.push('/discover?redirect_url=%2Fsubmit' + '?' + encodeURIComponent('from=h5' + '&time=' + (new Date()).getTime()));
  };

  /**
   * 跳转到问答社区
   */
  var jumpToAskCommunity = (context) => {

    var userInfo = getLocalUserInfo();

    if (userInfo.user_level >= 2) {
      router.pushPlus('/askCommunity/majors');
    } else {
      var dialog = getDialogObj(context);
      if (dialog) {
        dialog.getHtml('test', {level: userInfo.user_level}, (html) => {
          alertSimple(html, '查看等级详情', (num) => {
            if (num.index === 0) {
              router.pushPlus('/my/Growth');
            }
          }, true);
        });
      }
    }
  };

  /**
   * 跳转到问答社区具体问答详情页
   */
  var jumpToAskCommunityDetail = (context, id) => {

    var userInfo = getLocalUserInfo();

    if (userInfo.user_level >= 2) {
      router.pushPlus('/askCommunity/major/' + id,'list-detail-page' ,true,'pop-in','hide',true);
    } else {
      var dialog = getDialogObj(context);
      if (dialog) {
        dialog.getHtml('test', {level: userInfo.user_level}, (html) => {
          alertSimple(html, '查看等级详情', (num) => {
            if (num.index === 0) {
              router.pushPlus('/my/Growth');
            }
          }, true);
        });
      }
    }
  };

  /**
   * 跳转到活动报名
   */
  var jumpToApplyActivity = (context, id) => {

    var userInfo = getLocalUserInfo();

    if (userInfo.user_level >= 2) {
      router.pushPlus('/EnrollmentStatus/' + id);
    } else {
        var dialog = getDialogObj(context);
        if (dialog) {
        dialog.getHtml('test', {level: userInfo.user_level}, (html) => {
          alertSimple(html, '查看等级详情', (num) => {
            if (num.index === 0) {
              router.pushPlus('/my/Growth');
            }
          }, true);
        });
      }
    }
  };

  /**
   * 跳转到机遇报名
   */
  var jumpToApplyOpportunity = (context, id) => {
    var userInfo = getLocalUserInfo();

    if (userInfo.user_level >= 3) {
    router.pushPlus('/EnrollmentStatus/' + id);
    } else {
     var dialog = getDialogObj(context);
      if (dialog) {
        dialog.getHtml('test', {level: userInfo.user_level}, (html) => {

          alertSimple(html, '查看等级详情', (num) => {

            if (num.index === 0) {
              router.pushPlus('/my/Growth');
            }

          }, true);
        });
      }
    }
  };


  /**
   * 升级等级Newbie Task
   */
  var upgradeLevel = (context, id) => {
    var userInfo = getLocalUserInfo();
    var dialogObj = getDialogObj(context);
    if (dialogObj) {
      dialogObj.getHtml('p-upgrade', {level: userInfo.user_level}, (html) => {
        alertZoom(html, (num) => {
        }, false);
      });
    }
  };


  /**
   * 新手任务Newbie Task  console.log(localEvent.getLocalItem('num'));
   */
  var newbieTask = (context, id) => {
    var userInfo = getLocalUserInfo();
    var mobile = userInfo.phone;
    var num = parseInt(localEvent.getLocalItem("num"+mobile).value);
    if (num != 1) {
    if (!userInfo.newbie_unfinish_tasks.ask) {
        var dialogObj = getDialogObj(context);
        if (dialogObj) {
          dialogObj.getHtml('p-task', {level: userInfo.user_level}, (html) => {
            alertZoom(html, (num) => {
              postRequest(`activity/getCoupon`, {coupon_type:1}).then(response => {
                var code = response.data.code;
                //如果请求不成功提示信息 并且返回上一页；
                if(code !== 1000) {
                  return;
                }
                localEvent.setLocalItem("num"+mobile, {value: '1'});
              });
              if (window.mixpanel.track) {
                window.mixpanel.track(
                  'inwehub:newbie:dialog',
                  {"app": "inwehub", "user_device": getUserAppDevice(), "page": 'newbie-dialog', "page_title": "新手任务弹窗"}
                );
              }
            }, false);
          });
        }
      }
  }
  };


  /**
   * 完善名片的提示框；
   */
  var perfectCard = (context, id) => {
     var userInfo = getLocalUserInfo();
     var uid = userInfo.user_id;
     var Card = parseInt(localEvent.getLocalItem('PerfectCard' + uid).value)
     if(Card != 1){
       if (userInfo.account_info_complete_percent >= 90) {
           var dialogObj = getDialogObj(context);
		        if (dialogObj) {
			          dialogObj.getHtml('perfectCard-t', {level: userInfo.user_level}, (titlehtml) => {
			        	  dialogObj.getHtml('perfectCard-b', {level: userInfo.user_level}, (contenthtml) => {
			          	alertSkyTwo(titlehtml,  contenthtml, 'icon-mingpianwanshan', (num) => {
			          		localEvent.setLocalItem('PerfectCard' + uid, {value: '1'});
			          		if (num.index === 0) {
				              router.pushPlus('/my/resume');
				            }
			          	}, true);
			          });
			        });
		        }
       	}


    }
    };


//专家认证提示；

 var expertcertification = (context, id) => {
    var userInfo = getLocalUserInfo();
    var dialogObj = getDialogObj(context);
     if (dialogObj) {
			          dialogObj.getHtml('expertapplication-t', {level: userInfo.user_level}, (titlehtml) => {
			        	  dialogObj.getHtml('expertapplication-b', {level: userInfo.user_level}, (contenthtml) => {
			          	alertSkyTwo(titlehtml,  contenthtml, 'icon-chengweizhuanjia1', (num) => {
			          		console.log(num)
			          		if (num.index === 0) {
				              router.pushPlus('/my/resume');
				            }
			          	}, true);
			          });
			        });
		        }
  };









  return {
    canDo: canDo,
    jumpToAddProject: jumpToAddProject,
    jumpToApplyProfessor: jumpToApplyProfessor,
    jumpToAddAsk: jumpToAddAsk,
    jumpToAddArticle: jumpToAddArticle,
    jumpToApplyActivity: jumpToApplyActivity,
    jumpToApplyOpportunity:jumpToApplyOpportunity,
    jumpToAskCommunity: jumpToAskCommunity,
    jumpToAskCommunityDetail: jumpToAskCommunityDetail,
    upgradeLevel: upgradeLevel,
    newbieTask: newbieTask,
    perfectCard:perfectCard,
    expertcertification:expertcertification
  }
};


export default new userAbility();
