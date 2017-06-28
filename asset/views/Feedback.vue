<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">反馈建议</h1>
    </header>


    <div class="mui-content">
      <div class="feedback">
        <div class="title">我们懂得聆听，您的意见与反馈</div>

        <MTextarea v-model.trim="description" :content="description" :rows="9" :descMaxLength="500" :placeholder="'这里仅针对产品使用期间的任何问题进行收集，如果您有专业问题，请前往首页发起提问功能'"></MTextarea>

        <div class="button-wrapper">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit">提交</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {NOTICE} from '../stores/types';
  import {createAPI, addAccessToken} from '../utils/request';
  import MTextarea from '../components/MTextarea.vue';

  const Feedback = {
    data: () => ({
      description: ''
    }),
    components: {
      MTextarea
    },
    created () {
      showInwehubWebview();
    },
    methods: {
      submit(){
        if (!this.description) {
          mui.toast('请填写反馈内容');
          return;
        }
        this.description = '';
        return;

        var data = {
          content: this.description
        };

        addAccessToken().post(createAPI(`system/feedback`), data,
          {
            validateStatus: status => status === 200
          }
        )
          .then(response => {

            var code = response.data.code;
            if (code !== 1000) {
              mui.alert(response.data.message);
              return;
            }
            this.description = '';
            mui.toast("反馈成功");
          })
          .catch(({response: {message = '网络状况堪忧'} = {}}) => {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: data.message,
                time: 2000,
                status: false
              });
            });
          })
      }
    }
  }
  export default Feedback;
</script>


<style scoped>
  .mui-content{
  }
  .title{
    color:#aba9ab;
    height:40px;
    line-height:40px;
    padding-left:10px;
  }
  .feedback{
  }
  .feedback textarea{
    height:200px;
  }

  .textarea-wrapper{
    position: relative;
    margin:0 5px;
    background: #fff;
    border-radius: 5px;
    border: 1px solid #bbbbbb;
    padding-bottom:20px;
  }
  .textarea-wrapper textarea{
    padding-bottom:0;
    margin-bottom:0;
    border:none;
  }
  .textarea-wrapper .counter{
    position: absolute;
    right: 10px;
    bottom: 2px;
    color:#999;
  }
  .button-wrapper{
    margin-top:40px;
    padding:0 50px;
  }
</style>
