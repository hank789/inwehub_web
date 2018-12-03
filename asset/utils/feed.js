
import { deleteItem as deleteDiscoverItem, collect } from './discover'
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
  }

  return iconMenus
}

function iconMenusClickedItem (context, item, iconItemClicked) {
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
        context.$refs.share.share()
        collect(context, item.feed.submission_id, () => {
          item.feed.is_bookmark = true
        }, () => {
          item.feed.is_bookmark = false
        })
        break
      case '已收藏':
        context.$refs.share.share()
        collect(context, item.feed.submission_id, () => {
          item.feed.is_bookmark = true
        }, () => {
          item.feed.is_bookmark = false
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
