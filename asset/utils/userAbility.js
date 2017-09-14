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

var userAbility = () => {

  var UserInfo = localEvent.getLocalItem('UserInfo');

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
   * 发布需求
   */
  var addProject = (context) => {
    if (isCompanyStatus()) {
      router.push('/project/basic');
    } else {
      router.push('/company/my?back=%2Fmy');
    }
  };

  /**
   * 申请专家
   */

  var applyProfessor = (context) => {

    var userInfo = getLocalUserInfo();


	if (userInfo.user_level < 2)  {
	  var dialogObj = getDialogObj(context);
	  if (dialogObj) {
      dialogObj.getHtml('test', {level:userInfo.user_level}, (html) => {
        console.log(html);
        alertSimple(html, '查看等级详情', (index) =>{ }, true);
      });
    }

	}else{
    var expertStatus = parseInt(userInfo.expert_apply_status);
    switch (parseInt(expertStatus)) {
      case 0:
      case 3:
        router.pushPlus('/my/pilot');
        break;
      case 2:
        mui.toast('您已经是专家');
        break;
      case 1:
        router.pushPlus('/expert/apply/success?type=0');
        break;
    }
	}



  };

  /**
   * 专家提问
   */
  var addAsk = (context) => {
     router.push('/ask');
  };

  /**
   * 提交文章
   */
  var addArticle = (context) => {
     router.push('/discover?redirect_url=%2Fsubmit' + '?' + encodeURIComponent('from=h5' + '&time=' + (new Date()).getTime()));
  };

  /**
   * 活动报名
   */
  var applyActivity = (context, id) => {
  	
 var userInfo = getLocalUserInfo();	
 
	if (userInfo.user_level < 2)  {	
		 var dialog = getDialogObj(context);
		 if (dialog) {
		 	dialog.getHtml('test', {level:userInfo.user_level}, (html) => {
	            console.log('html:'+html);
	            alertSimple(html,'查看等级详情',(index) =>{ },true);
	       });
		 }
       
	}else{
		router.pushPlus('/EnrollmentStatus/'+id);
	}


  };

 /**
   * 机遇报名
   */
  var applyOpportunity = (context, id) => {
  	
 var userInfo = getLocalUserInfo();	
 
	if (userInfo.user_level < 3)  {	
		 var dialog = getDialogObj(context);
		 if (dialog) {
		 	dialog.getHtml('test', {level:userInfo.user_level}, (html) => {
	            console.log('html:'+html);
	            alertSimple(html,'查看等级详情',(index) =>{ },true);
	       });
		 }
       
	}else{
		router.pushPlus('/EnrollmentStatus/'+id);
	}


  };
  /**
   * 首页查看更多专家
   */
  var moreProfessor = (context) => {

  };


  /**
   * 升级等级
   */
  var upgradeLevel = (context) => {

  };

  return {
    canDo: canDo,
    addProject: addProject,
    applyProfessor: applyProfessor,
    addAsk:addAsk,
    addArticle:addArticle,
    applyActivity:applyActivity,
    moreProfessor:moreProfessor,
    upgradeLevel:upgradeLevel
  }
};


export default new userAbility();
