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
        <div class="mui-media-body freeQuestion-content">{{data.title.replace('互动回答', "")}}{{data.feed.answer_user_name}}</div>
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
    <div class="text-14-444 font ellipsis textToLink" v-html="textToLink(data.feed.comment_content)" @tap.stop.prevent="$router.pushPlus(data.url)"></div>

    <div class="freeQuestion-container comment-container ">
      <div class="question-answer">回答者<i>{{data.feed.answer_user_name}}</i></div>
    </div>


    <div class="mui-ellipsis-3 answer-content" @tap.stop.prevent="$router.pushPlus(data.url)">{{data.feed.answer_content}}</div>

    <div class="container-answer margin-10-0-0" @tap.stop.prevent="$router.pushPlus('/askCommunity/interaction/answers/' + data.feed.question_id, 'list-detail-page')">
      <div class="color-808080 font-14  text-line-5"><div class="tagSelect" v-for="item in data.feed.tags" @tap.stop.prevent="toTagDetail(item.name)">#{{item.name}}#</div>{{data.feed.question_title}}</div>
      <div class="interval margin-top-6">{{data.feed.question_answer_num}}人回答<i></i>{{data.feed.follow_question_num}}人关注</div>
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
  import userAbility from '../../utils/userAbility'
  import { textToLinkHtml, secureHtml } from '../../utils/dom'

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
      textToLink (text) {
        return secureHtml(textToLinkHtml(text))
      },
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
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
  .font{
    font-size: 0.426rem;
  }
  /*回答者详情*/
.comment-container{
  height:0.506rem;
  line-height: 0.506rem;
  padding: 0 0rem;
}
.question-answer{
  float: left;
  font-size:0.346rem;
  color: #808080;
  letter-spacing:0.026rem;
  margin-top: 0.08rem;
}
.question-answer i{
    color: #03aef9;
   font-style: normal;
  }
/*回答者的内容*/
.answer-content{
  font-size:0.426rem;
  color: #444444;
  line-height: 0.56rem;
  margin-bottom: 0.373rem;
  margin-top: 0.08rem;
  letter-spacing:0.026rem;
}


</style>

