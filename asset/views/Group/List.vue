<template>
  <div>
    <div id="home-content" class="mui-content">
      <div class="container-control-logoAndTabsAndSearch">
        <svg class="icon logoIcon" aria-hidden="true">
          <use xlink:href="#icon-logowenzi"></use>
        </svg><span class="splitCircle"></span>
        <div class="logoAndTabsAndSearchTabs">
          <div class="tab active" @tap.stop.prevent="$router.replace('/groups')">圈子</div>
          <div class="tab" @tap.stop.prevent="$router.replace('/ask/offers')">问答</div>
          <div class="tab" @tap.stop.prevent="$router.replace('/dianping')">点评</div>
        </div>
        <svg class="icon searchIcon" aria-hidden="true"  @tap.stop.prevent="$router.pushPlus('/searchAll','list-detail-page-three')">
          <use xlink:href="#icon-sousuo"></use>
        </svg>
      </div>

      <div class="line-river-after line-river-after-top"></div>

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :list="list"
        :api="'group/mine'"
        :prevOtherData="{page: 1}"
        :nextOtherData="{}"
        :pageMode = true
        :autoShowEmpty="false"
        class="listWrapper"
      >
        <!--<div class="groupSearchWrapper" v-if="list.length" @tap.stop.prevent="$router.pushPlus('/group/search','list-detail-page-three')">-->
          <!--<div class="groupSearch border-football">-->
            <!--<svg class="icon" aria-hidden="true">-->
              <!--<use xlink:href="#icon-sousuo"></use>-->
            <!--</svg>-->
            <!--<span>搜索您感兴趣的其他圈子</span>-->
          <!--</div>-->
        <!--</div>-->



        <div class="component-feed-item-guide" v-if="!list.length">
          <div class="feed-IconImg">
            <img src="../../statics/images/feed@3x.png" alt="">
          </div>
          <div class="desc">关注你感兴趣的人和圈子，了解他们的最新动态</div>
          <div class="buttonWrapper" @tap.stop.prevent="$router.pushPlus('/userGuide/stepone?from=group')">
            <button>去看看</button>
          </div>
        </div>

        <div class="component-group" v-for="(item, index) in list" :key="index" @tap.stop.prevent="$router.pushPlus('/group/detail/' + item.id)">
          <div class="groupLogo">
            <ImageView :src="item.logo" width="44" height="44"></ImageView>
          </div>
          <div class="groupContent">
            <div class="groupName">
              <div class="font-family-medium groupOwnerWrapper">
                <span class="text-line-1">{{item.name}}</span><span class="border-football" v-if="item.is_joined === 3">圈主</span>
              </div>
            </div>
            <span class="groupDescribe text-line-1">{{item.description}}</span>
            <span class="groupText">{{item.subscribers}}人气</span>
            <span class="groupText">{{item.articles}}分享</span>
            <span class="groupText" v-if="!item.public">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-simi"></use>
              </svg>
              私密
            </span>
          </div>
          <i class="bot"></i>
        </div>
        <div class="foundGroup" v-if="list.length" @tap.stop.prevent="toGroupAdd()">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-tianjia"></use>
          </svg>
          <span class="font-family-medium">创建我的圈子</span>
        </div>
      </RefreshList>

    </div>
  </div>
</template>
<script>

  import RefreshList from '../../components/refresh/MescrollList.vue'
  import { postRequest } from '../../utils/request'
  import userAbility from '../../utils/userAbility'

  export default {
    data () {
      return {
        list: [],
        loading: 1,
        groupsList: [],
        apper: 0
      }
    },
    components: {
      RefreshList
    },
    props: {},
    watch: {},
    methods: {
      toGroupAdd () {
        userAbility.jumpToGroupAdd()
      },
      refreshPageData () {
        if (this.$route.query.refresh) {
          this.$refs.RefreshList.refreshPageData(this.prevOtherData)
        }
      },
      goJoin (id) {
        postRequest(`group/join`, {id: id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          window.mui.toast(response.data.message)
          // 请求成功后跳转详情页面
          this.$router.pushPlus('/group/detail/' + id)
        })
      }
    },
    mounted () {
      // 左滑
      document.getElementById('home-content').addEventListener('swipeleft', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle >= 160) {
          this.$router.replace('/ask/offers')
        }
      })
      // 右滑
      document.getElementById('home-content').addEventListener('swiperight', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle <= 20) {
          this.$router.replace('/dianping')
        }
      })
    },
    updated () {}
  }
</script>
<style scoped="scoped" lang="less">

  .mui-content{
    background: #ffffff;
  }
  .bot {
    position: absolute;
    right:0;
    bottom: 0;
    left:0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .listWrapper{
    top: 1.173rem;
    bottom: 50px; /* px不转换 */
  }
  .foundGroup {
    text-align: center;
    margin-top: 0.32rem;
    span {
      color: #808080;
      font-size: 0.373rem;
    }
    svg {
      color: #B4B4B6;
      font-size: 0.293rem;
      vertical-align: inherit;
    }
  }
  .component-feed-item-guide {
    padding-top: 2.8rem;
    &.feedListNo {
      margin-top: 2.666rem;
      button {
        margin-top: 0.453rem;
      }
    }
    .line-river-after {
      margin-top: 0.8rem;
      &:after {
        left: 0.426rem;
        right: 0.426rem;
      }
    }
    .feed-IconImg {
      width: 3.2rem;
      height: 1.973rem;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>

