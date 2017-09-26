<template>
  <div>
    <div class="message">
      <div class="message_title">
        <p>问答留言</p>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="comment()">
          <use xlink:href="#icon-xiugai"></use>
        </svg>
        <i class="bot"></i>
      </div>

      <div class="listWrapper">
          <ul class="message_detail">
            <li>
              <div class="message_t">
                <p>
                  <img src="../../statics/images/balance1.png"/>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </p>
                <p>
                  <span class="mui-ellipsis">郭大红</span>
                  <span>2016/03/12 18:00</span>
                </p>
              </div>
              <div class="message_b">
                小米MIX2，这次它吸取了一代设计上的教训，减小了屏幕尺寸，变成5.99寸，由于是18:9的全面屏，所以大小就和5.5寸的iPhone7 plus一样

              </div>
              <i class="bot"></i>
            </li>
          </ul>
      </div>
    </div>

    <div class="commentWrapper" v-show="showTextarea">
      <div class="textareaWrapper">
        <textarea v-model="textarea" placeholder="在此留言" id="commentTextarea"></textarea>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="submit()">
          <use xlink:href="#icon-fasong"></use>
        </svg>
      </div>
    </div>

  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import autosize from 'autosize';

  const Discuss = {
    data: () => ({
      showTextarea:false,
      loading: true,
      textarea:'',
      list:[]
    }),
    props: {
      answerId: {
        type: Number,
        default: 0
      },
    },
    mounted(){
    },
    components: {},
    computed: {},
    methods: {
      comment(){
          this.showTextarea = true;
          setTimeout(() => {
            document.getElementById('commentTextarea').focus();
          }, 500);
      },
      submit(){
          if (!this.textarea) {
              return false;
          }

          postRequest(`answer/comment`, {'answer_id':this.answerId, content:this.textarea}).then(response => {
            var code = response.data.code;
            if (code !== 1000) {
              mui.alert(response.data.message);
              return;
            }

            mui.toast('留言成功');
            this.showTextarea = false;
          });
      },
      getList(){
        if (!this.answerId) {
            console.log('answerId:' + this.answerId);
            return;
        }
        postRequest(`answer/commentList`, {'answer_id':this.answerId, page:1}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          if (response.data.data.length > 0) {
            this.list = response.data.data;
          }
          this.loading = 0;
        });
      }
    },
    watch: {
      'answerId'(newVal, oldVal) {
        if (newVal) {
          this.getList();
        }
      },
    },

    created () {

    }
  }
  export default Discuss;
</script>

<style scoped="scoped">
  div,
  span,
  p,
  ul,
  li,
  i,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .message {
    width: 100%;
    background: #FFFFFF;
    overflow: hidden;
    margin-top: 10px;
    padding: 0 15px 15px 15px;
  }

  .message_title {
    width: 100%;
    height: 44px;
    position: relative;
    line-height: 44px;

  }

  .message_title p {
    float: left;
    font-size: 16px;
    color: #444444;

  }

  .message_title svg {
    float: right;
    font-size: 17px;
    color: #03aef9;
    margin-top: 13.5px;
  }

  .message_detail {
    width: 100%;
    overflow: hidden;
  }

  .message_detail li {
    width: 100%;
    overflow: hidden;
    position: relative;
    padding: 12px 0 10px 0;
  }

  .message_b {
    font-size: 14px;
    color: #444444;
    margin-top: 7px;
  }

  .message_t {
    width: 100%;
    height: 32px;
  }

  .message_t p:nth-child(1) {
    width: 32px;
    height: 32px;
    float: left;
    position: relative;
  }

  .message_t p:nth-child(1) img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .message_t p:nth-child(1) svg {
    font-size: 16px;
    color: #03aef9;
    position: absolute;
    bottom: 0;
    right: -5px;
  }

  .message_t p:nth-child(2) {
    float: left;
    margin-left: 10px;
    height: 32px;
  }

  .message_t p:nth-child(2) span {
    display: block;
    width: 100%;
    height: 50%;
    font-size: 13px;
    color: #444444;
  }

  .message_t p:nth-child(2) span:nth-child(2) {
    color: #c8c8c8;
  }

  .listWrapper{}

  .commentWrapper{
    background: #ececee;
    position: fixed;
    width:100%;
    bottom:0;
    padding:5px 15px;
  }

  .commentWrapper .textareaWrapper{
    position: relative;
    background:#fff;
    border-radius:5px;
    height:35px;
  }

  .commentWrapper textarea{
    border:none;
    display: inline-block;
    width:50%;
    height:100%;
    margin:0;
    padding:0 5px;
    line-height: 35px;
    font-size:14px;

  }

  .commentWrapper textarea::placeholder {
    color: #c8c8c8;
  }

  .commentWrapper .icon{
    position: absolute;
    right:5px;
    color:#03aef9;
    font-size:26px;
    top:5px;
  }
</style>
