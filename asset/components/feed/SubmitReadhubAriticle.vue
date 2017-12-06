<template>
  <div class="container-item">
    <div class="container-avatarAndText">
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

    <div class="text-16-444 mui-ellipsis-2 margin-10-0-0">{{data.feed.title}}<span class="color-b4b4b6 font-12"
                                                                                   v-if="data.feed.domain"> - {{data.feed.domain}}</span>

    <div class="container-image margin-10-0-0" v-if="data.feed.img">
      <img :src="data.feed.img"/>
    </div>

    <div class="options text-right margin-10-0-0" @tap.stop.prevent="toDetail(data.url)">
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

    </div>
  </div>
</template>


<script type="text/javascript">
  import Avatar from '../../components/image/Avatar.vue'
  import SuppertAndComment from './SuppertAndComment.vue'
  import { postRequest } from '../../utils/request'
  import { getIndexByIdArray } from '../../utils/array'
  import { getLocalUserInfo } from '../../utils/user'

  const currentUser = getLocalUserInfo()

  export default {
    data () {
      return {}
    },
    components: {
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
      toResume (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      }
    }
  }
</script>
