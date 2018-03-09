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
        <div class="mui-media-body freeQuestion-content">{{data.title.replace('专业问答', "")}}</div>
        <div class="freeQuestion" @tap.stop.prevent="$router.pushPlus('/askCommunity/majors')">专业问答</div>
        <div class="freeQuestion—support" v-if="data.top"><i></i>顶</div>
        <svg class="icon freeQuestion—delete" aria-hidden="true">
          <use xlink:href="#icon-gengduo"></use>
        </svg>
        <div class="freeQuestion-time">
          <timeago :since="timeago(data.created_at)" :auto-update="60">
          </timeago>
        </div>
      </div>
    </div>
    <div class="average_rate" v-if="data.feed.average_rate">回答好评率{{data.feed.average_rate}}</div>
    <div class="text-16-444 mui-ellipsis-3">{{data.feed.answer_content}}</div>

    <div class="container-answer margin-10-0-0">
      <div class="color-808080 font-14 text-line-5"><div class="tagSelect" v-for="item in data.feed.tags" @tap.stop.prevent="toTagDetail(item.name)">#{{item.name}}#</div>{{data.feed.question_title}}</div>
      <div class="interval margin-top-6">承诺时间{{data.feed.answer_promise_time}}<i></i>响应时间{{data.feed.answer_response_time}} <div class="question-money"><i></i>￥: {{data.feed.question_price}}</div></div>
    </div>


    <div class="freeQuestion-container">
      <div class="freeQuestion-allAnswer margin-left-0 bg-blue" v-if="data.feed.is_pay_for_view">查看回答</div>
      <div class="freeQuestion-allAnswer margin-left-0 bg-blue" v-else>1元围观</div>
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
  import { postRequest } from '../../utils/request'
  import userAbility from '../../utils/userAbility'
  // import { getLocalUserInfo } from '../../utils/user'

  // const currentUser = getLocalUserInfo()

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
    created () {
    },
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
      support () {
        var data = {
          id: this.data.feed.answer_id
        }

        postRequest(`support/answer`, data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
//          var uuid = currentUser.uuid
//          var username = currentUser.name
//          if (false) {
//            this.data.feed.support_number--
//            for (var i in this.data.feed.supporter_list) {
//              if (this.data.feed.supporter_list[i].uuid === uuid) {
//                this.data.feed.supporter_list.splice(i, 1)
//              }
//            }
//          } else {
//            this.data.feed.support_number++
//            this.data.feed.supporter_list.push({name: username, uuid: uuid})
//          }

          this.$emit('setSupportStatus', response.data.data.type)

          window.mui.toast(response.data.data.tip)
        })
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

<style>
  .question-money{
    float: right;
    height:0.506rem;
    background: #a8dff7;
    border-radius: 0.106rem;
    font-size:0.32rem;
    color: #235280;
    line-height: 0.55rem;
    padding: 0 0.346rem 0 0.08rem;
  }
  .question-money i{
    margin: 0;
    display: inline-block;
    width:0.106rem;
    height:0.106rem;
    border-radius: 50%;
    background: #FFFFFF;
    margin-bottom: 0.042rem;
  }
  .tagSelect{
    display: inline-block;
    font-size:0.373rem;
    color: #235280;
    margin-right:0.133rem;
  }
  .top-10{
    margin-top: 0.266rem;
  }

</style>
<style scoped>
.average_rate{
  font-size: 0.32rem;
  color: #b4b4b6;
  margin-bottom: 0.16rem;
}
</style>
