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
        <span class="font-family-medium">分类<i></i></span>
        <span @tap.stop.prevent="$router.replace('/dianping/search/companys?text=' + searchText)">公司</span>
        <i class="bot"></i>
      </div>

      <RefreshList
        ref="refreshlist"
        v-model="list"
        :api="'search/productCategory'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        :autoShowEmpty="false"
        :isShowUpToRefreshDescription="false"
        :prevSuccessCallback="prevSuccessCallback"
        class="listWrapper">

        <div class="container-searchResult">
          <div class="container-resultList">
            <div class="container-result" v-for="(item, index) in list" :key="index">
              <span>{{ item.name }}</span>
              <i class="bot"></i>
            </div>
          </div>
          <div class="container-noMore">暂无更多</div>
        </div>

      </RefreshList>

    </div>
  </div>
</template>

<script>
  import RefreshList from '../../../components/refresh/List.vue'

  export default {
    data () {
      return {
        searchText: '',
        isShowCancelButton: false,
        confirmSearchText: '',
        list: [],
        resultLoading: 1,
        searchAdviceList: []
      }
    },
    components: {
      RefreshList
    },
    computed: {
      dataList () {
        return {search_word: this.confirmSearchText}
      }
    },
    methods: {
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

  .container-searchResult {
    .container-resultList {
      padding: 0 16px;
      .container-result {
        padding: 11px 0 12px;
        position: relative;
        span {
          color: #444444;
          font-size: 15px;
          line-height: 21px;
        }
      }
    }
  }
</style>
