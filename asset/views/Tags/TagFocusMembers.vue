<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">{{tagName ? '关注成员' : '圈子成员'}}</h1>
    </header>
    <div class="mui-content absolute">
      <!--内容区域-->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="url"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        :pageMode= true
        
        @prevSuccessCallback="prevSuccessCallback"
        class="listWrapper">
        <ul class="cions-list">
          <li  v-for="(item, index) in list">
            <div class="cions-avatar">
              <img :src="item.user_avatar_url"  @tap.stop.prevent="toAvatar(item.uuid)"/>
              <svg class="icon" aria-hidden="true" v-if="item.is_expert">
                <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
              </svg>
            </div>
            <div class="detail">
              <p>{{item.user_name}}<span v-if="index === 0 && groupsId"><i></i>圈主</span></p>
              <p class="mui-ellipsis">{{item.description}}</p>
            </div>
            <div class="fouce grey"  @tap.stop.prevent="collectProfessor(item.uuid,index)" v-if="item.is_followed && item.user_id != id">已关注</div>
            <div class="fouce" @tap.stop.prevent="collectProfessor(item.uuid,index)" v-else-if="!item.is_followed && item.user_id != id">关注</div>
            <i class="bot"></i>
          </li>
        </ul>
      </RefreshList>
      <div class="focusAll"  @tap.stop.prevent="allInvitation()" v-if="tagName">一键关注</div>
    </div>
  </div>
</template>
<script>
  import { postRequest } from '../../utils/request'
  import RefreshList from '../../components/refresh/MescrollList.vue'
  import TagsInfo from '../../components/tags/TagsInfo.vue'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()

  export default {
    data () {
      return {
        url: 'followed/tagUsers',
        id: currentUser.user_id,
        tagName: '',
        groupsId: '',
        loading: 1,
        list: [],
        current_page: 1,
        dataList: null
      }
    },
    components: {
      RefreshList,
      TagsInfo
    },
    created () {
      if (this.$route.query.tagname) {
        if (this.current_page === 1) {
          this.dataList = {
            tag_name: this.tagName
          }
        }
        this.tagName = this.$route.query.tagname
        this.url = 'followed/tagUsers'
        this.dataList = {
          tag_name: this.tagName
        }
      } else if (this.$route.query.id) {
        this.url = 'group/members'
        this.groupsId = this.$route.query.id
        this.dataList = {
          id: this.groupsId,
          type: 2
        }
      }
    },
    beforeRouteEnter (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
      next(vm => {
        // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
        vm.$refs.RefreshList && vm.$refs.RefreshList.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
      })
    },
    beforeRouteLeave (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
      this.$refs.RefreshList && this.$refs.RefreshList.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
      next()
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
      prevSuccessCallback () {
        this.current_page = this.$refs.RefreshList.getResponse().data.current_page
      },
      // 一键关注
      allInvitation () {
        this.invitation_user_id = []
        for (var index in this.list) {
          if (this.list[index].is_followed !== 1) {
            this.invitation_user_id.push(this.list[index].user_id)
          }
        }
        for (var i in this.list) {
          this.list[i].is_followed = 1
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

//            this.current_page += 1
//            if (this.current_page > 1) {
//                this.dataList = {
//                  page: this.current_page,
//                  tag_name: this.tagName
//                }
//            }
            window.mui.toast('一键关注成功')
          })
        }
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
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #FFFFFF;
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
  .cions-list li .cions-avatar{
    position: relative;
    width:1.173rem;
    height:1.173rem;
    border-radius:50%;
    background: #cccccc;
    margin-top: 0.266rem;
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
  .cions-list li .detail p:nth-of-type(1){
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .cions-list li .detail p:nth-of-type(1) span{
    width: 1.013rem;
    height: 0.48rem;
    background: rgba(168, 223, 247, 1);
    border-radius: 0.16rem;
    font-size: 0.32rem;
    color: rgba(35,82,128,1);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-left: 0.16rem;
  }

  .cions-list li .detail p:nth-of-type(1) span i{
    display: inline-block;
    width: 0.08rem;
    height: 0.08rem;
    border-radius: 50%;
    background: #ffffff;
    margin: 0 0.08rem;
  }
  .cions-list li .detail p:nth-of-type(2){
    width:5.333rem;
    font-size:0.32rem;
    color: #b4b4b6;
    margin-top: -0.053rem;
  }
  .cions-list li .fouce{
    width:1.626rem;
    height:0.72rem;
    background:#03aef9;
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
    background: #dbdcdb;
  }
  .listWrapper{
    bottom: 1.173rem;
  }
  /*一键关注*/
  .focusAll{
    width:100%;
    height: 1.173rem;
    background: #03aef9;
    text-align: center;
    line-height: 1.173rem;
    font-size: 0.426rem;
    color: #ffffff;
    position: fixed;
    bottom: 0;
  }
</style>
