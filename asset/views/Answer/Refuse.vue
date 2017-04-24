<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">拒绝应答</h1>
    </header>

    <div class="mui-content loading" v-show="loading">
      <div class="loading">
        <img :src="loading_gif"/>
      </div>
    </div>

    <div class="mui-content" v-show="!loading">

      <div class="mui-content-padded">
        <div class="form form-ask-refuse">
          <form>

            <div class="title">您怎么就拒绝回答啦？</div>
            <div class="category">
              <span v-for="(item, index) in tags" :class="sTags.indexOf(item) >= 0 ?'active':''"
                    @tap.stop.prevent="selectTags(item)">{{ item }}</span>
            </div>

            <textarea placeholder="谈谈您的感受！" v-model="description"></textarea>
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
      tags: [],
      sTags: [],
      id:null,
      description: '',
      loading: true,
      loading_gif: loading_gif
    }),
    computed: {
      nothing () {
        if (this.loading) {
          return -1;
        }
        return this.answers.length ? 0 : 1;
      }
    },
    methods: {
      selectTags (tag) {
        var pos = this.sTags.indexOf(tag);
        if (pos >= 0) {
          this.sTags.splice(pos, 1);
        } else {
          this.sTags.push(tag);
        }
      },
      submit(){

        if (!this.description) {
          mui.toast('请填写拒绝理由！');
          return;
        }

        if (!this.tags) {
          mui.toast('请选择标签！');
          return;
        }

        var data = {
          tags: this.sTags.join(','),
          description: this.description,
          question_id: this.id
        };
        addAccessToken().post(createAPI(`question/rejectAnswer`), data,
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

            this.$router.go(-2);
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
    mounted(){

    },
    created () {
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

      addAccessToken().post(createAPI(`tags/load`), {tag_type: 2},
        {
          validateStatus: status => status === 200
        }
      )
        .then(response => {

          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            this.$router.go(-1);
          }

          this.tags = response.data.data;
          this.loading = 0;
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
  export default Refuse;
</script>


<style scoped>
  .form-ask-refuse {
    padding: 10px 20px;
  }

  .form-ask-refuse textarea {
    margin-top: 15px;
    width: 100%;
    height: 100px;
    border: 1px solid #efefef;
  }

  .form-ask-refuse .title {
    margin-top: 10px;
    color: #8b8b8b;
    height: 32px;
  }

  .form-ask-refuse .category span.active {
    border: 1px solid #4a90e2;
  }

  .form-ask-refuse .category span {
    border: 1px solid #b6b6b6;
    border-radius: 5px;
    padding: 0 5px;
    display: inline-block;
    height: 32px;
    margin-right: 6px;
    margin-bottom: 10px;
    text-align: center;
    line-height: 32px;
    position: relative;
  }

  .form-ask-refuse .category span input {
    display: inline-block;
    position: relative;
    border: none;
    height: 90%;
    margin-top: -4px;
    width: 90%;
    text-align: center;
  }

  .form-ask-refuse .options {
    text-align: center;
  }

  .form-ask-refuse .button-wrapper {
    margin-top: 15px;
  }

  .mui-content {
    background-color: #fff;
  }
</style>
