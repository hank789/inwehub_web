<template>
  <div>

    <header class="mui-bar mui-bar-nav mui-bar-top">
      <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left mui-action-back" @tap.stop.prevent="cancelAnswer">取消</a>
      <h1 class="mui-title">回答</h1>
      <a @tap.stop.prevent="goAnswer"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">发布</a>
    </header>

    <div class="mui-content answerRichText blur">
        <div class="form form-realAnswer">
            <Meditor ref="myTextEditor" v-model.trim="description" :content="description" :rows="5" :descMaxLength="50000" :placeholder="'请填写回答'"  :id="meditorId" @ready="onEditorReady($event)" @onEditorBlur="onEditorBlur" @onEditorFocus="onEditorFocus"></Meditor>

            <!--<span class="mui-icon mui-icon-speech mui-plus-visible" @tap.stop.prevent="speech"></span>-->


        </div>

      <!--<div class="button-wrapper">-->
        <!--<button type="button" class="mui-btn mui-btn-block mui-btn-primary"    @tap.stop.prevent="goAnswer">我回答好了</button>-->
      <!--</div>-->
    </div>


  </div>
</template>

<script>
  import {NOTICE, RICHTEXT_ANSWER_SET} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';
  import Meditor from '../../components/vue-quill/Meditor.vue';

  const Answer = {
    data: () => ({
      id: null,
      description: {},
      editorObj:{}
    }),
    components: {
      Meditor
    },
    mounted(){
    },
    watch: {
      '$route': 'refreshRouteData'
    },
    computed: {
      meditorId() {
        return 'answer' + this.id;
      }
    },
    methods: {
      refreshRouteData(){
         console.log('refreshRouteData');
         this.getId();
         console.log(this.id);
      },
      getId(){
        let id = parseInt(this.$route.params.id);
        this.id = id;
      },
      cancelAnswer(){

        if (mui.os.plus && mui.os.ios) {
          this.$refs.myTextEditor.nowSave();
        }


        if (this.editorObj.getLength() <= 1) {
          mui.back();
          return;
        }

        mui.confirm("退出此处编辑？", null, ['确定', '取消'], e => {
          console.log(e.index);
          if (e.index == 0) {
            setTimeout(() => {
              mui.back();
            }, 100);
          }
        }, 'div');
      },
      onEditorBlur(editor) {
//        document.getElementsByClassName('answerRichText')[0].className = document.getElementsByClassName('answerRichText')[0].className.replace('focus', '');
//        document.getElementsByClassName('answerRichText')[0].className = document.getElementsByClassName('answerRichText')[0].className.replace('blur', '')+' blur';
      },
      onEditorFocus(editor) {

//        document.getElementsByClassName('answerRichText')[0].className = document.getElementsByClassName('answerRichText')[0].className.replace('blur', '');
//        document.getElementsByClassName('answerRichText')[0].className = document.getElementsByClassName('answerRichText')[0].className.replace('focus', '')+' focus';
      },
      onEditorReady(editor) {
        this.editorObj = editor;

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

        // 提问设备，1为IOS，2为安卓，3为网页，4为微信小程序
        var device = 1;
        if (mui.os.plus) {
          if (mui.os.android) {
            device = 2;
          }
        } else {
          device = 3;
        }

        var data = {
          question_id: this.id,
          description: this.description,
          promise_time: '',
          device: device
        };

        mui.confirm("回答提交后就不能再修改了，你确认提交么？ ", null, ['取消', '确定'], e => {
          if (e.index == 1) {

            for (var i in data.description.ops) {
                if (data.description.ops[i].insert.hasOwnProperty('image')) {
                  if (/drag/.test(data.description.ops[i].insert.image)) {
                     data.description.ops.splice(i, 1);
                  }
                }
            }


            data.description = JSON.stringify(data.description);

            var options = {
              onUploadProgress: function(progressEvent) {
                this.percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                mui.uploadWaitingValue(this.percentCompleted);
              }
            };

            mui.showUploadWaiting();

            postRequest(`answer/store`, data, false, options).then(response => {

              var code = response.data.code;
              if (code !== 1000) {
                mui.alert(response.data.message);
                return;
              }

              mui.toast(response.data.message);

              if (mui.os.plus && mui.os.ios) {
                mui.plusReady(() => {
                  plus.storage.setItem(this.id, '');
                });
              } else {
                this.$store.dispatch(RICHTEXT_ANSWER_SET, {content:'', id:this.id});
              }
              //储存状态用来判断是否评论；
              localEvent.setLocalItem("isAnswer"+this.id, {value: 'true'});


              mui.back();
            });
          }
        }, 'div');
      },
      speech(){
        var options = {};
        options.engine = 'iFly';
        var t = this;
        plus.speech.startRecognize( options, function ( s ) {
          t.description += s;
        }, function ( e ) {
          mui.alert( "语音识别失败："+e.message );
        });
      }
    },
    created () {
        //showInwehubWebview();
        this.getId();
    }
  }
  export default Answer;
</script>


<style>
 .button-wrapper{
    margin-top: 15px;
    padding: 0 50px 15px;
  }

  .form-realAnswer{
    padding:5px 0;
  }



  .answerRichText.blur{
    position: absolute;
    width:100%;
    height:100%;
  }

 .answerRichText.blur .form-realAnswer{
    overflow: hidden;
    height:100%;
 }

 .answerRichText.blur .form-realAnswer > div{
   height:100%;
 }

 .answerRichText.blur .textarea-wrapper{
   height:100% !important;
 }

 .answerRichText.blur .quill-editor{
   height:100%;
 }

 .answerRichText.blur .ql-container{
   height:90%;
 }
</style>
