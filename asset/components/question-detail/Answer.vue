<template>
  <div class="mui-table-view detail-answer">

    <UserInfo
      :uuid="answer.uuid"
      :avatar="answer.user_avatar_url?answer.user_avatar_url:''"
      :realname="answer.user_name ? answer.user_name : ''"
      :position="answer.title ? answer.title : ''"
      :company="answer.company ? answer.company : ''"
      :isFollow="isFollow"
      :isFollowed="answer.is_followed?true:false"
      :isExpert="answer.is_expert ? answer.is_expert : 0"
      :isShowPositionAndCompany="isShowPositionAndCompany"
      @setFollowStatus="setFollowStatus"
    ></UserInfo>


    <div class="mui-table-view-cell">


      <div class="richText" v-show="answer.content != ''">
        <quill-editor ref="myTextEditorRead"
                      :options="editorOptionRead" @ready="onEditorReadyRead($event)">
        </quill-editor>
        <div class="time">
          <p class="average_rate" v-if="answer.average_rate">{{answer.average_rate}}好评</p>
          <p class="created_at">{{answer.created_at ? answer.created_at.split(' ')[0].replace(/-/g, '/') : ''}}</p>
        </div>
      </div>

      <div class="needMoneyWrapper" v-show="answer.content == ''">
        <div class="buttonWrapper">

          <pay :btnText="money+'元看答案'" :pay_object_type="pay_object_type" :pay_object_id="answer.id" :pay_money="money"
               v-on:pay_success="paySuccess">

          </pay>
        </div>
        <div class="desc">用于鼓励提问者与回答者</div>
        <div class="time">
          <p v-if="answer.average_rate" class="average_rate">{{answer.average_rate}}好评</p>
          <p class="created_at">{{answer.created_at ? answer.created_at.split(' ')[0].replace(/-/g, '/') : ''}}</p>
        </div>
      </div>

      <Statistics
        :answerList="answer"
        :answerId="answer.id"
        :commentNum="answer.comment_number"
        :seeNum="answer.view_number"
        :supportNum="answer.support_number"
        :isSupported="answer.is_supported?true:false"
        :showShoucang="showShoucang"
        :collectNum="answer.collect_num"
        :isCollected="answer.is_collected?true:false"
        :questionId="questionId"
        :showModifyBtn="showModifyBtn && answer.user_id === curUid?true:false"
        @supportNumDesc="supportNumDesc"
        @supportNumAdd="supportNumAdd"
        @setSupportStatus="setSupportStatus"
        @collectNumDesc="collectNumDesc"
        @collectNumAdd="collectNumAdd"
        @setCollectStatus="setCollectStatus"
      ></Statistics>
    </div>
  </div>
</template>

<script type="text/javascript">
  import UserInfo from './UserInfo.vue'
  import { quillEditor } from '../../components/vue-quill'
  import Statistics from './Statistics.vue'
  import pay from '../../components/pay/pay.vue'
  import { postRequest } from '../../utils/request'
  import { getLocalUserInfo } from '../../utils/user'

  export default {
    data () {
      var user = getLocalUserInfo()
      return {
        editorOptionRead: {
          placeholder: ' ',
          modules: {
            toolbar: []
          },
          readOnly: true
        },
        editorReadObj: {},
        money: 1,
        curUid: user.user_id,
        uuid: user.uuid,
        name: user.name,
        pay_object_type: 'view_answer'
      }
    },
    components: {
      UserInfo,
      quillEditor,
      Statistics,
      pay
    },
    props: {
      questionId: {
        type: Number,
        default: 0
      },
      answer: {
        type: Object,
        default: {}
      },
      isFollow: {
        type: Boolean,
        default: false
      },
      needMoney: {
        type: Boolean,
        default: false
      },
      showModifyBtn: {
        type: Boolean,
        default: false
      },
      showShoucang: {
        type: Boolean,
        default: false
      },
      isShowPositionAndCompany: {
        type: Boolean,
        default: false
      }
    },
    created () {
    },
    watch: {
      'answer' (newVal, oldVal) {
        var content = newVal.content
        if (content) {
          var objs = JSON.parse(content)
          this.editorReadObj.setContents(objs)
          if (window.mui.os.plus && this.editorOptionRead.readOnly) {
            var aList = document.querySelectorAll('a[href^="http"]')
            for (let i = 0; i < aList.length; i++) {
              aList[i].addEventListener('click', function (e) {
                e.preventDefault()
                window.plus.runtime.openURL(this.href)
              }, false)
            }
          }
        }
      }
    },
    mounted () {},
    methods: {
      setFollowStatus (status) {
        this.answer.is_followed = status
      },
      paySuccess (orderId) {
        postRequest(`answer/payforview`, {
          order_id: orderId,
          answer_id: this.answer.id,
          device: 1
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          var content = response.data.data.content

          if (content) {
            var objs = JSON.parse(content)
            this.editorReadObj.setContents(objs)
            this.$emit('paySuccess', content)
          }
        })
      },
      onEditorReadyRead (editor) {
        this.editorReadObj = editor
      },
      supportNumAdd () {
        this.answer.support_number++
        var support = {
          name: this.name,
          uuid: this.uuid
        }
        this.answer.supporter_list = this.answer.supporter_list.concat(support)
      },
      supportNumDesc () {
        this.answer.support_number--
        for (var i in this.answer.supporter_list) {
          if (this.answer.supporter_list[i].uuid === this.uuid) {
            this.answer.supporter_list.splice(i, 1)
          }
        }
      },
      setSupportStatus (type) {
        this.answer.is_supported = type === 'support' ? 1 : 0
      },
      collectNumAdd () {
        this.answer.collect_num++
      },
      collectNumDesc () {
        this.answer.collect_num--
      },
      setCollectStatus (type) {
        this.answer.is_collected = type === 'collect' ? 1 : 0
      }
    }
  }
</script>

<style scoped="scoped">
  .detail-answer {
    margin-bottom: 10px;
  }

  .detail-answer:before {
    display: none;
  }

  .detail-answer .time {
    width:100%;
    overflow: hidden;
    font-size: 12px;
    margin-top: 13px;
    color: #b4b4b6;
  }
  .detail-answer .average_rate{
    float: left;
  }
  .detail-answer .created_at{
    float: right;
  }

  .detail-answer:after {
    display: none;
  }

  .needMoneyWrapper .desc {
    color: #b4b4b6;
    text-align: center;
    font-size: 14px;
  }
  .mui-table-view-cell {
    position: relative;
    overflow: hidden;
    padding: 11px 15px 0 15px;
    -webkit-touch-callout: none;
  }
</style>
