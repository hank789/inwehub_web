<template>
  <div>
    <div id="home-content" class="mui-content">

      <div class="container-control-logoAndTabsAndSearch">
        <svg class="icon logoIcon" aria-hidden="true">
          <use xlink:href="#icon-logowenzi"></use>
        </svg><span class="splitCircle"></span>
        <div class="logoAndTabsAndSearchTabs">
          <div class="tab" @tap.stop.prevent="$router.replace('/dianping')">点评</div>
          <div class="tab" @tap.stop.prevent="$router.replace('/groups')">圈子</div>
          <div class="tab active" @tap.stop.prevent="$router.replace('/ask/offers')">问答</div>
        </div>
        <svg class="icon searchIcon" aria-hidden="true"  @tap.stop.prevent="$router.pushPlus('/searchAll','list-detail-page-three')">
          <use xlink:href="#icon-sousuo"></use>
        </svg>
      </div>

      <div class="line-river-after line-river-after-top"></div>

      <div class="container-tabs">
        <div class="tab" :class="{active: filter === 1}" @tap.stop.prevent="switchFilter(1)"><span>悬赏大厅</span></div>
        <div class="tab" :class="{active: filter === 2}"  @tap.stop.prevent="switchFilter(2)"><span>热门问答</span></div>
      </div>
      <div class="line-river-after line-river-top"></div>
      <!--推荐问答 -->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'question/list'"
        :pageMode = true
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        class="listWrapper"
      >
        <template v-for="(item, index) in list">
          <div class="container-list-question" @tap.stop.prevent="toDetail(item.id,item.question_type)">
            <!--<div class="container-label" v-if="item.tags.length"><span v-for="(item, index) in item.tags" @tap.stop.prevent="toTagDetail(item.name)">{{item.name}}</span></div>-->
            <div class="question text-line-3">
              <label v-if="item.price>0" class="component-label" :class="getStateClass(item.status)">{{item.status_description}}</label><span v-html="textToLink(item.description)"></span>
            </div>
            <div v-if="item.question_type == 2" class="statistics">{{item.answer_number}}回答<span class="line-wall"></span>{{item.follow_number}}关注</div>
            <div v-if="item.question_type == 1" class="statistics">{{item.comment_number}}评论<span class="line-wall"></span>{{item.support_number}}点赞<span v-if="item.average_rate" class="line-wall"></span>{{item.average_rate?item.average_rate:''}}</div>
          </div>
          <div class="line-river-big"></div>
        </template>

      </RefreshList>

      <div class="goEditWrapper askoffers" @tap.stop.prevent="toAsk()">
        <div class="editIcon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-fabu"></use>
          </svg>
        </div>
      </div>

      <div class="switch"  @tap.stop.prevent="orderBy()">
        {{sort === 2 ? '最新' : '最热'}}
      </div>
    </div>
  </div>

</template>

<script>
  import RefreshList from '../../components/refresh/MescrollList.vue'
  import { textToLinkHtml } from '../../utils/dom'
  import AskCommunityListItem from '../../components/AskCommunity/AskCommunityListItem'
  import { getQuestionStateClass } from '../../utils/ask'
  import userAbility from '../../utils/userAbility'

  const MajorList = {
    data: () => ({
      list: [],
      tags: [],
      sort: 1,
      filter: 1
    }),
    computed: {
      dataList () {
        return {
          order_by: this.sort,
          filter: this.filter
        }
      }
    },
    created () {},
    components: {
      RefreshList,
      AskCommunityListItem
    },
    methods: {
      toAsk () {
        userAbility.jumpToAddAsk(this)
      },
      toSearch () {
        this.$router.pushPlus('/searchQuestion', 'list-detail-page-three')
      },
      switchFilter (filter) {
        this.filter = filter
      },
      addQuestion () {
        this.$router.pushPlus('/ask?from=list')
      },
      getStateClass (state) {
        return getQuestionStateClass(state)
      },
      toDetail (id, type) {
        this.$router.pushPlus('/ask/offer/answers/' + id, 'list-detail-page', true, 'pop-in', 'hide', true)
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
    mounted () {
      userAbility.showFreeAskGuide(this)
      // 左滑
      document.getElementById('home-content').addEventListener('swipeleft', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle >= 160) {
          this.$router.replace('/dianping')
        }
      })
      // 右滑
      document.getElementById('home-content').addEventListener('swiperight', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle <= 20) {
          this.$router.replace('/groups')
        }
      })
    }
  }
  export default MajorList
</script>

<style lang="less" scoped>
  /*滚动区域*/

  .container-tabs {
    border: none;
  }
  .line-river-top:after {
    top: -0.026rem;
  }
  .component-search{
    position: absolute;
    top: 0.133rem;
    left: 1.226rem;
  }
  .mui-content {
    background: #ffffff;

    .listWrapper{
      top:2.24rem !important;
      bottom:50px !important; /* px不转换 */
    }

    .immersed44 .listWrapper{
      bottom: 84px !important; /* px不转换 */
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
      bottom: 1.546rem;
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
  .container-list-question .question {
    margin-top: 0 !important;
  }
</style>
