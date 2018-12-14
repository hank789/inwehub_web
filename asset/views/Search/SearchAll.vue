<template>
  <div>
    <div class="mui-content">
      <div class="search">
        <p class="border-football">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <input type="text" placeholder="搜产品、问答、圈子、内容" v-model.trim="searchText" v-on:keydown.enter="enterKeyCode($event)"/>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="empty()" v-if="isShowCancelButton">
            <use xlink:href="#icon-times1"></use>
          </svg>
        </p>
        <p @tap.stop.prevent="back()">取消</p>
      </div>
      <!--导航栏-->
      <div class="menu" v-if="getCurrentMode === 'result' && searchText !== ''">
        <span class="font-family-medium">综合<i></i></span>
        <span @tap.stop.prevent="$router.replace('/searchSubmission?text=' + searchText)">分享</span>
        <span @tap.stop.prevent="$router.replace('/searchQuestion?text=' + searchText)">问答</span>
        <span @tap.stop.prevent="$router.replace('/group/search?text=' + searchText)">圈子</span>
        <span @tap.stop.prevent="$router.replace('/dianping/search/products?text=' + searchText)">产品</span>
        <span @tap.stop.prevent="$router.replace('/dianping/search/comments?text=' + searchText)" class="">点评</span>
        <i class="bot"></i>
      </div>

      <div class="hotSearch" v-if="getCurrentMode === 'history'">
        <div class="hotSearchText">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-huo"></use>
          </svg>
          <span class="font-family-medium">热搜</span>
        </div>
        <div class="hotSearchList">
          <span v-for="(item, index) in hotSearchHistory.top" :key="index" @tap.stop.prevent="selectConfirmSearchText(item)">{{item}}</span>
        </div>
        <div class="hotSearchText history">
          <span class="font-family-medium">历史</span>
        </div>
        <div class="hotSearchList">
          <span v-for="(item, index) in hotSearchHistory.history" :key="index" @tap.stop.prevent="selectConfirmSearchText(item)">{{item}}</span>
        </div>
      </div>

      <div class="searchList" v-if="getCurrentMode === 'match'">
        <div class="listOne" @tap.stop.prevent="selectConfirmSearchText(searchText)">
          查看“{{searchText}}”的搜索结果
          <i class="bot"></i>
        </div>
      </div>

      <div class="searchList" v-if="getCurrentMode === 'match'">
        <div v-for="(item, index) in searchAdviceList" :key="index" @tap.stop.prevent="selectConfirmSearchText(item)">
          {{item}}
          <i class="bot"></i>
        </div>
      </div>

      <RefreshList
        v-if="getCurrentMode === 'result'"
        ref="refreshlist"
        :api="'search/all'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        :autoShowEmpty="false"
        :isShowUpToRefreshDescription="false"
        :prevSuccessCallback="prevSuccessCallback"
        class="listWrapper">

        <div class="searchSubmission" v-if="list.submission.list.length">
          <div class="searchTitle">分享</div>
          <div class="" v-for="(submission, index) in list.submission.list" :key="index">
            <FeedItem :item="submission"></FeedItem>
          </div>
          <div class="checkAll" v-if="this.list.submission.total > 3"  @tap.stop.prevent="$router.replace('/searchSubmission?text=' + searchText)">
            <span class="font-family-medium">查看全部{{ this.list.submission.total }}个分享</span>
          </div>
        </div>

        <div class="searchQuestion" v-if="list.question.list.length">
          <div class="searchTitle">问答</div>
          <div class="">

            <template  v-for="(item, index) in list.question.list">
              <div class="container-list-question" @tap.stop.prevent="toDetail(item.id,item.question_type)">
                <div class="question text-line-3">
                  <label v-if="item.price>0" class="component-label" :class="getStateClass(item.status)">{{item.status_description}}</label><span v-html="textToLink(item.description)"></span>
                </div>
                <div v-if="item.question_type == 2" class="statistics">{{item.answer_number}}回答<span class="line-wall"></span>{{item.follow_number}}关注</div>
                <div v-if="item.question_type == 1" class="statistics">{{item.comment_number}}评论<span class="line-wall"></span>{{item.support_number}}点赞<span v-if="item.average_rate" class="line-wall"></span>{{item.average_rate?item.average_rate:''}}</div>
              </div>
              <div class="line-river-after line-river-after-top" v-if="index === 2 && index === list.question.list.length-1"></div>
              <div class="line-river-big" v-if="index !== 3 && index !== list.question.list.length-1"></div>
            </template>

          </div>
          <div class="checkAll" v-if="this.list.question.total > 3"  @tap.stop.prevent="$router.replace('/searchQuestion?text=' + searchText)">
            <span class="font-family-medium">查看全部{{ this.list.question.total }}个问答</span>
          </div>
        </div>

        <div class="searchGroup" v-if="list.group.list.length">
          <div class="searchTitle">圈子</div>
          <div class="" v-for="(submission, index) in list.group.list" :key="index">
            <div class="component-group" @tap.stop.prevent="$router.pushPlus('/group/detail/' + submission.id)">
              <div class="groupLogo">
                <ImageView :src="submission.logo" width="44" height="44"></ImageView>
              </div>
              <div class="groupContent">
                <div class="groupName">
                  <div class="font-family-medium groupOwnerWrapper">
                    <span class="text-line-1" v-html="getHighlight(submission.name)"></span><span class="border-football" v-if="submission.is_joined === 3">圈主</span>
                  </div>
                </div>
                <span class="groupDescribe text-line-1">{{submission.description}}</span>
                <span class="groupText">{{submission.subscribers}}人气</span>
                <span class="groupText">{{submission.articles}}分享</span>
                <span class="groupText" v-if="!submission.public">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-simi"></use>
                  </svg>
                  私密
                </span>
              </div>
              <i class="bot"></i>
            </div>
          </div>
          <div class="checkAll" v-if="this.list.group.total > 3" @tap.stop.prevent="$router.replace('/group/search?text=' + searchText)">
            <span class="font-family-medium">查看全部{{ this.list.group.total }}个圈子</span>
          </div>
        </div>

        <div class="searchComment" v-if="list.review.list.length">
          <div class="searchTitle">点评</div>
          <div class="" v-for="(submission, index) in list.review.list" :key="index">
            <FeedItem :item="submission"></FeedItem>
          </div>
          <div class="checkAll" v-if="this.list.review.total > 3" @tap.stop.prevent="$router.replace('/dianping/search/comments?text=' + searchText)">
            <span class="font-family-medium">查看全部{{ this.list.review.total }}个点评</span>
          </div>
        </div>

        <div class="searchProduct" v-if="list.product.list.length">
          <div class="searchTitle">产品</div>
          <div class="" >
            <div class="productList">
              <div class="comment-product" v-for="(tag, index) in list.product.list" :key="index">
                <div class="product-info" @tap.stop.prevent="$router.pushPlus('/dianping/product/' + encodeURIComponent(tag.name))">
                  <div class="product-img border-football">
                    <img class="lazyImg" v-lazy="tag.logo" alt="">
                  </div>
                  <div class="product-detail">
                    <div class="productName font-family-medium text-line-1" v-html="getHighlight(tag.name)"></div>
                    <div class="productMark">
                      <div class="stars">
                        <StarView :rating="tag.review_average_rate"></StarView>
                      </div>
                      <div class="starsText">
                        <span>{{ tag.review_average_rate }}分</span>
                        <i></i><span>{{ tag.review_count }}条评论</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="line-river-after line-river-after-top"></div>
              </div>
            </div>
          </div>
          <div class="checkAll" v-if="this.list.product.total > 3" @tap.stop.prevent="$router.replace('/dianping/search/products?text=' + searchText)">
            <span class="font-family-medium">查看全部{{ this.list.product.total }}个产品</span>
          </div>
        </div>

        <div class="river"></div>
        <div class="noTime">
          <span>暂无更多</span>
        </div>

      </RefreshList>

    </div>
  </div>
</template>

<script type="text/javascript">
  import { searchText as searchTextFilter } from '../../utils/search'
  import { postRequest } from '../../utils/request'
  import RefreshList from '../../components/refresh/List.vue'
  import TextDetail from '../../components/discover/TextDetail'
  import { autoBlur, textToLinkHtml } from '../../utils/dom'
  import FeedItem from '../../components/Feed.vue'
  import StarView from '../../components/star-rating/starView.vue'
  import { getQuestionStateClass } from '../../utils/ask'

  export default {
    data () {
      return {
        searchText: '',
        confirmSearchText: '',
        isShowCancelButton: false,
        list: {
          submission: {
            list: []
          },
          question: {
            list: []
          },
          group: {
            list: []
          },
          review: {
            list: []
          },
          product: {
            list: []
          }
        },
        searchAdviceList: [],
        resultLoading: 1,
        hotSearchHistory: {
          history: [],
          top: []
        }
      }
    },
    computed: {
      dataList () {
        return {search_word: this.confirmSearchText}
      },
      getCurrentMode () {
        if (this.searchText === '') {
          return 'history'
        }

        if (this.searchText !== this.confirmSearchText) {
          return 'match'
        }

        setTimeout(() => {
          autoBlur()
        }, 100)

        return 'result'
      }
    },
    components: {
      RefreshList,
      TextDetail,
      FeedItem,
      StarView
    },
    created () {
      this.refreshPageData()
    },
    activated () {
      this.refreshPageData()
    },
    watch: {
      searchText: function (newValue, oldValue) {
        searchTextFilter(newValue, (text) => {
          if (newValue) {
            this.isShowCancelButton = true
            this.searchAdvice(newValue)

            if (newValue !== this.confirmSearchText) {
              this.initList()
            }
          }
        })
      }
    },
    mounted () {
    },
    methods: {
      initList () {
        this.list = {
          submission: {
            list: []
          },
          question: {
            list: []
          },
          group: {
            list: []
          },
          review: {
            list: []
          },
          product: {
            list: []
          }
        }
      },
      enterKeyCode: function (ev) {
        if (ev.keyCode === 13) {
          this.selectConfirmSearchText(this.searchText)
        }
      },
      getStateClass (state) {
        return getQuestionStateClass(state)
      },
      textToLink (text) {
        return textToLinkHtml(' ' + text)
      },
      prevSuccessCallback: function () {
        this.resultLoading = 0
        this.list = this.$refs.refreshlist.getResponse().data
      },
      refreshPageData: function () {
        var text = this.$route.query.text
        if (text) {
          this.searchText = text
          this.selectConfirmSearchText(text)
          setTimeout(() => {
            this.$refs.refreshlist.refreshPageData(this.dataList)
          }, 200)
        }
        this.hotSearch()
      },
      focus: function () {
        this.confirmSearchText = ''
        // this.list = []
        if (this.searchText) {
          this.searchAdvice(this.searchText)
        }
      },
      selectConfirmSearchText (text) {
        this.searchText = text
        if (text) {
          this.resultLoading = 1
          this.confirmSearchText = text
        }
        this.searchAdviceList = []
      },
      hotSearch () {
        postRequest(`search/topInfo`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.hotSearchHistory = response.data.data
        })
      },
      searchAdvice (searchText) {
        postRequest(`search/suggest`, {
          search_word: searchText
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.searchAdviceList = response.data.data.suggest
        })
      },
      toResume (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      back () {
        this.empty()
        window.mui.back()
        return
      },
    // 文字高亮
      getHighlight (content) {
        var reg = new RegExp('(' + this.searchText + ')', 'gi')  // 正则验证匹配
        var newstr = content.replace(reg, '<span style="color: #03aef9">$1</span>')  // 动态添加颜色
        return newstr
      },
    // 时间处理；
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
    //  点击清空输入框
      empty () {
        this.searchText = ''
      }
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
  .mui-content {
    background: #ffffff;
    .listWrapper {
      top: 2.24rem;
    }
    .search {
      position: relative;
      width: 100%;
      padding: 0 0.426rem;
      display: flex;
      height: 1.173rem;
      margin-top: 0.133rem;
      flex-direction: row;
      align-items: center;
      background: #ffffff;
      justify-content: space-between;
      .border-football {
        &:after {
          height: 1.77rem;
        }
      }
      p {
        &:nth-of-type(1) {
          width: 7.813rem;
          height: 0.906rem;
          border-radius: 1.333rem;
          background: #f3f4f6;
          /*border:0.026rem solid #dcdcdc;*/
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.266rem;
          svg {
            color: #c8c8c8;
            &:nth-of-type(1) {
              font-size: 0.48rem;
              margin-top: 0.053rem;
            }
            &:nth-of-type(2) {
              margin-left: 0.266rem;
              font-size: 0.533rem;
              position: relative;
              z-index: 10000;
            }
          }
          input {
            width: 6.026rem !important;
            height: 0.853rem;
            border: none;
            background: #f3f4f6;
            font-size: 0.373rem;
            color: #444444;
            position: absolute;
            left: 0.853rem;
            z-index: 990;
            padding: 0 0.266rem;
          }
        }
        &:nth-of-type(2) {
          width: 1.066rem;
          font-size: 0.4rem;
          color: #03aef9;
          text-align: right;
          line-height: 0.56rem;
        }
      }
    }
    /*导航栏的样式*/
    .menu{
      width:100%;
      height:1.04rem;
      background: #ffffff;
      font-size:0.373rem;
      color: #444444;
      display: flex;
      flex-direction: row;
      position: relative;
      margin-top: -0.106rem;
      span{
        display: flex;
        width:13.5%;
        height:100%;
        justify-content: center;
        align-items: center;
        &:nth-of-type(1){
          font-size: 0.373rem;
          position:relative;
          color: #444444;
          font-weight: 500;
          i{
            position:absolute;
            width:0.72rem;
            height:0.053rem;
            border-radius: 1.333rem;
            background:#03aef9;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
          }
        }
      }
    }
  }
  .hotSearch {
    padding: 0.32rem 0.426rem;
    .history {
      margin-top: 0.16rem;
    }
    .hotSearchText {
      padding-bottom: 0.32rem;
      span {
        color: #444444;
        font-size: 0.426rem;
        line-height: 0.586rem;
      }
      .icon {
        color: #FA4975;
      }
    }
    .hotSearchList {
      span {
        height: 0.72rem;
        line-height: 0.72rem;
        color: #444444;
        font-size: 0.32rem;
        padding: 0rem 0.266rem;
        background: #F3F4F6;
        border-radius: 2.666rem;
        margin: 0 0.133rem 0.266rem 0;
        display: inline-block;
      }
    }
  }
  /*搜索建议*/
  .searchList {
    padding: 0 0.426rem;
    position: relative;
    z-index: 1000;
    div {
      color: #808080;
      font-size: 0.4rem;
      padding: 0.32rem 0;
      line-height: 0.586rem;
      position: relative;
    }
    .listOne {
      color: #03AEF9;
    }
  }

  .searchTitle {
    color: #808080;
    font-size: 0.346rem;
    padding-left: 0.426rem;
    line-height: 0.773rem;
    background: #F3F4F6;
  }
  .checkAll {
    height: 1.173rem;
    line-height: 1.173rem;
    text-align: center;
    span {
      color: #808080;
      font-size: 0.346rem;
    }
  }

  .noTime {
    height: 1.52rem;
    padding-top: 0.333rem;
    text-align: center;
    span {
      color: #C8C8C8;
      font-size: 0.32rem;
    }
  }

  .productList {
    .comment-product {
      padding: 0.346rem 0.4rem 0;
      .product-info {
        padding: 0 0 0.4rem;
        background: none;
      }
    }
  }

  .comment-product {
    padding: 0.293rem 0.4rem 0.4rem;
    .product-info {
      overflow: hidden;
      background: #F7F8FA;
      padding: 0.266rem;
      .product-img {
        width: 1.173rem;
        height: 1.173rem;
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 0.106rem;
          object-fit: contain;
        }
      }
      .product-detail {
        float: left;
        margin-left: 0.266rem;
        width: 7.5rem;
        .productName {
          color: #444444;
          font-size: 0.426rem;
          line-height: 0.6rem;
        }
        .productMark {
          display: flex;
          .stars {
            margin-top: 0.026rem;
          }
          .icon {
            color: #FCC816;
            font-size: 0.32rem;
          }
          span {
            color: #B4B4B6;
            font-size: 0.293rem;
            line-height: 0.4rem;
            &:nth-of-type(1) {
              color: #FCC816;
              margin-left: 0.08rem;
            }
          }
          i {
            width: 0.053rem;
            height: 0.053rem;
            margin-right: 0.133rem;
            vertical-align: middle;
            border-radius: 50%;
            background: #B4B4B6;
            display: inline-block;
          }
        }
      }
    }
  }

  .container-list-question .question {
    margin-top: 0 !important;
  }

</style>
