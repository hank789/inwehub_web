<template>
  <div>
    <div style="background: #f3f4f6"></div>
    <div class="mui-content">
      <div class="invitation-title">
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="close()">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
        <div class="next-step" @tap.stop.prevent="close()">完成</div>
        <div class="invitation-text">
          <p>关注几个互动问答</p>
          <p>参考更多用户的解答</p>
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
      <ul v-if="list.length">
        <li v-for="(item,index) in list" @tap.stop.prevent="skip(item.question_type,item.id)">
          <p class="mui-ellipsis-3"><span v-for=" tag in item.tags">#{{tag.name}}#</span>{{item.title}}</p>
          <p>{{item.answer_number}}人回答  |  {{item.follow_number}}关注</p>
          <div class="focus grey" v-if="item.is_followed_question" @tap.stop.prevent="collectQuestion(item.id,index)">已关注</div>
          <div class="focus" v-else @tap.stop.prevent="collectQuestion(item.id,index)">关注</div>
          <i class="bot"></i>
        </li>
      </ul>
      <Empty v-else></Empty>


    </div>
    <div id="statusBarStyle" mode="dark"></div>
  </div>
</template>
<script>
  import RefreshList from '../../components/refresh/List.vue'
  import { postRequest } from '../../utils/request'
  import Empty from '../../components/Empty.vue'

  export default {
    data: () => ({
      list: [],
      question_id: '',
      page: 1,
      loading: 1,
      followed_question_id: []
    }),
    created () {
    },
    computed: {

    },
    components: {
      RefreshList,
      Empty
    },
    methods: {
      close () {
        if (this.$route.query.from === 'feed') {
          this.$router.pushPlus('/home?refresh=1')
        } else {
          this.$router.pushPlus('/my')
        }
      },
      skip (type, id) {
        switch (type) {
          case 1:
            this.$router.pushPlus('/askCommunity/major/' + id)
            break
          case 2:
            this.$router.pushPlus('/askCommunity/interaction/answers/' + id)
            break
        }
      },
      allInvitation () {
        this.followed_question_id = []
        for (var index in this.list) {
          this.followed_question_id.push(this.list[index].id)
        }
        if (this.followed_question_id.length) {
          postRequest('follow/batchQuestions', {
            ids: this.followed_question_id
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
        postRequest('question/recommendUser', {
          page: this.page
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          this.list = response.data.data.data
          this.loading = 0
        })
      },
      change () {
        this.page += 1
        this.getdata()
      },
      collectQuestion (id, index) {
        postRequest(`follow/question`, {
          id: id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.list[index].is_followed_question = !this.list[index].is_followed_question
          window.mui.toast(response.data.data.tip)
        })
      }
    },
    mounted () {
      this.getdata()
    },
    updated () {
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
 /*内容*/
  ul{
    width:100%;
    overflow: hidden;
    position: relative;
  }
  ul li{
    width:92%;
    margin-left: 4%;
    position: relative;
    padding:0.32rem 0 0.4rem 0;
  }
  ul li p:nth-of-type(1){
    font-size: 0.426rem;
    color: #444444;
    line-height: 0.56rem;
  }
  ul li p:nth-of-type(1) span{
    color: rgb(35,82,128);
    margin-right: 0.16rem;
  }
  ul li p:nth-of-type(2){
    font-size: 0.32rem;
    color:#b4b4b6;
    margin-top: 0.08rem;
  }
  ul li .focus{
    width:1.653rem;
    height:27x;
    background: #03aef9;
    font-size: 0.373rem;
    color: #ffffff;
    text-align: center;
    line-height: 0.666rem;
    border-radius: 1.333rem;
    position: absolute;
    bottom: 0.253rem;
    right: 4%;
  }
  ul li .grey{
    background: #dcdcdc;
    color: #b4b4b6;
  }
</style>
