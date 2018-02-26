<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">标签详情</h1>
    </header>
    <div class="mui-content absolute">
      <TagsInfo :tagName = tagName></TagsInfo>
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/tag/detail/' + encodeURIComponent(tagName) + '/questions')">问答</span>
        <span @tap.stop.prevent="$router.replace('/tag/detail/' + encodeURIComponent(tagName) + '/discover')">分享</span>
        <span @tap.stop.prevent="">用户 <i></i></span>
        <i class="bot"></i>
      </div>
      <!--内容区域-->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'tags/users'"
        :prevOtherData="{tag_name:tagName}"
        :nextOtherData="{tag_name:tagName}"
        :pageMode= true
        :list="list"
        class="listWrapper">
        <ul class="cions-list">
          <li  v-for="(item, index) in list">
            <div class="cions-avatar">
              <img :src="item.avatar_url"  @tap.stop.prevent="toAvatar(item.uuid)"/>
              <svg class="icon" aria-hidden="true" v-if="item.is_expert">
                <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
              </svg>
            </div>
            <div class="detail">
              <p>{{item.name}}</p>
              <p class="mui-ellipsis">{{item.description}}</p>
            </div>
            <div class="fouce grey"  @tap.stop.prevent="collectProfessor(item.uuid,index)" v-if="item.is_followed">已关注</div>
            <div class="fouce" @tap.stop.prevent="collectProfessor(item.uuid,index)" v-else>关注</div>
            <i class="bot"></i>
          </li>
        </ul>
      </RefreshList>

    </div>
  </div>
</template>
<script>
  import { postRequest } from '../../utils/request'
  import RefreshList from '../../components/refresh/List.vue'
  import TagsInfo from '../../components/tags/TagsInfo.vue'

  export default {
    data () {
      return {
        tagName: '',
        loading: 1,
        list: []
      }
    },
    components: {
      RefreshList,
      TagsInfo
    },
    created () {
      if (this.$route.params.tag) {
        this.tagName = this.$route.params.tag
      }
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
      }
    },
    mounted () {
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
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.1rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #FFFFFF;
  }
  /*菜单*/
  .menu{
    width:100%;
    height:3.9rem;
    background: #FFFFFF;
    font-size:1.4rem;
    color: #444444;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    position: relative;
  }
  .menu span:nth-of-type(3){
    position:relative;
    color: #03aef9;
  }
  .menu span:nth-of-type(3) i{
    position:absolute;
    width:2.7rem;
    height:0.15rem;
    border-radius: 5rem;
    background:#03aef9;
    top: 2.8rem;
    left: 0;
    right: 0;
    margin: auto;
  }

  /*list*/


  /*关注和取消*/

  .my-focus-item .follows {
    position: absolute;
    width: 6.2rem;
    height: 2.7rem;
    border: 0.1rem solid #03aef9;
    border-radius: 5rem;
    text-align: center;
    line-height: 2.7rem;
    right: 0;
    top: 1.8rem;
    font-size: 1.4rem;
    color: #03aef9;
  }

  .my-focus-item .bgblue {
    background: #03aef9;
    color: #FFFFFF;
  }

  .my-focus-item div p:nth-of-type(1) span {
    display: inline-block;
    max-width: 12.6rem;
    height: 2rem;
    overflow: hidden;
    font-family: "PingFangSC";
    font-size: 1.4rem;
    color: #565656;
  }

  .my-focus-item div p:nth-of-type(1) svg {
    font-size: 2rem;
    margin-bottom: 0.2rem;
    color: #3c95f9;
  }

  .my-focus-item div p:nth-of-type(2){
    width: 100%;
    height: 1.4rem;
    font-size: 1.3rem;
    color: #b4b4b6;
    line-height: 1.3rem;
  }
  /*列表区域*/
  .cions-list{
    width:100%;
    overflow: hidden;
    padding: 0 4%;
  }
  .cions-list li{
    position: relative;
    height:6.4rem;
  }
  .cions-list li div{
    float: left;
  }
  .cions-list li .cions-avatar{
    position: relative;
    width:4.4rem;
    height:4.4rem;
    border-radius:50%;
    background: #cccccc;
    margin-top: 1rem;
  }
  .cions-list li .cions-avatar img{
    width:4.4rem;
    height:4.4rem;
    border-radius:50%;
  }
  .cions-list li .cions-avatar svg{
    position: absolute;
    font-size: 2rem;
    right: -0.5rem;
    bottom: -0.2rem;
  }
  .cions-list li .detail{
    margin-top: 1.4rem;
    font-size:1.4rem;
    color: #444444;
    margin-left: 0.8rem;
  }
  .cions-list li .detail p:nth-of-type(2){
    width:20rem;
    font-size:1.2rem;
    color: #b4b4b6;
    margin-top: -0.2rem;
  }
  .cions-list li .fouce{
    width:6.1rem;
    height:2.7rem;
    border: 0.1rem solid #03aef9;
    border-radius: 5rem;
    text-align: center;
    line-height: 2.5rem;
    font-size:1.4rem;
    color: #03aef9;
    margin-top: 1.85rem;
    float: right;

  }
  .cions-list li .grey{
    color: #b4b4b6;
    border: 0.1rem solid #b4b4b6;
  }
  .listWrapper{
    top:17.7rem;
  }
</style>
