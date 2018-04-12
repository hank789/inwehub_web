<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">圈子</h1>
    </header>
    <div class="mui-content" v-show="!loading">
    <!--圈子详情-->
     <GroupsInfo
      :detail="detail"
     ></GroupsInfo>
      <div class="gray"></div>
      <div class="group-text">
        <p>圈子介绍<i class="bot"></i></p>
        <p>{{ detail.description }}</p>
      </div>
      <div class="join" v-if="detail.is_joined === -1" @tap.stop.prevent="joinIn">加入圈子</div>
      <div class="join wait" v-if="detail.is_joined === 0">入圈审核中</div>
      <div class="join wait" v-if="detail.is_joined === 2">审核不通过</div>
    </div>
  </div>
</template>
<script>
  import RefreshList from '../../components/refresh/List.vue'
  import GroupsInfo from '../../components/groups/GroupsInfo.vue'
  import { postRequest } from '../../utils/request'

  export default {
    data () {
      return {
        id: null,
        loading: 1,
        detail: null
      }
    },
    components: {
      RefreshList,
      GroupsInfo
    },
    methods: {
      refreshPageData () {
        this.loading = 1
        this.getData()
      },
      joinIn () {
        postRequest(`group/join`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          this.detail.is_joined = 0
        })
      },
      getData () {
        this.id = parseInt(this.$route.params.id)
        if (!this.id) {
          window.mui.back()
          return
        }

        postRequest(`group/detail`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          this.detail = response.data.data
          if (this.detail.is_joined === 3 || this.detail.is_joined === 1) {
            this.$router.pushPlus('/group/detail/' + this.detail.id)
          } else {
            this.loading = 0
          }
        })
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

<style scoped="scoped">
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
  .mui-content{
    background: #ffffff;
  }
  .bot {
    position: absolute;
    right:0;
    bottom: 0;
    left:0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .gray{
    width:100%;
    height:10px;
    background: #f3f4f6;
  }
  .group-text{
    width:92%;
    margin-left: 4%;
    overflow: hidden;
  }
  .group-text p:nth-of-type(1){
    width:100%;
    height:43px;
    position: relative;
    font-size: 16px;
    color:rgba(68,68,68,1);
    font-weight: 500;
    line-height: 43px;
  }
  .group-text p:nth-of-type(2){
    width:100%;
    margin-top: 14px;
    position: relative;
    font-size: 16px;
    color:rgba(68,68,68,1);
    line-height: 20px;
  }
  .join{
    width:92%;
    height:44px;
    position: fixed;
    right:0;
    left:0;
    bottom: 15px;
    margin: auto;
    background:rgba(3,174,249,1);
    box-shadow: 0px 1px 10px 0px rgba(205,215,220,1);
    border-radius: 50px ;
    text-align: center;
    line-height: 44px;
    font-size: 16px;
    color:rgba(255,255,255,1);
    font-weight: 500;
  }
  .join.wait{
    background:rgba(220,220,220,1);
    box-shadow: 0px 1px 10px 0px rgba(205,215,220,1);
    color:rgba(180,180,182,1);
  }

</style>
