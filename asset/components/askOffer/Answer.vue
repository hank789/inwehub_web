<template>
  <div class="mui-table-view detail-answer">
    <div class="component-title-home">
      <div class="left">回答</div>
      <div class="component-bestAnswerLabel" v-if="answer.is_best_answer">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-nianfendise1"></use>
        </svg>
        <span>最佳回答</span>
      </div>
    </div>
    <div class="line-river line-river-full"></div>
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
      :time="answer.created_at"
      @setFollowStatus="setFollowStatus"
    ></UserInfo>

    <div class="line-river-after line-river-after-rightLeft" v-show="!answer.content == ''"></div>

    <div class="mui-table-view-cell">

      <div class="richText container-editor container-editor-app" v-show="answer.content != ''">
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
          <p class="created_at"> 著作权归作者所有 </p>
        </div>
      </div>

      <div class="needMoneyWrapper" v-show="answer.content == ''">
        <div class="buttonWrapper">
          <div class="button-wrapper">
            <div id="pay_content">
              <div id="appleiap" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="toPay()">1元看答案 / 看评论</div>
            </div>
          </div>
        </div>
        <div class="desc">用于鼓励提问者与回答者</div>
        <div class="time">
          <p v-if="answer.average_rate" class="average_rate">{{answer.average_rate}}好评</p>
          <p class="created_at">{{answer.created_at}} 著作权归作者所有 </p>
        </div>
      </div>


      <div class="component-dianzanList margin-top-10" v-if="answer.support_number">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dianzan1"></use>
        </svg>
        <span v-for="(item, index) in answer.supporter_list" @tap.stop.prevent="toAvatar(item.uuid)">{{item.name}}</span><span v-if="answer.support_number > answer.supporter_list.length">等{{supportNum}}人</span>

      </div>

    </div>
  </div>
</template>

<script type="text/javascript">
  import UserInfo from '../question-detail/UserInfo.vue'
  import { quillEditor } from '../../components/vue-quill'
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
      pay
    },
    props: {
      questionId: {
        type: Number,
        default: 0
      },
      answer: {
        type: Object,
        default: function () {
          return {}
        }
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
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      toPay () {
        this.$emit('toPay')
      },
      change (editor) {
        var html = editor.html
        html = textToLinkHtml(html)

        html = html.replace(/<a href="/g, "<span class='vendorUrl text-content' href=\"")
        html = html.replace(/<\/a>/g, '</span>')

        var answerContentWrapper = this.$el.querySelector('.answerContent')
        html = addPreviewAttrForImg(html)
        html = html.replace(/(<p><br><\/p>)*$/, '')
        answerContentWrapper.innerHTML = html

        window.mui.previewImage()

        var that = this

        setTimeout(() => {
          openVendorUrl(answerContentWrapper)
          var aList = this.$el.querySelectorAll('a[href^="http"]')
          for (let i = 0; i < aList.length; i++) {
            aList[i].addEventListener('click', function (e) {
              e.preventDefault()
              that.$router.pushPlus('/webview/vendor/' + encodeURIComponent(this.href))
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
  .container-editor .ql-container{
    margin-top:0;
  }
  .detail-answer {
    margin-bottom: 0.266rem;
    padding-bottom:0.333rem;
  }

  .detail-answer:before {
    display: none;
  }

  .detail-answer .time {
    width:100%;
    overflow: hidden;
    font-size: 0.32rem;
    margin-top: 0.346rem;
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
    font-size: 0.373rem;
  }
  .mui-table-view-cell {
    position: relative;
    overflow: hidden;
    padding: 0.293rem 0.4rem 0 0.4rem;
    -webkit-touch-callout: none;
  }

  .hiddenWrapper{
    display: none;
  }

  .line-river-after-rightLeft:after {
    right: 0.426rem;
    left: 0.426rem;
  }
</style>
