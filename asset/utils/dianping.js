import {getRequest, postRequest} from './request'

/* 产品详情 */
function getProductDetail (context, title, callback) {
  postRequest(`tags/product`, {
    tag_name: title
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    callback(response.data.data)
  })
}

/* 点评详情 */
function getCommentDetail (context, id, callback) {
  postRequest(`article/detail-by-slug`, {
    slug: id
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    callback(response.data.data)
  })
}

/* 点评 */
function add (context, data, options, callback) {
  postRequest(`article/store`, {
    type: 'review',
    title: data.content,
    photos: data.photos,
    category_ids: data.category_ids,
    tags: data.product_id,
    rate_star: data.rate_star,
    hide: data.isHide,
    identity: data.identity
  }, false, options).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    callback(response.data.data)
  })
}

/* 精华点评列表 */
function getRecommandProductList (context, num, callback) {
  postRequest(`tags/getRecommendReview`, {
    perPage: num,
    page: 1
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    callback(response.data.data.data)
  })
}

/* 产品分类 */
function getCategories (context, callback) {
  postRequest(`tags/getProductCategories`, {
    parent_id: 0
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    callback(response.data.data)
  })
}

/* 关注产品 */
function collectProduct (context, id, upCallback, downCallback) {
  postRequest(`follow/tag`, {
    id: id
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    window.mui.toast(response.data.data.tip)
    if (response.data.data.type === 'unfollow') {
      downCallback()
    } else {
      upCallback()
    }
  })
}

/* 产品点评列表 */
function getProductComments (context, id, pageNum, callback) {
  postRequest(`tags/productReviewList`, {
    tag_name: id,
    perPage: pageNum
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    callback(response.data.data.data)
  })
}

/* 获取角色列表 */
function getTags (context, callback) {
  postRequest(`tags/load`, {
    tag_type: 8
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    callback(response.data.data.tags)
  })
}

/* 创建新产品 */
function addProduct (context, data, callback) {
  var options = {
    onUploadProgress: function (progressEvent) {
      var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      window.mui.uploadWaitingValue(percentCompleted)
    }
  }

  window.mui.showUploadWaiting()

  postRequest(`tags/submitProduct`, {
    name: data.name,
    logo: data.logo,
    category_ids: data.category_ids,
    company: data.company,
    summary: data.summary
  }, false, options).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }
    callback(response.data.data)
  })
}

/* 产品问题反馈 */

function feedBackProduct (context, data, callback) {
  var options = {
    onUploadProgress: function (progressEvent) {
      var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      window.mui.uploadWaitingValue(percentCompleted)
    }
  }

  window.mui.showUploadWaiting()

  postRequest(`tags/feedbackProduct`, {
    type: data.type,
    content: data.content,
    images: data.images,
    product: data.product
  }, false, options).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }
    callback(response.data.data.data)
  })
}

/* 热门产品 */

function getHotProduct (context, perPage, callback) {
  getRequest(`weapp/product/getHot`, {
    perPage: perPage
  }).then(res => {
    var code = res.data.code
    if (code !== 1000) {
      window.mui.toast(res.data.message)
      return
    }
    callback(res.data.data.data)
  })
}

/* 热门专题 */

function gethotAlbum (context, callback) {
  getRequest(`weapp/product/hotAlbum`, {}).then(res => {
    var code = res.data.code
    if (code !== 1000) {
      window.mui.toast(res.data.message)
      return
    }
    callback(res.data.data)
  })
}

/* 更多专题 */

function getAlbumList (context, perPage, callback) {
  getRequest(`weapp/product/albumList`, {
    perPage: perPage
  }).then(res => {
    var code = res.data.code
    if (code !== 1000) {
      window.mui.toast(res.data.message)
      return
    }
    callback(res.data.data)
  })
}

/* 我期待的专题 */

function submitFeedback (context, title, callback) {
  postRequest(`system/feedback`, {
    title: '期待专题',
    content: title
  }).then(res => {
    var code = res.data.code
    if (code !== 1000) {
      window.mui.toast(res.data.message)
      return
    } else {
      window.mui.toast('提交成功')
    }
    callback(res.data)
  })
}

export {
  add,
  getCommentDetail,
  getProductDetail,
  getRecommandProductList,
  getCategories,
  collectProduct,
  getProductComments,
  getTags,
  addProduct,
  feedBackProduct,
  getHotProduct,
  gethotAlbum,
  getAlbumList,
  submitFeedback
}

