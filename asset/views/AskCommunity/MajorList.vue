<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">问答社区</h1>
    </header>


    <div class="mui-content absolute">
          <!--提问-->
           <div class="ask" @tap.stop.prevent="$router.pushPlus('/ask')">
             <div class="ask_img">
               <i>分红</i>
               <span>我要提问</span>
             </div>
           </div>
          <!--推荐问答 -->
          <RefreshList
            ref="RefreshList"
            v-model="list"
            :api="'question/list'"
            :pageMode = true
            :prevOtherData="dataList"
            :nextOtherData="{}"
            class="listWrapper"
          >
            <template v-for="(item, index) in list">
              <div class="container-list-question" @tap.stop.prevent="toDetail(item.id,item.question_type)">
                <div class="container-label" v-if="item.tags.length"><span v-for="(item, index) in item.tags" @tap.stop.prevent="toTagDetail(item.name)">{{item.name}}</span></div>
                <div class="question text-line-3">
                  <label class="component-label" :class="getStateClass(item.status)">{{item.price}}元悬赏中</label><span v-html="textToLink(item.description)"></span>
                </div>
                <div class="statistics">{{item.answer_number}}回答<span class="line-wall"></span>{{item.follow_number}}关注</div>
              </div>
              <div class="line-river-big"></div>
            </template>

          </RefreshList>
         <div class="switch"  @tap.stop.prevent="orderBy()">
           <svg class="icon" aria-hidden="true">
             <use xlink:href="#icon-shaixuanpaixu_"></use>
           </svg>
           {{sort === 2 ? '最新' : '最热'}}
         </div>
        </div>
      </div>

</template>

<script>
  import RefreshList from '../../components/refresh/MescrollList.vue'
  import { textToLinkHtml } from '../../utils/dom'
  import AskCommunityListItem from '../../components/AskCommunity/AskCommunityListItem'

  const MajorList = {
    data: () => ({
      list: [],
      tags: [],
      sort: 1,
      dataList: {}
    }),
    computed: {
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
    created () {
      this.dataList = {
        page: 1,
        order_by: this.sort
      }
    },
    components: {
      RefreshList,
      AskCommunityListItem
    },
    methods: {
      getStateClass (state) {
        switch (state) {
          case 8:
            return 'component-label-success'
          case 9:
            return 'component-label-fail'
          default:
            return 'component-label-warn'
        }
      },
      toDetail (id, type) {
        if (type === 1) {
          this.$router.pushPlus('/askCommunity/major/' + id, 'list-detail-page', true, 'pop-in', 'hide', true)
        } else {
          this.$router.pushPlus('/ask/offer/answers/' + id, 'list-detail-page', true, 'pop-in', 'hide', true)
        }
      },
      textToLink (text) {
        return textToLinkHtml(' ' + text)
      },
      orderBy () {
        if (this.sort === 1) {
          this.sort = 2
        } else {
          this.sort = 1
        }
        this.dataList = {
          page: 1,
          order_by: this.sort
        }
      }
    },
    mounted () {
    }
  }
  export default MajorList
</script>

<style lang="less" scoped>
  /*滚动区域*/
  .mui-content {
    background: #ffffff;
    .ask{
      width:100%;
      height:0.906rem;
      padding: 0 4%;
      .ask_img{
        width:100%;
        height:100%;
        background: #cccccc;
        position: relative;
        background: url("../../statics/images/askCommunity_bg@3x.png") no-repeat;
        background-size: cover;
        span{
          position: absolute;
          font-size: 0.373rem;
          color: #444444;
          left: 1.6rem;
          line-height: 0.96rem;
        }
        i{
          display: inline-block;
          font-style: normal;
          width: 0.8rem;
          height: 0.453rem;
          font-size: 0.32rem;
          color: #FFFFFF;
          border-radius: 0.106rem;
          background: #fa4975;
          text-align: center;
          line-height: 0.453rem;
          position: absolute;
          top: 0.24rem;
          left: 0.53rem;
          &::after {
            content: "";
            display: block;
            width: 0.16rem;
            height: 0.16rem;
            background: #fa4975;
            position: absolute;
            -webkit-transform: rotate(135deg);
            transform: rotate(135deg);
            right: -0.08rem;
            top: 0rem;
            bottom: 0;
            margin: auto;
          }
        }
      }
    }
    .listWrapper{
      top:0.906rem !important;
    }
    .switch{
      position: fixed;
      width:1.973rem;
      height:0.906rem;
      background: #444444;
      box-shadow: 0rem 0.026rem 0.266rem 0rem rgba(205,215,220,0.5);
      opacity:0.85;
      border-radius:1.333rem;
      font-size:0.4rem;
      color: #FFFFFF;
      bottom: 0.533rem;
      right:0.426rem;
      z-index: 9;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      svg{
        font-size: 0.453rem;
        margin-right: 0.08rem;
      }
    }
  }


</style>

