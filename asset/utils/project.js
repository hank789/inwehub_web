import localEvent from '../stores/localStorage'
import { postRequest } from '../utils/request'

var options = {
  project_stage_text (projectStage) {
    switch (parseInt(projectStage)) {
      case 1:
        return '只有个想法，还需要看看'
      case 2:
        return '项目已立项，就等顾问来操刀'
      case 3:
        return '项目进行中，需要大牛加入'
    }

    return ''
  },
  project_type_text (projectType) {
    switch (parseInt(projectType)) {
      case 1:
        return '一次性'
      case 2:
        return '持续性'
    }
    return ''
  },
  worker_num_text (workerNum) {
    switch (parseInt(workerNum)) {
      case 1:
        return '1个'
      case 2:
        return '2个'
      case 3:
        return '3~5个'
      case 4:
        return '5~8个'
      case 5:
        return '8个以上'
      case 6:
        return '其他'
      case 7:
        return '不确定'
    }
    return ''
  },
  project_cycle_text (projectCycle) {
    switch (parseInt(projectCycle)) {
      case 1:
        return '小于1周'
      case 2:
        return '1-2周'
      case 3:
        return '2-4周'
      case 4:
        return '1-2月'
      case 5:
        return '2-4月'
      case 6:
        return '4-6月'
      case 7:
        return '半年以上'
      case 8:
        return '不确定'
      case 9:
        return '其他'
    }
    return ''
  },
  billing_mode_text (billingMode) {
    switch (parseInt(billingMode)) {
      case 1:
        return '按人计算'
      case 2:
        return '2整体打包'
    }
    return ''
  },
  work_intensity_text (workIntensity) {
    switch (parseInt(workIntensity)) {
      case 1:
        return '2H/W'
      case 2:
        return '4H/W'
      case 3:
        return '8H/W'
      case 4:
        return '16H/W'
      case 5:
        return '24H/W'
      case 6:
        return '32H/W'
      case 7:
        return '40H/W'
      case 8:
        return '其他'
      case 9:
        return '我不确定'
    }
    return ''
  },
  worker_level_text (workerLevel) {
    switch (parseInt(workerLevel)) {
      case 1:
        return '熟练'
      case 2:
        return '精通'
      case 3:
        return '3资深'
    }
    return ''
  },
  remote_work_text (remoteWork) {
    switch (parseInt(remoteWork)) {
      case 1:
        return '接受'
      case 2:
        return '不接受'
    }
    return ''
  }
}

function getCacheInfo () {
  var info = localEvent.getLocalItem('ProjectInfo')

  if (typeof info === 'object') {
    if (!info.basic) {
      return false
    }
  }

  return info
}

function setCacheInfo (pageName, projectObj) {
  var obj = getCacheInfo()
  if (!obj) {
    obj = {}
  }
  obj[pageName] = projectObj
  localEvent.setLocalItem('ProjectInfo', obj)
}

function cacheProject (projectId, obj) {
  var info = localEvent.getLocalItem('ProjectInfo')
  if (info && info.basic && !info.basic.editMode) {
    console.log('编辑模式：缓存草稿')
    localEvent.setLocalItem('ProjectInfoBmp', info)
  }

  postRequest(`project/info`, {
    id: projectId
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.alert(response.data.message)
      return
    }

    console.log('编辑模式：请求新数据')

    var projectInfo = response.data.data

    var basic = {
      project_id: projectInfo.project_id,
      project_name: projectInfo.project_name,
      project_type: projectInfo.project_type,
      project_stage: projectInfo.project_stage,
      project_stage_text: options.project_stage_text(projectInfo.project_stage),
      project_description: projectInfo.project_description,
      disableButton: false,
      editMode: true,
      deleted_images: [],
      loading: 0
    }

    for (var i in basic) {
      obj[i] = basic[i]
    }

    var images = projectInfo.images
    obj.images = []
    for (var imageIndex in images) {
      var cacheImg = {
        name: '',
        size: '',
        base64: images[imageIndex],
        isNew: false
      }
      obj.images.push(cacheImg)
    }

    setCacheInfo('basic', basic)

    var concrete = {
      disabledButton: false,
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
      loading: 0
    }

    setCacheInfo('concrete', concrete)

    const currentUser = localEvent.getLocalItem('UserInfo')
    var company = {
      disabledButton: false,
      company_name: projectInfo.company_name,
      company_description: projectInfo.company_description,
      company_industry_tags: projectInfo.company_industry_tags,
      company_represent_person_is_self: projectInfo.company_represent_person_is_self,
      company_represent_person_name: projectInfo.company_represent_person_name,
      company_represent_person_title: projectInfo.company_represent_person_title,
      company_represent_person_phone: projectInfo.company_represent_person_phone,
      company_represent_person_email: projectInfo.company_represent_person_email,
      company_billing_need: projectInfo.company_billing_title ? '1' : '0',
      company_billing_title: projectInfo.company_billing_title,
      company_billing_bank: projectInfo.company_billing_bank,
      company_billing_account: projectInfo.company_billing_account,
      company_billing_taxes: projectInfo.company_billing_taxes,
      page_industry_tags_id: 'page_industry_tags',
      object_type: 'project',
      localUser: currentUser,
      loading: 0
    }
    setCacheInfo('company', company)

    var like = {
      qualification_requirements: projectInfo.qualification_requirements,
      other_requirements: projectInfo.other_requirements,
      is_view_resume: projectInfo.is_view_resume,
      is_apply_request: projectInfo.is_apply_request,
      loading: 0
    }
    setCacheInfo('like', like)
  })
}

/**
 * 重置缓存(bmp模式)
 */
function resetCache (obj) {
  // 从bmp里恢复
  var info = localEvent.getLocalItem('ProjectInfoBmp')

  if (info && info.basic && !info.basic.editMode) {
    console.log('从bmp里恢复')
    clearCacheInfo()
    localEvent.clearLocalItem('ProjectInfoBmp')
    localEvent.setLocalItem('ProjectInfo', info)

    if (info.basic) {
      for (var i in info.basic) {
        if (i === 'images') continue
        obj[i] = info.basic[i]
      }

      obj.images = info.basic.images
    }
  }

  // 当前是编辑模式清空
  var project = getCacheInfo()
  if (project && project.basic && project.basic.editMode) {
    console.log('当前是编辑模式清空')
    clearCacheInfo()

    var basic = {
      project_id: null,
      project_name: '',
      project_type: '1',
      project_stage: null,
      project_stage_text: '',
      project_description: '',
      disableButton: true,
      deleted_images: [],
      editMode: false,
      images: [],
      loading: 1
    }
    if (basic) {
      for (var basicIndex in basic) {
        if (basicIndex === 'images') continue
        obj[i] = basic[i]
      }
    }

    obj.images = basic.images
  }

  // bmp模式直接读取
  if (project && project.basic && !project.basic.editMode) {
    console.log('bmp模式直接读取')
    for (var projectIndex in project.basic) {
      if (projectIndex === 'images' || projectIndex === 'deleted_images') continue
      obj[projectIndex] = project.basic[projectIndex]
    }

    obj.images = project.basic.images
  }
}

function clearCacheInfo () {
  localEvent.clearLocalItem('ProjectInfo')
}

export {
  getCacheInfo,
  setCacheInfo,
  clearCacheInfo,
  resetCache,
  cacheProject,
  options
}
