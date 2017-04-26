<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">意见反馈</h1>
    </header>


    <div class="mui-content">
      <div class="mui-content-padded feedback">
        <p>我们懂得聆听，您的意见与反馈</p>

        <div class="textarea-wrapper">
          <textarea placeholder="这里仅针对产品使用期间的任何问题进行收集，如果您有专业问题，请前往首页发起提问功能" v-model="description"></textarea>
          <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
        </div>

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

  const Feedback = {
    data: () => ({
      description: '',
      descMaxLength: 500
    }),
    computed: {
      descLength() {
        return this.description.length;
      }
    },
    methods: {
      submit(){
        if (!this.description) {
          mui.toast('请填写反馈内容');
          return;
        }

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
    },
    watch: {
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength);
        }
      }
    }
  }
  export default Feedback;
</script>


<style scoped>
  .mui-content{
    background-color:#fff;
  }
  .feedback{
    padding:10px;
  }
  .feedback textarea{
    height:200px;
  }

  .textarea-wrapper{
    position: relative;
  }
  .textarea-wrapper .counter{
    position: absolute;
    right: 10px;
    bottom: 30px;
    color:#999;
  }
</style>
