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
//import localEvent from '../stores/localStorage';

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
   * 跳转到活动报名
   */
  var jumpToApplyActivity = (context, id) => {

    var userInfo = getLocalUserInfo();

    if (userInfo.user_level < 2) {
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

    } else {
      router.pushPlus('/EnrollmentStatus/' + id);
    }
  };

  /**
   * 跳转到机遇报名
   */
  var jumpToApplyOpportunity = (context, id) => {
    var userInfo = getLocalUserInfo();

    if (userInfo.user_level < 3) {
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

    } else {
      router.pushPlus('/EnrollmentStatus/' + id);
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

    var num = parseInt(localEvent.getLocalItem('num').value);
    if (num !== 1) {
      if (userInfo.newbie_unfinish_tasks.complete_userinfo == "false" && userInfo.newbie_unfinish_tasks.complete_userinfo == "false" && userInfo.newbie_unfinish_tasks.complete_userinfo == "false") {
        var dialogObj = getDialogObj(context);
        if (dialogObj) {
          dialogObj.getHtml('p-task', {level: userInfo.user_level}, (html) => {

            alertZoom(html, (num) => {
              localEvent.setLocalItem('num', {value: '1'});

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
     var Card = parseInt(localEvent.getLocalItem('PerfectCard').value)
     if(Card != 1){
       if (userInfo.account_info_complete_percent >= 96) {
           var dialogObj = getDialogObj(context);
		        if (dialogObj) {
			          dialogObj.getHtml('perfectCard-t', {level: userInfo.user_level}, (titlehtml) => {
			        	  dialogObj.getHtml('perfectCard-b', {level: userInfo.user_level}, (contenthtml) => {
			          	alertSkyTwo(titlehtml,  contenthtml, 'icon-mingpianwanshan', (num) => {	
			          		localEvent.setLocalItem('PerfectCard', {value: '1'});
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



  return {
    canDo: canDo,
    jumpToAddProject: jumpToAddProject,
    jumpToApplyProfessor: jumpToApplyProfessor,
    jumpToAddAsk: jumpToAddAsk,
    jumpToAddArticle: jumpToAddArticle,
    jumpToApplyActivity: jumpToApplyActivity,
    jumpToApplyOpportunity:jumpToApplyOpportunity,
    upgradeLevel: upgradeLevel,
    newbieTask: newbieTask,
    perfectCard:perfectCard
  }
};


export default new userAbility();
