<template>
  <div class="container-item">
    <div class="container-avatarAndText">
      <div class="author">
        <div class="avatar"  @tap.stop.prevent="toResume(data.user.uuid)">
          <div class="avatarInner"><Avatar :avatar="data.user.avatar"></Avatar>
            <svg class="icon" aria-hidden="true" v-if="data.user.is_expert === 1">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
        </div>
        <div class="mui-media-body freeQuestion-content">{{data.title.replace('互动问答', "")}}</div>
        <div class="freeQuestion" @tap.stop.prevent="$router.pushPlus('/askCommunity/interactions')">互动问答</div>
        <div class="freeQuestion—support" v-if="data.top"><i></i>顶</div>
        <svg class="icon freeQuestion—delete" aria-hidden="true" v-if="data.user.is_expert === 1">
          <use xlink:href="#icon-gengduo"></use>
        </svg>
        <div class="freeQuestion-time">
          <timeago :since="timeago(data.created_at)" :auto-update="60">
          </timeago>
        </div>
      </div>
    </div>
    <div class="text-16-444 text-line-3" @tap.stop.prevent="$router.pushPlus(data.url)">{{data.feed.answer_content}}</div>

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
      :comment_num="data.feed.comment_num"
      :support_number="data.feed.support_number"
    ></Invitation>

  </div>
</template>

<script type="text/javascript">
  import Avatar from '../../components/image/Avatar.vue'
  import Invitation from '../../components/feed/QuestionInvitationAnswer.vue'
  import userAbility from '../../utils/userAbility'

  export default {
    data () {
      return {
        isAppear: true
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
