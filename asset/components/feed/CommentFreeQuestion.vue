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
        <div class="mui-media-body freeQuestion-content">{{data.title}}</div>
        <div class="freeQuestion">互动问答</div>
        <svg class="icon freeQuestion—delete" aria-hidden="true" v-if="data.user.is_expert === 1">
          <use xlink:href="#icon-gengduo"></use>
        </svg>
      </div>
    </div>
    <div class="text-14-444 ellipsis textToLink" v-html="data.feed.comment_content"></div>

    <div class="mui-ellipsis-3 answer-content">根据多年的许愿拜神经验，以下要素非常重要，选择正确的拜神时间，选择下图中您就近的神位，关键还是要心诚，如何做到心诚,谈谈我的方法，首先每天吃早餐非常重首先每天吃早餐非常重</div>

    <div class="freeQuestion-container comment-container">
      <div class="question-answer">回答者<i>{{data.feed.answer_user_name}}</i></div>
      <div class="freeQuestion-upvote">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zan"></use>
        </svg>
        23
      </div>
      <div class="freeQuestion-comment">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-pinglun"></use>
        </svg>
        23
      </div>
    </div>

    <div class="container-answer margin-10-0-0">
      <div class="color-444 font-16 text-line-2">{{data.feed.question_title}}</div>
      <div class="color-808080 font-14 margin-5-0-0 text-line-3">{{data.feed.answer_content}}</div>
      <div class="interval">3人回答<i></i>34关注</div>
    </div>
    <Invitation></Invitation>
  </div>
</template>

<script type="text/javascript">

  import Avatar from '../../components/image/Avatar.vue'
  import Invitation from '../../components/feed/QuestionInvitationAnswer.vue'

  export default {
    data () {
      return {}
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
  padding: 0;
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

