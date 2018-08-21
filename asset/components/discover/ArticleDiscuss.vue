<template>
  <div>
    <div class="component-block-title">
      <div class="left">评论({{total}})</div>
      <div class="right" @tap.stop.prevent="switchMode">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-paixu"></use>
        </svg>{{mode}}
      </div>
    </div>
    <div class="line-river-after"></div>

    <div class="message">
      <!--<div class="listWrapper empty" v-show="list.length === 0">-->
        <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-zanwushuju"></use>-->
        <!--</svg>-->
        <!--<p>暂无留言</p>-->
      <!--</div>-->

      <div class="container-list-discuss">
        <div class="list-item-discuss">
          <div class="lidL">
            <img :src="info.avatar_url"/>
            <svg class="icon" aria-hidden="true" v-if="info.is_expert">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
          <div class="lidR">
            <div class="lidR1">{{info.name}}</div>
            <div class="lidR2">
              <div class="lidframe" @tap.stop.prevent="goComment()">
                <span v-if="list.length === 0">有花堪折直须折，快做评论第一人</span>
                <span v-else-if="list.length > 3">知音千里难寻觅，说点什么不后悔</span>
                <span v-else>有想法就说，莫负好时光</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container-list-discuss" v-show="list.length !== 0 && showList">
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
          <template v-for="(item, index) in list" v-if="index < 3">
            <div class="list-item-discuss"  @tap.stop.prevent="clickComment(item, list)" :key="index">
              <div class="lidL" @tap.stop.prevent="toResume(item.owner.uuid)">
                <img :src="item.owner.avatar"/>
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
    </div>

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
  import { postRequest } from '../../utils/request'
  import { getLocalUserInfo } from '../../utils/user'
  import { getIndexByIdArray } from '../../utils/array'
  import Vue from 'vue'
  import DiscussReplay from '../../components/discover/DiscussReply.vue'
  import { textToLinkHtml } from '../../utils/dom'
  import { openVendorUrl, openAppUrl } from '../../utils/plus'
  import userAbility from '../../utils/userAbility'

  const Discuss = {
    data: () => ({
      loading: true,
      busy: false,
      showList: true,
      commentTarget: null,
      delCommentId: 0,
      delList: null,
      page: 1,
      list: [],
      total: '',
      mode: '最新',
      order_by: 1,
      info: []
    }),
    props: {
      listApi: {
        type: String,
        default: ''
      },
      listParams: {
        type: Object,
        default: () => {
          return null
        }
      },
      storeApi: {
        type: String,
        default: ''
      },
      storeParams: {
        type: Object,
        default: () => {
          return null
        }
      }
    },
    components: {
      DiscussReplay
    },
    computed: {},
    methods: {
      goComment () {
        this.$emit('goComment')
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
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      rootComment () {
        this.comment(0, '', this.list)
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
      textToLink (text) {
        return textToLinkHtml(text)
      },
      moreReply (item) {
        item.moreReply = 1
        var indexOfItem = getIndexByIdArray(this.list, item.id)
        Vue.set(this.list, indexOfItem, item)
      },
      toResume (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()), 'list-detail-page')
      },
      resetList () {
        this.page = 1
        this.list = []
        this.getList()
      },
      comment (parentId, commentTargetUsername, list) {
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

        this.$emit('comment', data)
      },
      sendMessage (message) {
        console.log(message)
        this.commentTarget = message.commentData
        var parentId = this.commentTarget.parentId
        var params = Object.assign({
          body: message.content,
          content: message.content,
          parent_id: parentId,
          mentions: message.noticeUsers
        }, this.storeParams)

        postRequest(this.storeApi, params).then(response => {
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
          if (this.commentTarget.list) {
            this.commentTarget.list.unshift(item)
          } else {
            this.resetList()
          }
        }
      },
      loadMore () {
        this.busy = true
        console.log('loadMore')
        if (JSON.stringify(this.listParams) === '{}') {
          return
        }
        this.getList()
      },
      getList () {
        if (!this.listParams) {
          return false
        }
        var params = Object.assign({page: this.page, order_by: this.order_by}, this.listParams)
        postRequest(this.listApi, params).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.total = response.data.data.total
          console.log(this.total + '／／／／手机发神经开发建设是的风景是的')
          if (response.data.data.data.length > 0) {
            this.list = this.list.concat(response.data.data.data)
          }

          if (response.data.data.data.length < 10) {
            this.busy = true
          } else {
            this.busy = false
          }

          this.page++

          this.loading = 0
        })
      },
      getInfo () {
        postRequest(`profile/info`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.info = response.data.data.info
        })
      }
    },
    mounted () {
      this.getInfo()
    },
    watch: {
      'listParams' (newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.resetList()
        }
      }
    },
    created () {

    },
    updated () {
      this.$nextTick(() => {
        var eles = this.$el.querySelectorAll('.textToLink')
        for (var i in eles) {
          openVendorUrl(eles[i])
          openAppUrl(eles[i])
        }
      })
    }
  }
  export default Discuss
</script>

<style scoped="scoped" lang="less">
  .lidR2 {
    .lidframe {
      width: 304px;
      height: 34px;
      line-height: 34px;
      padding-left: 10px;
      /*text-align: center;*/
      border-radius: 5px;
      border: 1px solid #DCDCDC;
      span {
        font-size: 14px;
        color: #C8C8C8;
      }
    }
  }
  .empty {
    width: 100%;
    background: #FFFFFF;
    margin-bottom: 0.266rem;
    text-align: center;
    padding: 0.533rem 0;
  }

  .empty .icon {
    font-size: 1.333rem;
  }

  .empty p {
    width: 100%;
    font-size: 0.32rem;
    color: #c8c8c8;
    text-align: center;
  }

  .lidL{
    position: relative;
  }

  .lidL .icon{
    position: absolute;
    top:0.533rem;
    right:-0.08rem;
  }
</style>
