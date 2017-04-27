<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">填写回答</h1>
    </header>

    <div class="mui-content">
      <div class="mui-content-padded">
        <div class="form form-realAnswer">
          <form>
            <div class="title">在这里留下您的回答：</div>
            <div class="textarea-wrapper">
              <textarea v-model.trim="description" placeholder="请填写回答"></textarea>
              <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
            </div>

            <div class="button-wrapper">
              <button type="button" class="mui-btn mui-btn-block mui-btn-primary"    @tap.stop.prevent="goAnswer">发布</button>
              <div class="desc">注意：发布后将不能更改，请再次检查内容！</div>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken} from '../../utils/request';

  const Answer = {
    data: () => ({
      id: null,
      description: '',
      descMaxLength: 500
    }),
    computed: {
      descLength() {
        return this.description.length;
      }
    },
    methods: {
      goAnswer(){
        if (!this.description) {
          mui.toast('请填写回答内容');
          return;
        }

        var data = {
          question_id: this.id,
          description: this.description,
          promise_time: ''
        };
        addAccessToken().post(createAPI(`answer/store`), data,
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

            mui.toast(response.data.message);

            var id = response.data.data.id;
            this.$router.replace('/answer/' + this.id);
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
    },
    created () {
      let id = parseInt(this.$route.params.id);
      this.id = id;
    }
  }
  export default Answer;
</script>


<style scoped>

  .form-realAnswer{
    padding:0 20px;
  }
  .form-realAnswer textarea {
    width:100%;
    height:200px;
    border:1px solid #efefef;
  }
  .form-realAnswer .title{
    margin-top:30px;
    color:#8b8b8b;
    height:32px;
  }


  .form-realAnswer .button-wrapper{
    margin-top:15px;
    padding-bottom:15px;
  }

  .mui-content{
    background-color:#fff;
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
  .desc{
    padding-top:15px;
    color:#999;
  }
</style>
