<template>
  <div>
    <HomeSearch :unread_count="unread_count" :contact_id="contact_id"></HomeSearch>

    <div class="mui-content">
      <div class="container-tabs">
        <div class="tab active"><span>全部</span></div>
        <div class="tab"><span>推荐</span></div>
      </div>

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'feed/list'"
        :prevOtherData="prevOtherData"
        :nextOtherData="nextOtherData"
        :pageMode = "true"
        :isShowUpToRefreshDescription="false"
        :list="list"
        :emptyDescription="emptyDescription"
        class="listWrapper"
      >

        <template v-for="(item, index) in list">

          <!-- 发布了发现 -->
          <div class="container-feed-discover-add" v-if="item.feed_type === 5">
            <div class="container-avatarAndTwoLineText">
              <div class="avatar">
                <div class="avatarInner"><img src="images/expert.png">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </div>
              </div>
              <div class="mui-media-body">
                <div class="lineWrapper-1">郭伟发布了分享
            <div class="component-label component-label-top">顶</div>
                </div>
                <div class="lineWrapper-2">3分钟前
            <svg class="icon addressIcon" aria-hidden="true">
                  <use xlink:href="#icon-dingwei1"></use>
                </svg><span class="address">曼哈顿（金陵）商务酒店2</span>
                </div>
              </div>
            </div>
            <div class="contentWrapper"><span class="tag">#小哈公社</span>1. 必须使用生产版本管理2. 因为MRP视图中的选择方法字段就没有用处，SAP将之去除了3. MRP3视图的消耗模式增加一个选项:按期间消耗。 因为MRP视图中的选择方法字段就没有用处，SAP将之去除了MRP3视图的消耗模...增加一个选项:按期间消耗。</div>
            <div class="container-images container-images-discover">
              <div class="container-image"><img src="images/shuijiao.jpg"></div>
              <div class="container-image"><img src="images/shuijiao.jpg"></div>
              <div class="container-image"><img src="images/shuijiao.jpg"></div>
            </div>
            <div class="container-pdf-list">
              <div class="pdf"><span class="text-line-2">传统大型企业的IT咨询项目加实施落地，实施方法论是否可以敏捷化？</span></div>
              <div class="pdf"><span class="text-line-2">传统大型企业的IT咨询项目加实施落地，实施方法论是否可以敏捷化？</span></div>
            </div>
            <div class="container-remarks"><span class="from"><i>来自圈子</i>大话君和朋友们</span>3评论<span class="line-wall"></span>34点赞</div>
          </div>

          <!-- 发布了文章 -->
          <div class="container-feed-article-add">
            <div class="container-avatarAndTwoLineText">
              <div class="avatar">
                <div class="avatarInner"><img src="images/expert.png">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </div>
              </div>
              <div class="mui-media-body">
                <div class="lineWrapper-1">郭伟发布了文章</div>
                <div class="lineWrapper-2">3分钟前</div>
              </div>
            </div>
            <div class="contentWrapper text-line-3">客户虐我千百遍，爱意如初永感念。客户虐我千百遍，爱意如初永感念<span class="url">-baidu.com</span></div>
            <div class="container-image"><img src="images/shuijiao.jpg"></div>
            <div class="container-remarks"><span class="from"><i>来自圈子</i>大话君和朋友们</span>3评论<span class="line-wall"></span>34点赞</div>
          </div>

         <!-- 回答 -->
          <div class="container-feed-question">
            <div class="container-avatarAndTwoLineText">
              <div class="avatar">
                <div class="avatarInner"><img src="images/expert.png">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </div>
              </div>
              <div class="mui-media-body">
                <div class="lineWrapper-1">章顾问关注了问答
            <div class="component-label component-label-top">顶</div>
                </div>
                <div class="lineWrapper-2">3分钟前</div>
              </div>
            </div>
            <div class="contentWrapper"><span class="component-label component-label-warn">8元悬赏中</span><span class="tag">#小哈公社</span>1. 必须使用生产版本管理2. 因为MRP视图中的选择方法字段就没有用处，SAP将之去除了3. MRP3视图的消耗模式增加一个选项:按期间消耗。 因为MRP视图中的选择方法字段就没有用处，SAP将之去除了MRP3视图的消耗模...增加一个选项:按期间消耗。</div>
            <div class="container-remarks">3评论<span class="line-wall"></span>34点赞</div>
            <div class="contentWrapper contentWrapper-question"><span class="component-label component-label-warn">8元悬赏中</span><span class="tag">#小哈公社</span>1. 必须使用生产版本管理2. 因为MRP视图中的选择方法字段就没有用处，SAP将之去除了3. MRP3视图的消耗模式增加一个选项:按期间消耗。 因为MRP视图中的选择方法字段就没有用处，SAP将之去除了MRP3视图的消耗模...增加一个选项:按期间消耗。2</div>
          </div>


          <div class="line-river-big"></div>
        </template>

      </RefreshList>

    </div>
  </div>
</template>
<script>
  import RefreshList from '../components/refresh/List.vue'
  import HomeSearch from '../components/search/Home'

  const Feed = {
    data: () => ({
      search_type: 2, // 1:关注,2:全部,3:问答,4:分享,5:他的动态,6:推荐,默认2
      emptyDescription: '暂无内容',
      unread_count: 0,
      contact_id: '',
      list: []
    }),
    created () {

    },
    updated () {
    },
    components: {
      RefreshList,
      HomeSearch
    },
    activated: function () {

    },
    mounted () {

    },
    computed: {
      prevOtherData () {
        return {search_type: this.search_type}
      },
      nextOtherData () {
        return {search_type: this.search_type}
      }
    },
    methods: {
      messagecountchange (obj) {
        if (obj.contact_id) {
          this.contact_id = obj.contact_id
          this.unread_count = obj.unread_count
        }
      },
    }
  }
  export default Feed
</script>

<style lang="less" scoped>
  .mui-content{
    background: #fff;
  }
  .listWrapper {
    top: 1.2rem;
    bottom: 1.333rem;
  }
</style>
