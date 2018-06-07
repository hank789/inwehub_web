<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">问答社区</h1>
      <a class="mui-btn mui-btn-blue mui-btn-link mui-pull-right" @tap.stop.prevent="addQuestion();">提问题</a>
    </header>

    <div class="mui-content absolute">
      <div class="container-tabs">
        <div class="tab" :class="{active: filter === 1}" @tap.stop.prevent="switchFilter(1)"><span>悬赏大厅</span></div>
        <div class="tab" :class="{active: filter === 2}"  @tap.stop.prevent="switchFilter(2)"><span>热门问答</span></div>
      </div>
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
            <div class="container-label" v-if="item.tags.length"><span v-for="(item, index) in item.tags" @tap.stop.prevent="toTagDetail(item.name)">{{item.name}}</span></div>
            <div class="question text-line-3">
              <label v-if="item.price>0" class="component-label" :class="getStateClass(item.status)">{{item.status_description}}</label><span v-html="textToLink(item.description)"></span>
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
  import RefreshList from '../../components/refresh/List.vue'
  import { textToLinkHtml } from '../../utils/dom'
  import AskCommunityListItem from '../../components/AskCommunity/AskCommunityListItem'
  import { getQuestionStateClass } from '../../utils/ask'

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
    mounted () {
    }
  }
  export default MajorList
</script>

<style lang="less" scoped>
  /*滚动区域*/
  .mui-content {
    background: #ffffff;

    .listWrapper{
      top:1.04rem;
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
