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


        <div class="form form-ask-refuse">
          <form>

            <div class="title">您怎么就拒绝回答啦？</div>
            <div class="category">
              <span v-for="(item, index) in tags" :class="sTags.indexOf(item) >= 0 ?'active':''"
                    @tap.stop.prevent="selectTags(item)">{{ item }}</span>
            </div>

            <div class="textarea-wrapper">
              <textarea v-model.trim="description"></textarea>
              <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
            </div>

            <!--<span class="mui-icon mui-icon-speech mui-plus-visible" @tap.stop.prevent="speech"></span>-->

            <div class="button-wrapper">
              <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                      @tap.stop.prevent="submit">提交反馈
              </button>
            </div>

          </form>
      </div>

    </div>

  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';

  const Refuse = {
    data: () => ({
      tags: [],
      sTags: [],
      id:null,
      descMaxLength: 200,
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
      },
      descLength() {
        return this.description.length;
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
      speech(){
        var options = {};
        options.engine = 'iFly';
        var t = this;
        plus.speech.startRecognize( options, function ( s ) {
          t.description += s;
        }, function ( e ) {
          mui.alert( "语音识别失败："+e.message );
        });
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


        mui.confirm("选择确定后您将不能再回答该问题了，您确定拒绝回答么？", null, ['取消', '确定'], e => {
          if (e.index == 1) {
            postRequest(`question/rejectAnswer`, data).then(response => {
              var code = response.data.code;
              if (code !== 1000) {
                mui.alert(response.data.message);
                return;
              }

              this.$router.replace('/answers/');
            });
          }
        }, 'div');
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

      postRequest(`tags/load`, {tag_type: 2}).then(response => {
        var code = response.data.code;
        if (code !== 1000) {
          mui.alert(response.data.message);
          this.$router.go(-1);
        }

        this.tags = response.data.data.tags;
        this.loading = 0;
      });
    },
    watch: {
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength);
        }
      }
    }
  }
  export default Refuse;
</script>


<style scoped>
  .form-ask-refuse {
    padding:0 5px;
  }

  .form-ask-refuse textarea {
    margin-top: 15px;
    width: 100%;
    height: 138px;
    border:none;
  }

  .form-ask-refuse .title {
    margin-top: 10px;
    margin-left:10px;
    color: #8b8b8b;
    height: 32px;
  }

  .form-ask-refuse .category{
    padding:10px 20px;
  }

  .form-ask-refuse .category span.active {
    border: 1px solid #4a90e2;
  }

  .form-ask-refuse .category span {
    border: 1px solid #b6b6b6;
    border-radius: 5px;
    padding: 0 15px;
    display: inline-block;
    height: 32px;
    background: #fff;
    font-size:14px;
    margin: 5px 6px;
    text-align: center;
    color:#333;
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
    padding:0 50px;
  }

  .textarea-wrapper {
    position: relative;
    background: #fff;
    padding-bottom:20px;
    border-radius: 5px;
    border: 1px solid #bbbbbb;
  }
  .textarea-wrapper textarea{
    margin:0;
    padding-bottom:0;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 10px;
    font-size:12px;
    bottom: 2px;
    color: #999;
  }
</style>
