
import { deleteItem as deleteDiscoverItem, collect, setTop, addGood, cancelGood, cancelTop, report } from './discover'
import { getLocalUserId } from './user'
import { getIndexByIdArray } from './array'

function isAsk (item) {
  switch (item.feed_type) {
    case 1:
    case 2:
    case 3:
    case 6:
    case 11:
    case 12:
    case 14:
      return true
    default:
      return false
  }
}

function isDiscover (item) {
  switch (item.feed_type) {
    case 15:
    case 16:
    case 5:
      return true
    default:
      return false
  }
}

function isComment (item) {
  switch (item.feed_type) {
    case 17:
      return true
    default:
      return false
  }
}

function getIconMenus (item) {
  var iconMenus = []
  if (isDiscover(item)) {
    if (getLocalUserId() === item.user.id) {
      iconMenus.push({
        icon: '#icon-shanchu1',
        text: '删除'
      })
    }

    if (item.feed.is_bookmark) {
      iconMenus.push({
        icon: '#icon-shoucangdilantongyi',
        text: '已收藏',
        isBookMark: 1
      })
    } else {
      iconMenus.push({
        icon: '#icon-shoucangdilantongyi',
        text: '收藏',
        isBookMark: 0
      })
    }

    if (item.feed.is_group_owner) {
      if (item.feed.is_recommend) {
        iconMenus.push({
          icon: '#icon-sheweijingxuan',
          text: '取消加精'
        })
      } else {
        iconMenus.push({
          icon: '#icon-sheweijingxuan',
          text: '设为精选'
        })
      }

      if (item.feed.top) {
        iconMenus.push({
          icon: '#icon-zhiding',
          text: '取消置顶'
        })
      } else {
        iconMenus.push({
          icon: '#icon-zhiding',
          text: '置顶'
        })
      }
    }
    iconMenus.push({
      icon: '#icon-jubao',
      text: '举报'
    })
  }
  return iconMenus
}

function iconMenusClickedItem (context, item, iconItemClicked, callback) {
  if (isDiscover(item)) {
    switch (iconItemClicked.text) {
      case '删除':
        context.$refs.share.share()
        deleteDiscoverItem(item.id, () => {
          var index = getIndexByIdArray(context.list, item.id)
          context.list.splice(index, 1)
        })
        break
      case '收藏':
        collect(context, item.feed.submission_id, () => {
          item.feed.is_bookmark = true
          callback()
        }, () => {
          item.feed.is_bookmark = false
          callback()
        })
        break
      case '已收藏':
        collect(context, item.feed.submission_id, () => {
          item.is_recommend = 1
          var index = getIndexByIdArray(context.list, item.id)
          context.list[index].feed.is_recommend = 1
          callback()
        }, () => {
          item.feed.is_bookmark = false
          callback()
        })
        break
      case '设为精选':
        addGood(item.feed.submission_id, () => {
          item.feed.is_recommend = true
          callback()
        })
        break
      case '取消加精':
        cancelGood(item.feed.submission_id, () => {
          item.feed.is_recommend = false
          callback()
        })
        break
      case '置顶':
        setTop(item.feed.submission_id, () => {
          item.feed.top = true
          callback()
        })
        break
      case '取消置顶':
        cancelTop(item.feed.submission_id, () => {
          item.feed.top = false
          callback()
        })
        break
      case '举报':
        context.$refs.share.share()
        setTimeout(() => {
          report(context, item.url)
        })
        break
    }
  }

  if (isAsk(item)) {

  }

  if (isComment(item)) {

  }
}

export {
  isAsk,
  isDiscover,
  isComment,
  iconMenusClickedItem,
  getIconMenus
}
