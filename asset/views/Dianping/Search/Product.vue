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
        <span class="font-family-medium">产品<i></i></span>
        <span @tap.stop.prevent="$router.replace('/dianping/search/comments?text=' + searchText)">点评</span>
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
        :api="'search/tagProduct'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        :autoShowEmpty="false"
        :isShowUpToRefreshDescription="true"
        :prevSuccessCallback="prevSuccessCallback"
        class="listWrapper">

        <div class="productList">
          <div class="comment-product" v-for="(item, index) in list" :key="index">
            <div class="product-info" @tap.stop.prevent="$router.pushPlus('/dianping/product/' + encodeURIComponent(item.name))">
              <div class="product-img border-football">
                <ImageView :src="item.logo" width="44" height="44"></ImageView>
                <!--<img src="../../../statics/images/uicon.jpg" alt="">-->
              </div>
              <div class="product-detail">
                <div class="productName font-family-medium text-line-1" v-html="getHighlight(item.name)"></div>
                <div class="productMark">
                  <div class="stars">
                    <StarView :rating="item.review_average_rate"></StarView>
                  </div>
                  <div class="starsText">
                    <span>{{ item.review_average_rate }}分</span>
                    <i></i><span>{{ item.review_count }}条评论</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="line-river-after line-river-after-top"></div>
          </div>
          <div class="container-noMore" v-if="list.length">暂无更多</div>
        </div>

        <div class="noResult increase dianping-search" v-if="getCurrentMode === 'result' && !list.length && !resultLoading">
          <div class="empty-Img">
            <img src="../../../statics/images/empty@3x.png">
          </div>
          <div class="noResultText">暂无结果，换个关键词试试~</div>
        </div>

      </RefreshList>

    </div>
  </div>
</template>

<script>
  import RefreshList from '../../../components/refresh/List.vue'
  import StarView from '../../../components/star-rating/starView.vue'
  import { postRequest } from '../../../utils/request'
  import { searchText as searchTextFilter } from '../../../utils/search'
  import { autoBlur } from '../../../utils/dom'

  export default {
    data () {
      return {
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
      StarView
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
    created () {
      this.refreshPageData()
    },
    activated () {
      this.refreshPageData()
    },
    methods: {
      empty () {
        this.searchText = ''
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
        this.empty()
        window.mui.back()
        return
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
      },
      // 文字高亮
      getHighlight (content) {
        var reg = new RegExp('(' + this.searchText + ')', 'gi')  // 正则验证匹配
        var newstr = content.replace(reg, '<span style="color: #03aef9">$1</span>')  // 动态添加颜色
        return newstr
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

  .comment-product {
    padding: 0.346rem 0.4rem 0;
    .product-info {
      overflow: hidden;
      border-radius: 0.106rem;
      padding: 0 0 0.4rem;
      background: none;
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
        .productName {
          width: 7.573rem;
          color: #444444;
          font-size: 0.426rem;
          line-height: 0.6rem;
        }
        .productMark {
          display: flex;
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
          .stars {
            display: flex;
            div {
              margin-right: 0.08rem;
            }
          }
          .starsText {
          }
        }
      }
    }
  }

</style>
