/**
 * 用户能力权限检查
 *
 *  //.step1 导入组件
 import userAbilityCheck from 'utils/userAbilityCheck'

 //使用


 **/
import localEvent from '../stores/localStorage';
import {getLocalUserInfo, isCompanyStatus} from '../utils/user';
import router from '../modules/index/routers/index';
import {alertZoom, alertSkyOne, alertSkyTwo, alertSimple, getDialogObj} from '../utils/dialog';

var userAbilityCheck = () => {
  var UserInfo = localEvent.getLocalItem('UserInfo');
  /**
   * 申请专家条件验证
   */
  var applyProfessor = (context) => {

    var userInfo = getLocalUserInfo();

    //验证资料的完善程度
    var account_info_complete_percent = userInfo.account_info_complete_percent;
    if (account_info_complete_percent < 96) {
      var font = '<p style= "text-align:left">' + '申请专家认证需要保证个人资料完整度在96%以上，请前往进行维护。' + '</p>';
      var title = '<p style="font-size:16px; margin-bottom:15px">' + '温馨提示 ' + '</p>';
      mui.confirm(font, title, function (e) {
        if (e.index == 1) {
          router.replace('/my/info');
        } else {

        }
      }, 'div');
      return false;
    }


    //验证用户等级
    if (userInfo.user_level < 2) {
      var dialogObj = getDialogObj(context);
      if (dialogObj) {
        dialogObj.getHtml('test', {level: userInfo.user_level}, (html) => {
          alertSimple(html, '查看等级详情', (num) => {
            if (num.index === 0) {
              router.pushPlus('/my/Growth');
            }
          }, true);
        });
      }
      return false;
    }

    //验证用户状态
    var expertStatus = parseInt(userInfo.expert_apply_status);
    switch (parseInt(expertStatus)) {
      case 0:
      case 3:
        //is ok
        break;
      case 2:
        mui.toast('您已经是专家');
        return false;
        break;
      case 1:
        if (context.$route.path === '/my') {
          router.pushPlus('/expert/apply/success?type=0');
        } else {
          router.push('/expert/apply/success?type=0');
        }
        break;
    }
    return true;
  };


  /**
   * 首页查看更多专家
   */
  var moreProfessor = (context) => {
    var userInfo = getLocalUserInfo();

    if (userInfo.user_level < 4) {
      var dialogObj = getDialogObj(context);
      if (dialogObj) {
        dialogObj.getHtml('test', {level: userInfo.user_level}, (html) => {

          alertSimple(html, '查看等级详情', (num) => {
            if (num.index === 0) {
              router.pushPlus('/my/Growth');
            }
          }, true);
        });
      }
      return false;

    }

    return true;
  };
  
  
  
   /**
   * 完善名片的提示框；
   */
  var  perfectCard = (context) => {
    var userInfo = getLocalUserInfo();
    
    if (userInfo.account_info_complete_percent < 96) {
      var dialogObj = getDialogObj(context);
      if (dialogObj) {
        dialogObj.getHtml('perfectCard-t', {level: userInfo.user_level}, (titlehtml) => {
        	  dialogObj.getHtml('perfectCard-b', {level: userInfo.user_level}, (contenthtml) => {
          	alertSkyTwo(titlehtml,  contenthtml, 'icon-mingpianwanshan', (num) => {
          		if (num.index === 0) {
	              router.pushPlus('/my/resume');
	            }
          	}, true);
          });
        });
      }
      return false;

    }

    return true;
  };

 


  return {
    applyProfessor: applyProfessor,
    moreProfessor:moreProfessor,
    perfectCard:perfectCard

};
}


export default new userAbilityCheck();
