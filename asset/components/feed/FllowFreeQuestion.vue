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
    <div class="text-16-444 mui-ellipsis-2"> {{data.feed.title}}</div>
    <!--<div class="labelWrapper">-->
      <!--<span class="font-12 color-b4b4b6 line-vertical">{{data.feed.answer_num}}人回答</span>-->
      <!--<span class="font-12 color-03aef9">{{data.feed.follow_num}}关注</span>-->
    <!--</div>-->
    <div class="interval fllow-bot">{{data.feed.answer_num}}人回答<i></i>{{data.feed.follow_num}}关注</div>
    <!--<div class="answer-list mui-ellipsis" v-if="data.feed.answer_num">-->
      <!--回答者：<span v-for="item in data.feed.answer_user_list">{{item.name}}<i>,</i></span>-->
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
<style>

</style>
