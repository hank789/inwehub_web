<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">我的收藏</h1>
    </header>

    <div class="mui-content">

      <div class="container-searchMenu">
        <span @tap.stop.prevent="$router.replace('/my/collectedAnswers')">问答</span>
        <span class="font-family-medium" >分享<i></i></span>
        <span @tap.stop.prevent="$router.replace('/dianping/my/collectProducts')">点评</span>
        <i class="bot"></i>
      </div>

      <!--内容区域-->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'collected/readhubSubmission'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        class="listWrapper">
        <ul class="answer">
          <li  v-for="(ask, index) in list" @tap.stop.prevent="$router.pushReadHubPage(ask.comment_url)">
            <div class="container-image margin-10-0-0" v-if="ask.img.length" >
              <img class="lazyImg" v-lazy="ask.img.length ? ask.img[0] : ''" />
            </div>
            <p class="mui-ellipsis-2">{{ask.title}}<a v-if="ask.domain">{{ask.domain}}</a> </p>
            <p>
              <timeago :since="timeago(ask.created_at)" :auto-update="60">
               </timeago>
              <a v-if="ask.category_name">#{{ask.category_name}}</a>
            </p>
            <i class="bot"></i>
          </li>
        </ul>

      </RefreshList>

      <!---->
    </div>
    <!---->

  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/MescrollList.vue'
  const PublishAnswers = {
    data: () => ({
      list: []
    }),
    created () {
    },
    computed: {

    },
    components: {
      RefreshList
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
      // 时间处理；
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      }
    },
    mounted () {
    },
    updated () {
//    console.error(this.list);
    }
  }
  export default PublishAnswers
</script>

<style scoped="scoped">
  .container-searchMenu {
     margin-top: 0;
   }

  .mui-content {
    background: #FFFFFF;
  }

  .bot {
    position: absolute;
    right: 0rem;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  /*清掉自带样式*/

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
  /*滚动区域*/

  .answer {
    width: 92%;
    margin-left: 4%;
    overflow: hidden;
  }

  .answer li {
    width: 100%;
    overflow: hidden;
    padding: 0.4rem 0 0.346rem 0;
    position: relative;
  }
   .answer li div{
     margin-bottom: 0.32rem;
     margin-top: 0;
   }
  .answer li p:nth-of-type(1){
    font-size:0.4rem;
    color:#444444;


  }
  .answer li p:nth-of-type(1) a{
    font-size:0.32rem;
    color:rgb(180,180,182);

  }
   .answer li p:nth-of-type(2){
      font-size:0.32rem;
      color:#b4b4b6;
  }
  .answer li p:nth-of-type(2) a{
    font-size:0.32rem;
    color:rgb(128,128,182);
  }


  /*状态的颜色*/
 .label_1,.label_2,.label_4{
    background: #fcc816;
 }

 .label_3,.label_5,.label_6,.label_7{
   background: #c8c8c8;
 }

  .listWrapper{
    top: 1.2rem !important;
  }
  /*container-image margin-10-0-0*/
</style>
