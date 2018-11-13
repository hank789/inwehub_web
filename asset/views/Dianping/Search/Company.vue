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

      <RefreshList
        ref="refreshlist"
        v-model="list"
        :api="'search/company'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        :autoShowEmpty="false"
        :isShowUpToRefreshDescription="false"
        :prevSuccessCallback="prevSuccessCallback"
        class="listWrapper">

        <div class="container-searchCompony">
          <div class="container-searchComponyList">
            <div class="container-componyList" v-for="(item, index) in list" :key="index">
              <div class="componyImg border-football">
                <img src="../../../statics/images/uicon.jpg">
              </div>
              <div class="componyInfo">
                <div class="componyName">{{ item.name }}</div>
                <div class="componyTags">专业服务</div>
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
        confirmSearchText: '',
        isShowCancelButton: false,
        resultLoading: 1,
        list: [],
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
  .mui-content {
    background: #FFFFFF;
    .listWrapper{
      top: 2.24rem;
    }
  }

  .container-searchCompony {
    .container-searchComponyList {
      padding: 0 16px;
      .container-componyList {
        position: relative;
        padding: 15px 0 12.5px;
        display: flex;
        .componyImg {
          width: 42px;
          height: 42px;
          border-radius: 4px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
          }
          &.border-football {
            &:after {
              border-radius: 8px;
            }
          }
        }
        .componyInfo {
          margin-left: 13px;
          .componyName {
            color: #444444;
            font-size: 16px;
            line-height: 22.5px;
          }
          .componyTags {
            color: #808080;
            font-size: 13px;
            line-height: 18.5px;
            margin-top: 4px;
            margin-bottom: 5px;
          }
          .componyAddress {
            width: 286.5px;
            display: flex;
            justify-content: space-between;
            .address {
              color: #B4B4B6;
              .icon {
                font-size: 14px;
              }
              span {
                font-size: 11px;
                line-height: 15px;
                margin-left: -4px;
              }
            }
          }
        }
      }
    }
  }
</style>
