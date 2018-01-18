<template>
  <div>
    <div class="mui-content">
      <div class="invitation-title">
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.push('/my')">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
        <div class="next-step" @tap.stop.prevent="$router.push('/my')">完成</div>
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
      <ul>
        <li>
          <p class="mui-ellipsis-3">
            <span>#供应链#</span>咨询顾问迎接新年的到来有什么独特的方式？对于2018年应该有怎样的期待和愿望？
            为了愿景的达成，许愿、努力、烧香...佛，怎样才是正确的姿势？如果选择拜佛，哪里的佛更靠谱一点？怎样才是正确的姿势？如果...
            佛更靠谱一点
          </p>
          <p>3人回答  |  34关注</p>
          <div class="focus">关注</div>
          <i class="bot"></i>
        </li>
      </ul>



    </div>
  </div>
</template>
<script>
  import RefreshList from '../../components/refresh/List.vue'
  import { postRequest } from '../../utils/request'

  export default {
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

//          if (response.data.data.unfollow) {
          this.list[index].is_followed = !this.list[index].is_followed
//          }

          window.mui.toast(response.data.data.tip)
        })
      }
    },
    mounted () {
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
    left: 0px;
    height: 1px;
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
    height:132px;
    background: #f3f4f6;
    padding: 0 17px;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .invitation-title svg{
    color: #b4b4b6;
    font-size: 25px;
    position: absolute;
    left:17px;
    top:20px;
  }
  .invitation-title .next-step{
    width:75px;
    height:34px;
    line-height: 32px;
    border: 1px solid #03aef9;
    border-radius: 50px;
    font-size:14px;
    color:#03aef9;
    position: absolute;
    right:17px;
    top:16px;
  }
  .invitation-title .invitation-text{
    position: absolute;
    top:59px;
    text-align: left;
    display: flex;
    flex-direction: column;
  }
  .invitation-text p:nth-of-type(1){
    font-size:14px;
    color: #808080;
  }
  .invitation-text p:nth-of-type(2){
    font-size:20px;
    color: #323232;
  }
  /*换一批&&一键邀请*/
  .invitation-recommend{
    width:100%;
    height:44px;
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
 /*内容*/
  ul{
    width:100%;
    padding:12px 0 0 0;
    overflow: hidden;
    position: relative;
  }
  ul li{
    width:92%;
    margin-left: 4%;
    position: relative;
    padding-bottom: 15px;
  }
  ul li p:nth-of-type(1){
    font-size: 16px;
    color: #444444;
    line-height: 21px;
  }
  ul li p:nth-of-type(2){
    font-size: 12px;
    color:#b4b4b6;
    margin-top: 3px;
  }
  ul li .focus{
    width:62px;
    height:27x;
    background: #03aef9;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    line-height: 25px;
    border-radius: 50px;
    position: absolute;
    bottom: 9.5px;
    right: 4%;
  }
</style>
