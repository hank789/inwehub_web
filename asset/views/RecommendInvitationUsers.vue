<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">邀请用户</h1>
    </header>
    <div class="mui-content">
      <div class="invitation-fouce-user" @tap.stop.prevent='toContact()'>
        邀请我关注的好友
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chakangengduojiantou"></use>
        </svg>
      </div>
      <div class="invitation-recommend">
        <p @tap.stop.prevent="change()">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shuaxin"></use>
          </svg>
          换一批
        </p>
        <i></i>
        <p @tap.stop.prevent="allInvitation()">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-yijianyaoqinghuida"></use>
          </svg>
          一键邀请
        </p>
      </div>
      <div class="container"  v-if="!this.list.length && !loading">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zanwushuju"></use>
        </svg>
        <p>暂时还没有数据呀～</p>
      </div>

      <ul class="my-focus">
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
  </div>
</template>
<script>
  import RefreshList from '../components/refresh/List.vue'
  import { postRequest } from '../utils/request'

  const PublishAnswers = {
    data: () => ({
      list: [],
      question_id: '',
      page: 1,
      loading: 1,
      invitation_user_id: []
    }),
    created () {
      this.question_id = this.$route.params.id
    },
    computed: {

    },
    components: {
      RefreshList
    },
    methods: {
      allInvitation () {
        this.invitation_user_id = []
        for (var index in this.list) {
          this.invitation_user_id.push(this.list[index].id)
        }
        if (this.invitation_user_id.length) {
          this.choose(this.invitation_user_id, 2)
          this.change()
        }
      },
      toContact () {
        var description = encodeURIComponent(this.$route.query.title.replace(/\s/g, '').substr(0, 200))
        var username = encodeURIComponent(this.$route.query.username.replace(/\s/g, ''))
        var answerNum = this.$route.query.answernum ? this.$route.query.answernum : 0
        var followedNum = this.$route.query.followednum ? this.$route.query.followednum : 0
        var url = '/contact/' + this.question_id + '?username=' + username + '&title=' + description + '&answernum=' + answerNum + '&followednum=' + followedNum
        this.$router.pushPlus(url, 'backAndClose', true, 'pop-in', 'close', true)
      },
      getdata () {
        postRequest('question/recommendInviterList', {
          question_id: this.question_id,
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
      },
      choose (id, index) {
        postRequest(`question/inviteAnswer`, {
          question_id: this.question_id,
          user_id: id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (index >= 0) {
            this.list[index].is_invited = 1
          } else {
            window.mui.toast('一键邀请成功')
          }
        })
      },
      change () {
        this.page += 1
        this.getdata()
      }
    },
    mounted () {
      this.getdata()
    },
    updated () {
     // 数据加载完之后
//      if (this.$route.query.from && this.$route.query.from === 'feed') {
//        this.allInvitation()
//      }
    }
  }
  export default PublishAnswers

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
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #FFFFFF;
  }
  /*邀请好友*/
  .invitation-fouce-user{
    width:100%;
    height:44px;
    background: #f3f4f6;
    padding: 0 4%;
    line-height: 44px;
    font-size:14px;
    color: #444444;
  }
  .invitation-fouce-user svg{
    float: right;
    color: #808080;
    margin-top: 15px;
  }
  /*换一批&&一键邀请*/
  .invitation-recommend{
    width:100%;
    height:44px;
    border-top: 1px solid #dcdcdc;
    border-bottom: 1px solid #dcdcdc;
    background: #FFFFFF;
    position: relative;
  }
  .invitation-recommend p{
    width:50%;
    height:44px;
    text-align: center;
    font-size:14px;
    color: #235280;
    line-height: 44px;
    float: left;
  }
  .invitation-recommend p svg{
    font-size: 20px;
    margin-bottom: -2px;
  }
  .invitation-recommend i{
    width:1px;
    height:19px;
    background: #dcdcdc;
    position: absolute;
    top:0;
    bottom: 0;
    left:0;
    right: 0;
    margin: auto;
  }
  /*列表区域*/
  .my-focus {
    margin: 0;
    padding: 0;
    list-style: none;
    padding-left: 17px;
    padding-right: 17px;
  }

  .my-focus-item {
    width: 100%;
    height: 63px;
    list-style: none;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
  }
  .my-focus-item div.avatar {
    width: 44px;
    height: 44px;
    float: left;
    margin-right: 8px;
    position: relative;
  }
  .my-focus-item img {
    width: 44px;
    height: 44px;
    border-radius: 50%;

  }
  .my-focus-item svg {
    color: #fcc816;
    font-size:15px;
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
    width: 62px;
    height: 27px;
    border: 1px solid #03aef9;
    border-radius: 50px;
    text-align: center;
    line-height: 27px;
    right: 0;
    top: 18px;
    font-size: 14px;
    color: #03aef9;
  }

  .my-focus-item .bgblue {
    background: #03aef9;
    color: #FFFFFF;
  }

  .my-focus-item div p:nth-of-type(1) span {
    display: inline-block;
    max-width: 126px;
    height: 20px;
    overflow: hidden;
    font-family: "PingFangSC";
    font-size: 14px;
    color: #565656;
  }

  .my-focus-item div p:nth-of-type(1) svg {
    font-size: 20px;
    margin-bottom: 2px;
    color: #3c95f9;
  }

  .my-focus-item div p:nth-of-type(2){
    width: 100%;
    height: 14px;
    font-size: 13px;
    color: #b4b4b6;
    line-height: 13px;
  }


/*无数据的显示样式*/
  .container {
    position: absolute;
    top: 50%;
    left: 36%;
  }

  .container svg {
    font-size: 60px;
    margin-left: 23px;
    margin-bottom: 8px;
  }

  .container p {
    font-family: "PingFangSC";
    font-size: 12px;
    color: #c8c8c8;
  }

  .descriptionText {
    width:60%;
    font-size: 13px;
    color: #b4b4b6;
  }
</style>
