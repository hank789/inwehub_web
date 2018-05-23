<template>
  <div class="freeQuestion-container">
    <div class="freeQuestion-fouce" v-if="is_followed_question" @tap.stop.prevent="collectAsk()">已关注</div>
    <div class="freeQuestion-fouce blue" @tap.stop.prevent="collectAsk()"  v-else>关注问题</div>


    <div class="freeQuestion-allAnswer bg-blue" @tap.stop.prevent="toContact()" >一键邀请</div>
    <div class="freeQuestion-upvote" v-if="isAppear" >
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-zan"></use>
      </svg>
      {{support_number}}
    </div>
    <div class="freeQuestion-comment" v-if="isAppear" >
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-pinglun"></use>
      </svg>
      {{comment_num}}
    </div>
  </div>
</template>
<script type="text/javascript">
  import { postRequest } from '../../utils/request'
  export default {
    data () {
      return {}
    },
    props: {
      is_followed_question: {
        type: Number,
        default: Number
      },
      isAppear: {
        type: Boolean,
        default: Boolean
      },
      question_id: {
        type: Number,
        default: Number
      },
      username: {
        type: String,
        default: String
      },
      title: {
        type: String,
        default: String
      },
      answer_num: {
        type: Number,
        default: Number
      },
      follow_num: {
        type: Number,
        default: Number
      },
      comment_num: {
        type: Number,
        default: Number
      },
      support_number: {
        type: Number,
        default: Number
      }
    },
    created () {
    },
    watch: {},
    mounted () {

    },
    methods: {
      collectAsk () {
        if (!this.question_id) {
          return
        }

        postRequest(`follow/question`, {
          id: this.question_id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.is_followed_question = response.data.data.type === 'follow' ? 1 : 0
        })
      },
      toContact () {
        var description = encodeURIComponent(this.title.replace(/\s/g, '').substr(0, 200))
        var username = encodeURIComponent(this.username.replace(/\s/g, ''))
        var answerNum = this.answer_num ? this.answer_num : 0
        var followedNum = this.follow_num ? this.follow_num : 0
        var url = '/RecommendInvitation/' + this.question_id + '?username=' + username + '&title=' + description + '&answernum=' + answerNum + '&followednum=' + followedNum + '&from=feed'
        this.$router.pushPlus(url, 'backAndClose', true, 'pop-in', 'close', true)
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

