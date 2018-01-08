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
        <div class="freeQuestion—support"><i></i>顶</div>
        <svg class="icon freeQuestion—delete" aria-hidden="true" v-if="data.user.is_expert === 1">
          <use xlink:href="#icon-gengduo"></use>
        </svg>
      </div>
    </div>
    <div class="text-16-444 text-line-2 freeQuestion-content">{{data.feed.content}}</div>
    <div class="container-answer margin-10-0-0">
      <div class="color-808080 font-14 text-line-5">{{data.feed.title}}</div>
      <div class="interval">{{data.feed.comment_num}}人回答<i></i>{{data.feed.follow_question_num}}关注</div>
    </div>
    <!--点赞 关注问题-->
    <!--<div class="options text-right">-->
      <!--<div class="component-followed-question blue" v-if="data.feed.is_followed_question">已关注{{data.feed.follow_question_num}}</div>-->
      <!--<div class="component-followed-question blue" v-else>关注问题{{data.feed.follow_question_num}}</div>-->
      <!--<div class="component-iconNumber iconPenglunWrapper">-->
        <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-pinglun1"></use>-->
        <!--</svg><span>{{data.feed.comment_number}}</span>-->
      <!--</div>-->
      <!--<div class="component-iconNumber">-->
        <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-dianzan1"></use>-->
        <!--</svg><span>{{data.feed.support_number}}</span>-->
      <!--</div>-->
    <!--</div>-->
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
    created () {
    },
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

