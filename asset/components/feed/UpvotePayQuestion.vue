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
    <div class="container-answer">
      <div class="color-444 font-16 mui-ellipsis-2">{{data.feed.question_title}}</div>
      <div class="color-808080 font-13 margin-5-0-0">回答者：{{data.feed.answer_user_name}}</div>
    </div>
    <!--点赞 关注问题-->
    <div class="options text-right">
      <div class="component-followed-question" v-if="data.feed.average_rate">{{data.feed.average_rate}}好评</div>
      <div class="component-iconNumber iconPenglunWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-pinglun1"></use>
        </svg><span>{{data.feed.comment_number}}</span>
      </div>
      <div class="component-iconNumber">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dianzan1"></use>
        </svg><span>{{data.feed.support_number}}</span>
      </div>
    </div>

    <div class="buttonWrapper">
      <button class="mui-btn mui-btn-block mui-btn-primary" v-if="!data.feed.is_pay_for_view">1元看答案／看评论</button>
      <button class="mui-btn mui-btn-block mui-btn-primary" v-else>查看回答</button>
    </div>

    <div class="component-dianzanList" v-if="data.feed.support_number"><svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-dianzan1"></use>
    </svg><span v-for="(item, index) in data.feed.supporter_list" @tap.stop.prevent="toResume(item.uuid)">{{item.name}}</span><span v-if="data.feed.support_number > data.feed.supporter_list.length">等{{data.feed.support_number}}人</span>
    </div>

  </div>
</template>

<script type="text/javascript">
  import Avatar from '../../components/image/Avatar.vue'

  export default {
    data () {
      return {}
    },
    components: {
      Avatar
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

  .buttonWrapper{
    margin-top:10px;
  }
</style>
