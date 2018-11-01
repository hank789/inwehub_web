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
function add (context, data, callback) {
  postRequest(`article/store`, {
    type: 'review',
    title: data.content,
    photos: data.photos,
    category_ids: data.category_ids,
    tags: data.product_id,
    rate_star: data.rate_star,
    hide: data.isHide,
    identity: data.identity
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    callback()
  })
}

/* 精华点评列表 */
function getRecommandProductList (context, num, callback) {
  postRequest(`tags/getRecommendReview`, {
    perPage: 4,
    page: 1
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    callback(response.data.data)
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

export {
  add,
  getCommentDetail,
  getProductDetail,
  getRecommandProductList,
  getCategories
}

