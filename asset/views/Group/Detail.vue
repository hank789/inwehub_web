<template>
  <div>
    <!--<header class="mui-bar mui-bar-nav">-->
      <!--<Back></Back>-->
      <!--<h1 class="mui-title">{{detail.name}}</h1>-->
      <!--<div class="headerShare" @tap.stop.prevent="joinShare">-->
        <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-shoucang-xiao"></use>-->
        <!--</svg>-->
      <!--</div>-->
      <!--<div class="headerShare headerNotice">-->
        <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-tongzhi"></use>-->
        <!--</svg>-->
      <!--</div>-->
    <!--</header>-->


    <div class="mui-content" v-if="!loading">

      <div v-if="!isInGroup">
        <div class="header">
          <img :src="detail.background_img" alt="">
          <div class="backMask"></div>
          <div class="headerBack">
            <div @tap.stop.prevent="$router.goBack()">
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
              <img :src="detail.logo" alt="">
            </div>
          </div>
        </div>
        <div class="groupWrapper" @tap.stop.prevent="$router.pushPlus('/group/moreSetup/' + detail.id)">
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
          <div class="goMoreoPerations">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jinru"></use>
            </svg>
          </div>
        </div>
      </div>

      <div v-if="isInGroup">
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
              <img :src="detail.background_img" alt="">
              <div class="backMask"></div>
              <div class="headerBack">
                <div @tap.stop.prevent="$router.goBack()">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-fanhui"></use>
                  </svg>
                </div>
              </div>
              <div class="openNotice" v-if="isOpenNotification === 1" @tap.stop.prevent="goUnlock">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-tongzhi"></use>
                </svg>
              </div>

              <div class="openNotice" v-if="isOpenNotification === 0" @tap.stop.prevent="goUnlock">
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
                  <img :src="detail.logo" alt="">
                </div>
              </div>
            </div>
            <div class="groupWrapper" id="groupWrapper" @tap.stop.prevent="$router.pushPlus('/group/moreSetup/' + detail.id)">
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
              <div class="goMoreoPerations">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-jinru"></use>
                </svg>
              </div>
            </div>
          </div>

        <!--<GroupsInfo-->
          <!--:detail="detail"-->
          <!--@allOptions="allOptions()"-->
        <!--&gt;</GroupsInfo>-->
        <div class="gray"></div>
        <div class="menu">
          <span :class="{'font-family-medium': search_type === 1}" @tap.stop.prevent="chooseType(1)">全部<i
            v-if="search_type === 1"></i></span>
          <!--<span :class="{'font-family-medium': search_type === 2}" @tap.stop.prevent="chooseType(2)">圈主<i-->
            <!--v-if="search_type === 2"></i></span>-->
          <span :class="{'font-family-medium': search_type === 3}" @tap.stop.prevent="chooseType(3)">精华<i
            v-if="search_type === 3"></i></span>
          <i class="bot"></i>
        </div>
          <div  class="groups-list">
            <template v-for="(item, index) in list">
              <div v-if="item.feed_type === 15" @tap.stop.prevent="toDetail(item)">
                <!--x发布了分享-->
                <DiscoverShare
                  :data="item"
                  :show='isShowItemOption(item)'
                  ref="discoverShare"
                  @comment="comment"
                  @showItemOptions="showItemOptions(item, index)"
                ></DiscoverShare>
              </div>
              <div v-else-if="item.feed_type === 16"  @tap.stop.prevent="toDetail(item)">
                <!--x发布了链接分享-->
                <SubmitReadhubAriticle :data="item"
                                       :show='isShowItemOption(item)'
                                       @comment="comment"
                                       @showItemOptions="showItemOptions(item, index)"
                ></SubmitReadhubAriticle>
              </div>
              <div v-else-if="item.feed_type === 5"  @tap.stop.prevent="toDetail(item)">
                <!--x发布了原创文章，有title何描述-->
                <SubmitReadhubAriticle :data="item"
                                       :show='isShowItemOption(item)'
                                       @comment="comment"
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
        <div class="join" v-if="detail.audit_status === 1 && detail.is_joined === -1" @tap.stop.prevent="joinIn">加入圈子</div>

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
    <!---->

    <Options
      ref="allOptions"
      :id="'allOptions'"
      :options="allOptionSelects"
      @selectedItem="selectedItem"
    ></Options>

    <Options
      ref="itemOptions"
      :id="'itemOptions'"
      :options="itemOptions"
      @selectedItem="selectedItem"
    ></Options>

    <GroupsShare
      ref="share"
      v-if="!loading"
      :title="shareOption.title"
      :shareName="shareOption.shareName"
      :link="shareOption.link"
      :content="shareOption.content"
      :imageUrl="shareOption.imageUrl"
      :thumbUrl="shareOption.thumbUrl"
      :targetId="id"
      :targetType="'group'"
      @success="shareSuccess"
      @fail="shareFail"
    ></GroupsShare>
    <commentTextarea ref="ctextarea"
                     @sendMessage="sendMessage"
    ></commentTextarea>

    <!--<FooterMenu-->
      <!--:options="footerMenus"-->
      <!--@clickedItem="footerMenuClickedItem"-->
      <!--v-if="isInGroup"-->
    <!--&gt;</FooterMenu>-->

  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  import Options from '../../components/Options.vue'
  import GroupsInfo from '../../components/groups/GroupsInfo.vue'
  import SubmitReadhubAriticle from '../../components/feed/SubmitReadhubAriticle'
  import DiscoverShare from '../../components/feed/DiscoverShare.vue'
  import { postRequest } from '../../utils/request'
  import { getLocalUserId } from '../../utils/user'
  import { getIndexByIdArray } from '../../utils/array'
  import GroupsShare from '../../components/GroupsShare.vue'
  import { getGroupDetail } from '../../utils/shareTemplate'
  import localEvent from '../../stores/localStorage'
  import commentTextarea from '../../components/comment/Textarea.vue'
  import { goThirdPartyArticle } from '../../utils/webview'
  import userAbility from '../../utils/userAbility'
  import FooterMenu from '../../components/FooterMenu.vue'
  import { checkPermission, toSettingSystem } from '../../utils/plus'

  export default {
    data () {
      return {
        id: null,
        list: [],
        search_type: 1,
        detail: null,
        loading: 1,
        allOptionSelects: [],
        itemOptions: [],
        itemOptionsObj: null,
        itemOptionsIndex: 0,
        shareOption: {
          title: '',
          link: '',
          content: '',
          imageUrl: '',
          thumbUrl: '',
          shareName: ''
        },
        isInGroup: false,
        isOpenNotification: -1 // -1， 未知, 1 yes 0 no
      }
    },
    created () {
    },
    computed: {
      prevOtherData () {
        return {id: this.id, type: this.search_type}
      },
      nextOtherData () {
        return {id: this.id, type: this.search_type}
      },
      footerMenus () {
        if (this.detail.room_id > 0) {
          return [
            {
              icon: '#icon-tijiaowenzhang1',
              text: '发分享',
              number: 0,
              disable: false,
              rightLine: true,
              isLight: false
            },
            {
              icon: '#icon-hudongwenda-',
              text: '圈聊',
              number: 0,
              disable: false,
              rightLine: false,
              newNum: this.detail.unread_group_im_messages,
              isLight: false
            },
            {
              icon: '#icon-fenxiang',
              text: '邀请加入',
              number: 0,
              disable: false,
              rightLine: false,
              isLight: true
            }
          ]
        } else {
          return [
            {
              icon: '#icon-tijiaowenzhang1',
              text: '发分享',
              number: 0,
              disable: false,
              rightLine: false,
              isLight: false
            },
            {
              icon: '#icon-fenxiang',
              text: '邀请加入',
              number: 0,
              disable: false,
              rightLine: false,
              isLight: true
            }
          ]
        }
      }
    },
    components: {
      RefreshList,
      GroupsInfo,
      SubmitReadhubAriticle,
      Options,
      GroupsShare,
      DiscoverShare,
      commentTextarea,
      FooterMenu
    },
    props: {},
    watch: {
      '$route' (to, from) {
        if (to.name === from.name) {
          this.refreshPageData()
        }
      }
    },
    methods: {
      getNotification () {
        postRequest(`notification/push/info`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
        })
      },
      checkPermission () {
        checkPermission('NOTIFITION', () => {
          console.log('有通知权限')
          this.isOpenNotification = 1
        }, () => {
          console.log('没有通知权限')
          this.isOpenNotification = 0
          this.getNotification()
        })
      },
      goUnlock () {
        console.log(this.isOpenNotification + 'this.isOpenNotification等于多少')
        if (this.isOpenNotification === 0) {
          var btnArray = ['取消', '去设置']
          window.mui.confirm('开启平台通知，才能即刻收到圈子的动态通知哦~', '开启通知', btnArray, (e) => {
            if (e.index === 1) {
              toSettingSystem('NOTIFITION')
            }
          })
          this.isOpenNotification = 1
        } else {

        }
      },
      goMore () {
        this.$router.pushPlus('/group/moreSetup/' + this.detail.id)
      },
      prevSuccessCallback () {},
      footerMenuClickedItem (item) {
        switch (item.text) {
          case '发分享':
            this.toDiscoverAdd()
            break
          case '圈聊':
            this.detail.unread_group_im_messages = 0
            this.toGroupChat()
            break
          case '邀请加入':
            this.joinShare()
            break
        }
      },
      sendMessage (message) {
        var commentTarget = message.commentData

        postRequest(`article/comment-store`, {
          'submission_id': commentTarget.submissionId,
          body: message.content,
          parent_id: commentTarget.parentId,
          mentions: message.noticeUsers
        }).then(response => {
          var code = response.data.code

          if (code === 6108) {
            userAbility.alertGroups(this, response.data.data.group_id)
            return
          }

          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          var data = response.data.data

          window.mui.toast(response.data.message)

          this.commentTargetComponent.prependItem(
            data.id,
            message.content,
            data.created_at,
            commentTarget.parentId,
            commentTarget.commentList
          )

          this.$refs.ctextarea.finish()
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
      toGroupChat () {
        this.$router.pushPlus('/group/chat/' + this.detail.room_id)
      },
      refreshPageData (param) {
        if (param && param.type && param.type === 'back') {
          return
        }

        this.loading = 1
        this.checkPermission()
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
      showItemOptions (item, index) {
        this.itemOptions = []
        this.itemOptionsObj = item
        this.itemOptionsIndex = index
        if (getLocalUserId() === item.user.id) {
          this.itemOptions = [
            '删除'
          ]
        }

        if (this.detail.is_joined === 3) {
          if (item.feed.is_recommend) {
            this.itemOptions.push('取消加精')
          } else {
            this.itemOptions.push('加精')
          }

          if (item.top) {
            this.itemOptions.push('取消置顶')
          } else {
            this.itemOptions.push('置顶')
          }
        }

        this.$refs.itemOptions.toggle()
      },
      selectedItem (item) {
        switch (item) {
          case '退出圈子':
            this.quit()
            break
          case '删除':
            // this.del(this.itemOptionsObj, () => {
            //   this.$refs.itemOptions.toggle()
            // })
            break
          case '加精':
            this.addGood(this.itemOptionsObj, () => {
              this.$refs.itemOptions.toggle()
            })
            break
          case '取消加精':
            this.cancelGood(this.itemOptionsObj, () => {
              this.$refs.itemOptions.toggle()
            })
            break
          case '置顶':
            this.setTop(this.itemOptionsObj, () => {
              this.$refs.itemOptions.toggle()
            })
            break
          case '取消置顶':
            this.cancelTop(this.itemOptionsObj, () => {
              this.$refs.itemOptions.toggle()
            })
            break
          case '圈成员管理':
            this.$refs.allOptions.toggle()
            this.$router.pushPlus('/group/setting/' + this.id)
            break
          case '开放圈子群聊':
            this.$refs.allOptions.toggle()
            var btnArray = ['取消', '确定']
            var that = this
            window.mui.confirm('确定开放圈子群聊吗？', ' ', btnArray, function (e) {
              if (e.index === 1) {
                postRequest(`group/openIm`, {id: that.id}).then(response => {
                  var code = response.data.code
                  if (code !== 1000) {
                    window.mui.toast(response.data.message)
                    that.$router.replace('/groups')
                    return
                  }
                  that.detail.room_id = response.data.data.room_id
                  window.mui.toast('群聊已开启')
                })
              }
            })
            break
          case '关闭圈子群聊':
            this.$refs.allOptions.toggle()
            var btnArray2 = ['取消', '确定']
            var that2 = this
            window.mui.confirm('确定要关闭群聊吗？', ' ', btnArray2, function (e) {
              if (e.index === 1) {
                postRequest(`group/closeIm`, {id: that2.id}).then(response => {
                  var code = response.data.code
                  if (code !== 1000) {
                    window.mui.toast(response.data.message)
                    that2.$router.replace('/groups')
                    return
                  }
                  that2.detail.room_id = 0
                  window.mui.toast('群聊已关闭')
                })
              }
            })
            break
        }
      },
      setTop (item, callback) {
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
      allOptions () {
        if (this.detail.is_joined === 3) {
          if (this.detail.room_id > 0) {
            this.allOptionSelects = ['圈成员管理', '关闭圈子群聊']
          } else {
            this.allOptionSelects = ['圈成员管理', '开放圈子群聊']
          }
          this.$refs.allOptions.toggle()
        } else {
          this.allOptionSelects = ['退出圈子']
          this.$refs.allOptions.toggle()
        }
      },
      getData () {
        this.id = parseInt(this.$route.params.id)
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

          this.shareOption = getGroupDetail(
            this.id,
            this.detail.name,
            this.detail.owner.name,
            this.detail.subscribers,
            this.detail.logo
          )

          this.loading = 0
        })
      },
      del (item, callback) {
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
      quit () {
        postRequest(`group/quit`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          if (this.detail.is_joined !== 3) {
            this.$refs.allOptions.toggle()
          }

          this.refreshPageData()
        })
      },
      chooseType (type) {
        this.search_type = type
      },
      comment (submissionId, parentId, commentTargetUsername, list, component) {
        // console.log('comment data:' + window.JSON.stringify(data) + ', comment:' + window.JSON.stringify(comment))
        var commentTarget = {
          submissionId: submissionId,
          parentId: parentId || 0,
          commentList: list
        }
        var data = {
          targetUsername: commentTargetUsername || '',
          commentData: commentTarget
        }
        this.commentTargetComponent = component
        this.$refs.ctextarea.comment(data)
      }
    },
    mounted () {},
    activated: function () {
      // if (this.id !== parseInt(this.$route.params.id)) {
      //   this.refreshPageData()
      // }
      this.refreshPageData()
    },
    updated () {}
  }
</script>

<style scoped="scoped">
  .mui-content {
    background: #ffffff;
    /*top: 0px;*/
  }
  .mui-scroll-wrapper {
    /*top: 247px;*/
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

  /*菜单*/
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
    /*top: 259px;*/
  }
  .menu span {
    position: relative;
    margin-bottom: -0.293rem;
  }
  .menu span.bold {
    font-weight: 500;
  }
  .menu span i {
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
  .groups-list {
    margin-top: 1.306rem;
  }

  .invitation {
    width: 100%;
    height: 1.333rem;
    background: #ffffff;
    position: absolute;
    bottom: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    border-top: 0.026rem solid #DCDCDC;
  }

  .invitation p {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 0.346rem;
    color: rgba(128, 128, 128, 1);
  }

  .invitation p:nth-of-type(1) {
    width: 65%;
    height: 100%;
  }

  .invitation p:nth-of-type(1) svg {
    font-size: 0.64rem;
    margin-right: 0.24rem;
  }

  .invitation p:nth-of-type(2) {
    width: 35%;
    height: 100%;
    font-size: 0.426rem;
    color: rgba(255, 255, 255, 1);
    background: rgba(3, 174, 249, 1);
  }
  .join{
    width:92%;
    height:1.173rem;
    position: fixed;
    right:0;
    left:0;
    bottom: 0.4rem;
    margin: auto;
    background:rgba(3,174,249,1);
    box-shadow: 0rem 0.026rem 0.266rem 0rem rgba(205,215,220,1);
    border-radius: 1.333rem ;
    text-align: center;
    line-height: 1.173rem;
    font-size: 0.426rem;
    color:rgba(255,255,255,1);
    font-weight: 500;
  }
  .join.wait{
    background:rgba(220,220,220,1);
    box-shadow: 0rem 0.026rem 0.266rem 0rem rgba(205,215,220,1);
    color:rgba(180,180,182,1);
  }
  .Nothing{
    width: 5.626rem;
    height: 5.333rem;
    position: absolute;
    font-size: 0.32rem;
    color: rgba(200,200,200,1);
    left: 0;
    right: 0;
    top: 9rem;
    text-align: center;
    margin: auto;
  }
  .Nothing svg{
    font-size: 1.6rem;
    margin-bottom: 0.133rem;
  }
  .listWrapper{
    /*bottom: 1.333rem;*/
  }
</style>


<style lang="less" scoped>
  .headerShare {
    position: absolute;
    right: 16px;
    top: 10px;
    .icon {
      color: #3C3E44;
      font-size: 24px;
    }
  }
  .headerNotice {
    right: 60px;
  }
  .header {
    background: #1C3F6D;
    position: relative;
    height: 149px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
    }
    .backMask {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      background:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.1) 100%);
    }
    .headerBack {
      /*width: 100%;*/
      display: flex;
      height: 44px;
      position: absolute;
      top: 0;
      z-index: 10;
      padding-left: 12px;
      .icon {
        margin-top: 10px;
        font-size: 23px;
        color: #FFFFFF;
      }
    }
    .openNotice {
      position: absolute;
      top: 11px;
      right: 60px;
      .icon {
        font-size: 24px;
        color: #ffffff;
      }
      &.share {
        right: 16px;
      }
    }
    .headPhotowrapper {
      position: absolute;
      bottom: -24px;
      left: 17px;
      z-index: 100;
      .headImages {
        width: 56px;
        height: 56px;
        text-align: center;
        background: #E3E3E3;
        border-radius: 4px;
        border: 1px solid #ffffff;
        img {
          width: 100%;
          height: 100%;
          border-radius: 3px;
          object-fit: cover;
        }
      }
    }
  }

  .groupWrapper {
    margin-top: 40px;
    padding: 0 16px 13px;
    position: relative;
    .groupNAmeWrapper {
      color: #444444;
      font-size: 20px;
      .font-family-medium {
        line-height: 28px;
      }
    }
    .groupDescribeWrapper {
      margin-top: 3px;
      color: #B4B4B6;
      font-size: 12px;
      line-height: 16px;
    }
    .goMoreoPerations {
      position: absolute;
      top: 12px;
      right: 16px;
      .icon {
        font-size: 13px;
      }
    }
  }

  .group-text {
    position: relative;
    padding: 11px 16px;
    span {
      color: #444444;
      font-size: 16px;
    }
  }
  .groupIntroduce {
    padding: 10px 16px;
    span {
      color: #808080;
      font-size: 14px;
      line-height: 22px;
    }
  }
  .goHairShareWrapper {
    position: absolute;
    bottom: 20px;
    right: 16px;
    z-index: 9;
    .goHairShareBack {
      width: 44px;
      height: 44px;
      text-align: center;
      line-height: 44px;
      background: #03AEF9;
      border-radius: 50%;
      box-shadow:0px 1px 10px 0px rgba(205,215,220,1);
      .icon {
        font-size: 22px;
        color: #ffffff;
      }
    }
  }

</style>
