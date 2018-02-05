<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">用户榜</h1>
    </header>
    <!--组件-->
    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="">贡献榜<i></i></span>
        <span @tap.stop.prevent="$router.replace('/invitationList')">本月获赞榜</span>
      </div>
     <template v-if="!loading && first">
        <div class="ranking">
          <div class="See" @tap.stop.prevent="$router.pushPlus('/my/Growth')">我的贡献值</div>
          <img src="../../statics/images/cionslist@2x.png" class="ranking-title"/>
          <ul class="ranking-content">
            <li>
              <div class="avatar-container">
                <p class="avatar">
                  <img :src="third.user_avatar_url" @tap.stop.prevent="toAvatar(third.uuid)"/>
                </p>
                <p class="banner">
                  <img src="../../statics/images/blue-3@2x.png">
                  <span>No.{{third.rank}}</span>
                </p>
              </div>
              <p>{{third.user_name}}</p>
              <p class="cions">贡献值<i>{{third.coins}}</i></p>
              <p :class="third.is_followed?'grey':''" @tap.stop.prevent='collect(third.uuid,third)'>{{third.is_followed ? '已关注' : '关注Ta'}}</p>
            </li>
            <li>
              <div class="avatar-container">
                <p class="avatar big-avatar">
                  <img :src="first.user_avatar_url"  @tap.stop.prevent="toAvatar(first.uuid)"/>
                </p>
                <p class="banner">
                  <img src="../../statics/images/red-1@2x.png">
                  <span>No.{{first.rank}}</span>
                </p>
              </div>
              <p>{{first.user_name}}</p>
              <p class="cions">贡献值<i>{{first.coins}}</i></p>
              <p :class="first.is_followed?'grey':''" @tap.stop.prevent='collect(first.uuid,first)'>{{first.is_followed ? '已关注' : '关注Ta'}}</p>
            </li>
            <li>
              <div class="avatar-container">
                <p class="avatar">
                  <img :src="second.user_avatar_url" @tap.stop.prevent="toAvatar(second.uuid)"/>
                </p>
                <p class="banner">
                  <img src="../../statics/images/yellow-1@2x.png">
                  <span>No.{{second.rank}}</span>
                </p>
              </div>
              <p>{{second.user_name}}</p>
              <p class="cions">贡献值<i>{{second.coins}}</i></p>
              <p :class="second.is_followed?'grey':''" @tap.stop.prevent='collect(second.uuid,second)'>{{second.is_followed ? '已关注' : '关注Ta'}}</p>
            </li>
          </ul>
        </div>

        <ul class="cions-list">
          <li v-for="(item, index) in list">
            <div class="cions-num">
              <p>No.</p>
              <p>{{item.rank}}</p>
            </div>
            <div class="cions-avatar">
              <img :src="item.user_avatar_url" @tap.stop.prevent="toAvatar(item.uuid)"/>
              <svg class="icon" aria-hidden="true" v-if="item.is_expert">
                <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
              </svg>
            </div>
            <div class="detail">
              <p>{{item.user_name}}</p>
              <p>贡献值<i>{{item.coins}}</i></p>
            </div>
            <div class="fouce" :class="item.is_followed?'grey':''"  @tap.stop.prevent='collectProfessor(item.uuid,index)'>{{item.is_followed ? '已关注' : '关注'}}</div>
            <i class="bot"></i>
          </li>
        </ul>
     </template>
     <Empty v-if="!loading && list.length === 0"></Empty>
    </div>
  </div>
</template>
<script>
  import { postRequest } from '../../utils/request'
  import Empty from '../../components/Empty.vue'

  export default {
    data () {
      return {
        loading: 1,
        first: null,
        second: null,
        third: null,
        list: []
      }
    },
    components: {
      Empty
    },
    methods: {
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume/' + uuid + '?goback=1' + '&time=' + (new Date().getTime()))
      },
      // 点击关注；
      collectProfessor (uuid, index) {
        postRequest(`follow/user`, {
          id: uuid
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          if (response.data.data.type === 'unfollow') {
            this.list[index].is_followed = 0
          } else {
            this.list[index].is_followed = 1
          }
          window.mui.toast(response.data.data.tip)
        })
      },
      collect (uuid, item) {
        postRequest(`follow/user`, {
          id: uuid
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          if (response.data.data.type === 'unfollow') {
            item.is_followed = 0
          } else {
            item.is_followed = 1
          }
          window.mui.toast(response.data.data.tip)
        })
      },
      getData () {
        postRequest(`rank/userContribution`, {}).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          this.loading = 0
          if (response.data.data.length >= 0) {
            this.isAppear = response.data.data.length
            this.first = response.data.data[0]
            this.second = response.data.data[1]
            this.third = response.data.data[2]
            this.list = response.data.data.slice(3)
          }
        })
      }
    },
    mounted () {
      this.getData()
    },
    updated () {}
  }
</script>




<style scoped>
  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a {
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
  .mui-content{
    background: #FFFFFF;
  }
  .menu{
    width:100%;
    height:39px;
    background: #f3f4f6;
    font-size:14px;
    color: #444444;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  .menu span:nth-of-type(1){
    position:relative;
    color: #03aef9;
  }
  .menu span:nth-of-type(1) i{
    position:absolute;
    width:42px;
    height:1.5px;
    border-radius: 50px;
    background:#03aef9;
    top: 28px;
    left: 0;
    right: 0;
    margin: auto;
  }
  /*排名的展示样式*/
  .ranking{
    width:100%;
    height:264px;
    background: #fcc816;
    position: relative;
  }
  .ranking-title{
    height:43px;
    position: absolute;
    top:14px;
    left:0;
    right: 0;
    margin: auto;
  }
  .See{
    position: absolute;
    right: 0;
    top:20.5px;
    display: inline-block;
    font-size: 14px;
    color: #ffffff;
    border-radius: 50px 0 0 50px;
    padding: 3.5px 7px 3.5px 8px;
    background: -webkit-linear-gradient( rgb(243, 130, 1), rgb(252, 153, 40)); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient( rgb(243, 130, 1), rgb(252, 153, 40)); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient( rgb(243, 130, 1), rgb(252, 153, 40)); /* Firefox 3.6 - 15 */
    background: linear-gradient( rgb(243, 130, 1), rgb(252, 153, 40)); /* 标准的语法（必须放在最后） */
  }
  .ranking-content{
    width:100%;
    height:175.5px;
    position: absolute;
    top:68.5px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 0 4%;
  }
  .ranking-content li{
    height:156px;
    border:1px solid #ee8610;
    background: #ececee;
    margin-top: 5px;
    border-radius:4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0px 2px 4px #ececee;
  }
  .ranking-content li:nth-of-type(2){
    height:175.5px;
    margin: 0 2.5%;
    margin-top: 0;
  }
  .ranking-content li .avatar-container{
    margin:10.5px 0 6px 0;
    position: relative;
  }
  .ranking-content li:nth-of-type(2) .avatar-container{
    margin:15.5px 0 6px 0;
  }
  .ranking-content li .avatar-container .avatar{
    width:50px;
    height:50px;
    border-radius:50%;
  }
  .ranking-content li:nth-of-type(2) .avatar-container .avatar{
    width:60px;
    height:60px;
    border-radius:50%;
  }
  .ranking-content li .avatar-container .avatar img{
    width:100%;
    height:100%;
    border-radius:50%;
  }
  .ranking-content li .avatar-container .banner{
    width: 66px;
    position: absolute;
    left: -8px;
    bottom: -10px;
    font-size: 11px;
    color: #444444;
    text-align: center;
  }
  .ranking-content li:nth-of-type(2) .avatar-container .banner{
    width: 76px;

  }
  .ranking-content li .avatar-container .banner span{
    position: absolute;
    top: 2px;
    left: 0;
    right: 0;
    margin: auto;
    line-height: 25px;
  }
  .ranking-content li:nth-of-type(2) .avatar-container .banner span{
    line-height: 30px;
  }

  .ranking-content li p:nth-of-type(1){
    font-size: 14px;
    color: #444444;
    font-weight:600;
  }
  .ranking-content li .cions{
    font-size: 12px;
    color: rgb(68, 68, 68);
  }
  .ranking-content li .cions i{
    color: #235280;
  }
  .ranking-content li p:nth-of-type(3){
    width:82px;
    height:24px;
    border-radius:50px;
    border:1px solid #03aef9;
    text-align: center;
    line-height: 22px;
    font-size: 12px;
    color: #03aef9;
    margin-top: 7px;
  }
  .ranking-content li p:nth-of-type(3).grey{
    color: #b4b4b6;
    border: 1px solid #b4b4b6;
  }
  /*列表区域*/
  .cions-list{
    width:100%;
    overflow: hidden;
    padding: 0 4%;
  }
  .cions-list li{
    position: relative;
    height:64px;
  }
  .cions-list li div{
    float: left;
  }
  .cions-list li .cions-num{
    font-size:12px;
    color: #c8c8c8;
    margin-top: 15px;
  }
  .cions-list li .cions-num p:nth-of-type(2){
    font-size:18px;
    font-weight:500;
    color: #235280;
    margin-top: -5px;
  }
  .cions-list li .cions-avatar{
    position: relative;
    width:44px;
    height:44px;
    border-radius:50%;
    background: #cccccc;
    margin-top: 10px;
    margin-left: 15px;
  }
  .cions-list li .cions-avatar img{
    width:44px;
    height:44px;
    border-radius:50%;
  }
  .cions-list li .cions-avatar svg{
    position: absolute;
    font-size: 20px;
    right: -5px;
    bottom: -2px;
  }
  .cions-list li .detail{
    margin-top: 14px;
    font-size:14px;
    color: #444444;
    margin-left: 8px;
  }
  .cions-list li .detail p:nth-of-type(2){
    font-size:12px;
    color: rgb(128, 128, 128);
    margin-top: -2px;
  }
  .cions-list li .detail p:nth-of-type(2) i{
    color: #235280;
  }
  .cions-list li .fouce{
    width:61px;
    height:27px;
    border: 1px solid #03aef9;
    border-radius: 50px;
    text-align: center;
    line-height: 25px;
    font-size:14px;
    color: #03aef9;
    margin-top: 18.5px;
    float: right;

  }
  .cions-list li .grey{
    color: #b4b4b6;
    border: 1px solid #b4b4b6;
  }

  /***媒体查询*****/

  @media screen and (min-width: 320px) {
    .ranking-content li{
      width:102px;
    }
    .ranking-content li:nth-of-type(2){
      width:120px;
    }
  }

  @media screen and (min-width: 375px) {
    .ranking-content li{
      width:102px;
    }
    .ranking-content li:nth-of-type(2){
      width:120px;
    }
  }

  @media screen and (min-width: 414px) {
    .ranking-content li{
      width:112px;
    }
    .ranking-content li:nth-of-type(2){
      width:130px;
    }
  }
</style>

