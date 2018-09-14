<template>
  <div>
    <div class="mui-content searchSubmission">
      <div class="search">
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <input type="text" placeholder="" v-model.trim="searchText" v-on:keydown.enter="enterKeyCode($event)"/>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="empty()" v-if="isShowCancelButton">
            <use xlink:href="#icon-times1"></use>
          </svg>
        </p>
        <p class="font-family-medium" @tap.stop.prevent="back()">取消</p>
      </div>
      <div class="menu" v-if="list.length">
        <span @tap.stop.prevent="" class="font-family-medium">分享<i></i></span>
        <span @tap.stop.prevent="$router.replace('/searchQuestion?text=' + searchText)">问答</span>
        <span @tap.stop.prevent="$router.replace('/group/search?text=' + searchText)">圈子</span>
        <i class="bot"></i>
      </div>

      <div class="hotSearch" v-if="searchText === ''">
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

      <div class="searchList" v-if="searchAdviceList.length">
        <div v-for="(item, index) in searchAdviceList" :key="index" v-if="searchAdviceList.length !== 1" @tap.stop.prevent="selectConfirmSearchText(item)">
          {{item}}
          <i class="bot"></i>
        </div>
      </div>

      <div class="searchList" v-if="!searchAdviceList.length && searchText && !this.list.length && confirmSearchText !== searchText">
        <div class="listOne" @tap.stop.prevent="selectConfirmSearchText(searchText)">
          查看“{{searchText}}”的搜索结果
            <i class="bot"></i>
        </div>
      </div>

      <RefreshList
        v-if="confirmSearchText"
        v-model="list"
        :api="'search/submission'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        :autoShowEmpty="false"
        :isShowUpToRefreshDescription="false"
        class="listWrapper">
        <div>
          <template v-for="(item, index) in list">

            <!-- 发布了分享 -->
            <div @tap.stop.prevent="toDetail(item)" class="container-feed-discover-add" v-if="item.feed_type === 15">
              <div class="container-avatarAndTwoLineText">
                <div class="avatar" @tap.stop.prevent="toResume(item.user.uuid)">
                  <div class="avatarInner"><img :src="item.user.avatar">
                    <svg class="icon" aria-hidden="true" v-show="item.user.is_expert">
                      <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                    </svg>
                  </div>
                </div>
                <div class="mui-media-body">
                  <div class="lineWrapper-1">{{ item.title }}
                    <div class="component-label component-label-top" v-show="item.top > 0">顶</div>
                  </div>
                  <div class="lineWrapper-2"><timeago :since="timeago(item.created_at)" :auto-update="60">
                  </timeago>
                    <svg class="icon addressIcon" aria-hidden="true" v-show="item.feed.current_address_name">
                      <use xlink:href="#icon-dingwei1"></use>
                    </svg><span class="address">{{ item.feed.current_address_name }}</span>
                  </div>
                </div>
              </div>
              <div class="contentWrapper text-line-3">
                <span v-for="tag in item.feed.tags" @tap.stop.prevent="toTagDetail(tag.name)" class="tag">#{{tag.name}}#</span>
                <span v-html="getHighlight(item.feed.title)"></span>
              </div>

              <div v-if="item.feed.img" class="container-images container-images-discover">
                <div v-for="img in item.feed.img" class="container-image"><img :src="img"></div>
              </div>
              <div v-if="item.feed.files" class="container-pdf-list">
                <div v-for="file in item.feed.files" class="pdf"><span class="text-line-2">{{file.name}}</span></div>
              </div>
              <div class="container-remarks"><span class="from"><i>来自圈子</i>{{ item.feed.group.name }}</span>{{ item.feed.comment_number }}评论<span class="line-wall"></span>{{ item.feed.support_number }}点赞</div>

            </div>

            <!-- 发布了链接分享 -->
            <div @tap.stop.prevent="toDetail(item)" class="container-feed-article-add" v-if="item.feed_type === 16">
              <div class="container-avatarAndTwoLineText">
                <div class="avatar" @tap.stop.prevent="toResume(item.user.uuid)">
                  <div class="avatarInner"><img :src="item.user.avatar">
                    <svg class="icon" aria-hidden="true" v-show="item.user.is_expert">
                      <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                    </svg>
                  </div>
                </div>
                <div class="mui-media-body">
                  <div class="lineWrapper-1">{{ item.title }}
                    <div class="component-label component-label-top" v-show="item.top > 0">顶</div>
                  </div>
                  <div class="lineWrapper-2"><timeago :since="timeago(item.created_at)" :auto-update="60">
                  </timeago>
                    <svg class="icon addressIcon" aria-hidden="true" v-show="item.feed.current_address_name">
                      <use xlink:href="#icon-dingwei1"></use>
                    </svg><span class="address">{{ item.feed.current_address_name }}</span>
                  </div>
                </div>
              </div>
              <!-- 新增链接样式 -->
              <div class="newLink">
                <div class="contentWrapper text-line-3" v-html="getHighlight(item.feed.title)"></div>
                <div class="newLinkBox">
                  <div class="container-image lazyImg" v-if="item.feed.img">
                    <img class="lazyImg" v-lazy="item.feed.img">
                  </div>

                  <div class="linkContent text-line-2" v-if="item.feed.article_title">{{item.feed.article_title}}</div>
                  <div class="link">{{item.feed.domain}} </div>
                </div>
              </div>
              <div class="container-remarks"><span class="from"><i>来自圈子</i>{{ item.feed.group.name }}</span>{{ item.feed.comment_number }}评论<span class="line-wall"></span>{{ item.feed.support_number }}点赞</div>
            </div>
            <div class="line-river-big"></div>
          </template>
        </div>

        <div class="noResult" :class="!list.length ? 'increase' : ''" v-if="list.length">
          <svg class="icon addressIcon" aria-hidden="true">
            <use xlink:href="#icon-zanwushuju"></use>
          </svg>
          <div class="noResultText" v-if="list.length">无更多结果，快来发布相关分享~</div>
          <div class="goRelease" @tap.stop.prevent="$router.pushPlus('/discover/add')">发分享</div>
        </div>
        <div class="line-river-big" v-if="list.length"></div>
      </RefreshList>
    </div>

    <div class="noResult increase" v-if="!list.length && this.searchText !== ''">
      <svg class="icon addressIcon" aria-hidden="true">
        <use xlink:href="#icon-zanwushuju"></use>
      </svg>
      <div class="noResultText">暂无结果，快来发布相关分享~</div>
      <div class="goRelease" @tap.stop.prevent="$router.pushPlus('/discover/add')">发分享</div>
    </div>

  </div>
</template>

<script type="text/javascript">
  import { searchText as searchTextFilter } from '../../utils/search'
  import { postRequest } from '../../utils/request'
  import RefreshList from '../../components/refresh/List.vue'
  import TextDetail from '../../components/discover/TextDetail'

  export default {
    data () {
      return {
        searchText: '',
        confirmSearchText: '',
        isShowCancelButton: false,
        list: [],
        searchAdviceList: [],
        hotSearchHistory: {
          history: [],
          top: []
        }
      }
    },
    components: {
      RefreshList,
      TextDetail
    },
    created () {
      this.refreshPageData()
    },
    watch: {
      searchText: function (newValue, oldValue) {
        searchTextFilter(newValue, (text) => {
          if (newValue) {
            this.isShowCancelButton = true
            if (oldValue !== '') {
              this.searchAdvice()
            }
          }
        })
      }
    },
    mounted () {},
    computed: {
      dataList () {
        return {search_word: this.confirmSearchText}
      }
    },
    methods: {
      refreshPageData: function () {
        var text = this.$route.query.text
        if (text) {
          this.searchText = text
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
          this.confirmSearchText = text
        }
        this.searchAdviceList = []
      },
      searchAdvice () {
        postRequest(`search/suggest`, {
          search_word: this.searchText
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
      top: 2.346rem;
    }
    .search{
      width:100%;
      padding: 0 0.426rem;
      display: flex;
      height:1.173rem;
      margin-top: 0.133rem;
      flex-direction: row;
      align-items: center;
      background: #ffffff;
      justify-content: space-between;
      p{
        &:nth-of-type(1){
          width: 7.813rem;
          height:0.906rem;
          border-radius: 1.333rem;
          background: #f3f4f6;
          border:0.026rem solid #dcdcdc;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.266rem;
          svg{
            color: #c8c8c8;
            &:nth-of-type(1){
              font-size: 0.48rem;
            }
            &:nth-of-type(2){
              margin-left: 0.266rem;
              font-size: 0.533rem;
            }
          }
          input{
            margin-top: 0.4rem;
            height:0.853rem;
            border: none;
            background: #f3f4f6;
            font-size: 0.373rem;
            color: #444444;
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
      span{
        display: flex;
        width:33%;
        height:100%;
        justify-content: center;
        align-items: center;
        &:nth-of-type(1){
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
        color: #444444;
        font-size: 0.32rem;
        padding: 0.133rem 0.266rem;
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

