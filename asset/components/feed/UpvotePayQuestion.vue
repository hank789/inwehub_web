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
        <div class="freeQuestion" @tap.stop.prevent="$router.pushPlus('/ask/offers')">专业问答</div>
        <div class="freeQuestion—support" v-if="data.top"><i></i>顶</div>
        <div class="freeQuestion-time">
          <timeago :since="timeago(data.created_at)" :auto-update="60">
          </timeago>
        </div>
      </div>
    </div>

    <div class="freeQuestion-container comment-container margin-t">
      <div class="question-answer">回答者<i>{{data.feed.answer_user_name}}</i></div>
      <div class="freeQuestion-upvote" v-if="data.feed.average_rate">回答好评率{{data.feed.average_rate}}</div>
    </div>


    <div class="text-16-444 mui-ellipsis-3 answerMajorContent" v-html="textToLink(data.feed.answer_content)"></div>

    <div class="container-answer margin-10-0-0">
      <div class="color-808080 font-14 text-line-5">
        <div class="tagSelect" v-for="item in data.feed.tags" @tap.stop.prevent="toTagDetail(item.name)">#{{item.name}}#</div>
        <span v-html="textToLink(data.feed.question_title)"></span>
      </div>
      <div class="interval margin-top-6">承诺时间{{data.feed.answer_promise_time}}<i></i>响应时间{{data.feed.answer_response_time}} <div class="question-money"><i></i>￥: {{data.feed.question_price}}</div></div>
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
  import userAbility from '../../utils/userAbility'
  import { textToLinkHtml, secureHtml } from '../../utils/dom'

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
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()), 'list-detail-page')
      }
    }
  }
</script>

<style scoped>
/*回答者样式*/
  .comment-container{
    height: 0.8rem;
    padding: 0;
  }
  .question-answer{
    float: left;
    font-size:0.346rem;
    color: #808080;
  }
  .question-answer i{
    color: #03aef9;
    font-style: normal;
  }
  .answerMajorContent{
    width:100%;
  }
  .margin-t{
    margin-top: 0.1rem;
  }
</style>
