<template>
   <div>
       <header class="mui-bar mui-bar-nav">
         <Back></Back>
         <h1 class="mui-title">圈主设置</h1>
       </header>
       <div class="mui-content absolute">
         <RefreshList
           ref="RefreshList"
           v-model="list"
           :api="'group/members'"
           :prevOtherData="{id: id, type: 1}"
           :nextOtherData="{id: id, type: 1}"
           :pageMode = true
           class="listWrapper"
         >
           <div class="setUpList">
             <span>编辑圈子</span>
             <svg class="icon" aria-hidden="true">
               <use xlink:href="#icon-jinru"></use>
             </svg>
           </div>
           <div class="line-river-after line-river-after-short"></div>
           <div class="setUpList openChat"> <!-- @tap.stop.prevent="goOpenChat" -->
             <span>圈子聊天</span>
             <Switches class="switchestop" v-model="openChat" type-bold="true" theme="custom" color="blue"></Switches>
           </div>
           <div class="gray"></div>
           <div class="cions-list">
             <div class="memberTitle">成员管理</div>
             <div class="line-river-after"></div>
             <template v-for="(item, index) in list">
               <div class="memberList" v-if="item.user_id !== localUserId">
                 <div class="cions-avatar" @tap.stop.prevent="toResume(item)">
                   <img :src="item.user_avatar_url"/>
                   <svg class="icon" aria-hidden="true" v-if="item.is_expert">
                     <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                   </svg>
                 </div>
                 <div class="detail">
                   <span>{{item.user_name}}</span>
                   <span><timeago :since="timeago(item.created_at)" :auto-update="60"></timeago></span>
                 </div>
                 <div class="fouce" v-if="item.audit_status === 0" @tap.stop.prevent="pass(item)">通过</div>
                 <div class="fouce space" v-if="item.audit_status === 0" @tap.stop.prevent="noPass(item)">拒绝</div>
                 <div class="fouce" v-if="item.audit_status === 1 && item.user_id !== localUserId" @tap.stop.prevent="moveOut(item, index)">移除</div>
                 <div class="fouce grey" v-if="item.audit_status === 2">已拒绝</div>
                 <i class="bot"></i>
               </div>
             </template>
           </div>
         </RefreshList>
       </div>
   </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  import { postRequest } from '../../utils/request'
  import { getLocalUserId } from '../../utils/user'
  import Switches from 'vue-switches'

  export default {
    data () {
      return {
        id: null,
        localUserId: getLocalUserId(),
        list: [],
        openChat: 0
      }
    },
    components: {
      RefreshList,
      Switches
    },
    props: {},
    methods: {
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      toResume (item) {
        this.$router.pushPlus('/share/resume?id=' + item.uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      pass (item) {
        postRequest('group/joinAgree', {
          id: this.id,
          user_id: item.user_id
        })
          .then(response => {
            var code = response.data.code

            if (code !== 1000) {
              window.mui.toast(response.data.message)
              return
            }

            item.audit_status = 1
          })
      },
      noPass (item) {
        postRequest('group/joinReject', {
          id: this.id,
          user_id: item.user_id
        })
          .then(response => {
            var code = response.data.code

            if (code !== 1000) {
              window.mui.toast(response.data.message)
              return
            }

            item.audit_status = 2
          })
      },
      moveOut (item, index) {
        var btnArray = ['取消', '确定']
        window.mui.confirm('确定删除吗？', ' ', btnArray, (e) => {
          if (e.index === 1) {
            postRequest('group/removeMember', {
              id: this.id,
              user_id: item.user_id
            })
              .then(response => {
                var code = response.data.code

                if (code !== 1000) {
                  window.mui.toast(response.data.message)
                  return
                }

                this.list.splice(index, 1)
              })
          }
        })
      },
      goOpenChat () {
        this.id = parseInt(this.$route.params.id)
        var btnArray = ['取消', '确定']
        var that = this
        window.mui.confirm('确定开放圈子群聊吗？', ' ', btnArray, function (e) {
          if (e.index === 1) {
            postRequest(`group/openIm`, {id: that.id}).then(response => {
              var code = response.data.code
              if (code !== 1000) {
                window.mui.toast(response.data.message)
                that.$router.replace('/groups')
                return
              }
              that.openChat = response.data.data.room_id
              window.mui.toast('群聊已开启')
            })
          }
        })
      },
      goCloseChat () {
        this.id = parseInt(this.$route.params.id)
        var btnArray2 = ['取消', '确定']
        var that2 = this
        window.mui.confirm('确定要关闭群聊吗？', ' ', btnArray2, function (e) {
          if (e.index === 1) {
            postRequest(`group/closeIm`, {id: that2.id}).then(response => {
              var code = response.data.code
              if (code !== 1000) {
                window.mui.toast(response.data.message)
                that2.$router.replace('/groups')
                return
              }
              that2.openChat = response.data.data.room_id
              window.mui.toast('群聊已关闭')
            })
          }
        })
      },
      refreshPageData () {
        this.getData()
      },
      getData () {
        this.id = parseInt(this.$route.params.id)
        if (!this.id) {
          window.mui.back()
          return
        }
      }
    },
    mounted () {
    },
    updated () {},
    watch: {
      '$route': 'refreshPageData',
      openChat (val) {
        if (val === true) {
          this.goOpenChat()
          console.log('true的时候调用')
        } else {
          this.goCloseChat()
          console.log('false的时候调用')
        }
      }
    },
    created () {
      this.getData()
    }
  }

</script>
<style scoped lang="less">
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
    background: #ffffff;
  }
  .apply{
    width:92%;
    height:1.173rem;
    margin-left: 4%;
    line-height: 1.173rem;
    font-size: 0.426rem;
    color: #444444;
    font-weight: 500;
    position: relative;
  }
  /*列表区域*/
  .cions-list{
    overflow: hidden;
    padding: 0 16px;
    .memberTitle {
      color: #808080;
      font-size: 13px;
      line-height: 34px;
    }
    .memberList {
      position: relative;
      height:1.706rem;
      div {
        float: left;
      }
      .cions-avatar {
        position: relative;
        width:1.173rem;
        height:1.173rem;
        border-radius:50%;
        background: #cccccc;
        margin-top: 0.266rem;
        img {
          width:1.173rem;
          height:1.173rem;
          border-radius:50%;
        }
        svg {
          position: absolute;
          font-size: 0.533rem;
          right: -0.133rem;
          bottom: -0.053rem;
        }
      }
      .detail{
        /*width: 30%;*/
        margin-top: 0.373rem;
        font-size:0.373rem;
        color: #565656;
        margin-left: 0.213rem;
        span {
          &:nth-of-type(1) {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          &:nth-of-type(2) {
            width:5.333rem;
            font-size:0.32rem;
            color: #b4b4b6;
            margin-top: -0.053rem;
          }
        }
      }
      .fouce {
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
      .grey {
        color: #b4b4b6;
        background: #dbdcdb;
      }
    }
  }
  .space{
    margin-right: 0.266rem;
  }
  .vue-switcher--bold div {
    width: 51px;
    height: 31px;
  }
  .setUpList {
    padding: 11px 16px;
    background: #ffffff;
    display: flex;
    color: #444444;
    font-size: 16px;
    position: relative;
    justify-content: space-between;
    &.openChat {
      padding-bottom: 0;
    }
    .icon {
      color: #808080;
      font-size: 13px;
      margin-top: 4px;
    }
    .switchestop {
      margin-top: 7px;
    }
  }
</style>
