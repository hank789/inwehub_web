<template>
  <div>
    <div class="mui-content">

      <div class="container-search">
        <p class="border-football">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <input type="text" placeholder="搜索产品、点评、分类、公司" v-model.trim="searchText" v-on:keydown.enter="enterKeyCode($event)"/>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="empty()" v-if="isShowCancelButton">
            <use xlink:href="#icon-times1"></use>
          </svg>
        </p>
        <p @tap.stop.prevent="back()">取消</p>
      </div>
      <!-- 导航栏 -->
      <div class="container-searchMenu">
        <span @tap.stop.prevent="$router.replace('/dianping/search/products?text=' + searchText)">产品</span>
        <span class="font-family-medium">点评<i></i></span>
        <span @tap.stop.prevent="$router.replace('/dianping/search/categories?text=' + searchText)">分类</span>
        <span @tap.stop.prevent="$router.replace('/dianping/search/companys?text=' + searchText)">公司</span>
        <i class="bot"></i>
      </div>

      <div class="container-hotSearch" v-if="getCurrentMode === 'history'">
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

      <div class="container-searchList" v-if="getCurrentMode === 'match'">
        <div class="listOne" @tap.stop.prevent="selectConfirmSearchText(searchText)">
          查看“{{searchText}}”的搜索结果
          <i class="bot"></i>
        </div>
      </div>

      <div class="container-searchList" v-if="getCurrentMode === 'match'">
        <div v-for="(item, index) in searchAdviceList" :key="index" @tap.stop.prevent="selectConfirmSearchText(item)">
          {{item}}
          <i class="bot"></i>
        </div>
      </div>



      <RefreshList
        v-if="getCurrentMode === 'result'"
        ref="refreshlist"
        v-model="list"
        :api="'search/reviews'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        :autoShowEmpty="false"
        :isShowUpToRefreshDescription="true"
        :prevSuccessCallback="prevSuccessCallback"
        class="listWrapper">

        <template v-for="(item, index) in list">
          <DianPingFeed
            :item="item"
            :isShowLink="true"
            @showItemMore="showItemMore"
          ></DianPingFeed>
        </template>
        <div class="container-noMore" v-if="list.length">暂无更多</div>

        <div class="noResult increase dianping-search" v-if="getCurrentMode === 'result' && !list.length && !resultLoading">
          <div class="empty-Img">
            <img src="../../../statics/images/empty@3x.png">
          </div>
          <div class="noResultText">暂无结果，换个关键词试试~</div>
        </div>

      </RefreshList>

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

<script>
  import RefreshList from '../../../components/refresh/List.vue'
  import { postRequest } from '../../../utils/request'
  import { searchText as searchTextFilter } from '../../../utils/search'
  import DianPingFeed from '../../../components/Feed.vue'
  import PageMore from '../../../components/PageMore.vue'
  import { autoBlur } from '../../../utils/dom'

  export default {
    data () {
      return {
        shareOption: {},
        iconMenus: [],
        searchText: '',
        isShowCancelButton: false,
        confirmSearchText: '',
        list: [],
        resultLoading: 1,
        searchAdviceList: [],
        hotSearchHistory: {
          history: [],
          top: []
        }
      }
    },
    components: {
      RefreshList,
      DianPingFeed,
      PageMore
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
    methods: {
      empty () {
        this.searchText = ''
      },
      showItemMore (shareOption) {
        this.shareOption = shareOption
        this.$refs.share.share()
      },
      shareFail () {

      },
      shareSuccess () {

      },
      iconMenusClickedItem () {
      },
      focus: function () {
        this.confirmSearchText = ''
        this.list = []
        if (this.searchText) {
          this.searchAdvice(this.searchText)
        }
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
      back () {
        window.mui.back()
        return
      },
      // 文字高亮
      getHighlight (content) {
        var reg = new RegExp('(' + this.searchText + ')', 'gi')  // 正则验证匹配
        var newstr = content.replace(reg, '<span style="color: #03aef9">$1</span>')  // 动态添加颜色
        return newstr
      },
      prevSuccessCallback () {
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
      }
    }
  }

</script>

<style scoped lang="less">
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
  }
</style>
