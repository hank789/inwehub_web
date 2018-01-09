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
        <div class="freeQuestion">专业问答</div>
        <svg class="icon freeQuestion—delete" aria-hidden="true" v-if="data.user.is_expert === 1">
          <use xlink:href="#icon-gengduo"></use>
        </svg>
        <div class="freeQuestion-time">2018-3-3</div>
      </div>
    </div>
    <div class="text-16-444 mui-ellipsis-3">{{data.feed.question_title}}</div>


    <div class="freeQuestion-container comment-container">
      <div class="question-answer">回答者<i>{{data.feed.answer_user_name}}</i></div>
      <div class="freeQuestion-upvote">回答好评率96%</div>
    </div>

    <div class="container-answer margin-10-0-0">
      <div class="color-808080 font-14 text-line-5"><div class="tagSelect">#供应链#</div>{{data.feed.question_title}}</div>
      <div class="interval top-10">承诺时间24h<i></i>相应时间24h <div class="question-money"><i></i>￥: 88</div></div>
    </div>

    <div class="freeQuestion-container">
      <div class="freeQuestion-allAnswer bg-blue major-upvote" v-if="!data.feed.is_pay_for_view">1元看答案/看评论</div>
      <div class="freeQuestion-allAnswer major-upvote  bg-blue" v-else>查看回答</div>
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
        {{data.feed.comment_number}}
      </div>
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
/*回答者样式*/
  .comment-container{
    height:41px;
    line-height: 19px;
    padding:10px 0 12px 0;
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
  /*一元看答案*/
  .major-upvote{
    width:134px;
  }
</style>
