<template>
  <div class="container-item">
    <div class="container-avatarAndText groupMore">
      <div class="author">
        <div class="avatar" @tap.stop.prevent="toResume(data.user.uuid)">
          <div class="avatarInner"><Avatar :avatar="data.user.avatar"></Avatar>
            <svg class="icon" aria-hidden="true" v-if="data.user.is_expert === 1">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
        </div>
        <div class="mui-media-body freeQuestion-content">{{data.title}}</div>
        <div class="freeQuestion—support" v-if="data.top"><i></i>顶</div>
        <div class="freeQuestion-time">
          <timeago :since="timeago(data.created_at)" :auto-update="60">
          </timeago>
        </div>
      </div>
      <!--<div class="more" v-if="show" @tap.stop.prevent="showItemOptions">-->
        <!--<svg class="icon" aria-hidden="true" >-->
          <!--<use xlink:href="#icon-gengduo"></use>-->
        <!--</svg>-->
      <!--</div>-->
    </div>


    <div class="margin-10-0-0">
      <span v-for="item in data.feed.tags" class="tags">#{{item.name}}#</span>
      {{data.feed.title}}
    </div>

    <div class="component-card-link">
      <div class="imageWrapper"><img class="lazyImg" v-lazy="data.feed.img"></div>
      <div class="cardLinktitle">{{data.feed.article_title}}</div>
      <div class="cardLinkUrl">{{data.feed.domain}}</div>
    </div>

    <div class="freeQuestion-container" @tap.stop.prevent="toDetail(data.feed.comment_url)">
      <!--<div class="feedComment">-->
        <!--<span>{{data.feed.comment_number}}评论 <span class="line-wall"></span> {{data.feed.support_number}}点赞</span>-->
      <!--</div>-->
      <div class="more" @tap.stop.prevent="showItemOptions" v-if="show">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gengduo"></use>
        </svg>
      </div>
      <div class="freeQuestion-upvote" :class="{'active': data.feed.is_upvoted}" @tap.stop.prevent="support">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zan"></use>
        </svg>
        {{data.feed.support_number}}
      </div>
      <div class="freeQuestion-comment" @tap.stop.prevent="commentIt(0, '', data.feed.comments)">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-pinglun"></use>
        </svg>
        {{data.feed.comment_number}}
      </div>
    </div>
    <!--<div class="container-answer margin-top-10 padding-space" @tap.stop.prevent="toDetail(data.feed.comment_url)" v-if="data.feed.support_number || data.feed.comment_number">-->
      <!--&lt;!&ndash; 点赞和评论列表start &ndash;&gt;-->
      <!--<SuppertAndComment-->
        <!--:supportNumber="data.feed.support_number"-->
        <!--:supportList="data.feed.supporter_list"-->
        <!--:commentNumber="data.feed.comment_number"-->
        <!--:commentList="data.feed.comments"-->
        <!--:detailUrl="data.feed.comment_url"-->
        <!--@commentIt="commentIt"-->
      <!--&gt;</SuppertAndComment>-->
      <!--&lt;!&ndash; 点赞和评论列表end &ndash;&gt;-->
    <!--</div>-->
  </div>
</template>


<script type="text/javascript">
  import Avatar from '../../components/image/Avatar.vue'
  import SuppertAndComment from './SuppertAndComment.vue'
  import { postRequest } from '../../utils/request'
  import { getIndexByIdArray } from '../../utils/array'
  import { getLocalUserInfo } from '../../utils/user'
  import userAbility from '../../utils/userAbility'

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
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    created () {
    },
    watch: {},
    mounted () {

    },
    methods: {
      goJoin (id) {
        this.$router.pushPlus('/group/detail/' + id)
      },
      showItemOptions () {
        this.$emit('showItemOptions', this.data)
      },
      // 时间处理；
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      toDetail (url) {
        this.$router.pushPlus(url, 'list-detail-two')
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

          if (code === 6108) {
            userAbility.inviteJoinInGroup(this.$parent, response.data.data.group_id)
            return
          }

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
          if (process.env.NODE_ENV === 'production' && window.mixpanel) {
            // mixpanel
            window.mixpanel.track(
              'inwehub:support:success',
              {
                'app': 'inwehub',
                'user_device': window.getUserAppDevice(),
                'page': this.id,
                'page_name': 'submission',
                'page_title': this.data.feed.is_upvoted ? 'support' : 'cancel',
                'referrer_page': ''
              }
            )
          }
          window.mui.toast(response.data.message)
        })
      },
      toResume (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()), 'list-detail-page')
      }
    }
  }
</script>
<style scoped lang="less">
  .more{
    color: #808080;
    font-size: 0.48rem;
    margin-left: 0.053rem;
    float: left;
    padding-right: 0.4rem;
  }
  .groups{
    margin-top: 0.4rem;
  }
  .padding-space{
    padding: 0.4rem 0.4rem 0.25rem 0.4rem;
  }

  .component-card-link{
    margin-top: 0.266rem;
  }
  .groupMore {
    display: flex;
    justify-content: space-between;
  }
  .freeQuestion-container .feedComment {
    color: #B4B4B6;
    font-size: 0.32rem;
  }
  .feedAddress {
    display: inline-block;
    color: #b4b4b6;
    font-size: .32rem;
    position: absolute;
    left: 3.04rem;
    top: 0.506rem;
  }
  .freeQuestion-comment {
    position: relative;
    z-index: -1;
  }
</style>
