<template>
  <div>
    <div class="mui-content">

      <div class="container-search">
        <p class="border-football">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <input type="text" placeholder="搜索点评、产品、分类、公司" v-model.trim="searchText" v-on:keydown.enter="enterKeyCode($event)"/>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="empty()" v-if="isShowCancelButton">
            <use xlink:href="#icon-times1"></use>
          </svg>
        </p>
        <p @tap.stop.prevent="back()">取消</p>
      </div>
      <!-- 导航栏 -->
      <div class="container-searchMenu">
        <span @tap.stop.prevent="$router.replace('/dianping/search/comments?text=' + searchText)">点评</span>
        <span @tap.stop.prevent="$router.replace('/dianping/search/products?text=' + searchText)">产品</span>
        <span @tap.stop.prevent="$router.replace('/dianping/search/categories?text=' + searchText)">分类</span>
        <span class="font-family-medium">公司<i></i></span>
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
        :api="'search/company'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        :autoShowEmpty="false"
        :isShowUpToRefreshDescription="true"
        :prevSuccessCallback="prevSuccessCallback"
        class="listWrapper">

        <div class="container-searchCompony">
          <div class="container-searchComponyList">
            <div class="container-componyList" v-for="(item, index) in list" :key="index" @tap.stop.prevent="$router.pushPlus('/companyDetailProduct/' + item.id)">
              <div class="componyImg border-football">
                <ImageView :src="item.logo" width="43" height="43" :isLazyload="false"></ImageView>
              </div>
              <div class="componyInfo">
                <div class="componyName text-line-1" v-html="getHighlight(item.name)"></div>
                <div class="componyTags" v-if="item.tags.length">
                  <span v-for="(tags, tagsIndex) in item.tags" :key="tagsIndex">{{ tags.name }}<i v-if="index !== tags.length-1"></i></span>
                </div>
                <div class="componyAddress">
                  <div class="address">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-dingwei"></use>
                    </svg>
                    <span>{{ item.address_province }}</span>
                  </div>
                  <div class="interval">< {{ item.distance_format }}</div>
                </div>
              </div>
              <i class="bot"></i>
            </div>
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
  import { postRequest } from '../../../utils/request'
  import { searchText as searchTextFilter } from '../../../utils/search'

  export default {
    data () {
      return {
        searchText: '',
        confirmSearchText: '',
        isShowCancelButton: false,
        resultLoading: 1,
        list: [],
        searchAdviceList: [],
        hotSearchHistory: {
          history: [],
          top: []
        }
      }
    },
    components: {
      RefreshList
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
  .mui-content {
    background: #FFFFFF;
    .listWrapper{
      top: 2.24rem;
    }
  }

  .container-searchCompony {
    .container-searchComponyList {
      padding: 0 0.426rem;
      .container-componyList {
        position: relative;
        padding: 0.4rem 0 0.333rem;
        display: flex;
        .componyImg {
          width: 1.12rem;
          height: 1.12rem;
          border-radius: 0.106rem;
          img {
            width: 100%;
            height: 100%;
            border-radius: 0.106rem;
          }
          &.border-football {
            &:after {
              border-radius: 0.213rem;
            }
          }
        }
        .componyInfo {
          margin-left: 0.346rem;
          .componyName {
            width: 7.546rem;
            color: #444444;
            font-size: 0.426rem;
            line-height: 0.6rem;
          }
          .componyTags {
            color: #808080;
            font-size: 0.346rem;
            line-height: 0.493rem;
            margin-top: 0.106rem;
            margin-bottom: 0.133rem;
            span {
              i {
                width: 0.053rem;
                height: 0.053rem;
                background: #B4B4B6;
                border-radius: 2.666rem;
                display: inline-block;
                vertical-align: middle;
                margin: -0.08rem 0.133rem 0;
              }
            }
          }
          .componyAddress {
            width: 7.64rem;
            display: flex;
            justify-content: space-between;
            .address {
              color: #B4B4B6;
              .icon {
                font-size: 0.373rem;
              }
              span {
                font-size: 0.293rem;
                line-height: 0.4rem;
                margin-left: -0.106rem;
              }
            }
          }
        }
      }
    }
  }
</style>
