<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left mui-action-back">取消</a>
      <h1 class="mui-title">回答</h1>
    </header>

    <div class="mui-content">

        <div class="form form-realAnswer">
            <Meditor v-model.trim="description" :content="description" :rows="5" :descMaxLength="1000" :placeholder="'请填写回答'"  @ready="onEditorReady($event)"></Meditor>

            <!--<span class="mui-icon mui-icon-speech mui-plus-visible" @tap.stop.prevent="speech"></span>-->


        </div>

      <div class="button-wrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary"    @tap.stop.prevent="goAnswer">我回答好了</button>
      </div>
    </div>


  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';

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
    methods: {
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

        var data = {
          question_id: this.id,
          description: this.description,
          promise_time: ''
        };

        mui.confirm("回答提交后就不能再修改了，你确认提交么？ ", null, ['取消', '确定'], e => {
          if (e.index == 1) {

            data.description = JSON.stringify(data.description);

            postRequest(`answer/store`, data).then(response => {

              var code = response.data.code;
              if (code !== 1000) {
                mui.alert(response.data.message);
                return;
              }

              mui.toast(response.data.message);

              this.$router.go(-1);
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
      let id = parseInt(this.$route.params.id);
      this.id = id;
    }
  }
  export default Answer;
</script>


<style scoped>
 .button-wrapper{
    margin-top: 15px;
    padding: 0 50px 15px;
  }

  .form-realAnswer{
    padding:5px 0;
  }
</style>
