<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">{{isSelf ? '我的专栏' : 'Ta的专栏'}}</h1>
    </header>

    <div class="mui-content">

      <!--列表-->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'article/user'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        class="listWrapper">
        <!--类别-->

        <ul class="recommend">
          <li v-for="(recommend, index) in list"  @tap.stop.prevent="goDetial(recommend)">
            <div class="container-image">
              <img :src="recommend.data ? recommend.data.img:''"  />
            </div>
            <p class="recommend_content mui-ellipsis-2" >{{recommend.title}}</p>
            <div class="recommend_datail">
              <p class="answer-fouce">{{recommend.comments_number}}评论<i></i>{{recommend.upvotes}}赞</p>
            </div>
          </li>
        </ul>
      </RefreshList>

    </div>
  </div>
</template>
<script>
  import RefreshList from '../../components/refresh/MescrollList.vue'
  import { getLocalUuid } from '../../utils/user'

  export default {
    data () {
      return {
        list: [],
        uuid: getLocalUuid()
      }
    },
    created () {},
    computed: {
      dataList () {
        return {uuid: this.$route.params.uuid}
      },
      isSelf () {
        if (this.uuid === this.$route.params.uuid) return true
        return false
      }
    },
    components: {
      RefreshList
    },
    methods: {
      refreshPageData () {
        this.uuid = getLocalUuid()
      },
      goDetial (hot) {
        this.$router.pushPlus('/c/' + hot.category_id + '/' + hot.slug)
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
    mounted () {},
    updated () {}
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
    background: #fff;
  }

  /*列表*/
  .recommend{
    width:100%;
    background: #FFFFFF;
    overflow: hidden;
  }
  .recommend li{
    width:92%;
    padding:0rem 0 0.346rem 0;
    overflow: hidden;
    background: #FFFFFF;
    margin-bottom: 0.266rem;
    margin-left: 4%;
    border-radius: 0.106rem;
    box-shadow: 0rem 0rem 0.186rem 0.053rem #ececee;
  }
  .recommend li:nth-of-type(1){
    padding-top: 0;
  }
  .recommend li  .container-image{
    position: relative;
  }
  .recommend li .container_type{
    width: 1.706rem;
    height:0.533rem;
    float: left;
    border-radius:0 0.48rem 0.48rem 0;
    text-align: center;
    line-height: 0.533rem;
    color: #FFFFFF;
    font-size: 0.32rem;
  }
  /*颜色*/
  .recommend li .blue{
    background: #03aef9;
  }
  .recommend li .yellow{
    background: #fcc816;
  }
  .recommend li .pink{
    background:#fa4975;
  }

  /**/
  .recommend_content{
    margin-top: 0.32rem;
    color:#444444;
    font-size:0.4rem;
    line-height: 0.533rem;
    padding: 0 0.4rem;

  }
  .container-item .title{
    width:100%;
    height:1.133rem;
    padding: 0 4%;
    line-height: 1.133rem;
  }
  .container-item .title p:nth-of-type(1){
    float: left;
    font-size:0.426rem;
    color:#444444;

  }
  .container-item .title p:nth-of-type(2){
    float: right;
    font-size:0.346rem;
    color:#03aef9;

  }


  #home-recommend div:nth-of-type(1) {
    margin-left: 0rem;
  }
  #home-card img{
    width:100%;
    height:100%;
    border-radius: 0.106rem;
  }
  .listWrapper{
    margin-top: 0rem;
    padding-top: 0.266rem;
  }

  /*底部的详情*/
  .recommend_datail{
    width:100%;
    height:0.533rem;
    margin-top: 0.24rem;
  }
  /*回答 关注*/
  .answer-fouce{
    float: right;
    font-size:0.32rem;
    color: #235280;
    padding-right: 0.4rem;
  }
  .answer-fouce i{
    margin: 0;
    display: inline-block;
    width:0.026rem;
    height:0.32rem;
    background: #dbdbdb;
    margin: 0 0.24rem -0.08rem 0.24rem;


  }

  /*榜单*/
  .mostInvitations{
    width:92%;
    height:1.6rem;
    background: #fdc707;
    margin: 0.186rem 4%;
    border-radius: 0.32rem;
    padding-left: 0.4rem;
    padding-top: 0.213rem;
    position: relative;
  }
  .mostInvitations .Medal{
    width: 0.853rem;
    position: absolute;
    right:0.48rem;
    top:0;
  }
  .invitation{
    font-size:0.32rem;
    color: #8e4c02;
  }
  .invitation span{
    font-size:0.426rem;
    font-weight:500;
    color: #8e4c02;
    margin-right: 0.053rem;
  }
  .invitation i{
    font-size:0.32rem;
    color:#235280;
  }
  .credits-cions{
    font-size:0.32rem;
    color: #8e4c02;
  }
  .credits-cions i{
    color: #235280;
  }
  .InvitationList{
    position: absolute;
    width:2.453rem;
    height:0.906rem;
    border:0.026rem solid #fde07d;
    border-radius: 0.346rem;
    font-size: 0.373rem;
    color: #b56102;
    line-height: 0.906rem;
    text-align: center;
    right: 1.493rem;
    top: 0.346rem;
    box-shadow:0rem 0rem 0.053rem rgba(81, 55, 7, 0.5) inset;
    text-shadow: 0 0 0.026rem rgb(238,134,16);
  }
  .InvitationList img{
    height:0.533rem;
    margin-top: 0.16rem;
  }
</style>
