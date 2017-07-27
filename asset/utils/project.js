import localEvent from '../stores/localStorage';
import {apiRequest, postRequest} from '../utils/request';

var options = {
  project_stage_text(project_stage) {

    switch(parseInt(project_stage)) {
      case 1:
        return '只有个想法，还需要看看';
        break;
      case 2:
        return '项目已立项，就等顾问来操刀';
        break;
      case 3:
        return '项目进行中，需要大牛加入';
        break;
    }
  },
  project_type_text(project_type){
    switch(parseInt(project_type)) {
      case 1:
        return '一次性';
        break;
      case 2:
        return '持续性';
        break;
    }
  },
  worker_num_text(worker_num){
    switch(parseInt(worker_num)) {
      case 1:
        return '1个';
        break;
      case 2:
        return '2个';
        break;
      case 3:
        return '3~5个';
        break;
      case 4:
        return '5~8个';
        break;
      case 5:
        return '8个以上';
        break;
      case 6:
        return '其他';
        break;
      case 7:
        return '不确定';
        break;
    }
  },
  project_cycle_text(project_cycle){
    switch(parseInt(project_cycle)) {
      case 1:
        return '小于1周';
        break;
      case 2:
        return '1-2周';
        break;
      case 3:
        return '2-4周';
        break;
      case 4:
        return '1-2月';
        break;
      case 5:
        return '2-4月';
        break;
      case 6:
        return '4-6月';
        break;
      case 7:
        return '半年以上';
        break;
      case 8:
        return '不确定';
        break;
      case 9:
        return '其他';
        break;
    }
  },
  billing_mode_text(billing_mode){
    switch(parseInt(billing_mode)) {
      case 1:
        return '按人计算';
        break;
      case 2:
        return '2整体打包';
        break;
    }
  },
  work_intensity_text(work_intensity){
    switch(parseInt(work_intensity)) {
      case 1:
        return '2H/W';
        break;
      case 2:
        return '4H/W';
        break;
      case 3:
        return '8H/W';
        break;
      case 4:
        return '16H/W';
        break;
      case 5:
        return '24H/W';
        break;
      case 6:
        return '32H/W';
        break;
      case 7:
        return '40H/W';
        break;
      case 8:
        return '其他';
        break;
      case 9:
        return '我不确定';
        break;
    }
  },
  worker_level_text(worker_level){
    switch(parseInt(worker_level)) {
      case 1:
        return '熟练';
        break;
      case 2:
        return '精通';
        break;
      case 3:
        return '3资深';
        break;
    }
  },
  remote_work_text(remote_work){
    switch(parseInt(remote_work)) {
      case 1:
        return '接受';
        break;
      case 2:
        return '不接受';
        break;
    }
  },
};

function getCacheInfo() {
  var info = localEvent.getLocalItem('ProjectInfo');

  if (typeof info === 'object') {
    if (!info.basic) {
      return false;
    }
  }

  return info;
}

function setCacheInfo(pageName, projectObj) {
  var obj = getCacheInfo();
  if (!obj) {
    obj = {};
  }
  obj[pageName] = projectObj;
  localEvent.setLocalItem('ProjectInfo', obj);
}


function cacheProject(projectId, obj) {

  var info = localEvent.getLocalItem('ProjectInfo');
  if (info && info.basic && !info.basic.editMode) {
    localEvent.setLocalItem('ProjectInfoBmp', info);
  }

  postRequest(`project/info`, {
    id: projectId
  }).then(response => {
    var code = response.data.code;
    if (code !== 1000) {
      mui.alert(response.data.message);
      return;
    }

    var projectInfo = response.data.data;

    var images = projectInfo.images;
    var cacheImages = [];
    for(var i in images) {
      cacheImages[i]={};
      cacheImages[i].url = images[i];
    }

    var basic = {
      project_id: projectInfo.project_id,
      project_name: projectInfo.project_name,
      project_type: projectInfo.project_type,
      project_stage: projectInfo.project_stage,
      project_stage_text: options.project_stage_text(projectInfo.project_stage),
      project_description: projectInfo.project_description,
      disableButton: false,
      editMode:true,
      deleted_images: [],
      images: cacheImages,
      loading: 0
    };

    for (var i in basic) {
      obj[i] = basic[i];
    }

    setCacheInfo('basic', basic);


    var concrete = {
      worker_num: projectInfo.worker_num,
      worker_num_text: options.worker_num_text(projectInfo.worker_num),
      worker_level: projectInfo.worker_level,
      project_amount: projectInfo.project_amount,
      billing_mode: projectInfo.billing_mode,
      project_begin_time: projectInfo.project_begin_time,
      project_cycle: projectInfo.project_cycle,
      project_cycle_text: options.project_cycle_text(projectInfo.project_cycle),
      work_intensity: projectInfo.work_intensity,
      work_intensity_text: options.work_intensity_text(projectInfo.work_intensity),
      remote_work: projectInfo.remote_work,
      travel_expense: projectInfo.travel_expense,
      work_address: projectInfo.work_address,
      disabledButton: false,
      loading: 0
    }
    setCacheInfo('concrete', concrete);


    const currentUser = localEvent.getLocalItem('UserInfo');
    var company = {
      company_name:projectInfo.company_name,
      company_description:projectInfo.company_description,
      company_industry_tags:projectInfo.company_industry_tags,
      company_represent_person_is_self:projectInfo.company_represent_person_is_self,
      company_represent_person_name:projectInfo.company_represent_person_name,
      company_represent_person_title:projectInfo.company_represent_person_title,
      company_represent_person_phone:projectInfo.company_represent_person_phone,
      company_represent_person_email:projectInfo.company_represent_person_email,
      company_billing_need:projectInfo.company_billing_title?'1':'0',
      company_billing_title:projectInfo.company_billing_title,
      company_billing_bank:projectInfo.company_billing_bank,
      company_billing_account:projectInfo.company_billing_account,
      company_billing_taxes:projectInfo.company_billing_taxes,
      disabledButton: false,
      page_industry_tags_id: 'page_industry_tags',
      object_type: 'project',
      localUser:currentUser,
      loading: 0
    };
    setCacheInfo('company', company);


    var like = {
      qualification_requirements:projectInfo.qualification_requirements,
      other_requirements:projectInfo.other_requirements,
      is_view_resume:projectInfo.is_view_resume,
      is_apply_request:projectInfo.is_apply_request,
      loading: 0
    };
    setCacheInfo('like', like);
  });
}

/**
 * 重置缓存
 */
function resetCache(obj)
{
  var info = localEvent.getLocalItem('ProjectInfoBmp');
  if (info && info.basic && !info.basic.editMode) {
      clearCacheIno();
      localEvent.clearLocalItem('ProjectInfoBmp');
      localEvent.setLocalItem('ProjectInfo', info);

    if (info.basic) {
      for (var i in info.basic) {
        obj[i] = info.basic[i];
      }
    }
  }
}

function clearCacheIno() {
  localEvent.clearLocalItem('ProjectInfo');
}





export {
  getCacheInfo,
  setCacheInfo,
  clearCacheIno,
  resetCache,
  cacheProject,
  options,
};
