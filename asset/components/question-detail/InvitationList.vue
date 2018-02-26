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
      height: 0.1rem;
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: rgb(220, 220, 220);
    }
   /*列表的头部*/
    .invitation-title{
      width:100%;
      height: 4.4rem;
      background: #FFFFFF;
      position: relative;
      line-height: 4.4rem;
    }
    .invitation-title span:nth-of-type(1){
      font-size: 1.6rem;
      float: left;
      color: #444444;
    }
    .invitation-title span:nth-of-type(2){
      font-size: 1.4rem;
      float: right;
      color: #03aef9;
    }
   /*列表部分*/
  .my-focus {
    margin: 0;
    padding: 0;
    list-style: none;
    padding-left: 1.7rem;
    padding-right: 1.7rem;
    background: #FFFFFF;
    margin-top: 1rem;
  }

  .my-focus-item {
    width: 100%;
    height: 6.3rem;
    list-style: none;
    padding-top: 1rem;
    padding-bottom: 1rem;
    position: relative;
  }
  .my-focus-item div.avatar {
    width: 4.4rem;
    height: 4.4rem;
    float: left;
    margin-right: 0.8rem;
    position: relative;
  }
  .my-focus-item img {
    width: 4.4rem;
    height: 4.4rem;
    border-radius: 50%;

  }
  .my-focus-item svg {
    color: #fcc816;
    font-size:1.5rem;
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
</style>
