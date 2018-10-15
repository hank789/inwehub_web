<template>
  <div>
    <div class="mui-content" v-if="!loading" id="home-content">

      <div v-if="!isInGroup && !detail.public">
        <div class="header">
          <img v-lazy="detail.background_img" class="lazyImg">
          <div class="backMask"></div>
          <div class="headerBack">
            <div @tap.stop.prevent="goBack">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-fanhui"></use>
              </svg>
            </div>
          </div>
          <div class="openNotice share" @tap.stop.prevent="joinShare">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shoucang-xiao"></use>
            </svg>
          </div>
          <div class="headPhotowrapper">
            <div class="headImages">
              <img v-lazy="detail.logo" class="lazyImg">
            </div>
          </div>
        </div>
        <div class="groupWrapper" @tap.stop.prevent="goMoreSetup">
          <div class="groupNAmeWrapper">
            <span class="font-family-medium">{{detail.name}}</span>
          </div>
          <div class="groupDescribeWrapper">
            <span>{{detail.subscribers}}人气 · </span><span>{{detail.articles}}分享</span>
            <span v-if="!detail.public">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-simi"></use>
                </svg> · 私密
              </span>
          </div>
          <div class="goMoreoPerations" v-if="detail.audit_status === 1">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jinru"></use>
            </svg>
          </div>
        </div>
      </div>

      <div v-if="isInGroup || detail.public">
        <RefreshList
          ref="RefreshList"
          v-model="list"
          :api="'group/submissionList'"
          :prevSuccessCallback="prevSuccessCallback"
          :prevOtherData="prevOtherData"
          :nextOtherData="nextOtherData"
          :pageMode="true"
          :isShowUpToRefreshDescription="false"
          :autoShowEmpty="false"
          :isLoadingByRefresh="false"
          :list="list"
          class="listWrapper"
        >
          <div>
            <div class="header">
              <img class="lazyImg" v-lazy="detail.background_img" alt="">
              <div class="backMask"></div>
              <div class="headerBack">
                <div @tap.stop.prevent="goBack">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-fanhui"></use>
                  </svg>
                </div>
              </div>
              <div class="openNotice" v-if="detail.current_user_notify" @tap.stop.prevent="closeNotice">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-tongzhi"></use>
                </svg>
              </div>

              <div class="openNotice" v-if="!detail.current_user_notify" @tap.stop.prevent="openNotice">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-tongzhiguanbi"></use>
                </svg>
              </div>
              <div class="openNotice share" @tap.stop.prevent="joinShare">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shoucang-xiao"></use>
                </svg>
              </div>
              <div class="headPhotowrapper">
                <div class="headImages">
                  <img class="lazyImg" v-lazy="detail.logo" alt="">
                </div>
              </div>
            </div>
            <div class="groupWrapper" id="groupWrapper" @tap.stop.prevent="goMoreSetup">
              <div class="groupNAmeWrapper">
                <span class="font-family-medium">{{detail.name}}</span>
              </div>
              <div class="groupDescribeWrapper">
                <span>{{detail.subscribers}}人气 · </span><span>{{detail.articles}}分享</span>
                <span v-if="!detail.public">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-simi"></use>
                  </svg> · 私密
                </span>
              </div>
              <div class="groupDescription" v-if="detail.is_joined === -1">
                <span>{{detail.description}}</span>
              </div>
              <div class="goMoreoPerations" v-if="detail.audit_status === 1">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-jinru"></use>
                </svg>
              </div>
            </div>
          </div>

        <div class="gray"></div>
        <div class="menu">
          <span :class="{'font-family-medium': search_type === 1}" @tap.stop.prevent="chooseType(1)">全部<i
            v-if="search_type === 1"></i></span>
          <span :class="{'font-family-medium': search_type === 3}" @tap.stop.prevent="chooseType(3)">精华<i
            v-if="search_type === 3"></i></span>
          <i class="bot"></i>
        </div>
          <div class="groups-list">
            <template v-for="(item, index) in list">
              <div v-if="item.feed_type === 15" @tap.stop.prevent="toDetail(item)">
                <!--x发布了分享-->
                <DiscoverShare
                  :data="item"
                  :show='isShowItemOption(item)'
                  ref="discoverShare"
                  @showItemOptions="showItemOptions(item, index)"
                ></DiscoverShare>
              </div>
              <div v-else-if="item.feed_type === 16"  @tap.stop.prevent="toDetail(item)">
                <!--x发布了链接分享-->
                <SubmitReadhubAriticle :data="item"
                                       :show='isShowItemOption(item)'
                                       @showItemOptions="showItemOptions(item, index)"
                ></SubmitReadhubAriticle>
              </div>
              <div v-else-if="item.feed_type === 5"  @tap.stop.prevent="toDetail(item)">
                <!--x发布了原创文章，有title何描述-->
                <SubmitReadhubAriticle :data="item"
                                       :show='isShowItemOption(item)'
                                       @showItemOptions="showItemOptions(item, index)"
                ></SubmitReadhubAriticle>
              </div>
            </template>
          </div>
          <!--为空的提示-->
          <div class="Nothing" v-if="!list.length">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zanwushuju"></use>
            </svg>
            <p>暂无数据</p>
          </div>

        </RefreshList>
        <div class="join addGroup" v-if="detail.is_joined === -1" @tap.stop.prevent="joinIn">加入圈子</div>
      </div>

      <!--不可以浏览-->
      <div v-else>
        <div class="gray"></div>

        <div class="group-text">
          <span class="font-family-medium">圈子介绍</span>
          <i class="bot"></i>
        </div>
        <div class="groupIntroduce">
          <span class="text-content">{{ detail.description }}</span>
        </div>
        <!--<div class="join" v-if="detail.audit_status === 1 && detail.is_joined === -1" @tap.stop.prevent="joinIn">加入圈子</div>-->

        <div class="join wait" v-if="detail.audit_status === 0">正在审核</div>
        <div class="join wait" v-if="detail.audit_status === 2">审核不通过</div>
        <div class="join wait" v-if="detail.audit_status === 1 && detail.is_joined === 0">入圈审核中</div>
        <!--审核不通过-->
        <div class="join" v-if="detail.audit_status === 1 && detail.is_joined === 2" @tap.stop.prevent="joinIn">重新申请</div>
      </div>

      <div class="goHairShareWrapper" v-if="isInGroup" @tap.stop.prevent="toDiscoverAdd">
        <div class="goHairShareBack">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-fabu"></use>
          </svg>
        </div>
      </div>
    </div>

    <PageMore
      ref="share"
      v-if="!loading"
      :shareOption="shareOption"
      :hideShareBtn="true"
      :iconMenu="iconMenus"
      @success="shareSuccess"
      @fail="shareFail"
      @clickedItem="iconMenusClickedItem"
    ></PageMore>

  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  import GroupsInfo from '../../components/groups/GroupsInfo.vue'
  import SubmitReadhubAriticle from '../../components/feed/SubmitReadhubAriticle'
  import DiscoverShare from '../../components/feed/DiscoverShare.vue'
  import { postRequest } from '../../utils/request'
  import { getLocalUserId } from '../../utils/user'
  import { getIndexByIdArray } from '../../utils/array'
  import PageMore from '../../components/PageMore.vue'
  import { getGroupDetail, getTextDiscoverDetail } from '../../utils/shareTemplate'
  import localEvent from '../../stores/localStorage'
  import { goThirdPartyArticle } from '../../utils/webview'
  import { checkPermission, toSettingSystem, setClipboardText } from '../../utils/plus'
  import { scrollPage } from '../../utils/dom'
  import { alertGroups } from '../../utils/dialogList'

  export default {
    data () {
      return {
        id: null,
        list: [],
        search_type: 1,
        detail: null,
        loading: 1,
        itemOptions: [],
        itemOptionsObj: null,
        itemOptionsIndex: 0,
        shareOption: {
          title: '',
          link: '',
          content: '',
          imageUrl: '',
          thumbUrl: '',
          shareName: '',
          targetType: 'group',
          targetId: ''
        },
        isInGroup: false,
        readyOpenNotice: false,
        iconMenus: [],
        copyLink: ''
      }
    },
    created () {},
    computed: {
      prevOtherData () {
        return {id: this.id, type: this.search_type}
      },
      nextOtherData () {
        return {id: this.id, type: this.search_type}
      },
      iconMenus () {
        return [
          {
            icon: '#icon-lianjie2',
            text: '复制链接'
          }
        ]
      }
    },
    components: {
      RefreshList,
      GroupsInfo,
      SubmitReadhubAriticle,
      PageMore,
      DiscoverShare
    },
    watch: {
      '$route' (to, from) {
        if (to.name === from.name) {
          this.refreshPageData()
        }
      }
    },
    methods: {
      iconMenusClickedItem (item) {
        switch (item.text) {
          case '删除':
            this.del(this.itemOptionsObj, () => {
            })
            break
          case '设为精选':
            this.addGood(this.itemOptionsObj, () => {
            })
            break
          case '取消加精':
            this.cancelGood(this.itemOptionsObj, () => {
            })
            break
          case '置顶':
            this.setTop(this.itemOptionsObj, () => {
            })
            break
          case '取消置顶':
            this.cancelTop(this.itemOptionsObj, () => {
            })
            break
        }
      },
      showItemOptions (item, index) {
        this.iconMenus = []
        this.itemOptionsObj = item
        this.itemOptionsIndex = index
        if (getLocalUserId() === item.user.id) {
          this.iconMenus.push({
            icon: '#icon-shanchu1',
            text: '删除'
          })
        }
        this.iconMenus.push(
          // {
          //   icon: '#icon-jubao',
          //   text: '举报'
          // }
        )

        if (this.detail.is_joined === 3) {
          if (item.feed.is_recommend) {
            this.iconMenus.push({
              icon: '#icon-sheweijingxuan',
              text: '取消加精'
            })
          } else {
            this.iconMenus.push({
              icon: '#icon-sheweijingxuan',
              text: '设为精选'
            })
          }

          if (item.top) {
            this.iconMenus.push({
              icon: '#icon-zhiding',
              text: '取消置顶'
            })
          } else {
            this.iconMenus.push({
              icon: '#icon-zhiding',
              text: '置顶'
            })
          }
        }
        var shareOption = getTextDiscoverDetail(
          this.itemOptionsObj.url,
          this.itemOptionsObj.title,
          this.itemOptionsObj.user.avatar,
          this.itemOptionsObj.user.name
        )
        this.shareOption = Object.assign(this.shareOption, shareOption)
        this.$refs.share.share()
      },
      goMoreSetup () {
        if (this.detail.is_joined === -1) {
          alertGroups(this, this.joinIn)
          // window.mui.toast('请加入圈子')
        } else {
          this.$router.pushPlus('/group/moreSetup/' + this.detail.id)
        }
      },
      goBack () {
        window.mui.back()
      },
      setNotificationStatus (status) {
        postRequest(`group/setNotify`, {
          id: this.id,
          is_notify: status
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          if (status) {
            this.readyOpenNotice = 0
            window.mui.toast('动态通知已开启')
          } else {
            window.mui.toast('动态通知已关闭')
          }
        })
      },
      closeNotice () {
        this.detail.current_user_notify = 0
        this.setNotificationStatus(0)
      },
      openNotice () {
        checkPermission('NOTIFITION', () => {
          this.detail.current_user_notify = 1
          this.setNotificationStatus(1)
        }, () => {
          if (window.mui.os.plus) {
            var btnArray = ['取消', '去设置']
            window.mui.confirm('开启平台通知，才能即刻收到圈子的动态通知哦~', '开启通知', btnArray, (e) => {
              if (e.index === 1) {
                this.readyOpenNotice = 1
                toSettingSystem('NOTIFITION')
              } else {
                this.readyOpenNotice = 0
              }
            })
          } else {
            this.detail.current_user_notify = 1
            this.setNotificationStatus(1)
          }
        })
      },
      goMore () {
        this.$router.pushPlus('/group/moreSetup/' + this.detail.id)
      },
      prevSuccessCallback () {
        scrollPage('.listWrapper', () => {
        }, () => {}, () => {}, () => {
        })
      },
      goArticle: function (article) {
        goThirdPartyArticle(
          article.view_url,
          article.id,
          article.title,
          article.comment_url,
          article.img_url
        )
      },
      toDetail (item) {
        this.$router.pushPlus(item.feed.comment_url, 'list-detail-page')
      },
      toDiscoverAdd () {
        localEvent.setLocalItem('selectedGroup' + getLocalUserId(), {
          id: this.id,
          name: this.detail.name
        })
        this.$router.pushPlus('/discover/add?from=' + encodeURIComponent('/group/detail/' + this.id))
      },
      refreshPageData (param) {
        if (param && param.type && param.type === 'back') {
          return
        }

        this.loading = 1
        this.getData()
      },
      joinIn () {
        postRequest(`group/join`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          if (this.detail.public) {
            this.detail.is_joined = 1
            this.isInGroup = 1
          } else {
            this.detail.is_joined = 0
          }
          window.mui.toast('圈子动态更新将第一时间通知您')
        })
      },
      joinShare () {
        var shareOption = getGroupDetail(
          this.id,
          this.detail.name,
          this.detail.owner.name,
          this.detail.subscribers,
          this.detail.logo
        )
        this.shareOption = Object.assign(this.shareOption, shareOption)
        this.$refs.share.share()
      },
      shareSuccess () {

      },
      shareFail () {

      },
      isShowItemOption (item) {
        if (getLocalUserId() === item.user.id) {
          // 文章是我写的
          return true
        }

        // 我是圈主
        if (this.detail.is_joined === 3) {
          return true
        }

        return false
      },
      report () {
        window.mui('#shareWrapper').popover('toggle')
        window.mui.prompt('举报', '输入举报原因', ' ', ['取消', '提交'], (e) => {
          if (e.index === 1) {
            if (e.value) {
              postRequest(`system/feedback`, {
                title: '举报内容',
                content: e.value
              }).then(response => {
                var code = response.data.code
                if (code !== 1000) {
                  window.mui.alert(response.data.message)
                  window.mui.back()
                  return
                }
                if (response.data.data) {
                  window.mui.back()
                  window.mui.toast('举报成功')
                }
              })
            } else {
              window.mui.toast('请填写举报内容')
            }
          }
        }, 'div')
      },
      setTop (item, callback) {
        window.mui('#shareWrapper').popover('toggle')
        postRequest(`group/setSubmissionTop`, {submission_id: item.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          window.mui.toast('操作成功')
          this.list[this.itemOptionsIndex].top = 1
          callback()
        })
      },
      cancelTop (item, callback) {
        window.mui('#shareWrapper').popover('toggle')
        postRequest(`group/cancelSubmissionTop`, {submission_id: item.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          window.mui.toast('操作成功')
          this.list[this.itemOptionsIndex].top = 0
          callback()
        })
      },
      addGood (item, callback) {
        window.mui('#shareWrapper').popover('toggle')
        postRequest(`group/setSubmissionRecommend`, {submission_id: item.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          item.is_recommend = 1
          this.list[this.itemOptionsIndex].feed.is_recommend = 1
          window.mui.toast('操作成功')
          callback()
        })
      },
      cancelGood (item, callback) {
        window.mui('#shareWrapper').popover('toggle')
        postRequest(`group/cancelSubmissionRecommend`, {submission_id: item.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          item.is_recommend = 0
          this.list[this.itemOptionsIndex].feed.is_recommend = 0
          window.mui.toast('操作成功')
          callback()
        })
      },
      getData () {
        this.id = parseInt(this.$route.params.id)
        this.shareOption.targetId = this.id
        if (!this.id) {
          window.mui.back()
          return
        }
        postRequest(`group/detail`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            this.$router.replace('/groups')
            return
          }

          this.detail = response.data.data

          if (this.detail.audit_status === 1) {
            if (this.detail.is_joined === 1 || this.detail.is_joined === 3) {
              this.isInGroup = true
            } else {
              this.isInGroup = false
            }
          } else {
            this.isInGroup = false
          }

          var shareOption = getGroupDetail(
            this.id,
            this.detail.name,
            this.detail.owner.name,
            this.detail.subscribers,
            this.detail.logo
          )

          this.shareOption = Object.assign(this.shareOption, shareOption)

          this.loading = 0
        })
      },
      del (item, callback) {
        window.mui('#shareWrapper').popover('toggle')
        var btnArray = ['取消', '确定']
        var list = this.list
        window.mui.confirm('确定删除吗？', ' ', btnArray, function (e) {
          if (e.index === 1) {
            // 进行删除
            postRequest(`article/destroy-submission`, {
              id: item.id
            }).then(response => {
              var code = response.data.code
              // 如果请求不成功提示信息 并且返回上一页；
              if (code !== 1000) {
                window.mui.toast(response.data.message)
                return
              }
              if (response.data.data) {
                var index = getIndexByIdArray(list, item.id)
                list.splice(index, 1)
                callback()
                window.mui.toast('删除成功')
              }
            })
          }
        })
      },
      chooseType (type) {
        this.search_type = type
      }
    },
    mounted () {
      window.addEventListener('resume', () => {
        if (this.readyOpenNotice === 1) {
          this.openNotice()
        }
      }, true)
    },
    activated: function () {
      this.refreshPageData()
    },
    updated () {}
  }
</script>

<style lang="less" scoped>
  .mui-content {
    background: #ffffff;
  }
  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .gray {
    width: 100%;
    height: 0.266rem;
    background: #f3f4f6;
  }
  .menu {
    width: 100%;
    height: 1.04rem;
    background: #FFFFFF;
    font-size: 0.373rem;
    color: #444444;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    line-height: 1.04rem;
    position: absolute;
    span {
      position: relative;
      margin-bottom: -0.293rem;
      &.bold {
        font-weight: 500;
      }
      i {
        position: absolute;
        width: 0.746rem;
        height: 0.04rem;
        border-radius: 1.333rem;
        background: #03aef9;
        top: 0.986rem;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
  }
  .groups-list {
    margin-top: 1.306rem;
  }
  .listWrapper{
    padding-bottom: 2.853rem;
  }
  .Nothing {
    width: 5.626rem;
    position: absolute;
    font-size: 0.32rem;
    color: rgba(200,200,200,1);
    left: 0;
    right: 0;
    top: 9rem;
    text-align: center;
    margin: 2rem auto 0;
    svg {
      font-size: 1.6rem;
      margin-bottom: 0.133rem;
    }
  }
  .join {
    width: 9.146rem;
    height: 1.173rem;
    position: absolute;
    right:0;
    left:0;
    z-index: 99;
    bottom: 0.4rem;
    margin: auto;
    color: #FFFFFF;
    line-height: 1.173rem;
    text-align: center;
    font-size: 0.426rem;
    background: #03AEF9;
    border-radius: 1.333rem ;
    font-family:PingFangSC-Medium;
    box-shadow: 0rem 0.026rem 0.266rem 0rem #CDD7DC;
    &.addGroup {
      width: 2.506rem;
    }
    &.wait{
      color: #b4b4b6;
      background: #dcdcdc;
      box-shadow: 0rem 0.026rem 0.266rem 0rem #CDD7DC;
    }
  }
  .headerShare {
    position: absolute;
    right: 0.426rem;
    top: 0.266rem;
    .icon {
      color: #3C3E44;
      font-size: 0.64rem;
    }
  }
  .headerNotice {
    right: 1.6rem;
  }
  .header {
    background: #1C3F6D;
    position: relative;
    height: 3.973rem;
    border-bottom-left-radius: 0.533rem;
    border-bottom-right-radius: 0.533rem;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-bottom-left-radius: 0.533rem;
      border-bottom-right-radius: 0.533rem;
    }
    .backMask {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      border-bottom-left-radius: 0.533rem;
      border-bottom-right-radius: 0.533rem;
      background:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.1) 100%);
    }
    .headerBack {
      /*width: 100%;*/
      display: flex;
      height: 1.173rem;
      position: absolute;
      top: 0;
      z-index: 10;
      padding-left: 0.32rem;
      .icon {
        margin-top: 0.266rem;
        font-size: 0.613rem;
        color: #FFFFFF;
      }
    }
    .openNotice {
      position: absolute;
      top: 0.293rem;
      right: 1.6rem;
      .icon {
        font-size: 0.64rem;
        color: #ffffff;
      }
      &.share {
        right: 0.426rem;
      }
    }
    .headPhotowrapper {
      position: absolute;
      bottom: -0.64rem;
      left: 0.453rem;
      z-index: 100;
      .headImages {
        width: 1.493rem;
        height: 1.493rem;
        text-align: center;
        background: #E3E3E3;
        border-radius: 0.106rem;
        border: 0.026rem solid #ffffff;
        img {
          width: 100%;
          height: 100%;
          border-radius: 0.08rem;
          object-fit: cover;
        }
      }
    }
  }

  .groupWrapper {
    margin-top: 1.066rem;
    padding: 0 0.426rem 0.346rem;
    position: relative;
    .groupNAmeWrapper {
      color: #444444;
      font-size: 0.533rem;
      .font-family-medium {
        line-height: 0.746rem;
      }
    }
    .groupDescribeWrapper {
      margin-top: 0.08rem;
      color: #B4B4B6;
      font-size: 0.32rem;
      line-height: 0.426rem;
    }
    .goMoreoPerations {
      position: absolute;
      top: 0.32rem;
      right: 0.426rem;
      .icon {
        font-size: 0.346rem;
      }
    }
    .groupDescription {
      color: #808080;
      font-size: 0.373rem;
      line-height: 0.586rem;
      margin-top: 0.346rem;
    }
  }

  .group-text {
    position: relative;
    padding: 0.293rem 0.426rem;
    span {
      color: #444444;
      font-size: 0.426rem;
    }
  }
  .groupIntroduce {
    padding: 0.266rem 0.426rem;
    span {
      color: #808080;
      font-size: 0.373rem;
      line-height: 0.586rem;
    }
  }
  .goHairShareWrapper {
    position: absolute;
    bottom: 0.533rem;
    right: 0.426rem;
    z-index: 9;
    .goHairShareBack {
      width: 1.173rem;
      height: 1.173rem;
      text-align: center;
      /*line-height: 1.28rem;*/
      background: #03AEF9;
      border-radius: 50%;
      position: relative;
      box-shadow:0rem 0.026rem 0.266rem 0rem rgba(205,215,220,1);
      .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        font-size: 0.586rem;
        color: #ffffff;
      }
    }
  }

</style>
