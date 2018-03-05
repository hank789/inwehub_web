<template>
  <div>
    <div style="background: #f3f4f6"></div>
    <div class="mui-content">
      <div class="invitation-title">
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="close()">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
        <div class="next-step" @tap.stop.prevent="toNext()">下一步</div>
        <div class="invitation-text">
          <p>关注您感兴趣的人</p>
          <p>关注Ta在平台上的动态</p>
        </div>
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
          一键关注
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
                 @tap.stop.prevent="toAvatar(item.uuid)"/>
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
          <p class="follows"  v-if="item.is_followed" @tap.stop.prevent="collectProfessor(item.id,index)">已关注</p>
          <p class="follows bgblue" @tap.stop.prevent="collectProfessor(item.id,index)" v-else>关注</p>
          <i class="bot"></i>
        </li>
      </ul>

    </div>
    <div id="statusBarStyle" mode="dark"></div>
  </div>
</template>
<script>
  import RefreshList from '../../components/refresh/List.vue'
  import { postRequest } from '../../utils/request'

  const PublishAnswers = {
    data: () => ({
      list: [],
      question_id: '',
      page: 1,
      loading: 1,
      invitation_user_id: []
    }),
    created () {
    },
    computed: {

    },
    components: {
      RefreshList
    },
    methods: {
      toNext () {
        this.$router.replace('/userGuide/stepthree?from=' + this.$route.query.from)
      },
      close () {
        if (this.$route.query.from === 'feed') {
          window.mui.back()
        } else {
          this.$router.pushPlus('/my')
        }
      },
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume/' + uuid + '?goback=1' + '&time=' + (new Date().getTime()))
      },
      allInvitation () {
        this.invitation_user_id = []
        for (var index in this.list) {
          this.invitation_user_id.push(this.list[index].id)
        }
        if (this.invitation_user_id.length) {
          postRequest('follow/batchUser', {
            ids: this.invitation_user_id
          }).then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.alert(response.data.message)
              window.mui.back()
              return
            }
            this.change()
            window.mui.toast('一键关注成功')
          })
        }
      },
      getdata () {
        postRequest('follow/recommendUserList', {
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
      change () {
        this.page += 1
        this.getdata()
      },
      collectProfessor (id, index) {
        postRequest(`follow/user`, {
          id: id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          console.log(response.data.data.type)
          if (response.data.data.type === 'follow') {
            this.list[index].is_followed = 1
          } else {
            this.list[index].is_followed = 0
          }
          window.mui.toast(response.data.data.tip)
        })
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
    background: #FFFFFF;
  }
  /*邀请的头部*/
  .invitation-title{
    width:100%;
    height:3.52rem;
    background: #f3f4f6;
    padding: 0 0.453rem;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .invitation-title svg{
    color: #b4b4b6;
    font-size: 0.666rem;
    position: absolute;
    left:0.453rem;
    top:0.533rem;
  }
  .invitation-title .next-step{
    width:2rem;
    height:0.906rem;
    line-height: 0.853rem;
    border: 0.026rem solid #03aef9;
    border-radius: 1.333rem;
    font-size:0.373rem;
    color:#03aef9;
    position: absolute;
    right:0.453rem;
    top:0.426rem;
  }
  .invitation-title .invitation-text{
    position: absolute;
    top:1.573rem;
    text-align: left;
    display: flex;
    flex-direction: column;
  }
  .invitation-text p:nth-of-type(1){
    font-size:0.373rem;
    color: #808080;
  }
  .invitation-text p:nth-of-type(2){
    font-size:0.533rem;
    color: #323232;
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
    border-radius: 1.333rem;
    text-align: center;
    line-height: 0.72rem;
    right: 0;
    top: 0.48rem;
    font-size: 0.373rem;
    color: #b4b4b6;
    background: #dcdcdc;
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
