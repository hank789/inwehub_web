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
        <div class="quill-editor">
          <div class="ql-container ql-snow">
            <div class="ql-editor answerContent">
            </div>
          </div>
        </div>
        <quill-editor
          class="hiddenWrapper"
          ref="myTextEditorRead"
          :options="editorOptionRead"
          @ready="onEditorReadyRead($event)"
          @change="change"
        >
        </quill-editor>
        <div class="time">
          <p class="average_rate" v-if="answer.average_rate">{{answer.average_rate}}好评</p>
          <p class="created_at">{{answer.created_at ? answer.created_at.split(' ')[0].replace(/-/g, '/') : ''}}</p>
        </div>
      </div>

      <div class="needMoneyWrapper" v-show="answer.content == ''">
        <div class="buttonWrapper">

          <div class="button-wrapper">
            <div id="pay_content">
              <div id="appleiap" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="toPay()">1元看答案</div>
            </div>
          </div>
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
  import { getLocalUserInfo } from '../../utils/user'
  import { textToLinkHtml, addPreviewAttrForImg } from '../../utils/dom'
  import { openVendorUrl } from '../../utils/plus'

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
        curUid: user.user_id,
        uuid: user.uuid,
        name: user.name
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
      'answer.content' (newVal, oldVal) {
        var content = newVal
        if (content) {
          var objs = JSON.parse(content)
          this.editorReadObj.setContents(objs)
        }
      }
    },
    mounted () {
      if (this.answer && this.answer.content) {
        var content = this.answer.content
        var objs = JSON.parse(content)
        this.editorReadObj.setContents(objs)
      }
    },
    methods: {
      toPay () {
        this.$emit('toPay')
      },
      change (editor) {
        var html = editor.html
        html = textToLinkHtml(html)

        html = html.replace('<a href="', "<span class='vendorUrl text-content' href=\"")
        html = html.replace('</a>', '</span>')

        var answerContentWrapper = this.$el.querySelector('.answerContent')
        html = addPreviewAttrForImg(html)
        html = html.replace(/(<p><br><\/p>)*$/, '')
        answerContentWrapper.innerHTML = html

        window.mui.previewImage()

        setTimeout(() => {
          openVendorUrl(answerContentWrapper)
          var aList = this.$el.querySelectorAll('a[href^="http"]')
          for (let i = 0; i < aList.length; i++) {
            aList[i].addEventListener('click', function (e) {
              e.preventDefault()
              this.router.pushPlus('/webview/vendor/' + encodeURIComponent(this.href))
            }, false)
          }
        }, 100)
      },
      setFollowStatus (status) {
        this.answer.is_followed = status
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

  .hiddenWrapper{
    display: none;
  }
</style>
