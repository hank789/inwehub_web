<template>
  <div>
    <div class="mui-content searchSubmission">
      <div class="search">
        <p class="border-football">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <input type="text" placeholder="搜产品、问答、圈子、内容" v-model.trim="searchText" v-on:keydown.enter="enterKeyCode($event)" @focus="focus"/>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="empty()" v-if="isShowCancelButton">
            <use xlink:href="#icon-times1"></use>
          </svg>
        </p>
        <p class="font-family-medium" @tap.stop.prevent="back()">取消</p>
      </div>
      <div class="menu" v-if="list.length || getCurrentMode === 'result' && searchText !== ''">


        <span @tap.stop.prevent="$router.replace('/searchAll?text=' + searchText)">综合</span>
        <span class="font-family-medium">分享<i></i></span>
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
        v-model="list"
        :api="'search/submission'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        :autoShowEmpty="false"
        :isShowUpToRefreshDescription="true"
        :prevSuccessCallback="prevSuccessCallback"
        class="listWrapper">
        <div>
          <template v-for="(item, index) in list">

            <FeedItem
              :item="item"
              @showItemMore="showItemMore"
            ></FeedItem>

          </template>
        </div>

        <div class="noResult" v-if="list.length">
          <div class="empty-Img">
            <img src="../../statics/images/empty@3x.png">
          </div>
          <div class="noResultText" v-if="list.length">无更多结果，快来发布相关分享~</div>
          <div class="goRelease" @tap.stop.prevent="$router.pushPlus('/discover/add')">发分享</div>
        </div>
        <div class="line-river-big" v-if="list.length"></div>
      </RefreshList>
    </div>

    <div class="noResult increase" v-if="getCurrentMode === 'result' && !list.length && !resultLoading">
      <div class="empty-Img">
        <img src="../../statics/images/empty@3x.png">
      </div>
      <div class="noResultText">暂无结果，快来发布相关分享~</div>
      <div class="goRelease" @tap.stop.prevent="$router.pushPlus('/discover/add')">发分享</div>
    </div>

    <PageMore
      ref="share"
      :shareOption="shareOption"
      :hideShareBtn="true"
      :iconMenu="iconMenus"
      @success="shareSuccess"
      @fail="shareFail"
      @clickedItem="iconMenusClickedItem"
    ></PageMore>

  </div>
</template>

<script type="text/javascript">
  import { searchText as searchTextFilter } from '../../utils/search'
  import { postRequest } from '../../utils/request'
  import RefreshList from '../../components/refresh/List.vue'
  import TextDetail from '../../components/discover/TextDetail'
  import FeedItem from '../../components/Feed.vue'
  import PageMore from '../../components/PageMore.vue'
  import { autoBlur } from '../../utils/dom'
  import { getIconMenus, iconMenusClickedItem } from '../../utils/feed'

  export default {
    data () {
      return {
        shareOption: {},
        iconMenus: [],
        searchText: '',
        confirmSearchText: '',
        isShowCancelButton: false,
        list: [],
        searchAdviceList: [],
        itemOptionsObj: {},
        resultLoading: 1,
        hotSearchHistory: {
          history: [],
          top: []
        }
      }
    },
    components: {
      RefreshList,
      TextDetail,
      FeedItem,
      PageMore
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
              this.list = []
            }
          }
        })
      }
    },
    mounted () {},
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
    methods: {
      showItemMore (shareOption, item) {
        this.iconMenus = getIconMenus(item)
        this.itemOptionsObj = item
        this.shareOption = shareOption
        this.$refs.share.share()
      },
      shareFail () {

      },
      shareSuccess () {

      },
      iconMenusClickedItem (item) {
        iconMenusClickedItem(this, this.itemOptionsObj, item, () => {
          this.iconMenus = getIconMenus(this.itemOptionsObj)
        })
      },
      focus: function () {
        this.confirmSearchText = ''
        this.list = []
        if (this.searchText) {
          this.searchAdvice(this.searchText)
        }
      },
      prevSuccessCallback: function () {
        this.resultLoading = 0
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
      enterKeyCode: function (ev) {
        if (ev.keyCode === 13) {
          this.selectConfirmSearchText(this.searchText)
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
      toDetail (item) {
        switch (item.feed_type) {
          case 1:
          case 2:
          case 3:
          case 5:
          case 6:
          case 11:
          case 12:
          case 14:
          case 15:
          case 16:
            this.$router.pushPlus(item.url, 'list-detail-page')
            break
          case -1:
            // 已废弃
            var linkArticle = {
              view_url: item.url,
              id: item.feed.submission_id,
              title: item.feed.title,
              comment_url: item.feed.comment_url,
              img_url: item.feed.img
            }
            this.goArticle(linkArticle)
            break
          default:
            this.$router.pushPlus(item.url, 'list-detail-page')
            break
        }
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

<style lang="less" scoped>
  .mui-android .mui-content .menu .bot {
    height: 0.026rem;
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
    .listWrapper{
      top: 2.24rem;
    }
    .search{
      position: relative;
      width:100%;
      padding: 0 0.426rem;
      display: flex;
      height:1.173rem;
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
      p{
        &:nth-of-type(1){
          width: 7.813rem;
          height:0.906rem;
          border-radius: 1.333rem;
          background: #f3f4f6;
          /*border:0.026rem solid #dcdcdc;*/
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.266rem;
          svg{
            color: #c8c8c8;
            &:nth-of-type(1){
              font-size: 0.48rem;
              margin-top: 0.053rem;
            }
            &:nth-of-type(2){
              margin-left: 0.266rem;
              font-size: 0.533rem;
              position: relative;
              z-index: 100;
            }
          }
          input{
            width: 6.026rem !important;
            height:0.853rem;
            border: none;
            background: #f3f4f6;
            font-size: 0.373rem;
            color: #444444;
            position: absolute;
            left: 0.853rem;
            z-index: 100;
            padding: 0 0.266rem;
          }
        }
        &:nth-of-type(2){
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
        width: 13.5%;
        height:100%;
        justify-content: center;
        align-items: center;
        &:nth-of-type(2){
          font-size: 0.373rem;
          position:relative;
          color: #444444;
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

  .newLink {
    margin-top: 0.24rem;
    .newLinkBox {
      margin-top: 0.266rem;
      padding: 0.4rem 0.4rem 0.293rem;
      background: #F7F8FA;
      border-radius: 0.106rem;
      .container-image {
        margin-top: 0;
        margin-bottom: 0.213rem;
      }
      img {
        border-radius: 0.106rem;
      }
      .linkContent {
        font-size: 0.373rem;
        color: #808080;
      }
      .link {
        font-size: 0.32rem;
        color: #B4B4B6;
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

  .increase {
    position: relative;
    z-index: 1000;
    top: 5.973rem;
  }
</style>

