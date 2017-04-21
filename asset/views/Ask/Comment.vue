<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">评价</h1>
    </header>


    <div class="mui-content">

      <div class="mui-content-padded">
        <div class="form form-realAnswer">
          <form>

            <div class="title">您对大师的回答反馈还满意么？留下您的建议吧：</div>
            <div class="textarea-wrapper">
              <textarea v-model.trim="description" placeholder="在这里留下你的反馈"></textarea>
              <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
            </div>
            <div class="button-wrapper">
              <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                      @tap.stop.prevent="submit">提交
              </button>
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

  const Refuse = {
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
      submit(){
        if (!this.description) {
          mui.toast('请填写反馈内容');
          return;
        }

        var data = {
          answer_id: this.id,
          description: this.description,
          rate_star: 1
        };
        addAccessToken().post(createAPI(`answer/feedback`), data,
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
            this.$router.replace('/ask/' + id);
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
  export default Refuse;
</script>


<style scoped>
  .form-realAnswer{
    padding:0 20px;
  }
  .form-realAnswer textarea {
    margin-top:20px;
    width:100%;
    height:200px;
    border:1px solid #efefef;
  }
  .form-realAnswer .title{
    margin-top:30px;
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
</style>
