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


    if (userInfo.user_level < 2) {
      var dialogObj = getDialogObj(context);
      if (dialogObj) {
        dialogObj.getHtml('test', {level: userInfo.user_level}, (html) => {
          console.log(html);
          alertSimple(html, '查看等级详情', (num) => {

            if (num.index == 0) {
//      	 	console.log('my');
              router.pushPlus('/my/Growth');
            }

          }, true);
        });
      }

    } else {
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

    if (userInfo.user_level < 2) {
      var dialog = getDialogObj(context);
      if (dialog) {
        dialog.getHtml('test', {level: userInfo.user_level}, (html) => {
          console.log('html:' + html);
          alertSimple(html, '查看等级详情', (num) => {

            if (num.index == 0) {
              //      	 	console.log('my');
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
   * 机遇报名
   */
  var applyOpportunity = (context, id) => {

    var userInfo = getLocalUserInfo();

    if (userInfo.user_level < 3) {
      var dialog = getDialogObj(context);
      if (dialog) {
        dialog.getHtml('test', {level: userInfo.user_level}, (html) => {
          console.log('html:' + html);
          alertSimple(html, '查看等级详情', (num) => {

            if (num.index == 0) {
//      	 	console.log('my');
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
   * 首页查看更多专家
   */
  var moreProfessor = (context) => {
    var userInfo = getLocalUserInfo();


    if (userInfo.user_level < 4) {
      var dialogObj = getDialogObj(context);
      if (dialogObj) {
        dialogObj.getHtml('test', {level: userInfo.user_level}, (html) => {
          console.log(html);
          alertSimple(html, '查看等级详情', (num) => {

            if (num.index == 0) {
//      	 	console.log('my');
              router.pushPlus('/my/Growth');
            }

          }, true);
        });
      }

    } else {

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
//      console.log(html);
        alertZoom(html, (num) => {

          if (num.index == 1) {
            num.index == -1;
          }

        }, false);
      });
    }

  };


  /**
   * 新手任务Newbie Task  console.log(localEvent.getLocalItem('num'));
   */
  var newbieTask = (context, id) => {
    var userInfo = getLocalUserInfo();
//	console.log(userInfo.newbie_unfinish_tasks);
//console.log(typeof(parseInt(localEvent.getLocalItem('num').value)));
    var num = parseInt(localEvent.getLocalItem('num').value);
    if (num != 1) {
      if (userInfo.newbie_unfinish_tasks) {
        var dialogObj = getDialogObj(context);
        if (dialogObj) {
          dialogObj.getHtml('p-task', {level: userInfo.user_level}, (html) => {
//          console.log(html);
            alertZoom(html, (num) => {
              console.log(num.index)
              localEvent.setLocalItem('num', {value: '1'});

            }, false);
          });
        }
      }
    }

//	 console.log(localEvent.getLocalItem(num))
  };

  return {
    canDo: canDo,
    addProject: addProject,
    applyProfessor: applyProfessor,
    addAsk: addAsk,
    addArticle: addArticle,
    applyActivity: applyActivity,
    moreProfessor: moreProfessor,
    upgradeLevel: upgradeLevel,
    newbieTask: newbieTask
  }
};


export default new userAbility();
