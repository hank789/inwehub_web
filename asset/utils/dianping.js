import { postRequest } from './request'

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
  postRequest(`tags/submitProduct`, {
    name: data.name,
    logo: data.logo,
    category_ids: data.category_ids,
    company: data.company,
    summary: data.summary
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }
    callback(response.data.data.data)
  })
}

/* 产品问题反馈 */

function feedBackProduct (context, data, callback) {
  postRequest(`tags/feedbackProduct`, {
    type: data.type,
    content: data.content,
    images: data.images,
    product: data.product
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }
    callback(response.data.data.data)
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
  feedBackProduct
}

