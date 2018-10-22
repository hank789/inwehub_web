<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">全部{{totalData}}条评论</h1>
      <div class="right" @tap.stop.prevent="switchMode">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-paixu"></use>
        </svg>{{mode}}
      </div>
    </header>

    <div class="mui-content">
      <div class="comment-empty" v-if="!list.length">
        <div class="comment-empty-content">
          <div class="comment-wait-img">
            <img src="../statics/images/commentwait@3x.png" alt="">
          </div>
          <span>静静等你来评论~</span>
          <div class="commeny-button" @tap.stop.prevent="newAddcomment">评论</div>
        </div>
      </div>
      <RefreshList
        ref="RefreshList"
        class="refreshListWrapper"
        v-model="list"
        :api="'article/comments'"
        :prevOtherData="prevOtherData"
        :nextOtherData="prevOtherData"
        :list="list"
        :pageMode="true"
        :autoShowEmpty="false"
        :prevSuccessCallback="prevSuccessCallback"
      >
        <div class="container-list-discuss container-list-marginTop">
          <div class="message">
            <template v-for="(item, index) in list">
              <div class="list-item-discuss"  @tap.stop.prevent="clickComment(item, list)" :key="index">
                <div class="lidL" @tap.stop.prevent="toResume(item.owner.uuid)">
                  <img v-if="item.owner.avatar" :src="item.owner.avatar"/>
                  <svg class="icon" aria-hidden="true" v-show="item.owner.is_expert">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </div>
                <div class="lidR">
                  <div class="lidR1">{{ item.owner.name }}</div>
                  <div class="lidR2 textToLink" v-html="textToLink(item.content)"></div>
                  <div class="lidR3">
                    <div class="lidRtime"> <timeago :since="timeago(item.created_at)" :auto-update="0">
                    </timeago></div>
                    <div class="lidROption" @tap.stop.prevent="vote(item)" :class="{active:item.is_supported}">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-zan"></use>
                      </svg><span v-if="item.supports">{{item.supports}}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="list-item-discuss-childrens" v-if="item.children.length">
                <DiscussReplay
                  v-if="item.children.length"
                  :children="item.children"
                  :parentOwnerName="item.owner.name"
                  :isShow="true"
                  @comment="clickComment"
                  @vote="vote"
                ></DiscussReplay>
              </div>

              <div class="line-river-after" v-if="index !== list.length-1"></div>

            </template>
          </div>
        </div>
      </RefreshList>
    </div>
    <commentTextarea ref="ctextarea" @sendMessage="sendMessage" :alwaysshow="true"></commentTextarea>


    <div id="sheet1" class="mui-popover mui-popover-bottom mui-popover-action">
      <!-- 可选择菜单 -->
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <a @tap.stop.prevent="doDelComment">删除我的回复</a>
        </li>
      </ul>
      <!-- 取消菜单 -->
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <a @tap.stop.prevent="hideDelComment"><b>取消</b></a>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  import RefreshList from '../components/refresh/List.vue'
  import { postRequest } from '../utils/request'
  import { getLocalUserInfo } from '../utils/user'
  import { getIndexByIdArray } from '../utils/array'
  import commentTextarea from '../components/comment/Textarea.vue'
  import Vue from 'vue'
  import { textToLinkHtml, transferTagToLink } from '../utils/dom'
  import DiscussReplay from '../components/discover/DiscussReply.vue'
  import userAbility from '../utils/userAbility'

  export default {
    data () {
      return {
        page: 1,
        mode: '最新',
        order_by: 1,
        slug: '',
        id: '',
        list: [],
        commentTarget: null,
        delCommentId: 0,
        totalNumber: [],
        totalData: ''
      }
    },
    components: {
      DiscussReplay,
      commentTextarea,
      RefreshList
    },
    computed: {
      prevOtherData () {
        this.slug = this.$route.params.slug

        return {
          page: this.page,
          order_by: this.order_by,
          submission_slug: this.slug
        }
      }
    },
    methods: {
      newAddcomment () {
        this.commentfoucs()
      },
      prevSuccessCallback () {
        this.totalNumber = this.$refs.RefreshList.getResponse()
        this.totalData = this.totalNumber.data.total
      },
      toResume (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()), 'list-detail-page')
      },
      sendMessage (message) {
        this.id = this.$route.params.id
        this.commentTarget = message.commentData

        var parentId = this.commentTarget.parentId

        var params = Object.assign({
          body: message.content,
          content: message.content,
          parent_id: parentId,
          mentions: message.noticeUsers,
          submission_id: this.id
        })
        postRequest(`article/comment-store`, params).then(response => {
          var code = response.data.code

          if (code === 6108) {
            userAbility.alertGroups(this.$parent, response.data.data.group_id)
            return
          }

          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          var data = response.data.data

          window.mui.toast(response.data.message)

          this.prependItem(
            data.id,
            message.content,
            data.created_at,
            parentId
          )

          this.$emit('commentFinish')
        })
      },
      resetList () {
        this.page = 1
        this.$refs.RefreshList.refreshPageData(this.prevOtherData)
      },
      switchMode () {
        if (this.mode === '最新') {
          this.order_by = 2
          this.mode = '最赞'
        } else {
          this.order_by = 1
          this.mode = '最新'
        }
        this.resetList()
      },
      textToLink (text) {
        return transferTagToLink(textToLinkHtml(' ' + text))
      },
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      vote (item) {
        postRequest('support/comment', {
          id: item.id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          if (response.data.data.type === 'support') {
            // 已点赞
            item.supports++
            item.is_supported = 1
          } else {
            // 取消点赞
            item.supports--
            item.is_supported = 0
          }
        })
      },
      prependItem (id, msg, createdAt, parentId) {
        var userInfo = getLocalUserInfo()
        var item = {
          id,
          children: [],
          content: msg,
          is_supported: 0,
          supports: 0,
          owner: {
            is_expert: userInfo.is_expert,
            avatar: userInfo.avatar_url,
            user_id: userInfo.user_id,
            uuid: userInfo.uuid,
            name: userInfo.name
          },
          created_at: createdAt
        }
        console.log('discuss:item:' + JSON.stringify(item))

        console.log('discuss:parentid:' + parentId)
        if (parentId) {
          var parentIndex = getIndexByIdArray(this.commentTarget.list, parentId)
          console.log('discuss:parentIndex:' + parentIndex)
          if (parentIndex > 0) {
            if (this.commentTarget.list[parentIndex].children) {
              this.commentTarget.list[parentIndex].children.unshift(item)
            } else {
              this.commentTarget.list[parentIndex].children = [item]
            }
          } else {
            this.resetList()
          }
        } else {
          console.log('discuss:commentTarget:' + JSON.stringify(this.commentTarget))
          if (this.commentTarget.list.length) {
            this.commentTarget.list.unshift(item)
          } else {
            this.resetList()
          }
        }
      },
      clickComment (comment, list) {
        var commentUid = comment.owner.uuid
        var userInfo = getLocalUserInfo()
        var uuid = userInfo.uuid
        if (commentUid === uuid) {
          this.delComment(comment, list)
        } else {
          this.comment(comment.id, comment.owner.name, list)
        }
      },
      moreReply (item) {
        item.moreReply = 1
        var indexOfItem = getIndexByIdArray(this.list, item.id)
        Vue.set(this.list, indexOfItem, item)
      },
      doDelComment () {
        postRequest('article/destroy-comment', {
          id: this.delCommentId
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          var index = getIndexByIdArray(this.delList, this.delCommentId)
          if (index) {
            this.delList = this.delList.splice(index, 1)
          }
          this.hideDelComment()
          this.$emit('delCommentSuccess')
        })
      },
      hideDelComment () {
        var del = document.getElementById('sheet_comment_del')
        if (del) {
          window.mui('#sheet_comment_del').popover('hide')
        }
      },
      delComment (comment, list) {
        this.delCommentId = comment.id
        this.delList = list
        var del = document.getElementById('sheet_comment_del')
        if (del) {
          window.mui('#sheet_comment_del').popover('toggle')
        } else {
          var ele = document.getElementById('sheet1')
          ele.id = 'sheet_comment_del'
          document.body.appendChild(ele)
          setTimeout(() => {
            window.mui('#sheet_comment_del').popover('toggle')
          }, 100)
        }
      },
      comment (parentId, commentTargetUsername, list, autoBlur) {
        var commentTarget = {
          parentId: parentId || 0,
          commentTargetUsername: commentTargetUsername || '',
          list: list
        }

        var data = {
          targetUsername: commentTargetUsername || '',
          commentData: commentTarget
        }

        console.log('回复 data:' + JSON.stringify(data))

        this.$refs.ctextarea.comment(data, autoBlur)
      },
      commentfoucs () {
        this.comment(0, '', this.list)
      }
    },
    mounted () {
      this.comment(0, '', this.list, true)
    },
    watch: {}
  }

</script>

<style scoped lang="less">
  .refreshListWrapper{
    /*top: 1.173rem;*/
    /*bottom:50px; !* px不转换 *!*/
  }
  .commentWrapper {
    z-index: 300;
  }
  .mui-content {
    top: 0;
    bottom: 1.226rem;
    background: #fff;
  }
  .comment-empty {
    margin-top: 2.106rem;
    text-align: center;
    position: relative;
    z-index: 99;
    .comment-empty-content {
      .comment-wait-img {
        width: 1.866rem;
        height: 2.373rem;
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
      span {
        color: #C8C8C8;
        font-size: 0.32rem;
        margin: 0.266rem 0 0.453rem;
        display: inline-block;
      }
      .commeny-button {
        width: 2.56rem;
        height: 0.96rem;
        margin: 0 auto;
        color: #FFFFFF;
        font-size: 0.373rem;
        line-height: 0.96rem;
        text-align: center;
        background: #03AEF9;
        border-radius: 2.666rem;
      }
    }
  }
  .right {
    color: #808080;
    font-size: 0.4rem;
    position: absolute;
    right: 0.426rem;
    top: 0.293rem;
  }
  .empty {
    width: 100%;
    background: #FFFFFF;
    margin-bottom: 0.266rem;
    text-align: center;
    padding: 0.533rem 0;
    .icon {
      font-size: 1.333rem;
    }
    p {
      width: 100%;
      font-size: 0.32rem;
      color: #c8c8c8;
      text-align: center;
    }
  }
  .lidL{
    position: relative;
    .icon {
      position: absolute;
      top:0.533rem;
      right:-0.08rem;
    }
  }
</style>
