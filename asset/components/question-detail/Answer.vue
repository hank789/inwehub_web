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
      @setFollowStatus="setFollowStatus"
    ></UserInfo>


    <div class="mui-table-view-cell">


      <div class="richText" v-if="answer.content != ''">
        <quill-editor ref="myTextEditorRead"
                      :options="editorOptionRead" @ready="onEditorReadyRead($event)">
        </quill-editor>
        <div class="time">{{answer.created_at ? answer.created_at.split(' ')[0].replace(/-/g, '/') : ''}}</div>
      </div>

      <div class="needMoneyWrapper" v-else>
        <div class="buttonWrapper">

          <pay :btnText="money+'元看答案'" :pay_object_type="pay_object_type" :pay_money="money"
               v-on:pay_success="paySuccess">

          </pay>
        </div>
        <div class="desc">用于鼓励提问者与回答者</div>
        <div class="time">{{answer.created_at ? answer.created_at.split(' ')[0].replace(/-/g, '/') : ''}}</div>
      </div>

      <Statistics
        :answerId="answer.id"
        :commentNum="answer.comment_number"
        :seeNum="answer.view_number"
        :supportNum="answer.support_number"
        :isSupported="answer.is_supported?true:false"
        @supportNumDesc="supportNumDesc"
        @supportNumAdd="supportNumAdd"
        @setSupportStatus="setSupportStatus"
      ></Statistics>
    </div>
  </div>
</template>

<script type="text/javascript">
  import UserInfo from './UserInfo.vue';
  import {quillEditor} from '../../components/vue-quill';
  import Statistics from './Statistics.vue';
  import pay from '../../components/pay/pay.vue';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';

  export default {
    data () {
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
      }
    },
    created(){
    },
    watch: {
      'answer'(newVal, oldVal) {
        var content = newVal.content;
        if (content) {
          var objs = JSON.parse(content);
          this.editorReadObj.setContents(objs);
        }
      },
    },
    methods: {
      setFollowStatus(status){
        this.answer.is_followed=status;
      },
      paySuccess(orderId){
        postRequest(`answer/payforview`, {
          order_id: orderId,
          answer_id: answer.id,
          device: 1
        }).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
          }

          this.answer.content = response.data.data.content;
        });
      },
      onEditorReadyRead(editor) {
        this.editorReadObj = editor;
      },
      supportNumAdd()
      {
        this.answer.support_number++;
        console.olog(this.answer);
      },
      supportNumDesc()
      {
        this.answer.support_number--;
        console.olog(this.answer);
      },
      setSupportStatus(type)
      {
        this.answer.is_supported = type === 'support' ? 1 : 0;
      }
    }
  };
</script>

<style scoped="scoped">
  .detail-answer {
    margin-bottom: 10px;
  }

  .detail-answer:before {
    display: none;
  }

  .detail-answer .time {
    font-size: 12px;
    color: #b4b4b6;
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
</style>
