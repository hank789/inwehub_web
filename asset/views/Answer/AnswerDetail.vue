<template>
  <div>

    <header class="mui-bar mui-bar-nav mui-bar-top">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{ title }}</h1>
    </header>

    <div class="mui-content" v-show="!loading">
      <div class="mui-table-view detail-ask">
        <div class="mui-table-view-cell">

          <div class="avatar">
            <div class="avatarInner">
              <img :src="answer.question?answer.question.user_avatar_url:''">
            </div>
          </div>

          <div class="mui-media-body">
            {{ answer.question ? answer.question.user_name : '' }}

            <div>
              <span class="timeAgo"><timeago
                :since="answer.question.created_at?timeago(answer.question.created_at):''"></timeago></span>
              <span class="amount">提问金额<b>￥{{ answer.question ? answer.question.price : '' }}</b>元</span>
            </div>
          </div>

        </div>
        <div class="mui-table-view-cell question content">提问：<br/>{{ answer.question ? answer.question.description : '' }}</div>
      </div>

      <div class="mui-row buttons" v-show="answer.question.status==2">
        <div class="mui-col-sm-6 mui-col-xs-6">
          <button type="button" class="mui-btn  mui-btn-block"
                  @tap.stop.prevent="selectTime"><span
            class="mui-icon fa fa-check-square-o"></span>确认应答

          </button>
        </div>
        <div class="mui-col-sm-6 mui-col-xs-6">
          <button type="button" class="mui-btn  mui-btn-block"
                  @tap.stop.prevent="$router.replace('/answerrefuse/' + answer.question.id)"><span
            class="mui-icon fa fa-times"></span>拒绝应答

          </button>
        </div>
      </div>



      <div class="form form-realAnswer" v-show="answer.question.status==4">

        <span class="time" v-if="startCountdown(answer.question)">倒计时<count-down :start-time="currentTime"
                                                                      :end-time="getEndTime(answer.question)"
                                                                      :dayTxt="':'" :hourTxt="':'"
                                                                      :minutesTxt="':'"></count-down></span>

        <span class="time" v-else-if="isTimeout(answer.question)"><b>已超时</b><timeago :since="timeago(answer.question.promise_answer_time)"
                                                                          :auto-update="60" locale="zh-Diff"></timeago></span>

        <span class="time" v-else><b v-show="isTimeout(answer.question)">已超时</b><timeago
          :since="timeago(answer.question.created_at)" :auto-update="60" locale="zh-Diff"></timeago></span>

        <div class="button-wrapper">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary"    @tap.stop.prevent="$router.push('/realAnswer/'+id)">添加回答内容</button>
        </div>
      </div>



      <div class="mui-table-view timeEnd" v-show="answer.question.status==5">
        <div class="mui-table-view-cell">
          您已拒绝回答该问题
        </div>
      </div>

      <div class="mui-table-view detail-answer" v-show="answer.question.status==6 || answer.question.status==7">
        <div class="mui-table-view-cell">


          <div class="avatar">
            <div class="avatarInner">
              <img :src="answer.answers[0]?answer.answers[0].user_avatar_url:''">
            </div>
          </div>

          <div class="mui-media-body">
            {{ answer.answers[0] ? answer.answers[0].user_name : '' }}

            <div>
              <span class="timeAgo"><timeago
                :since="answer.answers[0]?timeago(answer.answers[0].created_at):''"></timeago></span>
            </div>
          </div>

        </div>

        <div class="mui-table-view-cell question content">回答：<br/><div class="richText"><quill-editor ref="myTextEditorRead"
                                                                           :options="editorOptionRead"
                                                                           @change="onEditorChange($event)"
                                                                           @blur="onEditorBlur($event)"
                                                                           @focus="onEditorFocus($event)"
                                                                           @ready="onEditorReadyRead($event)">
        </quill-editor></div></div>
      </div>

      <!--<div class="mui-table-view detail-comment" v-show="answer.question.status==6">-->
        <!--<div class="mui-table-view-cell">-->
          <!--暂无评价-->

        <!--</div>-->
      <!--</div>-->


      <!--<div class="mui-table-view detail-comment-result" v-show="answer.question.status==7">-->
        <!--<div class="mui-table-view-cell content">-->
          <!--评价：{{ answer.feedback.description }}-->
        <!--</div>-->
        <!--<div class="mui-table-view-cell">-->
          <!--<span class="ratingNum">{{ rating }}.0分</span>-->
          <!--<star-rating :rating="rating" :padding="8" :star-size="25" :activeColor="'#F6A623'" :show-rating="showRating" :read-only="readOnly"></star-rating>-->
        <!--</div>-->
      <!--</div>-->

      <div class="mb70"></div>

    </div>

  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';

  import Quill from 'quill';
  import { ImageImport } from '../../js/modules/ImageImport.js';

  Quill.register('modules/imageImport', ImageImport);


  import { quillEditor } from '../../components/vue-quill';
  import CountDown from 'vue2-countdown';

  const AnswerDetail = {
    data: () => ({
      showRating: false,
      readOnly: true,
      id: null,
      currentTime: (new Date()).getTime(),
      answer: {
        answers: [{
          promise_time: null
        }],
        question: {
          status: 0,
        },
        feedback: {}
      },
      title:'回答问题',
      description: {},
      descMaxLength: 1000,
      descLength:0,
      loading: true,
      buttonAnswerDisable:false,
      buttonSelectTimeDisable:false,
      editorOption: {
        placeholder:'请填写回答',
        modules: {
          toolbar: [
            ['bold', { 'color': [] }, { 'align': [] }, 'image']
          ],
          history: {
            delay: 100,
            maxStack: 1,
            userOnly: true
          },
          imageImport: true
        }
      },
      editorOptionRead: {
        placeholder:' ',
        modules: {
          toolbar: [
          ]
        },
        readOnly: true
      },
      editorObj:{},
      editorReadObj:{}
    }),
    components: {
      quillEditor,
      CountDown
    },
    computed: {
      editor() {
        return this.$refs.myTextEditor.quillEditor
      },
      editorRead() {
        return this.$refs.myTextEditorRead.quillEditor
      },
      rating() {
        return this.answer.feedback.rate_star;
      }
    },
    mounted(){
      window.addEventListener('refreshData', (e)=>{
        //执行刷新
        console.log('refresh-answerDetail');
        this.getData();
      });
    },
    methods: {
      timeago(time) {
        let newDate = new Date();
        newDate.setTime(Date.parse(time.replace(/-/g, "/")));
        return newDate;
      },
      isTimeout(question){
        if (!question.promise_answer_time) {
          return false;
        }

        var endtime = this.getEndTime(question);
        var currentTime = (new Date()).getTime() / 1000;
        if (endtime < currentTime) {
          return true;
        }

        return false;
      },
      startCountdown(question){
        var endtime = this.getEndTime(question);
        var currentTime = (new Date()).getTime() / 1000;
        if (endtime < currentTime) {
          return false;
        }
        return true;
      },
      getEndTime(question){
        var deadline = question.promise_answer_time;
        if (deadline) {
          return Date.parse(deadline.replace(/-/g, "/")) / 1000;
        }
        return null;
      },
      docToHtml(docs){
        var doc = new Document(docs);
        return doc.convertTo('html');
      },
      onEditorChange(editor){
        this.descLength = editor.editor.getLength()-1;
      },
      onEditorBlur(editor) {
        //console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        //console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
        this.editorObj = editor;
      },
      onEditorReadyRead(editor) {
          this.editorReadObj = editor;
      },
      check(){
        //信息是否完善
        const currentUser = localEvent.getLocalItem('UserInfo');
        if (currentUser.hasOwnProperty('account_info_complete_percent')  && parseInt(currentUser.account_info_complete_percent) < 90) {
            mui.alert('您的个人信息还不完善，请先前往我的个人档案中补充完整才能应答。 ', null, null, () => {
              this.$router.replace('/my/info');
            });
        }
      },
      selectTime(){
        this.initDate();
      },
      goAnswer(){

        if (this.editorObj.getLength() <= 1) {
          mui.toast('请填写回答内容');
          return;
        }

        if (this.editorObj.getText().length <= 1) {
          mui.toast('请填写一段文本信息');
          return;
        }

        var data = {
          question_id: this.id,
          description: this.description,
          promise_time: ''
        };


        mui.confirm("回答提交后就不能再修改了，你确认提交么？ ", null, ['取消', '确定'], e => {
          if (e.index == 1) {
            if (this.buttonAnswerDisable) {
                return;
            }

            this.buttonAnswerDisable = true;

            data.description = JSON.stringify(data.description);

            postRequest(`answer/store`, data).then(response => {
              this.buttonAnswerDisable = false;

              var code = response.data.code;
              if (code !== 1000) {
                mui.alert(response.data.message);
                return;
              }

              mui.toast(response.data.message);

              var id = response.data.data.id;
              this.getData();
            });
          }
        }, 'div');
      },
      submit(time)
      {
        var data = {
          question_id: this.id,
          promise_time:time
        };

        if (this.buttonSelectTimeDisable) {
            return;
        }

        this.buttonSelectTimeDisable = true;

        postRequest(`answer/store`, data).then(response => {
          this.buttonSelectTimeDisable = false;
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          if (time != '0000') {
            this.getData();
          } else {
            this.getData();
          }
        });
      },
      initDate: function () {

        //普通示例
        var Picker = new mui.PopPicker();

        Picker.setData([
//          {
//            value: '0',
//            text: '立刻回答'
//          },
          {
            value: '120',
            text: '2小时内回答'
          },
          {
            value: '360',
            text: '6小时内回答'
          },
          {
            value: '720',
            text: '12小时内回答'
          },
          {
            value: '1440',
            text: '24小时内回答'
          }
        ]);

        var selectTime = '';
        Picker.show((rs) => {
          Picker.dispose();
          var value = rs[0].value;
          switch (value) {
            case '0':
              selectTime = '0000';
              break;
            case '120':
              selectTime = '0200';
              break;
            case '360':
              selectTime = '0600';
              break;
            case '720':
              selectTime = '1200';
              break;
            case '1440':
              selectTime = '2400';
              break;
            default:
              selectTime = '';
              break;
          }

          mui.confirm("选择确定后您将不能拒绝回答该问题了，并请在承诺的反馈时间内回答。", null, ['取消', '确定'], e => {
            if (e.index == 1) {
                this.submit(selectTime);
            }
          }, 'div');

        });




      },
      getTitle()
      {
        var status = this.answer.question.status;
        var title = '';
        switch (status) {
          case 2:
            title = '确认应答';
            break;
          case 4:
            if (this.answer.answers.length && this.answer.answers[0].promise_time) {
              title = '回答问题';
            } else {
              title = '回答问题';  //确认时间
            }
            break;
          default:
            title = '我的回答';
        }

        this.$emit('changeWechatTitle', title);

        this.title = title;
      },
      timeago(time) {
        if (!time) {
          return '';
        }
        let newDate = new Date();
        newDate.setTime(Date.parse(time.replace(/-/g, "/")));
        return newDate;
      },
      getData(){
        let id = parseInt(this.$route.params.id);

        if (!id) {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '发生一些错误',
              time: 1500,
              status: false
            });
          });
          this.$router.back();
          return;
        }

        this.id = id;

        postRequest(`question/info`, {id: this.id}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.toast(response.data.message);
            this.$router.pushPlus('/task');
          }

          this.answer = response.data.data;

          if (this.answer.answers[0]) {
            var content = this.answer.answers[0].content;
            var objs = JSON.parse(content);
            this.editorReadObj.setContents(objs);
          }

          this.loading = 0;

          this.getTitle();

          this.check();
        });
      }
    },
    beforeRouteLeave(to, from, next) {
      var popDiv = document.querySelector('.mui-dtpicker');
      if (popDiv) {
        document.body.removeChild(popDiv);
      }


      popDiv = document.querySelector('.mui-poppicker');
      if (popDiv) {
        document.body.removeChild(popDiv);
      }

      next();
    },
    watch: {
      descLength: function (newDescLength) {
        if (newDescLength > this.descMaxLength) {
          this.editorObj.history.undo();
        }
      },
      '$route': 'getData'
    },
    created () {
      showInwehubWebview();
      this.getData();
    }
  }
  export default AnswerDetail;
</script>


<style scoped>
  .detail-ask{
    padding:10px 0;
  }
  .detail-ask .question {
    position: relative;
    line-height: 28px;
  }

  .mui-media-body {
    padding-left: 10px;
  }

  .detail-ask .timeAgo {
    font-size: 12px;
    color: #8c8c8c;
  }

  .detail-ask .amount {
    position: absolute;
    bottom: 10px;
    right: 15px;
    font-size:14px;
    color: #ff9800;
  }

  .detail-ask .question .amount b {
    font-weight: normal;
  }

  .buttons {
    margin-left: -1px;
  }

  .buttons button {
    margin: -1px;
    padding: 10px 0;
    border-right: 0px;
    border-radius: 0;
  }

  .buttons button .mui-icon {
    font-size: 24px;
    vertical-align: bottom;
    margin-right: 10px;
  }

  .detail-answer {
    margin-top: -1px;
    padding:10px 0 0;
  }

  .detail-answer .question {
    position: relative;
    white-space:pre-wrap;
  }

  .detail-answer .timeAgo {
    font-size: 12px;
    color: #8c8c8c;
  }

  .detail-comment {
    margin-top: -1px;
    text-align: center;
  }

  .timeEnd {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .timeEnd .countDown {
    text-align: center;
    color: orange;
  }

  .star-rating {
    float: left;
  }

  .detail-comment-result {
    margin-top: -1px;
    padding:10px 0 0;
  }

  .detail-comment-result p {
    margin-top: 5px;
  }

  .ratingNum {
    float: right;
    margin-left: 10px;
    position: relative;
    bottom: -1px;
  }

  .content {
    line-height: 28px;
  }

  .avatar {
    z-index: 0;
    color: #ffffff;
    float: left;
    background-color: #bdbdbd;
    display: inline-block;
    height: 40px;
    width: 40px;
    font-size: 20px;
    color: #ffffff;
    text-align: center;
    border-radius: 50%;
  }

  .avatar .avatarInner {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 100%;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .form-realAnswer{
    padding-top:20px;
    padding-bottom:20px;
    background: #fff;
    position: relative;
  }

  .form-realAnswer:after{
    position: absolute;
    content: '';
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }

  .form-realAnswer textarea {
    background: none;
    width:100%;
    height:200px;
    border:none;
  }
  .form-realAnswer .title{
    margin-left:10px;
    height:32px;
  }


  .form-realAnswer .button-wrapper{
    margin-top:30px;
    padding:0 50px 15px;
  }

  .form-realAnswer .time{
    font-size:14px;
    color:#ff9800;
    position: absolute;
    top:15px;
    right: 16px;
  }

  .form-realAnswer .time b {
    font-weight:normal;
    margin-right:5px;
  }

  .textarea-wrapper{
    padding:0 0 20px;
    position: relative;
    border-radius: 5px;
    border:1px solid #bbbbbb;
    background: #fff;
    margin:0 5px;

  }
  .textarea-wrapper textarea{
    margin:0;
    padding-top:10px;
    padding-bottom:0;
  }
  .textarea-wrapper .counter{
    position: absolute;
    right: 10px;
    bottom: 2px;
    font-size:12px;
    color:#999;
  }
  .desc{
    padding-top:15px;
    color:#999;
  }
  .mui-table-view-cell:after{
    display: none;
  }

  .mui-content > .mui-table-view:first-child{
    margin-top:0;
  }

  .time div {
    display: inline-block;
    margin-left:5px;
  }
</style>
