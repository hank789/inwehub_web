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
           <div class="apply">
             入圈申请
             <i class="bot"></i>
           </div>
           <ul class="cions-list">
             <template v-for="(item, index) in list">
               <li v-if="item.user_id !== localUserId">
                 <div class="cions-avatar" @tap.stop.prevent="toResume(item)">
                   <img :src="item.user_avatar_url"/>
                   <svg class="icon" aria-hidden="true" v-if="item.is_expert">
                     <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                   </svg>
                 </div>
                 <div class="detail">
                   <p>{{item.user_name}}</p>
                   <p>{{item.created_at}}</p>
                 </div>
                 <div class="fouce" v-if="item.audit_status === 0" @tap.stop.prevent="pass(item)">通过</div>
                 <div class="fouce space" v-if="item.audit_status === 0" @tap.stop.prevent="noPass(item)">拒绝</div>
                 <div class="fouce" v-if="item.audit_status === 1 && item.user_id !== localUserId" @tap.stop.prevent="moveOut(item, index)">移除</div>
                 <div class="fouce grey" v-if="item.audit_status === 2">已拒绝</div>
                 <i class="bot"></i>
               </li>
             </template>
           </ul>
         </RefreshList>
       </div>
   </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  import { postRequest } from '../../utils/request'
  import { getLocalUserId } from '../../utils/user'

  export default {
    data () {
      return {
        id: null,
        localUserId: getLocalUserId(),
        list: []
      }
    },
    components: {
      RefreshList
    },
    props: {},
    methods: {
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
      '$route': 'refreshPageData'
    },
    created () {
      this.getData()
    }
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
    width: 30%;
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
  .space{
    margin-right: 0.266rem;
  }
</style>
