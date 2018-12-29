<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">邀请用户</h1>
    </header>
    <div class="mui-content">
      <div class="invitation-fouce-user" @tap.stop.prevent='toContact()'>
        邀请我关注的好友
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chakangengduojiantou"></use>
        </svg>
      </div>
      <div class="line-river line-river-full"></div>
      <div class="invitation-fouce-user" @tap.stop.prevent='toShare()'>
        邀请微信好友
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chakangengduojiantou"></use>
        </svg>
      </div>
      <div class="line-river-big"></div>
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
                 @tap.stop.prevent="$router.pushPlus('/share/resume?id=' + item.uuid + '&goback=1', 'list-detail-page')"/>
            <svg class="icon" aria-hidden="true" v-if="item.is_expert =='1'">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
          <div  @tap.stop.prevent="$router.pushPlus('/share/resume?id=' + item.uuid + '&goback=1', 'list-detail-page')">
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

    <Share :title="shareOptions.title"
           :shareName="shareOptions.shareName"
           :link="shareOptions.link"
           :hideShareBtn="true"
           :content="shareOptions.content"
           :imageUrl="shareOptions.imageUrl"
           :thumbUrl="shareOptions.thumbUrl"
           :targetId="question_id"
           :targetType="'recommendInvitation'"
           ref="shareComponent"></Share>

  </div>
</template>
<script>
  import { postRequest } from '../utils/request'
  import Share from '../components/Share.vue'
  import { getInviteAnswerDetail } from '../utils/shareTemplate'

  const PublishAnswers = {
    data: () => ({
      list: [],
      question_id: '',
      page: 1,
      loading: 1,
      invitation_user_id: [],
      shareOptions: {
        link: '',
        shareName: '',
        title: '',
        content: '',
        imageUrl: '',
        thumbUrl: ''
      }
    }),
    created () {
      this.question_id = this.$route.params.id

      var title = this.$route.query.title.replace(/\s/g, '').substr(0, 200)
      var answerNum = this.$route.query.answernum ? this.$route.query.answernum : 0
      var followedNum = this.$route.query.followednum ? this.$route.query.followednum : 0

      this.shareOptions = getInviteAnswerDetail(
        this.question_id,
        title,
        answerNum,
        followedNum
      )
    },
    computed: {

    },
    components: {
      Share
    },
    methods: {
      toShare () {
        this.$refs.shareComponent.share()
      },
      allInvitation () {
        this.invitation_user_id = []
        for (var index in this.list) {
          this.invitation_user_id.push(this.list[index].id)
        }
        if (this.invitation_user_id.length) {
          this.choose(this.invitation_user_id, -1)
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
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #fff;
  }
  /*邀请好友*/
  .invitation-fouce-user{
    width:100%;
    height:1.173rem;
    background: #fff;
    padding: 0 4%;
    line-height: 1.173rem;
    font-size:0.373rem;
    color: #444444;
  }
  .invitation-fouce-user svg{
    float: right;
    color: #808080;
    margin-top: 0.4rem;
  }
  /*换一批&&一键邀请*/
  .invitation-recommend{
    width:100%;
    height:1.173rem;
    border-bottom: 0.026rem solid #dcdcdc;
    background: #FFFFFF;
    position: relative;
  }
  .invitation-recommend p{
    width:50%;
    height:1.173rem;
    text-align: center;
    font-size:0.373rem;
    color: #235280;
    line-height: 1.173rem;
    float: left;
  }
  .invitation-recommend p svg{
    font-size: 0.533rem;
    margin-bottom: -0.053rem;
  }
  .invitation-recommend i{
    width:0.026rem;
    height:0.506rem;
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
    padding-left: 0.453rem;
    padding-right: 0.453rem;
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


/*无数据的显示样式*/
  .container {
    position: absolute;
    top: 50%;
    left: 36%;
  }

  .container svg {
    font-size: 1.6rem;
    margin-left: 0.613rem;
    margin-bottom: 0.213rem;
  }

  .container p {
    font-family: "PingFangSC";
    font-size: 0.32rem;
    color: #c8c8c8;
  }

  .descriptionText {
    width:60%;
    font-size: 0.346rem;
    color: #b4b4b6;
  }
</style>
