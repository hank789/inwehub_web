<template>
  <div class="container-item">
    <div class="container-avatarAndText" @tap.stop.prevent="toDetail(data.url)">
      <div class="author">
        <div class="avatar" @tap.stop.prevent="toResume(data.user.uuid)">
          <div class="avatarInner"><Avatar :avatar="data.user.avatar"></Avatar>
            <svg class="icon" aria-hidden="true" v-if="data.user.is_expert === 1">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
        </div>
        <div class="mui-media-body">{{data.title}}</div>
      </div>
    </div>
    <div class="text-16-444 text-line-5 preWrapper textToLink" @tap.stop.prevent="toDetail(data.url)">{{data.feed.title}}</div>

    <Images class="container-images-discover padding-0 margin-10-0-0" :images="data.feed.img" :group="data.id" v-if="data.feed.img.length > 0"></Images>

    <div class="options text-right" @tap.stop.prevent="toDetail(data.url)">
      <div class="component-iconNumber iconPenglunWrapper" @tap.stop.prevent="commentIt(0, '', data.feed.comments)">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-pinglun1"></use>
        </svg><span>{{data.feed.comment_number}}</span>
      </div>
      <div class="component-iconNumber" :class="{'active': data.feed.is_upvoted}" @tap.stop.prevent="support">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dianzan1"></use>
        </svg><span>{{data.feed.support_number}}</span>
      </div>
    </div>
    <div class="container-answer margin-10-0-0" @tap.stop.prevent="toDetail(data.url)" v-if="data.feed.support_number || data.feed.comment_number">
      <div class="component-dianzanList" v-if="data.feed.support_number"><svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dianzan1"></use>
        </svg><span v-for="(item, index) in data.feed.supporter_list" @tap.stop.prevent="toResume(item.uuid)">{{item.name}}</span>等{{data.feed.support_number}}人
      </div>
      <div class="line-horizontal padding-5-0-5-0" v-if="data.feed.comment_number && data.feed.support_number"></div>
      <div class="container-comments" :class="{'padding-0': parseInt(data.feed.support_number) === 0}" v-if="data.feed.comment_number">
        <template v-for="(comment, index) in data.feed.comments">


          <div class="comment text-line-5"  @tap.stop.prevent="commentIt(comment.id, comment.owner.name, data.feed.comments)"><span class="from" @tap.stop.prevent="toResume(comment.owner.uuid)">{{comment.owner.name}}</span><span  class="textToLink" v-html="textToLink(comment.content)"></span>
          </div>

          <DiscussReplySimple
            :children="comment.children"
            :parentOwnerName="comment.owner.name"
            @comment="commentIt"
          ></DiscussReplySimple>

        </template>
        <div class="more" @tap.stop.prevent="toDetail(data.url)">查看全部{{data.feed.comment_number}}条评论</div>
      </div>
    </div>
    <div class="component-address margin-5-0-0" v-show="data.feed.current_address_name" @tap.stop.prevent="toDetail(data.url)">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-dingwei1"></use>
      </svg>{{data.feed.current_address_name}}
    </div>
  </div>
</template>

<script type="text/javascript">

  import Images from '../../components/image/Images.vue'
  import Avatar from '../../components/image/Avatar.vue'
  import { postRequest } from '../../utils/request'
  import { getLocalUserInfo } from '../../utils/user'
  import { getIndexByIdArray } from '../../utils/array'
  import DiscussReplySimple from '../../components/discover/DiscussReplySimple.vue'
  import { textToLinkHtml } from '../../utils/dom'
  import { openVendorUrl } from '../../utils/plus'

  const currentUser = getLocalUserInfo()

  export default {
    data () {
      return {}
    },
    components: {
      Images,
      Avatar,
      DiscussReplySimple
    },
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    created () {
    },
    watch: {},
    mounted () {
      var eles = this.$el.querySelectorAll('.textToLink')
      for (var i in eles) {
        openVendorUrl(eles[i])
      }
    },
    methods: {
      textToLink (text) {
        return textToLinkHtml(text)
      },
      prependItem (id, msg, createdAt, parentId, commentList) {
        console.log('comment append id:' + id + ', msg:' + msg + ', createdAt:' + createdAt + ', parentId:' + parentId)
        var userInfo = getLocalUserInfo()
        var item = {
          id,
          children: [],
          content: msg,
          owner: {
            is_expert: userInfo.is_expert,
            avatar: userInfo.avatar_url,
            user_id: userInfo.user_id,
            uuid: userInfo.uuid,
            name: userInfo.name
          },
          created_at: createdAt
        }

        if (parentId) {
          var parentIndex = getIndexByIdArray(commentList, parentId)
          if (parentIndex) {
            commentList[parentIndex].children.unshift(item)
            this.data.feed.comment_number++
          }
        } else {
          this.data.feed.comments.unshift(item)
          this.data.feed.comment_number++
        }
      },
      commentIt (parentId = 0, commentTargetUsername = '', list) {
        this.$emit('comment', this.data.feed.submission_id, parentId, commentTargetUsername, list, this)
      },
      support () {
        var data = {
          submission_id: this.data.feed.submission_id
        }

        postRequest(`article/upvote-submission`, data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          var uuid = currentUser.uuid
          var username = currentUser.name

          this.data.feed.is_upvoted = response.data.data.type === 'upvote' ? 1 : 0
          if (this.data.feed.is_upvoted) {
            this.data.feed.support_number++
            this.data.feed.supporter_list.push({name: username, uuid: uuid})
          } else {
            this.data.feed.support_number--
            for (var i in this.data.feed.supporter_list) {
              if (this.data.feed.supporter_list[i].uuid === uuid) {
                this.data.feed.supporter_list.splice(i, 1)
              }
            }
          }
          window.mui.toast(response.data.message)
        })
      },
      toDetail (url) {
        this.$router.pushPlus(url, 'list-detail-page')
      },
      toResume (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      }
    }
  }
</script>

<style scoped>
  .preWrapper{
    white-space: pre-wrap !important;
  }
  .iconPenglunWrapper{
    margin-right:10px;
  }

  .comment .from{
    color:#03aef9;
  }

  .comment .to{
    color:#808080;
  }
</style>

