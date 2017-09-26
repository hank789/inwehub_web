<template>
  <div>
    <div class="message">
      <div class="message_title">
        <p>问答留言</p>
        <svg class="icon" aria-hidden="true">
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
  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';

  const Discuss = {
    data: () => ({
      loading: true,
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
</style>
