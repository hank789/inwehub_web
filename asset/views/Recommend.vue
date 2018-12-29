<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">精选推荐</h1>
    </header>

    <div class="mui-content">

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'recommendRead'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :pageMode = true
        @prevSuccessCallback="prevSuccessCallback"
        class="listWrapper"
      >
        <ul class="recommend">
          <template v-for="(item, index) in list">
            <li  @tap.stop.prevent="goDetial(item.read_type,item)">
              <div class="logo">
                <img class="lazyImg" v-lazy="item.data.img"/>
              </div>

              <div class="text-content">
                <div class="content_t mui-ellipsis-3">
                  <span class="label">{{ typeDesc(item.read_type) }}</span>
                  <span class="font-family-medium">{{item.data.title}}</span>
                </div>
                <div class="information">
                  <span>{{item.data.view_number}}浏览<i></i></span>
                  <span v-if="item.read_type === 1 || item.read_type === 2 || item.read_type === 6">{{item.data.support_number
                    }}点赞<i></i></span>
                  <span v-else-if="item.read_type === 3">{{item.data.answer_number}}回答<i></i></span>

                  <span v-if="item.read_type === 1 || item.read_type === 6">{{item.data.comment_number}}评论</span>
                  <span v-else-if="item.read_type === 2">好评率{{item.data.average_rate
                    }}</span>
                  <span v-else-if="item.read_type === 3">{{item.data.follower_number}}关注</span>
                </div>
              </div>
              <i class="bot"></i>
            </li>
          </template>
        </ul>
      </RefreshList>
    </div>

    <Share
      ref="share"
      v-if="!loading"
      :title="shareOption.title"
      :shareName="shareOption.shareName"
      :link="shareOption.link"
      :content="shareOption.content"
      :imageUrl="shareOption.imageUrl"
      :thumbUrl="shareOption.thumbUrl"
      :targetId="id"
      :targetType="'recommends'"
      @success="shareSuccess"
      @fail="shareFail"
    ></Share>

  </div>
</template>
<script>
  import RefreshList from '../components/refresh/MescrollList.vue'
  // import { goThirdPartyArticle } from '../utils/webview'
  import Share from '../components/Share.vue'
  import { getRecommends } from '../utils/shareTemplate'

  export default {
    data () {
      return {
        id: 0,
        list: [],
        loading: 1,
        shareOption: {
          title: '',
          link: '',
          content: '',
          imageUrl: '',
          thumbUrl: '',
          shareName: ''
        }
      }
    },
    components: {
      RefreshList,
      Share
    },
    props: {},
    watch: {},
    methods: {
      prevSuccessCallback () {
        this.loading = 0
        this.shareOption = getRecommends(0)
      },
      shareSuccess () {
      },
      shareFail () {

      },
      goDetial (type, recommend) {
        switch (type) {
          case 1:
            this.$router.pushPlus('/c/' + recommend.data.category_id + '/' + recommend.data.slug)
//            if (recommend.data.type === 'link') {
//              goThirdPartyArticle(
//                recommend.data.url,
//                recommend.source_id,
//                recommend.data.title,
//                '/c/' + recommend.data.category_id + '/' + recommend.data.slug,
//                recommend.data.img
//              )
//            } else {
//              this.$router.pushPlus('/c/' + recommend.data.category_id + '/' + recommend.data.slug)
//            }
            break
          case 2:
            this.$router.pushPlus('/askCommunity/major/' + recommend.source_id)
            break
          case 3:
            this.$router.pushPlus('/ask/offer/answers/' + recommend.source_id)
            break
          case 4:
            this.$router.pushPlus('/EnrollmentStatus/' + recommend.source_id)
            break
          case 5:
            this.$router.pushPlus('/EnrollmentStatus/' + recommend.source_id)
            break
          case 6:
            this.$router.pushPlus('/ask/offer/' + recommend.source_id)
            break
          default:
        }
      },
      typeDesc (type) {
        switch (type) {
          case 1:
            return '发现分享'
          case 2:
            return '专业问答'
          case 3:
            return '互动问答'
          case 6:
            return '互动回答'
        }
      }
    },
    mounted () {
    },
    updated () {},
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
    }
  }
</script>
<style scoped="scoped">
  /*清掉自带样式*/

  div,
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
  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #ffffff;
  }
  /*精选推荐*/
  .recommend{
    width:100%;
    padding: 0 0.426rem;
    overflow: hidden;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .recommend li{
    width: 100%;
    padding: 0.4rem 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
  }
  .recommend li:nth-of-type(1){
    padding-top: 0.32rem;
  }
  .recommend li .logo{
    width: 3.226rem;
    height:2.16rem;
  }
  .recommend li img{
    width:100%;
    height:100%;
    border-radius:0.106rem;
    object-fit: cover;
  }
  .recommend li .text-content{
    width:5.653rem;
    height:2.16rem;
    margin-left: 0.4rem;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .text-content .content_t{
    font-size: 0.373rem;
    color: RGBA(68, 68, 68, 1);
    line-height: 0.533rem;
    max-height: 1.7rem;
  }
  .recommend li .text-content  .container{
    display: inline;
  }
  .text-content .content_t span.label{
    height:0.4rem;
    line-height: 0.426rem;
    display: inline-block;
    font-size: 0.266rem;
    color: RGBA(128, 128, 128, 1);
    background:rgba(236,236,238,1);
    padding: 0rem 0.133rem;
    border-radius:0.106rem;
    font-weight: normal;
    position: relative;
    top: -0.026rem;
  }
  .information{
    width:100%;
    line-height: 0.32rem;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    font-size: 0.32rem;
    color: RGBA(128, 128, 128, 1);
    position: absolute;
    bottom: 0;
  }
  .information i{
    display: inline-block;
    width:0.026rem;
    height:0.32rem;
    background:RGBA(219, 219, 219, 1);
    margin: 0 0.266rem;
    margin-bottom: -0.05rem;
  }
</style>
