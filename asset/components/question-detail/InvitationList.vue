<template>
  <div v-if="this.list.length">
    <ul class="my-focus">
      <div class="invitation-title">
        <span>邀请问答</span>
        <span @tap.stop.prevent='toInvitation()'>查看更多</span>
        <i class="bot"></i>
      </div>
      <li class="my-focus-item" v-for="(item, index) in list">
        <div class="avatar">
          <img :src="item.avatar_url"
               @tap.stop.prevent="$router.pushPlus('/share/resume?id=' + item.uuid + '&goback=1')"/>
          <svg class="icon" aria-hidden="true" v-if="item.is_expert =='1'">
            <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
          </svg>
        </div>
        <div  @tap.stop.prevent="$router.pushPlus('/share/resume?id=' + item.uuid + '&goback=1')">
          <p>
            <span class="mui-ellipsis">{{item.name}}</span>
          </p>
          <p class="mui-ellipsis">{{item.description}}</p>
        </div>
        <p class="follows"  v-if="item.is_invited">已邀请</p>
        <p class="follows bgblue" @tap.stop.prevent="choose(item.id,index)" v-else>邀请</p>
        <i class="bot"></i>
      </li>
    </ul>
  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  import { postRequest } from '../../utils/request'

  const IivitationList = {
    data: () => ({
      list: [],
      page: 1,
      loading: 1
    }),
    created () {
    },
    computed: {
    },
    props: {
      ask: {
        type: Object,
        default: {}
      }
    },
    components: {
      RefreshList
    },
    methods: {
      toInvitation () {
        var description = encodeURIComponent(this.ask.description.replace(/\s/g, '').substr(0, 200))
        var username = encodeURIComponent(this.ask.user_name.replace(/\s/g, ''))
        var answerNum = this.ask.answer_num ? this.ask.answer_num : 0
        var followedNum = this.ask.follow_num ? this.ask.follow_num : 0
        var url = '/RecommendInvitation/' + this.ask.id + '?username=' + username + '&title=' + description + '&answernum=' + answerNum + '&followednum=' + followedNum
        this.$router.pushPlus(url, 'backAndClose', true, 'pop-in', 'close', true)
      },
      getdata () {
        postRequest('question/recommendInviterList', {
          question_id: this.ask.id,
          page: this.page
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          this.list = response.data.data
          this.loading = 0
        })
      }
    },
    mounted () {

    },
    updated () {
      this.getdata()
    }
  }
  export default IivitationList
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
      right: 0;
      bottom: 0;
      left: 0rem;
      height: 0.026rem;
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: rgb(220, 220, 220);
    }
   /*列表的头部*/
    .invitation-title{
      width:100%;
      height: 1.173rem;
      background: #FFFFFF;
      position: relative;
      line-height: 1.173rem;
    }
    .invitation-title span:nth-of-type(1){
      font-size: 0.426rem;
      float: left;
      color: #444444;
    }
    .invitation-title span:nth-of-type(2){
      font-size: 0.373rem;
      float: right;
      color: #03aef9;
    }
   /*列表部分*/
  .my-focus {
    margin: 0;
    padding: 0;
    list-style: none;
    padding-left: 0.453rem;
    padding-right: 0.453rem;
    background: #FFFFFF;
    margin-top: 0.266rem;
  }

  .my-focus-item {
    width: 100%;
    height: 1.68rem;
    list-style: none;
    padding-top: 0.266rem;
    padding-bottom: 0.266rem;
    position: relative;
  }
  .my-focus-item div.avatar {
    width: 1.173rem;
    height: 1.173rem;
    float: left;
    margin-right: 0.213rem;
    position: relative;
  }
  .my-focus-item img {
    width: 1.173rem;
    height: 1.173rem;
    border-radius: 50%;

  }
  .my-focus-item svg {
    color: #fcc816;
    font-size:0.4rem;
    position: absolute;
    right:0;
    bottom: 0;
  }

  .my-focus-item div {
    float: left;
    width: 60%;
  }

  /*关注和取消*/

  .my-focus-item .follows {
    position: absolute;
    width: 1.653rem;
    height: 0.72rem;
    border: 0.026rem solid #03aef9;
    border-radius: 1.333rem;
    text-align: center;
    line-height: 0.72rem;
    right: 0;
    top: 0.48rem;
    font-size: 0.373rem;
    color: #03aef9;
  }

  .my-focus-item .bgblue {
    background: #03aef9;
    color: #FFFFFF;
  }

  .my-focus-item div p:nth-of-type(1) span {
    display: inline-block;
    max-width: 3.36rem;
    height: 0.533rem;
    overflow: hidden;
    font-family: "PingFangSC";
    font-size: 0.373rem;
    color: #565656;
  }

  .my-focus-item div p:nth-of-type(1) svg {
    font-size: 0.533rem;
    margin-bottom: 0.053rem;
    color: #3c95f9;
  }

  .my-focus-item div p:nth-of-type(2){
    width: 100%;
    height: 0.373rem;
    font-size: 0.346rem;
    color: #b4b4b6;
    line-height: 0.346rem;
  }
</style>
