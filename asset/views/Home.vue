<template>
  <div>

    <div class="search mui-bar-nav">
      <div class="search-l" @tap.stop.prevent="$router.pushPlus('/chat/' + contact_id)">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-kefu"></use>
        </svg>
        <p>客服</p>
        <i v-if="unread_count"></i>
      </div>
      <div class="search-r" @tap.stop.prevent="$router.pushPlus('/searchQuestion','list-detail-page-three')">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-sousuo"></use>
        </svg>
        <p>搜内容、问答、圈子</p>
      </div>
    </div>

    <div class="mui-content absolute">
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
      <div class="gray"></div>
      <!--精选推荐-->
      <div class="title font-family-medium">精选推荐</div>
      <ul class="recommend">
        <template v-for="(item, index) in list">
          <li  @tap.stop.prevent="goDetial(item.read_type,item)">
            <div class="logo">
              <img :src="item.data.img" />
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
        <div class="more"  @tap.stop.prevent="$router.pushPlus('/recommends')">更多精选推荐</div>
      </ul>
      <!---->
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
  const Home = {
    data () {
      return {
        list: [],
        notices: [],
        contact_id: '',
        unread_count: 0
      }
    },
    created () {
      this.refreshPageData()
    },
    components: {},
    activated: function () {
      this.refreshPageData()
    },
    computed: {
    },
    methods: {
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
        postRequest(`recommendRead`, {}, false).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.list = response.data.data.data.slice(0, 5)
        })
      },
      getHomeData () {
        postRequest(`home`, {}, false).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.notices = response.data.data.notices
          // 是否弹受邀红包
          if (response.data.data.invitation_coupon.show) {
            userAbility.InvitationCoupon(this)
          }
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
  .mui-wechat  .search{
    top: 1.306rem;
  }
  .search{
    width: 100%;
    height: 1.386rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    z-index: 2;
    background: #ffffff;
    padding: 0 0.426rem;
  }
  .search-l{
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .search-l svg{
    font-size:0.666rem;
    color: rgba(200,200,200,1);
  }
  .search-l p{
    font-size:0.266rem;
    color: rgba(128,128,128,1);
    line-height: 0.373rem;
    margin-bottom: 0.133rem;
  }
  .search-l i{
    width:0.213rem;
    height:0.213rem;
    background: #FA4975;
    border-radius: 50%;
    position: absolute;
    top: 0.16rem;
    right: -0.266rem;
  }

  .search-r{
    width: 77%;
    height: 0.906rem;
    background:rgba(243,244,246,1);
    opacity:0.9477;
    border-radius: 1.333rem;
    font-size: 0.373rem;
    color:rgba(128,128,128,1);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .search-r svg{
    font-size: 0.453rem;
    color: rgba(68,68,68,1);
    margin-left: 0.426rem;
    margin-right: 0.16rem;
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
    height: 18.133rem;
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
