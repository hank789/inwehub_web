<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">发现</h1>
    </header>

    <div class="mui-content">
      <div class="ShareArticles">
        <p>
          <span>分享你发现的好文</span>
          <span>复制文章源地址</span>
        </p>
      </div>
      <ul class="concreteContent">
        <li class="address">
          <p>文章地址</p>
          <input type="text" placeholder="输入URL"/>
          <i class="bot"></i>
        </li>
        <li class="title">
          <p>文章标题</p>
          <input type="text" placeholder="输入文章标题"/>
          <i class="bot"></i>
        </li>
        <li class="channel">
          <P>选择频道</P>
          <p v-if="Channel">{{Channel}}</p>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="selectChannel" v-else>
            <use xlink:href="#icon-shuru"></use>
          </svg>

          <i class="bot"></i>
        </li>
        <!--<li class="coverMap">-->
          <!--<p>封面图片</p>-->
          <!--<svg class="icon" aria-hidden="true">-->
            <!--<use xlink:href="#icon-shuru"></use>-->
          <!--</svg>-->
          <!--<div class="container-image">-->
            <!--<img src="../../statics/images/guide_01.png"/>-->
          <!--</div>-->
          <!--<i class="bot"></i>-->
        <!--</li>-->
        <button class="submit">发布</button>
      </ul>

    </div>
  </div>
</template>

<script>
  import { getLocalUserInfo, getUserInfo, getUserLevelPercentage } from '../../utils/user'

  export default {
    data () {
      return {
        Channel: ""
      }
    },
    methods: {
      selectChannel () {
        var userPicker = new window.mui.PopPicker()

        userPicker.setData([
          {
            value: '1',
            text: '汽车'
          },
          {
            value: '2',
            text: '小哈公社'
          },
          {
            value: '3',
            text: 'inwehub'
          },
          {
            value: '4',
            text: '顾问小哈'
          },
          {
            value: '5',
            text: '快速消费品'
          }
        ])
        userPicker.pickers[0].setSelectedValue(this.Channel)
        userPicker.show(items => {
          this.Channel = items[0].text
          userPicker.dispose()
        })
      }
    }

  }


</script>

<style scoped="scoped">
  .mui-content {
    background: #FFFFFF;
  }

  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a,
  input,
  button {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  .bot {
    position: absolute;
    right: 0px;
    bottom: 0;
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  /*分享文章*/
  .ShareArticles {
    width: 100%;
    height: 150px;
    background: #ececee;
    /*border:1px solid #000000;*/
    position: relative;
  }

  .ShareArticles p {
    width: 100%;
    height: 50px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .ShareArticles p span:nth-of-type(1) {
    display: block;
    font-size: 20px;
    color: #444444;
    line-height: 20px;
  }

  .ShareArticles p span:nth-of-type(2) {
    display: block;
    font-size: 14px;
    color: #808080;
    margin-top: 8px;
  }

  /*内容*/
  .concreteContent {
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    padding-top: 17.5px;
  }

  .concreteContent li {
    width: 92%;
    height: 43px;
    margin-left: 4%;
    position: relative;
    line-height: 43px;
  }

  .address p, .title p {
    float: left;
    color: #808080;
    font-size: 14px;
  }

  .address input, .title input {
    width: 80%;
    height: 42px;
    float: left;
    margin-bottom: 0;
    padding-right: 0;
    border: none;
    font-size:14px;
    color:#444444;
  }

  input::-webkit-input-placeholder { /*WebKit browsers*/
    color: #c8c8c8;
    font-size: 14px;
    text-align: right;
  }

  input::-moz-input-placeholder { /*Mozilla Firefox*/
    color: #c8c8c8;
    font-size: 14px;
    text-align: right;
  }

  input::-ms-input-placeholder { /*Internet Explorer*/
    color: #c8c8c8;
    font-size: 14px;
    text-align: right;
  }

  /*频道*/
  .channel p:nth-of-type(1) {
    float: left;
    color: #808080;
    font-size: 14px;
  }

  .channel p:nth-of-type(2) {
    float: right;
    color: #c8c8c8;
    font-size: 14px;
  }

  .channel svg {
    color: #c8c8c8;
    font-size: 17px;
    margin-top: 13px;
    float: right;
  }

  /*封面*/
  .concreteContent .coverMap {
    height: 166px;
  }

  .container-image {
    width: 100%;
    height: 123px;
  }

  .coverMap p {
    float: left;
    color: #808080;
    font-size: 14px;
  }

  .coverMap svg {
    color: #c8c8c8;
    font-size: 17px;
    margin-top: 13px;
    float: right;
  }

  /* 发布按钮*/
  .submit {
    width: 92%;
    margin-left: 4%;
    height: 44px;
    border-radius: 5px;
    background: #dcdcdc;
    font-size: 16px;
    color: #b4b4b6;
    border: none;
    margin-top: 30px;
    margin-bottom: 30px;
  }

</style>
