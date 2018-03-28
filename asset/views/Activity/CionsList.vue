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
        <span @tap.stop.prevent="">本月成长榜<i></i></span>
        <span @tap.stop.prevent="$router.replace('/invitationList')">本月获赞榜</span>
      </div>
     <template v-if="!loading && first">
        <div class="ranking">
          <div class="See" @tap.stop.prevent="$router.pushPlus('/my/Growth')">我的成长值</div>
          <img src="../../statics/images/creditslist@2x.png" class="ranking-title"/>
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
              <p class="cions">成长值<i>{{third.coins}}</i></p>
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
              <p class="cions">成长值<i>{{first.coins}}</i></p>
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
              <p class="cions">成长值<i>{{second.coins}}</i></p>
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
              <p>成长值<i>{{item.coins}}</i></p>
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
    right: 0rem;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #FFFFFF;
  }
  .menu{
    width:100%;
    height:1.04rem;
    background: #f3f4f6;
    font-size:0.373rem;
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
    width: 1.866rem;
    height:0.04rem;
    border-radius: 1.333rem;
    background:#03aef9;
    top: 0.746rem;
    left: 0;
    right: 0;
    margin: auto;
  }
  /*排名的展示样式*/
  .ranking{
    width:100%;
    height:7.04rem;
    background: #fcc816;
    position: relative;
  }
  .ranking-title{
    height:1.146rem;
    position: absolute;
    top:0.373rem;
    left:0;
    right: 0;
    margin: auto;
  }
  .See{
    position: absolute;
    right: 0;
    top:0.546rem;
    display: inline-block;
    font-size: 0.373rem;
    color: #ffffff;
    border-radius: 1.333rem 0 0 1.333rem;
    padding: 0.093rem 0.186rem 0.093rem 0.213rem;
    background: -webkit-linear-gradient( rgb(243, 130, 1), rgb(252, 153, 40)); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient( rgb(243, 130, 1), rgb(252, 153, 40)); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient( rgb(243, 130, 1), rgb(252, 153, 40)); /* Firefox 3.6 - 15 */
    background: linear-gradient( rgb(243, 130, 1), rgb(252, 153, 40)); /* 标准的语法（必须放在最后） */
  }
  .ranking-content{
    width:100%;
    height:4.68rem;
    position: absolute;
    top:1.826rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 0 4%;
  }
  .ranking-content li{
    height:4.16rem;
    border:0.026rem solid #ee8610;
    background: #ececee;
    margin-top: 0.133rem;
    border-radius:0.106rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0rem 0.053rem 0.106rem #ececee;
  }
  .ranking-content li:nth-of-type(2){
    height:4.68rem;
    margin: 0 2.5%;
    margin-top: 0;
  }
  .ranking-content li .avatar-container{
    margin:0.28rem 0 0.16rem 0;
    position: relative;
  }
  .ranking-content li:nth-of-type(2) .avatar-container{
    margin:0.413rem 0 0.16rem 0;
  }
  .ranking-content li .avatar-container .avatar{
    width:1.333rem;
    height:1.333rem;
    border-radius:50%;
  }
  .ranking-content li:nth-of-type(2) .avatar-container .avatar{
    width:1.6rem;
    height:1.6rem;
    border-radius:50%;
  }
  .ranking-content li .avatar-container .avatar img{
    width:100%;
    height:100%;
    border-radius:50%;
  }
  .ranking-content li .avatar-container .banner{
    width: 1.76rem;
    position: absolute;
    left: -0.213rem;
    bottom: -0.266rem;
    font-size: 0.293rem;
    color: #444444;
    text-align: center;
  }
  .ranking-content li:nth-of-type(2) .avatar-container .banner{
    width: 2.026rem;

  }
  .ranking-content li .avatar-container .banner span{
    position: absolute;
    top: 0.053rem;
    left: 0;
    right: 0;
    margin: auto;
    line-height: 0.666rem;
  }
  .ranking-content li:nth-of-type(2) .avatar-container .banner span{
    line-height: 0.8rem;
  }

  .ranking-content li p:nth-of-type(1){
    font-size: 0.373rem;
    color: #444444;
    font-weight:600;
  }
  .ranking-content li .cions{
    font-size: 0.32rem;
    color: rgb(68, 68, 68);
  }
  .ranking-content li .cions i{
    color: #235280;
  }
  .ranking-content li p:nth-of-type(3){
    width:2.186rem;
    height:0.64rem;
    border-radius:1.333rem;
    text-align: center;
    line-height: 0.586rem;
    font-size: 0.32rem;
    background: #03aef9;
    color: #ffffff;
    margin-top: 0.186rem;

  }
  .ranking-content li p:nth-of-type(3).grey{
    color: #b4b4b6;
    background: #dbdcdb;
  }
  /*列表区域*/
  .cions-list{
    width:100%;
    overflow: hidden;
    padding: 0 4%;
  }
  .cions-list li{
    position: relative;
    height:1.706rem;
  }
  .cions-list li div{
    float: left;
  }
  .cions-list li .cions-num{
    font-size:0.32rem;
    color: #c8c8c8;
    margin-top: 0.4rem;
  }
  .cions-list li .cions-num p:nth-of-type(2){
    font-size:0.48rem;
    font-weight:500;
    color: #235280;
    margin-top: -0.133rem;
  }
  .cions-list li .cions-avatar{
    position: relative;
    width:1.173rem;
    height:1.173rem;
    border-radius:50%;
    background: #cccccc;
    margin-top: 0.266rem;
    margin-left: 0.4rem;
  }
  .cions-list li .cions-avatar img{
    width:1.173rem;
    height:1.173rem;
    border-radius:50%;
  }
  .cions-list li .cions-avatar svg{
    position: absolute;
    font-size: 0.533rem;
    right: -0.133rem;
    bottom: -0.053rem;
  }
  .cions-list li .detail{
    margin-top: 0.373rem;
    font-size:0.373rem;
    color: #444444;
    margin-left: 0.213rem;
  }
  .cions-list li .detail p:nth-of-type(2){
    font-size:0.32rem;
    color: rgb(128, 128, 128);
    margin-top: -0.053rem;
  }
  .cions-list li .detail p:nth-of-type(2) i{
    color: #235280;
  }
  .cions-list li .fouce{
    width:1.626rem;
    height:0.72rem;
    background: #03aef9;;
    border-radius: 1.333rem;
    text-align: center;
    line-height: 0.72rem;
    font-size:0.373rem;
    color: #ffffff;
    margin-top: 0.493rem;
    float: right;

  }
  .cions-list li .grey{
    color: #b4b4b6;
    background:#dbdcdb;
  }

  /***媒体查询*****/

  @media screen and (min-width: 320px) {
    .ranking-content li{
      width:2.72rem;
    }
    .ranking-content li:nth-of-type(2){
      width:3.2rem;
    }
  }

  @media screen and (min-width: 375px) {
    .ranking-content li{
      width:2.72rem;
    }
    .ranking-content li:nth-of-type(2){
      width:3.2rem;
    }
  }

  @media screen and (min-width: 414px) {
    .ranking-content li{
      width:2.986rem;
    }
    .ranking-content li:nth-of-type(2){
      width:3.466rem;
    }
  }
</style>

