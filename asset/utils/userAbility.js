/**
 * 用户能力判断
 *
 *  //.step1 导入组件
     import userAbility from 'utils/userAbility'

    //使用
    bool userAbility.canDo(string what) --- 是否可以做某事

 **/
import localEvent from '../stores/localStorage';

var userAbility = () => {

    var UserInfo = localEvent.getLocalItem('UserInfo');

  /**
   * 是否可以做某事
   * @param what
   * @returns {boolean}
   */
    var canDo = (what) => {
        var result = false;
        switch(what) {
           case 'apply_professor':  //申请专家

                break;
        }
        return result;
    };

    return {
      canDo:canDo
    }
};



export default new userAbility();
