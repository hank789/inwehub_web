<template>
  <div>
    <HomeSearch :unread_count="unread_count"></HomeSearch>
    <div class="mui-content absolute" v-show="!loading">
      <!--search-->
      <!--search/chat/72-->
      <div class="home-b">
      <!--轮播-->
      <div id="slider" class="mui-slider" v-if="notices.length">
        <div class="mui-slider-group  mui-slider-loop">
          <!-- 额外增加的一个节点(循环轮播：第一个节点是最后一张轮播) -->
          <div class="mui-slider-item mui-slider-item-duplicate" v-if="notices[notices.length-1]">
            <a @tap.stop.prevent="goLink(notices[notices.length-1].url)"><img :src="notices[notices.length-1].img_url"></a>
          </div>
          <div class="mui-slider-item" v-for="(notice, index) in notices">
            <a  @tap.stop.prevent="goLink(notice.url)" target="_blank"><img :src="notice.img_url"></a>
          </div>
          <!--支持循环，需要重复图片节点-->
          <!-- 额外增加的一个节点(循环轮播：最后一个节点是第一张轮播) -->
          <div class="mui-slider-item mui-slider-item-duplicate" v-if="notices[0]">
            <a @tap.stop.prexvent="goLink(notices[0].url)">
              <img :src="notices[0].img_url" />
            </a>
          </div>
        </div>
        <div class="home mui-slider-indicator">
          <div :class="{'mui-indicator':true, 'mui-active':index===0}" v-for="(notice, index) in notices"></div>
        </div>
      </div>
      <!--功能列表-->
      <ul class="categoryMenu">
       <li  @tap.stop.prevent="judge(1)">
         <svg class="icon" aria-hidden="true">
           <use xlink:href="#icon-zhuanyewenda-"></use>
         </svg>
        <p>问答</p>
       </li>
        <li  @tap.stop.prevent="$router.pushPlus('/groups')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wodequanzi-shouye"></use>
          </svg>
          <p>圈子</p>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/nearbyCompany')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhaoguwenyuanshi"></use>
          </svg>
          <p>附近</p>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/discover/company/services')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-fujinqiye1"></use>
          </svg>
          <p>服务</p>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/seekingCooperation')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xunhezuo"></use>
          </svg>
          <p>合作</p>
        </li>
      </ul>
      <div class="line-river" v-if="user_group_unread"></div>
      <div class="component-noticeBar" v-if="user_group_unread" @tap.stop.prevent="$router.pushPlus('/group/my')"><span>您的圈子有新动态！</span></div>
      <div class="gray"></div>
      <!--精选推荐-->
      <div class="component-title-home">
        <div class="left">精选推荐</div>
        <div class="right" @tap.stop.prevent="$router.pushPlus('/recommends')">更多</div>
      </div>
      <div class="line-river"></div>
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
            <i class="bot" v-if="list.length-1 !== index"></i>
          </li>
        </template>
        <!--<div class="more"  @tap.stop.prevent="$router.pushPlus('/recommends')">更多精选推荐</div>-->
      </ul>

        <div class="line-river-big"></div>
        <div class="component-title-home">
          <div class="left">人气圈子TOP3</div>
          <div class="right" @tap.stop.prevent="$router.pushPlus('/groups')">更多</div>
        </div>
        <div class="line-river"></div>
        <template v-for="(item, index) in hot_groups">
          <div class="component-item-group" @tap.stop.prevent="$router.pushPlus('/group/detail/' + item.id)">
            <div class="leftD">
              <img class="lazyImg" v-lazy="item.logo"></img>
            </div>
            <div class="rightD">
              <div class="line1 text-line-1"><img :src="top(index)"/>{{item.name}}</div>
              <div class="line2 text-line-2">{{item.description}}</div>
              <div class="line3 text-line-1"><img :src="item.owner.avatar" @tap.stop.prevent="toAvatar(item.owner.uuid)"/><span class="group-user">{{item.owner.name}}</span><span class="line-pole"></span><span class="group-number">{{item.scores}}</span><span class="desc">/今日人气</span></div>
            </div>
          </div>
          <div class="line-river" v-if="recommendAsks.length-1 !== index"></div>
        </template>

        <div class="line-river-big"></div>
        <div class="component-title-home">
          <div class="left">问答推荐</div>
          <div class="right" @tap.stop.prevent="clickGetRecommends()">
                <svg class="icon" :class="{move1: this.recommendLoading}" aria-hidden="true">
                  <use xlink:href="#icon-shuaxin"></use>
                </svg>换一换
          </div>
        </div>
        <div class="line-river"></div>
        <template v-for="(item, index) in recommendAsks">
          <div class="component-item-ask-recommand" @tap.stop.prevent="toDetail(item)">
            <div class="line1">
              <label v-for="(tag, tagIndex) in item.tags">{{tag.name}}</label>
            </div>
            <div class="line2 text-line-3">{{item.title}}</div>
            <div class="line3 text-line-1"><span class="guanzhu">{{item.follow_number}}关注</span><span class="line-pole" v-if="item.answer_number"></span><span class="users" :class="'users-' + item.answer_users.length"><img :src="answerUsers.avatar" v-for="(answerUsers, answerUsersIndex) in item.answer_users"></span><span class="huida" v-if="item.answer_number">等{{item.answer_number}}人回答</span></div>
          </div>
          <div class="line-river" v-if="recommendAsks.length-1 !== index"></div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  import { goThirdPartyArticle } from '../utils/webview'
  import { postRequest } from '../utils/request'
  import userAbility from '../utils/userAbility'
  import { autoTextArea, AppInit, openUrlByUrl } from '../utils/plus'
  import { saveLocationInfo } from '../utils/allPlatform'
  import HomeSearch from '../components/search/Home'
  import top1 from '../statics/images/top1@3x.png'
  import top2 from '../statics/images/top2@3x.png'
  import top3 from '../statics/images/top3@3x.png'
  import sessionStorageEvent from '../stores/localStorage'
  import { alertSimple } from '../utils/dialog'

  const Home = {
    data () {
      return {
        loading: 1,
        list: [],
        notices: [],
        hot_groups: [],
        contact_id: '',
        unread_count: 0,
        top1: top1,
        top2: top2,
        top3: top3,
        recommendAsks: [],
        recommendLoading: 0,
        recommendPage: 0,
        user_group_unread: 0,
        invitation_coupon: {
          show: false
        }
      }
    },
    created () {
      this.refreshPageData()
    },
    components: {
      HomeSearch
    },
    activated: function () {
      this.refreshPageData()
    },
    computed: {},
    methods: {
      toDetail (item) {
        if (item.question_type === 2) {
          this.$router.pushPlus('/askCommunity/interaction/answers/' + item.id)
        } else {
          this.$router.pushPlus('/ask/' + item.id)
        }
      },
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume/' + uuid + '?goback=1' + '&time=' + (new Date().getTime()))
      },
      top (index) {
        switch (index) {
          case 0:
            return this.top1
          case 1:
            return this.top2
          case 2:
            return this.top3
        }
      },
      refreshPageData () {
        this.getData()
        this.getHomeData()
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
      },
      messagecountchange (obj) {
        if (obj.contact_id) {
          this.contact_id = obj.contact_id
          this.unread_count = obj.unread_count
        }
      },
      goLink: function (url) {
        openUrlByUrl(url)
      },
      goDetial (type, recommend) {
        switch (type) {
          case 1:
            if (recommend.data.type === 'link') {
              goThirdPartyArticle(
                recommend.data.url,
                recommend.source_id,
                recommend.data.title,
                '/c/' + recommend.data.category_id + '/' + recommend.data.slug,
                recommend.data.img
              )
            } else {
              this.$router.pushPlus('/c/' + recommend.data.category_id + '/' + recommend.data.slug)
            }
            break
          case 2:
            this.$router.pushPlus('/askCommunity/major/' + recommend.source_id)
            break
          case 3:
            this.$router.pushPlus('/askCommunity/interaction/answers/' + recommend.source_id)
            break
          case 4:
            this.$router.pushPlus('/EnrollmentStatus/' + recommend.source_id)
            break
          case 5:
            this.$router.pushPlus('/EnrollmentStatus/' + recommend.source_id)
            break
          case 6:
            this.$router.pushPlus('/askCommunity/interaction/' + recommend.source_id)
            break
          default:

        }
      },
      judge (type) {
        postRequest(`auth/checkUserLevel`, {
          permission_type: type
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data) {
            if (response.data.data.is_valid) {
              switch (type) {
                case 1:
                  this.$router.pushPlus('/askCommunity/majors')
                  break
                case 2:
                  this.$router.pushPlus('/askCommunity/majors')
              }
            } else {
              userAbility.jumpJudgeGrade(this)
            }
          }
        })
      },
      getData () {
        postRequest(`recommendRead`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.list = response.data.data.data.slice(0, 5)
        })
      },
      getHomeData () {
        postRequest(`home`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.notices = response.data.data.notices
          this.hot_groups = response.data.data.hot_groups
          this.invitation_coupon = response.data.data.invitation_coupon
          this.user_group_unread = response.data.data.user_group_unread
          // 是否弹受邀红包
          if (response.data.data.invitation_coupon.show) {
            userAbility.InvitationCoupon(this)
          }
        })

        this.getRecommends()
      },
      clickGetRecommends () {
        var isShowToWodeshanchang = sessionStorageEvent.getLocalItem('showToWodeshanchang')
        if (!isShowToWodeshanchang.show) {
          sessionStorageEvent.setLocalItem('showToWodeshanchang', {show: true})
          alertSimple('<div style="text-align: center">丰富“我的擅长”，推荐更精准！</div>', '前往', (num) => {
            if (num.index === 0) {
              this.$router.pushPlus('/my/advantage')
            }
          }, true)
        }
        this.getRecommends()
      },
      getRecommends () {
        this.recommendLoading = 1
        postRequest(`question/recommendUser`, {perPage: 3, page: ++this.recommendPage}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          setTimeout(() => {
            this.recommendLoading = 0
          }, 1000)
          this.recommendAsks = response.data.data.data
          this.loading = 0
        })
      }
    },
    updated () {
      this.$nextTick(() => {
        // 轮播
        window.mui('.mui-slider').slider({
          interval: 5000
        })
      })
    },
    mounted () {
      // 新手任务
      userAbility.newbieTask(this)
      autoTextArea()
      saveLocationInfo()
      AppInit(this)
    }
  }
  export default Home
</script>

<style lang="less" scoped>
  div,
  span,
  p,
  ul,
  li,
  i,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
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
    bottom:1.333rem;
  }
  /*search*/
  /*.search{*/
    /*width:92%;*/
    /*height:0.906rem;*/
    /*margin-left: 4%;*/
    /*position: absolute;*/
    /*top:0.053rem;*/
    /*z-index: 2;*/
    /*display: flex;*/
    /*flex-direction: row;*/
    /*justify-content: space-between;*/
    /*align-items: center;*/
  /*}*/
  /*.search-l{*/
    /*display: flex;*/
    /*flex-direction: column;*/
    /*align-items: center;*/
    /*position: relative;*/
    /*justify-content: center;*/
  /*}*/
  /*.search-l svg{*/
    /*font-size:0.666rem;*/
    /*color: rgba(255,255,255,1);*/
  /*}*/
  /*.search-l p{*/
    /*font-size:0.266rem;*/
    /*color: rgba(255,255,255,1);*/
    /*line-height: 0.373rem;*/
    /*margin-bottom: 0.133rem;*/
  /*}*/
  /*.search-l i{*/
    /*width:0.213rem;*/
    /*height:0.213rem;*/
    /*background: #FA4975;*/
    /*border-radius: 50%;*/
    /*position: absolute;*/
    /*top: 0.16rem;*/
    /*right: -0.266rem;*/
  /*}*/
  /*.search-r{*/
    /*width: 77%;*/
    /*height:100%;*/
    /*background:rgba(255,255,255,1);*/
    /*opacity:0.9477;*/
    /*border-radius: 1.333rem;*/
    /*font-size: 0.373rem;*/
    /*color:rgba(200,200,200,1);*/
    /*display: flex;*/
    /*flex-direction: row;*/
    /*align-items: center;*/
    /*justify-content: center;*/
  /*}*/
  /*.search-r svg{*/
    /*font-size: 0.453rem;*/
    /*color: rgba(68,68,68,1);*/
    /*margin-left: 0.426rem;*/
    /*margin-right: 0.16rem;*/
  /*}*/
  /*search*/
  .home-b{
    width: 100%;
    overflow: hidden;
    position: absolute;
    top:0.213rem;
  }

  #slider{
    height:3.626rem;
    background: #cccccc;
    position: relative;
  }
  #slider .mui-slider-item img{
    height:3.626rem;
    width:100%;
    object-fit: cover;
  }
  .categoryMenu{
    width:100%;
    height:2.133rem;
    background: #ffffff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.853rem;
  }
  .categoryMenu li{
    height:100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .categoryMenu li svg{
    font-size:0.8rem;
  }
  .categoryMenu li p{
    font-size:0.346rem;
    color:rgba(128,128,128,1);
    line-height:0.373rem;
    margin-top: 0.213rem;
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
  .title{
    width:100%;
    line-height: 0.426rem;
    padding-left: 4%;
    margin-top: 0.293rem;
    text-align: left;
    font-size: 0.426rem;
    color: rgba(68,68,68,1);
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
  .more{
    width:100%;
    text-align: center;
    font-size: 0.373rem;
    margin-top: 0.293rem;
    color:rgba(3,174,249,1);
    line-height:0.533rem;
  }
  .gray{
    width:100%;
    height:0.266rem;
    background: #F3F4F5;
  }
  .mui-slider-item{
    height:3.626rem !important;
    overflow: hidden;
  }


  .line-river {
    height: 1px;
    position: relative;
  }
  .line-river:after {
    content: '';
    position: absolute;
    background: #dcdcdc;
    height: 1px;
    left: 0.413rem;
    right: 0.413rem;
    transform:scaleY(0.6);
    -webkit-transform: scaleY(0.6);
  }
  .line-river-big {
    height: 0.266rem;
    position: relative;
    background: #F3F4F6;
  }
  .component-noticeBar {
    position: relative;
    background: url(../statics/images/laba@3x.png) no-repeat;
    background-size: 0.546rem;
    background-position: 0.413rem 0.266rem;
    font-size: 0.373rem;
    height: 1.04rem;
    line-height: 1.04rem;
    color: #444;
  }
  .component-noticeBar span {
    margin-left: 1.146rem;
  }
  .component-title-home {
    height: 1.173rem;
    line-height: 1.173rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 0 0.413rem;
  }
  .component-title-home .left {
    font-family: PingFangSC-Medium;
    font-size: 0.426rem;
    color: #444;
  }
  .component-title-home .right {
    color: #03AEF9;
    font-size: 0.373rem;
  }
  .component-title-home .right svg {
    font-size: 0.493rem;
    vertical-align: text-bottom;
    margin-right: 0.186rem;
    position: relative;
    top:-1px;
  }
  .component-item-group {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 0.386rem 0.426rem;
    position: relative;
  }
  .component-item-group .leftD {
    width: 2.453rem;
    height: 2.44rem;
  }
  .component-item-group .leftD img {
    width: inherit;
    height: inherit;
    border-radius: 0.106rem;
  }
  .component-item-group .rightD {
    padding:0 0.28rem;
    position: relative;
    flex-grow:2;
    overflow:hidden;
  }
  .component-item-group .rightD .line1 {
    font-family: PingFangSC-Medium;
    font-size: 0.373rem;
  }
  .component-item-group .rightD .line1 img {
    width: 0.533rem;
    vertical-align: text-top;
    margin-right: 0.133rem;
  }
  .component-item-group .rightD .line2 {
    padding-top: 0.133rem;
    color: #808080;
    line-height: 0.44rem;
    font-size: 0.32rem;
  }
  .component-item-group .rightD .line3 {
    width:100%;
    position: absolute;
    bottom: 0;
  }
  .component-item-group .rightD .line3 img {
    width: 0.533rem;
    height: 0.533rem;
    border-radius: 50%;
    vertical-align: text-bottom;
    margin-right: 0.133rem;
  }
  .component-item-group .rightD .line3 .group-user {
    font-size: 0.32rem;
    color: #444;
  }
  .component-item-group .rightD .line3 .line-pole {
    display: inline-block;
    width: 0.026rem;
    height: 0.293rem;
    background: #dcdcdc;
    margin: 0 0.24rem;
    position: relative;
    top: 0.026rem;
  }
  .component-item-group .rightD .line3 .group-number {
    font-size: 0.373rem;
    color: #235280;
    position: relative;
    top: 0.013rem;
  }
  .component-item-group .rightD .line3 span.desc {
    color: #B4B4B6;
    font-size: 0.32rem;
    position: relative;
    left: 0.053rem;
  }
  .component-item-ask-recommand {
    padding: 0.333rem 0.426rem;
  }
  .component-item-ask-recommand .line1 label {
    background: #A8DFF7;
    color: #fff;
    font-size: 0.32rem;
    line-height: 0.44rem;
    padding: 0.04rem 0.24rem;
    border-radius: 1.333rem;
    display: inline-block;
    margin-right:5px;
  }
  .component-item-ask-recommand .line2 {
    margin: 0.266rem 0;
    font-size: 0.373rem;
    line-height: 0.52rem;
    color: #444;
  }
  .component-item-ask-recommand .line3 {
    vertical-align: middle;
  }
  .component-item-ask-recommand .line3 .guanzhu {
    color: #235280;
    font-size: 0.32rem;
    position: relative;
    vertical-align: inherit;
  }
  .component-item-ask-recommand .line3 .line-pole {
    display: inline-block;
    width: 1px;
    height: 11px;
    background: #dcdcdc;
    margin: 0 9.5px;
    position: relative;
    vertical-align: inherit;
  }
  .component-item-ask-recommand .line3 .users {
    position: relative;
    top: -1px;
    vertical-align: inherit;
  }
  .component-item-ask-recommand .line3 .users.users-1 {
    margin-right: 0.133rem;
  }
  .component-item-ask-recommand .line3 .users.users-2 {
    margin-right: 0;
  }
  .component-item-ask-recommand .line3 .users.users-3 {
    margin-right: -0.133rem;
  }
  .component-item-ask-recommand .line3 .users img {
    width: 0.586rem;
    height: 0.586rem;
    border: 0.053rem solid #fff;
    border-radius: 50%;
    vertical-align: inherit;
  }
  .component-item-ask-recommand .line3 .users img:nth-child(2) {
    position: relative;
    left: -0.133rem;
  }
  .component-item-ask-recommand .line3 .users img:nth-child(3) {
    position: relative;
    left: -0.266rem;
  }
  .component-item-ask-recommand .line3 .huida {
    color: #235280;
    font-size: 0.32rem;
    position: relative;
    vertical-align: inherit;
  }

  @keyframes myMove1 {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
  }
  .move1 {
    animation: myMove1 1s ease-in infinite;
    -webkit-animation: myMove1 1s ease-in infinite;
  }
</style>
<style>
  .home.mui-slider-indicator{
    text-align: right;
    padding-right: 4%;
  }
  .home.mui-slider-indicator .mui-indicator{
    width: 0.16rem;
    height: 0.16rem;
    margin: 0.026rem 0.133rem;
    background: rgba(216,216,216,1);
    -webkit-box-shadow: 0 0 0 0 rgba(1216,216,216, .7);
     box-shadow: 0 0 0 0 rgba(216,216,216, .7);
  }
  .home.mui-slider-indicator .mui-active.mui-indicator{
    width: 0.32rem;
    height:0.16rem;
    background:rgba(3,174,249,1);
    border-radius: 1.333rem;
    -webkit-box-shadow: 0 0 0.026rem 0.026rem rgba(3,174,249, .7);
    box-shadow: 0 0 0 0 rgba(3,174,249, .7);
  }
</style>

<!--<form class="mui-input-group search" >-->
  <!--<div class="mui-input-row">-->
    <!--<svg class="icon" aria-hidden="true">-->
      <!--<use xlink:href="#icon-sousuo"></use>-->
    <!--</svg>-->
    <!--<input type="text" class="mui-input-clear" placeholder="搜内容、问答、圈子">-->
  <!--</div>-->
<!--</form>-->
<!--.mui-input-group{-->
<!--width:57%;-->
<!--height:0.906rem;-->
<!--position: absolute;-->
<!--top: 0.213rem;-->
<!--right: 4%;-->
<!--z-index: 2;-->
<!--background: #ffffff;-->
<!--opacity:0.9477;-->
<!--border-radius: 1.333rem ;-->
<!--}-->
<!--.mui-input-group input{-->
<!--width:83%;-->
<!--height:0.906rem;-->
<!--line-height: 0.906rem;-->
<!--padding: 0 0.8rem 0 0;-->
<!--font-size:0.373rem;-->
<!--color:rgba(68,68,68,1);-->
<!--}-->
<!--.mui-input-group svg{-->
<!--font-size: 0.453rem;-->
<!--color:rgba(68,68,68,1);-->
<!--margin-left: 0.426rem;-->
<!--}-->
<!--<style>-->
  <!--.search .mui-input-row .mui-input-clear ~ .mui-icon-clear{-->
    <!--width:0.8rem;-->
    <!--height: 0.8rem;-->
    <!--top: 13%;-->
    <!--text-align: left;-->
  <!--}-->
<!--</style>-->
