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

var userAbility = () => {

  var UserInfo = localEvent.getLocalItem('UserInfo');

  /**
   * 是否可以做某事
   * @param what
   * @returns {boolean}
   */
  var canDo = (what) => {
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
  var addProject = () => {
    if (isCompanyStatus()) {
      router.push('/project/basic');
    } else {
      router.push('/company/my?back=%2Fmy');
    }
  };

  /**
   * 申请专家
   */
  var applyProfessor = () => {
    var userInfo = getLocalUserInfo();
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
  };

  /**
   * 专家提问
   */
  var addAsk = () => {
     router.push('/ask');
  };

  /**
   * 提交文章
   */
  var addArticle = () => {
     router.push('/discover?redirect_url=%2Fsubmit' + '?' + encodeURIComponent('from=h5' + '&time=' + (new Date()).getTime()));
  };

  return {
    canDo: canDo,
    addProject: addProject,
    applyProfessor: applyProfessor,
    addAsk:addAsk,
    addArticle:addArticle
  }
};


export default new userAbility();
