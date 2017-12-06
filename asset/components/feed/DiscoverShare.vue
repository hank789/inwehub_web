<template>
  <div class="container-item" :class="{noMoreComment: data.feed.comment_number <= 8}">
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
    <div class="text-16-444 text-line-5 preWrapper textToLink" @tap.stop.prevent="toDetail(data.url)">
      <span v-for="item in data.feed.tags" class="tags">#{{item.name}}</span>
      <span v-html="textToLink(data.feed.title)">{{data.feed.title}}</span>
    </div>

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

      <!-- 点赞和评论列表start -->
      <SuppertAndComment
        :supportNumber="data.feed.support_number"
        :supportList="data.feed.supporter_list"
        :commentNumber="data.feed.comment_number"
        :commentList="data.feed.comments"
        :detailUrl="data.url"

        @commentIt="commentIt"
      ></SuppertAndComment>

      <!-- 点赞和评论列表end -->
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
  import { textToLinkHtml } from '../../utils/dom'
  import SuppertAndComment from './SuppertAndComment.vue'

  const currentUser = getLocalUserInfo()

  export default {
    data () {
      return {}
    },
    components: {
      Images,
      Avatar,
      SuppertAndComment
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

  .comment .from{
    color:#03aef9;
  }

  .comment .to{
    color:#808080;
  }

  .noMoreComment .container-answer{
    padding:10px 15px 10px;
  }
</style>

