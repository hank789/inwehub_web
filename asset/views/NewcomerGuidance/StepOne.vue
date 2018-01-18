<template>
  <div>
    <div class="mui-content">
      <div class="invitation-title">
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.push('/my')">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
        <div class="next-step" @tap.stop.prevent="$router.push('/userGuide/steptwo')">下一步</div>
        <div class="invitation-text">
          <p>关注您感兴趣的标签</p>
          <p>我们会推荐您相关的内容</p>
        </div>
      </div>

      <div class="tag-title">热门标签</div>
      <ul>
        <li class="bg-blue">企业IT战略规划与ITSP</li>
        <li>高科技</li>
        <li>电网咨询</li>
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
  /*tag*/
.tag-title{
  font-size:13px;
  color: #808080;
  margin:20px 0 0 4%;

}
  ul{
    width:92%;
    margin-left: 1.5%;
  }
  ul li{
    float: left;
    border:1px solid #dcdcdc;
    font-size: 14px;
    color: #444444;
    border-radius: 4px;
    padding: 5px 10px;
    margin: 9px 0 0 10px;
  }
  ul li.bg-blue{
    background: #03aef9;
    border:1px solid #03aef9;
    color: #FFFFFF;
  }

</style>
