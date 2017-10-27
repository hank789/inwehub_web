<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的擅长</h1>
    </header>

    <div class="mui-content absolute">
      <ul class="myLabel">
        <p>擅长标签</p>
        <li>
          高科技
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-times--"></use>
          </svg>

        </li>
        <li>
          SAP
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-times--"></use>
          </svg>
        </li>
        <li>
          模型
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-times--"></use>
          </svg>
        </li>
        <li>
          高科
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-times--"></use>
          </svg>
        </li>
        <li>
          机械制造
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-times--"></use>
          </svg>
        </li>

      </ul>
      <div class="gray"></div>

      <div class="addLable">
        <p>添加标签</p>
        <div class="search">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <input type="text" v-model="searchText"/>
        </div>
        <ul>
          <li>
            <p>搜不到?</p>
            <p @tap.stop.prevent="Obtain()">申请添加</p>
            <i class="bot"></i>
          </li>
          <li>
            高科技
            <i class="bot"></i>
          </li>
          <li>
            高科技
            <i class="bot"></i>
          </li>
          <li>
            高科技
            <i class="bot"></i>
          </li>
          <li>
            高科技
            <i class="bot"></i>
          </li>
        </ul>

      </div>

    </div>
  </div>
</template>

<script>
  import { getLocalUserInfo, getUserInfo, getUserLevelPercentage } from '../../utils/user';
  import {searchText} from '../../utils/search';
  export default {
    data() {
      return {
          searchText:''
      }
    },
    methods: {
      Obtain() {
        var btnArray = ['取消', '确定'];
        mui.prompt('', '标签名称', '输入标签名称', btnArray, function(e) {
          if(e.index == 1) {
            console.log(e.value);
//          info.innerText = '谢谢你的评语：' + e.value;
          } else {
            console.log(22);
//          info.innerText = '你点了取消按钮';
          }
        })
      },
      search(){
          console.log('ok');
      }

    },
    watch: {
      searchText: function (newValue) {
         searchText(newValue, () => {
             console.log('请求api搜索:'+newValue);
         });
      },
    },
    mounted() {

    }
  }
</script>

<style scoped>
  ul,
  li,
  p,
  span,
  a,
  i {
    margin: 0;
    padding: 0;
    list-style: none;
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

  .mui-content {
    background: #FFFFFF;
  }

  .myLabel {
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    padding: 0 4% 15px 2%;
  }

  .myLabel p {
    font-size: 13px;
    margin-top: 15px;
    margin-bottom: 4px;
    color: #808080;
    margin-left: 10px;
  }

  .myLabel li {
    display: inline-block;
    background: #f3f4f6;
    border: 8px;
    border-radius: 4px;
    padding: 5px 12px 5px 10px;
    margin-top: 10px;
    margin-left: 10px;
  }

  .myLabel li svg {
    font-size: 10px;
    color: #c8c8c8;
    margin-bottom: 2px;
    margin-left: 5px;
  }

  .gray {
    width: 100%;
    height: 10px;
    background: #f3f4f6;
  }

  .addLable {
    width: 100%;
    background: #FFFFFF;
    padding: 15px 4% 0 4%;
  }

  .addLable p {
    font-size: 13px;
    color: #808080;
  }

  .search {
    width: 100%;
    height: 38px;
    margin-top: 9px;
    background: #F3F4F5;
    border-radius: 100px;
  }

  .search svg {
    font-size: 17px;
    color: #c8c8c8;
    margin-top: 9px;
    margin-left: 16px;
    /*margin-right: 5px;*/
    float: left;
  }

  .search input {
    width: 80%;
    height: 20px;
    margin-top: 7px;
    float: left;
    border: none;
    background: #F3F4F5;
    font-size: 14px;
    color: #444444;
  }

  .addLable ul {
    width: 100%;
    overflow: hidden;
    margin-top: 22px;
  }

  .addLable ul li {
    width: 100%;
    height: 44px;
    position: relative;
    text-align: left;
    line-height: 44px;
    font-size: 14px;
    color: #808080;
  }

  .addLable ul li:nth-of-type(1) p:nth-of-type(1) {
    float: left;
    color: #03aef9;
  }

  .addLable ul li:nth-of-type(1) p:nth-of-type(2) {
    width: 86px;
    height: 27px;
    border: 1px solid #03aef9;
    border-radius: 100px;
    text-align: center;
    line-height: 27px;
    margin-top: 8.5px;
    float: right;
    color: #03aef9;
  }


  /*按钮的color*/
 .mui-popup-buttons span..mui-popup-buttons span.mui-popup-button {
   color: #808080;
 }

</style>
