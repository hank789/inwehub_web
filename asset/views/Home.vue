<template>
  <div>
    <header class="hidewechattitle mui-bar mui-bar-nav">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-logowenzi"></use>
      </svg>
    </header>

    <div class="mui-content absolute" v-show="!loading">

      <!--首页轮播-->
      <div id="slider" class="mui-slider" v-if="notices.length">
        <div class="mui-slider-group mui-slider-loop">
          <!-- 额外增加的一个节点(循环轮播：第一个节点是最后一张轮播) -->
          <div class="mui-slider-item mui-slider-item-duplicate" v-if="notices[notices.length-1]">
            <a href="#">
              <img :src="notices[notices.length-1].img_url">
            </a>
          </div>

          <div class="mui-slider-item" v-for="(notice, index) in notices">
            <a @tap.stop.prevent="goLink(notice.url)" target="_blank">
              <img :src="notice.img_url">
            </a>
          </div>

          <!-- 额外增加的一个节点(循环轮播：最后一个节点是第一张轮播) -->
          <div class="mui-slider-item mui-slider-item-duplicate" v-if="notices[0]">
            <a href="#">
              <img :src="notices[0].img_url">
            </a>
          </div>
        </div>
        <div class="mui-slider-indicator">
          <div :class="{'mui-indicator':true, 'mui-active':index===0}" v-for="(notice, index) in notices"></div>
        </div>
      </div>
      <!--专业问答 和 成为专家-->
      <div class="home-expert">
        <div @tap.stop.prevent="toAsk()">
          <p>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanyewenda"></use>
            </svg>
            <span>专业问答</span>
            <b>分红</b>
          </p>

        </div>
        <i></i>
        <div @tap.stop.prevent="toApprove(is_expert)">
          <p>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-chengweizhuanjia"></use>
            </svg>
            <span>成为专家</span>
          </p>
        </div>
      </div>

      <!--
          首页的特惠时间； 点击跳入特惠的详情；
      -->
      <div class="freeAskWrapper" v-show="couponExpireAtText && couponExpireAtTime"
           @tap.stop.prevent="$router.pushPlus('/activity/ask?couponExpireAtTime='+couponExpireAtTime)">
        <div class="freeAsk mui-navigate-right">
          <div class="icon"></div>
          <div class="text">你的首问1元特惠还剩

            <div v-html="couponExpireAtText"></div>
          </div>
        </div>
      </div>
      <!--人物推荐-->
      <swiper :options="swiperOption" id="home-recommend">
        <swiper-slide id="home-card" :class="experts.uuid" v-for="(experts, index) in recommend_experts" :key="index"
                      :uuid="experts.uuid">
          <img :src="experts.avatar_url" :class="experts.uuid"/>
          <span>
	      	      	       <i :class="experts.uuid" class="mui-ellipsis">{{ experts.name }}</i>
		      	      	<svg class="icon" aria-hidden="true">
						  <use xlink:href="#icon-zhuanjiabiaoji"></use>
						</svg>
	      	        </span>
          <span class="mui-ellipsis">{{ experts.title ? experts.title : '　' }}</span>
          <span>查看</span>
          <p>
            {{experts.work_years ? experts.work_years : "0"}}年
					</p>
        </swiper-slide>
        <swiper-slide class="moreExperts">
          <div>
						<span class="Expertround">
	                		<svg class="icon" aria-hidden="true">
						  <use xlink:href="#icon-shouyegengduozhuanjia"></use>
						</svg>
						</span>
            <p>查看更多专家</p>
          </div>
        </swiper-slide>
      </swiper>
      <!--活动区-->
      <div class="activity" v-if="isShowActivity">
        <div class="weeklyActivity" @tap.stop.prevent="$router.pushPlus('/home/ActiveList')">
          <img :src="recommend_activity[0].image_url" v-show="recommend_activity[0].image_url"/>
          <p v-if="recommend_activity[0].activity_type =='1'">活动</p>
          <p v-if="recommend_activity[0].activity_type =='2'">机遇</p>
        </div>
        <div class="opportunities">
          <div class="newcomers" @tap.stop.prevent="$router.pushPlus('/home/ActiveList')">
            <img :src="recommend_activity[1].image_url" v-show="recommend_activity[1].image_url"/>
            <p v-if="recommend_activity[1].activity_type =='1'">活动</p>
            <p v-if="recommend_activity[1].activity_type =='2'">机遇</p>
          </div>
          <div class="latestWeekly" @tap.stop.prevent="$router.pushPlus('/home/ActiveList')">
            <img :src="recommend_activity[2].image_url" v-show="recommend_activity[2].image_url"/>
            <p v-if="recommend_activity[2].activity_type =='1'">活动</p>
            <p v-if="recommend_activity[2].activity_type =='2'">机遇</p>
          </div>
        </div>

      </div>
      <!--热门回答  answer_user_avatar_url-->
      <div class="hotAnswer">
        <div class="hotAnswer_t">
          <p>热门问答</p>
          <p @tap.stop.prevent="toAskCommunity">进入社区</p>
          <i class="bot"></i>
        </div>
        <ul class="hotAnswer_b">
          <li v-for="(qa, index) in recommend_qa" @tap.stop.prevent="toMajorDetail(qa.id)">
            <p class="mui-ellipsis-2">{{qa.description}}</p>
            <div class="hotAnswer_d">
              <p>
                <img :src="qa.answer_user_avatar_url"/>
                <svg class="icon" aria-hidden="true" v-if="qa.answer_user_is_expert == '1'">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </p>
              <p class="mui-ellipsis">
                <span>回答者：{{qa.answer_username}}</span>
                <!--<span>{{qa.answer_user_title}}</span>-->
                <!--<span>{{qa.answer_user_company}}</span>-->
              </p>
            </div>
            <i class="bot"></i>
          </li>
        </ul>
      </div>

      <!--向你推荐 -->
      <div class="home-reading">
        <div class="reader-upper">
          <span>向你推荐</span>
          <span @tap.stop.prevent="$router.push('/discover')">更多</span>
          <i class="bot"></i>
        </div>
        <ul>
          <li v-if="recommend_read.length=='0'"></li>
          <li v-for="(reads, index) in recommend_read" @tap.stop.prevent="goArticle(reads)" v-else>
            <img :src="reads.img_url"/>
            <div>
              <p class="mui-ellipsis-2">{{reads.title}}</p>
              <p>
                <span class="home-time">{{reads.publish_at}}</span>
                <span class="home-laud">
				  	  	   	  		<svg class="icon" aria-hidden="true">
									  <use xlink:href="#icon-dianzan1"></use>
									</svg>
									 <i>{{reads.upvotes}}</i>
  	  	   	  	                 </span>
              </p>
            </div>
            <i class="bot"></i>
          </li>

        </ul>
      </div>

      <div class="home-bot">
        你已经到达我的底线

      </div>

    </div>

    <div id="freeAskTemplate" style="display: none;">
      <div class="freeAskGet"></div>
      <div class="freeAskGetButton" @tap.stop.prevent="getFreeAsk()"></div>
    </div>

    <div id="freeAskSuccessTemplate" style="display: none;">
      <div class="xiaoha"></div>
      <div class="success"></div>
      <div class="close" @tap.stop.prevent="closeFreeAskSuccessTemplate()">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-times1"></use>
        </svg>
      </div>
    </div>

    <div id="statusBarStyle" background="#f3f4f6" bgColor="#f3f4f6" mode="dark"></div>
  </div>

</template>
<script>
  import {postRequest, apiRequest} from '../utils/request'
  import {TimeEndText} from '../utils/time'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import {setStatusBarBackgroundAndStyle} from '../utils/statusBar'
  import {queryParent} from '../utils/dom'
  import userAbility from '../utils/userAbility'
  import userAbilityCheck from '../utils/userAbilityCheck'

  const Home = {
    data: () => ({
      is_expert: '',
      recommend_read: '',
      recommend_experts: [],
      recommend_qa: [],
      isShowActivity: false,
      recommend_activity: [{
        image_url: ''
      },
      {
        image_url: ''
      },
      {
        image_url: ''
      }
      ],
      firstAsk: false,
      couponExpireAtTime: '',
      notices: [],
      currentTime: parseInt((new Date()).getTime() / 1000),
      loading: true,
      timeAutoEndTimeOut: false,
      swiperOption: {},
      isWeixin: false,
      isH5: false
    }),
    created () {
      this.swiperOption = {
        pagination: '.swiper-pagination',
        slidesPerView: 3,
        spaceBetween: 10,
        onTap: this.swipperClick
      }
    },
    components: {
      swiper,
      swiperSlide
    },
    // 缓存；
    activated: function () {
      this.getData()
    },
    mounted () {
      // showInwehubWebview();
      if (!window.mui.os.plus) {
        if (window.mui.os.wechat) {
          this.isWeixin = true
        } else {
          this.isH5 = true
        }
      }
    },
    computed: {
      // 首页倒计时；
      couponExpireAtText () {
        if (this.couponExpireAtTime) {
          return TimeEndText(this.currentTime, this.couponExpireAtTime)
        }
      }
    },
    methods: {
      // 详情；
      toMajorDetail (id) {
        userAbility.jumpToAskCommunityDetail(this, id)
      },
      // 进入社区；
      toAskCommunity () {
        userAbility.jumpToAskCommunity(this)
      },
      swipperClick (swiper, event) {
        var parent = queryParent(event.target, 'swiper-slide')
        if (!parent) return
        var uuid = parent.getAttribute('uuid')
        if (uuid) {
          this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1')
        } else {
          userAbilityCheck.moreProfessor(this)
        }
      },
      detail (url) {
        this.goLink(url)
      },
      // 认证专家跳转判断；
      toApprove (expertStatus) {
        userAbility.jumpToApplyProfessor(this)
      },
      toAsk () {
        userAbility.jumpToAddAsk(this)
      },
      goArticle: function (article) {
        var url = article.view_url
        var id = article.id
        var title = article.title
        var pathUrl = article.comment_url
        var imgUrl = article.img_url

        if (/http/.test(url)) {
          if (window.mui.os.plus) {
            if (window.mixpanel.track) {
              window.mixpanel.track(
                'inwehub:read_page_detail', {
                  'app': 'inwehub',
                  'user_device': window.getUserAppDevice(),
                  'page': url,
                  'page_title': title
                }
              )
            }
            if (window.ga) {
              window.ga('set', 'page', url)
              window.ga('send', 'pageview')
            }
            var articleParams = {
              article_id: id,
              article_url: url,
              article_title: title,
              article_comment_url: pathUrl,
              article_img_url: imgUrl,
              preload: true
            }
            var articleWs = window.mui.openWindow({
              url: '/public/index.html#/webview/article',
              id: 'inwehub_article_view',
              preload: false, // 一定要为false
              createNew: false,
              show: {
                autoShow: true,
                aniShow: 'pop-in'
              },
              styles: {
                popGesture: 'hide'
              },
              waiting: {
                autoShow: false
              },
              extras: articleParams
            })
            window.mui.fire(articleWs, 'load_article', articleParams)
          } else {
            //            var pathUrl = process.env.READHUB_URL + pathUrl + '/webview';

            url = '/discover?redirect_url=' + pathUrl + '?' + encodeURIComponent('from=h5')
            this.$router.push(url)
            //            window.location.href = url;
          }
        } else {
          this.$router.pushPlus(url)
        }
      },
      goLink: function (url) {
        if (/http/.test(url)) {
          if (window.mui.os.plus) {
            if (window.mixpanel.track) {
              window.mixpanel.track(
                'inwehub:notice_detail', {
                  'app': 'inwehub',
                  'user_device': window.getUserAppDevice(),
                  'page': url,
                  'page_title': '首页轮播文章'
                }
              )
            }
            var noticeWs = window.mui.openWindow({
              url: '/public/index.html#/webview/notice',
              id: 'inwehub_notice_view',
              preload: false, // 一定要为false
              createNew: false,
              show: {
                autoShow: true,
                aniShow: 'pop-in'
              },
              styles: {
                popGesture: 'hide'
              },
              waiting: {
                autoShow: false
              },
              extras: {
                preload: true,
                article_url: url
              }
            })
            window.mui.fire(noticeWs, 'load_article', {article_url: url})
          } else {
            window.location.href = url
          }
        } else {
          this.$router.pushPlus(url)
        }
      },
      closeFreeAskSuccessTemplate: function () {
        var FreeTemplate = document.getElementById('freeAskSuccessTemplate')
        FreeTemplate.style.display = 'none'

        if (window.mui('.mui-backdrop')[0]) {
          document.body.removeChild(window.mui('.mui-backdrop')[0])
        }
      },
      closeFreeAskTemplate: function () {
        var FreeTemplate = document.getElementById('freeAskTemplate')
        FreeTemplate.style.display = 'none'

        if (window.mui('.mui-backdrop')[0]) {
          document.body.removeChild(window.mui('.mui-backdrop')[0])
        }
      },
      getFreeAsk: function () {
        postRequest(`activity/getCoupon`, {
          'coupon_type': 1
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.getData()
          this.showFreeAskGetSuccess()
        })
      },
      showFreeAskGet: function () {
        var FreeTemplate = document.getElementById('freeAskTemplate')
        FreeTemplate.style.display = 'block'
        var mask = window.mui.createMask(() => {
          FreeTemplate.style.display = 'none'
          setStatusBarBackgroundAndStyle('#f3f4f6', 'dark')
        })
        setStatusBarBackgroundAndStyle('#A8A9AB', 'light')
        mask.show() // 显示遮罩
      },
      showFreeAskGetSuccess: function () {
        this.closeFreeAskTemplate()

        var FreeTemplate = document.getElementById('freeAskSuccessTemplate')
        FreeTemplate.style.display = 'block'
        var mask = window.mui.createMask(() => {
          FreeTemplate.style.display = 'none'
          setStatusBarBackgroundAndStyle('#f3f4f6', 'dark')
        })
        mask.show() // 显示遮罩
      },
      // 对时间的处理；
      timeAutoEnd: function () {
        if (this.timeAutoEndTimeOut) {
          clearTimeout(this.timeAutoEndTimeOut)
        }
        this.timeAutoEndTimeOut = setTimeout(() => {
          this.currentTime = parseInt((new Date()).getTime() / 1000)
          this.timeAutoEnd()
        }, 1000)
      },
      // 请求的数据；
      getData: function () {
        var t = this
        apiRequest(`home`, {}, false).then(responseData => {
          if (responseData === false) {
            return
          }

          // 推荐专家

          t.recommend_experts = responseData.recommend_experts

          this.isShowActivity = !!responseData.recommend_activity.length

          // 首页推荐活动
          for (var i in responseData.recommend_activity) {
            t.recommend_activity[i] = responseData.recommend_activity[i]
          }

          // 推荐阅读；
          t.recommend_read = responseData.recommend_read
          // 返回是否显示首次提问免费的福利；
          t.firstAsk = responseData.first_ask_ac.show_first_ask_coupon
          // 是否是专家；
          t.is_expert = responseData.expert_apply_status
          // 热门回答；
          t.recommend_qa = responseData.recommend_qa

          // 预加载第一篇文章
          if (window.mui.os.plus && t.recommend_read.length > 0) {
            var articleParams = {
              article_id: t.recommend_read[0].id,
              article_url: t.recommend_read[0].view_url,
              article_title: t.recommend_read[0].title,
              article_comment_url: t.recommend_read[0].comment_url,
              article_img_url: t.recommend_read[0].img_url,
              preload: true,
              custom_preload: true
            }
            window.mui.preload({
              url: '/public/index.html#/webview/article',
              id: 'inwehub_article_view',
              styles: {
                popGesture: 'hide'
              },
              extras: articleParams
            })
          }

          // 返回的时间；
          var couponExpireAt = responseData.first_ask_ac.coupon_expire_at
          if (couponExpireAt) {
            t.couponExpireAtTime = Date.parse(couponExpireAt.replace(/-/g, '/')) / 1000
            t.timeAutoEnd()
          } else {
            t.couponExpireAtTime = null
          }

          // 轮播图；
          t.notices = responseData.notices

          t.loading = 0
          if (t.firstAsk) {
            t.showFreeAskGet()
          }

          // 新手任务
          userAbility.newbieTask(this)

          if (t.notices.length) {
            setTimeout(function () {
              var slider = window.mui('#slider')
              slider.slider({
                interval: 5000
              })
            }, 100)
          }
        })
      }
    }
  }
  export default Home
</script>

<style lang="less" scoped>
  /*2.0版本css样式*/

  .mui-content {
    overflow-y: auto;
  }

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
    height: 0.1rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  /*头部样式*/

  header {
    width: 100%;
    height: 4.4rem;
    background: #f3f4f6;
    text-align: center;
  }

  header svg {
    font-size: 8rem;
    color: #3c3e44;
    margin-top: -1.3rem;
  }

  /*轮播样式*/

  #slider img {
    height: 13.6rem;
    width: 100%;
  }

  /*专业问答 和 成为专家 */

  .home-expert {
    width: 100%;
    height: 4.4rem;
    margin-bottom: 1rem;
    background: #FFFFFF;
    position: relative;
  }

  .home-expert i {
    display: block;
    float: left;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 0.1rem;
    height: 2rem;
    background: #DCDCDC;
  }

  .home-expert div {
    width: 49%;
    height: 4.4rem;
    line-height: 4.4rem;
    position: relative;
  }

  .home-expert div:nth-of-type(1) {
    float: left;
  }

  .home-expert div:nth-of-type(2) {
    float: right;
  }

  .home-expert div p {
    /*width:65%;*/
    height: 2.5rem;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    line-height: 2.5rem;
  }

  .home-expert div p svg {
    display: block;
    float: left;
    font-size: 2.5rem;
    margin-bottom: -0.4rem;
  }

  .home-expert div p span {
    display: block;
    float: left;
    font-size: 1.4rem;
    color: #444444;
    margin-left: 0.3rem;
  }

  .home-expert div p b {
    display: block;
    float: left;
    width: 3rem;
    padding: 0 0.2rem;
    height: 1.8rem;
    background: #F8C732;
    text-align: center;
    font-size: 1.2rem;
    color: #FFFFFF;
    line-height: 1.8rem;
    border-radius: 0.5rem;
    position: relative;
    z-index: 5;
    top: 0.35rem;
    left: 0.5rem;
  }

  .home-expert div p b::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border: 0.6rem solid transparent;
    border-right: 0.6rem solid #F8C732;
    border-bottom: 0.6rem solid #F8C732;
    position: absolute;
    transform: rotate(135deg);
    left: -0.1rem;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: -1;
  }

  /*一元特惠*/

  .freeAskWrapper {
    position: relative;
    height: 4.8rem;
    margin-top: 1.2rem;
  }

  .freeAsk {
    position: absolute;
    left: 1.5rem;
    right: 1.5rem;
  }

  .freeAsk .icon {
    position: absolute;
    width: 3.5rem;
    left: -0.8rem;
    top: -0.5rem;
    height: 4.8rem;
    display: inline-block;
    background-image: url("../statics/images/icon_xiaoha@2x.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  .freeAsk .text {
    background: #dcdcdc;
    border: 0.1rem #dcdcdc solid;
    border-radius: 5rem;
    font-size: 1.4rem;
    line-height: 1.4rem;
    color: #323232;
    padding: 1.3rem 0rem 1.3rem 3.5rem;
  }

  .freeAsk .text div {
    display: inline-block;
  }

  .freeAskGet {
    position: fixed;
    top: 50%;
    margin-top: -18.1rem;
    left: 1rem;
    right: 1rem;
    background: url("../statics/images/freeAskGet@2x.png") no-repeat center;
    background-size: contain;
    height: 26.2rem;
    z-index: 999;
  }

  .freeAskGetButton {
    position: fixed;
    top: 50%;
    margin: -7rem 0 0 -10rem;
    left: 50%;
    width: 15rem;
    height: 7rem;
    z-index: 1000;
  }

  #freeAskSuccessTemplate .xiaoha {
    position: fixed;
    top: 50%;
    left: 50%;
    margin: -19.5rem 0 0 -5rem;
    background: url("../statics/images/xiaoha-welcome@2x.png") no-repeat center;
    background-size: contain;
    width: 10rem;
    height: 15rem;
    z-index: 999;
  }

  #freeAskSuccessTemplate .success {
    position: fixed;
    top: 50%;
    left: 50%;
    margin: -4.5rem 0 0 -14.6rem;
    background: url("../statics/images/getSuccess@2x.png") no-repeat center;
    background-size: contain;
    width: 29.2rem;
    height: 9.1rem;
    z-index: 999;
  }

  #freeAskSuccessTemplate .close {
    position: fixed;
    top: 50%;
    left: 50%;
    margin: 9.4rem 0 0 -1.9rem;
    z-index: 999;
  }

  #freeAskSuccessTemplate .close .icon {
    font-size: 3.8rem;
    color: #b4b4b6;
  }

  /*人物推荐*/

  #home-recommend {
    width: 100%;
    height: 17rem;
    background: #FFFFFF;
    margin-top: 0.5rem;
  }

  #home-recommend div:nth-of-type(1) {
    margin-left: 0rem;
  }

  #home-card {
    width: 11.4rem;
    height: 14.8rem;
    background: #ececee;
    margin-top: 1.1rem;
    padding-top: 1rem;
    position: relative;
    border-radius: 0.4rem;
  }

  #home-card img {
    width: 5rem;
    height: 5rem;
    display: block;
    border-radius: 50%;
    margin: 0 auto;
  }

  #home-card span {
    display: block;
    text-align: center;
    font-size: 1.2rem;
    padding: 0 0.4rem;
  }

  #home-card span:nth-of-type(1) i {
    display: inline-block;
    max-width: 7rem;
    height: 2rem;
    font-style: normal;
  }

  #home-card span:nth-of-type(1) {
    width: 100%;
    text-align: center;
    font-size: 1.4rem;
    font-weight: 600;
    color: #444444;
    margin-top: 0.2rem;
  }

  #home-card span:nth-of-type(1) svg {
    font-size: 2rem;
    color: #03aef9;
    margin-bottom: 0.25rem;
    margin-left: -0.3rem;
  }

  .home-card span:nth-of-type(2) {
    display: inline-block;
    width: 100%;
    color: #444444;
  }

  #home-card span:nth-of-type(3) {
    width: 70%;
    height: 2.4rem;
    border-radius: 5rem;
    border: 0.05rem solid #03aef9;
    margin-left: 15%;
    margin-top: 0.6rem;
    font-family: "PingFangSC";
    font-size: 1.4rem;
    text-align: center;
    color: #03aef9;
  }

  #home-card p {
    position: absolute;
    top: 0rem;
    right: 0rem;
    width: 2.8rem;
    text-align: center;
    background: url("../statics/images/fill_1@2x.png") no-repeat;
    background-size: 100% 100%;
    font-size: 1.2rem;
    color: #ffffff;
  }

  /*查看更多专家样式*/

  .moreExperts {
    width: 11.83rem;
    margin-right: 1rem;
    margin-top: 1.1rem;
    height: 14.8rem;
    background: #ececee;
    border-radius: 0.4rem;
    position: relative;
  }

  .moreExperts > div {
    width: 80%;
    height: 60%;
    position: absolute;
    top: 20%;
    left: 10%;
    /*background: #CCCCCC;*/
  }

  .moreExperts > div > span {
    display: inline-block;
    border: 0.1rem solid #b4b4b6;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    margin-left: 25%;
    position: relative;
  }

  .moreExperts > div svg {
    font-size: 3rem;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
    color: #b4b4b6;
  }

  .moreExperts > div p {
    text-align: center;
    color: #444444;
    font-size: 1.2rem;
    margin-top: 0.2rem;
  }

  /*活动*/
  .activity {
    width: 100%;
    /*height: 15.7rem;*/
    padding: 1.1rem 4%;
    background: #ececee;
  }

  .weeklyActivity {
    width: 60%;
    height: 100%;
    background: #C8C7CC;
    float: left;
    position: relative;
    border-radius: 0.4rem;
    overflow: hidden;
  }

  .weeklyActivity > img {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .weeklyActivity > p {
    width: 3.7rem;
    height: 1.8rem;
    background: #444444;
    opacity: 0.7;
    text-align: center;
    line-height: 1.8rem;
    color: #FFFFFF;
    border-radius: 0 5rem 5rem 0;
    font-size: 1.2rem;
    margin-top: 1.4rem;
  }

  .opportunities {
    width: 37%;
    height: 100%;
    /*background: #03AEF9;*/
    margin-left: 3%;
    float: left;
  }

  .newcomers {
    width: 100%;
    height: 46.5%;
    background: #009FE8;
    float: left;
    position: relative;
    border-radius: 0.4rem;
  }

  .latestWeekly {
    width: 100%;
    height: 46.5%;
    margin-top: 7.1%;
    background: #C8C8C8;
    float: left;
    position: relative;
    border-radius: 0.4rem;
  }

  .newcomers > p,
  .latestWeekly > p {
    width: 3.7rem;
    height: 1.8rem;
    background: #444444;
    opacity: 0.7;
    text-align: center;
    line-height: 1.8rem;
    color: #FFFFFF;
    border-radius: 0 5rem 5rem 0;
    font-size: 1.2rem;
    margin-top: 1.2rem;
  }

  .newcomers > img,
  .latestWeekly > img {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 0.4rem;
  }

  /*热门回答*/

  .hotAnswer {
    width: 100%;
    /* height: 24.4rem;*/
    overflow: hidden;
    margin-bottom: 1rem;
    background: #FFFFFF;
  }

  .hotAnswer_t {
    width: 90%;
    margin-left: 5%;
    height: 4.4rem;
    position: relative;
  }

  .hotAnswer_t p:nth-of-type(1) {
    float: left;

    line-height: 4.4rem;
    font-size: 1.6rem;
    color: #444444;
  }

  .hotAnswer_t p:nth-of-type(2) {
    float: right;

    line-height: 4.4rem;
    font-size: 1.4rem;
    color: #03aef9;
  }

  .hotAnswer_b {
    width: 90%;
    margin-left: 5%;
    /*height: 20rem;*/
    overflow: hidden;
  }

  .hotAnswer_b li {
    width: 100%;
    overflow: hidden;
    padding: 1.2rem 0;
    position: relative;
  }

  .hotAnswer_b li > p {
    font-size: 1.4rem;
    color: #444444;
  }

  .hotAnswer_d {
    width: 100%;
    height: 3.2rem;
    margin-top: 0.45rem;
  }

  .hotAnswer_d p {
    float: left;
  }

  .hotAnswer_d p:nth-child(1) {
    width: 3.2rem;
    height: 3.2rem;
    /*background: #CCCCCC;*/
    position: relative;
  }

  .hotAnswer_d p:nth-child(1) > svg {
    position: absolute;
    font-size: 1.4rem;
    bottom: 0;
    right: -0.4rem;
  }

  .hotAnswer_d p:nth-child(1) > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .hotAnswer_d p:nth-child(2) {
    /*width: 34rem;*/
    height: 1.8rem;
    margin-top: 0.9rem;
    line-height: 1.8rem;
    /*background: #CCCCCC;*/
  }

  .hotAnswer_d p:nth-child(2) span:nth-child(1) {
    height: 1.5rem;
    margin-top: 0.85rem;
    font-size: 1.3rem;
    color: #808080;
    text-align: center;
    line-height: 1.5rem;
    padding: 0 3%;
  }

  .hotAnswer_d p:nth-child(2) span:nth-child(2) {
    height: 1.5rem;
    margin-top: 0.85rem;
    font-size: 1.3rem;
    color: #808080;
    border-right: 0.1rem solid #c8c8c8;
    text-align: center;
    line-height: 1.5rem;
    padding: 0 3%;
  }

  .hotAnswer_d p:nth-child(2) span:nth-child(3) {
    height: 1.5rem;
    margin-top: 0.85rem;
    font-size: 1.3rem;
    color: #808080;
    text-align: center;
    line-height: 1.5rem;
    padding: 0 3%;
  }

  /*向你推荐*/

  .home-reading {
    width: 100%;
    background: #FFFFFF;
  }

  .reader-upper {
    width: 90%;
    height: 5rem;
    margin-left: 5%;
    position: relative;
  }

  .reader-upper span:nth-of-type(1) {
    float: left;
    line-height: 5rem;
    font-size: 1.6rem;
    color: #444444;
  }

  .reader-upper span:nth-of-type(2) {
    float: right;
    line-height: 5rem;
    font-size: 1.3rem;
    color: #03aef9;
  }

  .home-reading ul {
    width: 100%;
  }

  .home-reading ul li {
    width: 90%;
    height: 12.5rem;
    margin-left: 5%;
    position: relative;
  }

  .home-reading ul li:last-child {
    .bot {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0rem;
      height: 0rem;
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: rgb(220, 220, 220);
    }
  }

  .home-reading ul li img {
    width: 35%;
    height: 8rem;
    float: left;
    margin-top: 2.1rem;
    border-radius: 0.4rem;
  }

  .home-reading ul li div {
    float: left;
    width: 63%;
    margin-left: 2%;
    margin-top: 2.1rem;
  }

  .home-reading ul li div p:nth-of-type(1) {
    height: 4.2rem;
    font-size: 1.4rem;
    color: #444444;
  }

  .home-reading ul li div p:nth-of-type(2) {
    font-size: 1.2rem;
    color: #808080;
    margin-top: 2rem;
  }

  .home-time {
    float: left;
    font-size: 1.2rem;
    color: #b4b4b6;
  }

  .home-laud {
    float: right;
  }

  .home-laud > svg {
    font-size: 1.7rem;
    color: #b4b4b6;
    margin-bottom: 0.15rem;
  }

  .home-laud > i {
    font-size: 2rem;
    font-size: 1.3rem;
    color: #b4b4b6;
    font-style: normal;
  }

  .home-bot {
    width: 100%;
    height: 14rem;
    background: #FFFFFF;
    font-size: 1.4rem;
    text-align: center;
    color: #c8c8c8;
  }

  .mui-slider-indicator .mui-active.mui-indicator {
    background: #03aef9;
  }

  .mui-slider-indicator .mui-indicator {
    display: inline-block;
    width: 0.6rem;
    height: 0.6rem;
    margin: 0.1rem 0.6rem;
    cursor: pointer;
    border-radius: 50%;
    background: #d8d8d8;
    -webkit-box-shadow: 0 0 0rem 0rem rgba(216, 216, 216, 1);
    box-shadow: 0 0 0rem 0rem rgba(216, 216, 216, 1);
  }

  /***媒体查询*****/
  /***媒体查询*****/

  @media screen and (min-width: 320px) {
    .activity {
      height: 13.3rem;
    }

    .home-expert div p {
      width: 74%;
    }

    .hotAnswer_d p:nth-child(2) {
      width: 25.6rem;
    }

  }

  @media screen and (min-width: 375px) {
    .activity {
      height: 15.7rem;
    }

    .home-expert div p {
      width: 65%;
    }

    .hotAnswer_d p:nth-child(2) {
      width: 30.5rem;
    }
  }

  @media screen and (min-width: 414px) {
    .activity {
      height: 17.2rem;
    }

    .home-expert div p {
      width: 60%;
    }

    .hotAnswer_d p:nth-child(2) {
      width: 34rem;
    }

  }
</style>
