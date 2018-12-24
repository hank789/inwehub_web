<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title" v-if="isSelf">我的发布</h1>
      <h1 class="mui-title" v-else>Ta的发布</h1>
    </header>

    <div class="mui-content">

      <div class="container-searchMenu">
        <span class="font-family-medium">回答<i></i></span>
        <span @tap.stop.prevent="$router.replace('/my/publishQuestions/' + uuid)">提问</span>
        <span @tap.stop.prevent="$router.replace('/my/publishArticle/' + uuid)">分享</span>
        <span @tap.stop.prevent="$router.replace('/my/publishComment/' + uuid)">评论</span>
        <span @tap.stop.prevent="$router.replace('/dianping/my/publishComments/' + uuid)">点评</span>
        <i class="bot"></i>
      </div>

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'answer/myList'"
        :prevOtherData="{type:0, uuid:this.uuid }"
        :nextOtherData="{type:0, uuid:this.uuid }"
        :list="list"
        class="listWrapper">

        <ul class="answer">
          <li v-for="(ask, index) in list" @tap.stop.prevent="toDetail(ask)">
            <p class="mui-ellipsis-2" v-html="textToLink(ask.description)"></p>
            <p>
              <span class="label" :class="'label_' + ask.status">{{ask.status_description}}</span>
              <span>{{ask.created_at.split(' ')[0].replace(/-/g, '/') }}</span>
            </p>
            <i class="bot"></i>
          </li>
        </ul>

      </RefreshList>

    </div>
  </div>
</template>

<script>
  import RefreshList from '../../../components/refresh/MescrollList.vue'
  import { textToLinkHtml, secureHtml } from '../../../utils/dom'
  import { getLocalUuid } from '../../../utils/user'

  const PublishAnswers = {
    data: () => ({
      list: [],
      uuid: '',
      userUuid: getLocalUuid()
    }),
    created () {},
    computed: {
      isSelf () {
        if (getLocalUuid() === this.$route.params.uuid) {
          return true
        }
        return false
      }
    },
    activated: function () {
      this.refreshPageData()
    },
    components: {
      RefreshList
    },
    watch: {
      '$route' (to, from) {
        if (to.name === from.name) {
          this.refreshPageData()
        }
      }
    },
    beforeRouteEnter (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
      next(vm => {
        // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
        vm.$refs.RefreshList && vm.$refs.RefreshList.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
      })
    },
    beforeRouteLeave (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
      this.$refs.RefreshList && this.$refs.RefreshList.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
      next()
    },
    methods: {
      refreshPageData () {
        if (this.$route.params.uuid) {
          this.uuid = this.$route.params.uuid
        }
      },
      textToLink (text) {
        return secureHtml(textToLinkHtml(text))
      },
      toDetail (item) {
        if (item.question_type === 2) {
          this.$router.pushPlus('/ask/offer/' + item.id)
        } else {
          if (this.isSelf) {
            this.$router.pushPlus('/answer/' + item.question_id)
          } else {
            this.$router.pushPlus('/askCommunity/major/' + item.question_id)
          }
        }
      }
    },
    mounted () {
    },
    updated () {

    }
  }
  export default PublishAnswers
</script>

<style scoped="scoped">
  .mui-content {
    background: #FFFFFF;
  }

  .bot {
    position: absolute;
    right: 0rem;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  p,
  span,
  i,
  img,
  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  /*滚动区域*/

  .answer {
    width: 92%;
    margin-left: 4%;
    overflow: hidden;
  }

  .answer li {
    width: 100%;
    overflow: hidden;
    padding: 0.373rem 0 0.346rem 0;
    position: relative;
  }

  .answer li p:nth-of-type(1) {
    color: #444444;
    font-size: 0.426rem;
  }

  .answer li p:nth-of-type(2) {
    overflow: hidden;
    margin-top: 0.16rem;
  }

  .label {
    float: left;
    width: 1.333rem;
    height: 0.453rem;
    line-height: 0.453rem;
    border-radius: 1.333rem;
    background: #fcc816;
    color: #ffffff;
    font-size: 0.32rem;
    text-align: center;
  }

  .answer li p:nth-of-type(2) span:nth-of-type(2) {
    float: right;
    font-size: 0.32rem;
    color: #b4b4b6;
  }

  /*状态的颜色*/
  .label_1, .label_2, .label_4 {
    background: #fcc816;
  }

  .label_3, .label_5, .label_6, .label_7 {
    background: #c8c8c8;
  }

  .listWrapper {
    top: 1.2rem !important;
  }
  .container-searchMenu {
    margin-top: 0;
  }
</style>
