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
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
          <ul class="message_detail">
            <li v-for="(item, index) in list">
              <div class="message_t">
                <p>
                  <img :src="item.user_avatar_url"/>
                  <svg class="icon" aria-hidden="true" v-show="item.is_expert">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </p>
                <p>
                  <span class="mui-ellipsis">{{ item.user_name }}</span>
                  <span>{{ item.created_at }}</span>
                </p>
              </div>
              <div class="message_b">
                {{ item.content }}

              </div>
              <i class="bot" v-show="list.length-1 !== index"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="commentWrapper" v-show="showTextarea">
      <div class="textareaWrapper">
        <textarea v-on:keydown.enter="sendMessage" v-model="textarea" placeholder="在此留言" id="commentTextarea"
                  autocomplete="off"></textarea>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="sendMessage">
          <use xlink:href="#icon-fasong"></use>
        </svg>
      </div>
    </div>

  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import {getLocalUserInfo} from '../../utils/user';

  const Discuss = {
    data: () => ({
      showTextarea: false,
      loading: true,
      textarea: '',
      busy: false,
      page: 1,
      list: []
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
        this.showTextarea = !this.showTextarea;

        if (this.showTextarea) {
          setTimeout(() => {
            document.getElementById('commentTextarea').focus();
          }, 500);
        }
      },
      sendMessage(event){

        event.preventDefault();

        if (!this.textarea.trim()) {
          return false;
        }

        postRequest(`answer/comment`, {'answer_id': this.answerId, content: this.textarea}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          var data = response.data.data;

          mui.toast(data.tips);

          this.prependItem(
              data.comment_id,
              this.textarea,
              data.created_at,
              data.user_name
          );
          this.textarea = '';
          this.showTextarea = false;
        });
      },
      prependItem(id, msg, created_at, username){
        var userInfo = getLocalUserInfo();
        console.olog(userInfo);

        var item = {
          id,
          content: msg,
          is_expert: userInfo.is_expert,
          user_avatar_url: userInfo.avatar_url,
          user_id: userInfo.user_id,
          user_name: username,
          created_at
        };

        this.list.unshift(item);
      },
      loadMore(){
        this.busy = true;
        console.log('loadMore');
        this.getList();
      },
      getList(){
        if (!this.answerId) {
          console.log('answerId:' + this.answerId);
          return;
        }

        console.log('getList');


        postRequest(`answer/commentList`, {'answer_id': this.answerId, page: this.page}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
          }

          if (response.data.data.data.length > 0) {
            this.list = this.list.concat(response.data.data.data);
          }

          if (response.data.data.data.length < 10) {
            this.busy = true;
          } else {
            this.busy = false;
          }

          this.page++;

          this.loading = 0;
        });
      }
    },
    watch: {
      'answerId'(newVal, oldVal) {
        if (newVal) {
          console.log('answerId new' + newVal);
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

  .listWrapper {
  }

  .commentWrapper {
    background: #ececee;
    position: fixed;
    width: 100%;
    bottom: 0;
    padding: 5px 15px;
  }

  .commentWrapper .textareaWrapper {
    position: relative;
    background: #fff;
    border-radius: 5px;
    height: 35px;
  }

  .commentWrapper textarea {
    border: none;
    display: inline-block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0 31px 0 5px;
    line-height: 35px;
    font-size: 14px;

  }

  .commentWrapper textarea::placeholder {
    color: #c8c8c8;
  }

  .commentWrapper .icon {
    position: absolute;
    right: 5px;
    color: #03aef9;
    font-size: 26px;
    top: 5px;
  }
</style>
