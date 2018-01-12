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
        <div class="mui-media-body freeQuestion-content">{{data.title.replace('专业回答', "")}}</div>
        <div class="freeQuestion" @tap.stop.prevent="$router.pushPlus('/askCommunity/majors')">专业问答</div>
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
    <div class="text-16-444 mui-ellipsis-3">{{data.feed.answer_content}}</div>


    <div class="freeQuestion-container comment-container">
      <div class="question-answer">回答者<i>{{data.feed.answer_user_name}}</i></div>
      <div class="freeQuestion-upvote" v-if="data.feed.average_rate">回答好评率{{data.feed.average_rate}}</div>
    </div>

    <div class="container-answer margin-10-0-0">
      <div class="color-808080 font-14 text-line-5"><div class="tagSelect" v-for="item in data.feed.tags">#{{item.name}}#</div>{{data.feed.question_title}}</div>
      <div class="interval top-10">承诺时间{{data.feed.answer_response_time}}<i></i>响应时间{{data.feed.answer_promise_time}} <div class="question-money"><i></i>￥: {{data.feed.question_price}}</div></div>
    </div>

    <div class="freeQuestion-container">
      <div class="freeQuestion-allAnswer bg-blue margin-left-0" v-if="data.feed.is_pay_for_view">查看回答</div>
      <div class="freeQuestion-allAnswer bg-blue margin-left-0" v-else>1元围观</div>
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
</style>
