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
    <div class="text-16-444 mui-ellipsis-2">{{data.feed.title}}</div>

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
  import { postRequest } from '../../utils/request'
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

<style scoped>

  .buttonWrapper{
    margin-top:10px;
  }
</style>
