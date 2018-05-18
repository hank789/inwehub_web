<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{detail.name}}</h1>
    </header>
    <div class="mui-content" v-if="!loading">
      <!--圈子详情-->
      <!--可以浏览-->
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
          <div class="gray"></div>
          <div class="menu">
          <span :class="{'font-family-medium': search_type === 1}" @tap.stop.prevent="chooseType(1)">全部<i
            v-if="search_type === 1"></i></span>
            <span :class="{'font-family-medium': search_type === 3}" @tap.stop.prevent="chooseType(3)">精华<i
              v-if="search_type === 3"></i></span>
            <i class="bot"></i>
          </div>
          <div  class="groups-list">
            <template v-for="(item, index) in list">
              <div v-if="item.feed_type === 5 && item.feed.domain === ''">
                <!--x发布了发现-->
                <DiscoverShare
                  :data="item"
                  :show='isShowItemOption(item)'
                  ref="discoverShare"
                  @comment="comment"
                  @showItemOptions="showItemOptions"
                ></DiscoverShare>
              </div>
              <div v-else-if="item.feed_type === 5 && item.feed.domain !== ''"  @tap.stop.prevent="toDetail(item)">
                <SubmitReadhubAriticle :data="item"
                                       :show='isShowItemOption(item)'
                                       @comment="comment"
                                       @showItemOptions="showItemOptions"
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

          <!---->
        </RefreshList>
      </div>
    </div>

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

    <commentTextarea ref="ctextarea"
                     @sendMessage="sendMessage"
    ></commentTextarea>

    <FooterMenu
      :options="footerMenus"
      @clickedItem="footerMenuClickedItem"
      v-if="isInGroup"
    ></FooterMenu>

  </div>
</template>

<script>
  import RefreshList from '../components/refresh/List.vue'
  import Options from '../components/Options.vue'
  import GroupsInfo from '../components/groups/GroupsInfo.vue'
  import SubmitReadhubAriticle from '../components/feed/SubmitReadhubAriticle'
  import DiscoverShare from '../components/feed/DiscoverShare.vue'
  import { postRequest } from '../utils/request'
  import { getLocalUserId } from '../utils/user'
  import { getIndexByIdArray } from '../utils/array'
  import localEvent from '../stores/localStorage'
  import commentTextarea from '../components/comment/Textarea.vue'
  import { goThirdPartyArticle } from '../utils/webview'
  import userAbility from '../utils/userAbility'
  import FooterMenu from '../components/FooterMenu.vue'

  export default {
    data () {
      return {
        list: [],
        search_type: 1,
        detail: {
          id: 0
        },
        loading: 1,
        allOptionSelects: [],
        itemOptions: [],
        itemOptionsObj: null,
        isInGroup: false
      }
    },
    created () {
    },
    computed: {
      prevOtherData () {
        return {id: this.detail.id, type: this.search_type}
      },
      nextOtherData () {
        return {id: this.detail.id, type: this.search_type}
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
              isNew: this.detail.unread_group_im_messages,
              isLight: false
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
      DiscoverShare,
      commentTextarea,
      FooterMenu
    },
    props: {},
    watch: {
      '$route': 'refreshPageData'
    },
    methods: {
      prevSuccessCallback () {
        this.getData()
      },
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
        switch (item.feed_type) {
          case 5:
            if (item.feed_type === 5 && item.feed.domain === '') {
              // ...
            } else {
              var linkArticle = {
                view_url: item.url,
                id: item.feed.submission_id,
                title: item.feed.title,
                comment_url: item.feed.comment_url,
                img_url: item.feed.img
              }
              this.goArticle(linkArticle)
            }
            break
          default:
            break
        }
      },
      toDiscoverAdd () {
        localEvent.setLocalItem('selectedGroup' + getLocalUserId(), {
          id: this.detail.id,
          name: this.detail.name
        })
        this.$router.pushPlus('/discover/add?from=' + encodeURIComponent('/feedback/advise'))
      },
      toGroupChat () {
        this.$router.pushPlus('/group/chat/' + this.detail.room_id)
      },
      refreshPageData (param) {
        if (param && param.type && param.type === 'back') {
          return
        }

        this.loading = 1
        this.getData()
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
      showItemOptions (item) {
        this.itemOptions = []
        this.itemOptionsObj = item
        if (getLocalUserId() === item.user.id) {
          this.itemOptions = [
            '删除'
          ]
        }

        if (this.detail.is_joined === 3) {
          this.itemOptions.push('加精')
        }

        this.$refs.itemOptions.toggle()
      },
      selectedItem (item) {
        switch (item) {
          case '退出圈子':
            this.quit()
            break
          case '删除':
            this.del(this.itemOptionsObj, () => {
              this.$refs.itemOptions.toggle()
            })
            break
          case '加精':
            this.addGood(this.itemOptionsObj, () => {
              this.$refs.itemOptions.toggle()
            })
            break
          case '圈成员管理':
            this.$refs.allOptions.toggle()
            this.$router.pushPlus('/group/setting/' + this.detail.id)
            break
          case '开放圈子群聊':
            this.$refs.allOptions.toggle()
            var btnArray = ['取消', '确定']
            var that = this
            window.mui.confirm('确定开放圈子群聊吗？', ' ', btnArray, function (e) {
              if (e.index === 1) {
                postRequest(`group/openIm`, {id: that.detail.id}).then(response => {
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
                postRequest(`group/closeIm`, {id: that2.detail.id}).then(response => {
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
      addGood (item, callback) {
        postRequest(`group/setSubmissionRecommend`, {submission_id: item.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          window.mui.toast('操作成功')
          callback()
        })
      },
      allOptions () {
        if (this.detail.is_joined === 3) {
          if (this.detail.room_id > 0) {
            this.allOptionSelects = ['关闭圈子群聊']
          } else {
            this.allOptionSelects = ['开放圈子群聊']
          }
          this.$refs.allOptions.toggle()
        }
      },
      getData () {
        postRequest(`group/getHelpGroup`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            this.$router.replace('/groups')
            return
          }
          this.detail = response.data.data
          this.isInGroup = true
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
    mounted () {
      this.getData()
    },
    updated () {}
  }
</script>

<style scoped="scoped">
  /*清掉自带样式*/
  p,
  span,
  i,
  img,
  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

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

  .group-text{
    width:92%;
    margin-left: 4%;
    overflow: hidden;
  }
  .group-text p:nth-of-type(1){
    width:100%;
    height:1.146rem;
    position: relative;
    font-size: 0.426rem;
    color:rgba(68,68,68,1);
    line-height: 1.146rem;
  }
  .group-text p:nth-of-type(2){
    width:100%;
    margin-top: 0.373rem;
    position: relative;
    font-size: 0.426rem;
    color:rgba(68,68,68,1);
    line-height: 0.533rem;
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
    top: 8rem;
    text-align: center;
    margin: auto;
  }
  .Nothing svg{
    font-size: 1.6rem;
    margin-bottom: 0.133rem;
  }
  .listWrapper{
    bottom: 1.333rem;
  }
</style>
