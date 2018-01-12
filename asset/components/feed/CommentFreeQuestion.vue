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
        <div class="mui-media-body freeQuestion-content">{{data.title.replace('互动问答', "")}}</div>
        <div class="freeQuestion" @tap.stop.prevent="$router.pushPlus('/askCommunity/interactions')">互动问答</div>
        <svg class="icon freeQuestion—delete" aria-hidden="true" v-if="data.user.is_expert === 1">
          <use xlink:href="#icon-gengduo"></use>
        </svg>
        <div class="freeQuestion-time">
          <timeago :since="timeago(data.created_at)" :auto-update="60">
          </timeago>
        </div>
      </div>
    </div>
    <div class="text-14-444 ellipsis textToLink" v-html="data.feed.comment_content"></div>

    <div class="mui-ellipsis-3 answer-content">{{data.feed.answer_content}}</div>

    <div class="freeQuestion-container comment-container">
      <div class="question-answer">回答者<i>{{data.feed.answer_user_name}}</i></div>
      <div class="freeQuestion-upvote">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zan"></use>
        </svg>
        {{data.feed.support_number}}
      </div>
      <div class="freeQuestion-comment">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-pinglun"></use>
        </svg>
        {{data.feed.comment_num}}
      </div>
    </div>

    <div class="container-answer margin-10-0-0">
      <div class="color-808080 font-14 margin-5-0-0 text-line-5"><div class="tagSelect" v-for="item in data.feed.tags">#{{item.name}}#</div>{{data.feed.question_title}}</div>
      <div class="interval">{{data.feed.question_answer_num}}人回答<i></i>{{data.feed.follow_question_num}}关注</div>
    </div>
    <Invitation
      :is_followed_question ="data.feed.is_followed_question"
      :isAppear="isAppear"
      :question_id="data.feed.question_id"
      :username="data.user.name"
      :title="data.feed.question_title"
      :answer_num="data.feed.question_answer_num"
      :follow_num="data.feed.follow_question_num"
    ></Invitation>
  </div>
</template>

<script type="text/javascript">

  import Avatar from '../../components/image/Avatar.vue'
  import Invitation from '../../components/feed/QuestionInvitationAnswer.vue'

  export default {
    data () {
      return {
        isAppear: false
      }
    },
    components: {
      Avatar,
      Invitation
    },
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    created () {},
    watch: {},
    mounted () {

    },
    methods: {
      // 时间处理；
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
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
  /*回答者详情*/
.comment-container{
  height:19px;
  line-height: 19px;
  padding: 0 2px;
}
.question-answer{
  float: left;
  font-size:13px;
  color: #808080;
}
.question-answer i{
    color: #03aef9;
   font-style: normal;
  }
/*回答者的内容*/
.answer-content{
  font-size:16px;
  color: #444444;
  line-height: 21px;
  margin-bottom: 14px;
  margin-top: 13px;
}


</style>

