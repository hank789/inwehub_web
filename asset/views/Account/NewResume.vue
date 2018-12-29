<!--suppress ALL -->
<template>
  <div class="resume">

    <div class="mui-content">

      <header class="mui-bar mui-bar-nav content-header-hide headersWrapperTop">
        <Back></Back>
        <h1 class="mui-title">个人名片</h1>
        <div class="openNotice share">
          <svg class="icon" aria-hidden="true"  @tap.stop.prevent="share">
            <use xlink:href="#icon-shoucang-xiao"></use>
          </svg>
        </div>
      </header>

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'feed/list'"
        :prevOtherData="prevOtherData"
        :nextOtherData="nextOtherData"
        :pageMode = "true"
        :isShowUpToRefreshDescription="true"
        :autoShowEmpty="false"
        @prevSuccessCallback="prevSuccessCallback"
        :emptyDescription="emptyDescription"
        class="listWrapper"
      >

        <div class="infoBg">
          <img :src="resume.info.avatar_url" class="avatar"/>
          <div class="backMask"></div>
        </div>
        <div class="muiContent">
        <div class="header-wrapper">
          <div class="headers">
            <!--<img :src="resume.info.avatar_url" class="avatar"/>-->
            <!--<div class="backMask"></div>-->
            <div class="headerBack">
              <div @tap.stop.prevent="goBack">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-fanhui"></use>
                </svg>
              </div>
            </div>
            <div class="title font-family-medium">个人名片</div>
            <div class="openNotice share" @tap.stop.prevent="share">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shoucang-xiao"></use>
              </svg>
            </div>

            <div class="headPhotowrapper">
              <div class="headImages">
                <img :src="resume.info.avatar_url" class="avatar"/>
              </div>
              <div class="personalInfo">
                <div class="nameAndLevel">
                  <span class="name font-family-medium">{{ resume.info.name }}</span>
                  <span class="level">L{{resume.info.user_level}}</span>
                </div>
                <div class="detailInfo">
                  <span class="text">被赞</span><span class="number font-family-medium">{{resume.info.supports}}</span> <i></i> <span class="text">{{resume.info.total_score}}</span>
                </div>
                <div class="consultWrapper">
                  <div class="leftButton">
                    <div class="border-football font-family-medium" v-show="uuid == cuuid" @tap.stop.prevent="$router.pushPlus('/my/detailInfo/' + resume.info.uuid)">详细资料</div>
                    <div class="border-football font-family-medium letter" v-if="uuid !== cuuid" @tap.stop.prevent="goChat()">发私信</div>
                    <div class="border-football font-family-medium" v-if="uuid !== cuuid" @tap.stop.prevent="goAsk('/ask/'+uuid)">提问题</div>
                  </div>
                  <div class="rightDetailInfo" v-if="uuid !== cuuid">
                    <span class="font-family-medium" @tap.stop.prevent="$router.pushPlus('/my/detailInfo/' + resume.info.uuid)">详细资料</span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-jinru"></use>
                    </svg>
                  </div>
                </div>
                <div class="operationWrapper">
                  <div class="code iconAndText" @tap.stop.prevent="$router.pushPlus('/my/qrcode?id=' + resume.info.uuid)">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-erweima"></use>
                    </svg>
                    <div class="word">个人码</div>
                  </div>
                  <div class="iconAndText" v-show="uuid !== cuuid && !resume.is_followed" @tap.stop.prevent="collectProfessor">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-shoucang"></use>
                    </svg>
                    <div class="word">关注</div>
                  </div>
                  <div class="active iconAndText" @tap.stop.prevent="collectProfessor"
                       v-show="uuid !== cuuid && resume.is_followed">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-shoucanghover"></use>
                    </svg>
                    <div class="word">已关注</div>
                  </div>
                </div>
              </div>

              <div class="counter">
                <div class="counterList" @tap.stop.prevent="$router.pushPlus('/my/focus/'+uuid)">
                  <span class="font-family-medium">{{resume.info.followed_number}}</span>
                  <span class="script">谁关注Ta</span>
                </div>

                <div class="counterList" @tap.stop.prevent="$router.pushPlus('/followed/'+uuid)">
                  <span class="font-family-medium">{{resume.info.follow_user_number}}</span>
                  <span class="script">Ta关注谁</span>
                </div>

                <div class="counterList" @tap.stop.prevent="$router.pushPlus('/my/publishAnswers/'+uuid)">
                  <span class="font-family-medium">{{resume.info.publishes}}</span>
                  <span class="script">发布</span>
                </div>

                <div class="counterList" @tap.stop.prevent="$router.pushPlus('/group/my/'+uuid)">
                  <span class="font-family-medium">{{resume.info.group_number}}</span>
                  <span class="script">圈子</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="domainWrapper" v-if="resume.info.skill_tags.length > 0 || uuid === cuuid">
          <div class="skilledTags">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shanchang"></use>
            </svg>
            <span>擅长领域</span>
          </div>
          <template v-for="(industry, index) in resume.info.skill_tags">
            <div class="tags" @tap.stop.prevent="toTagDetail(industry.text)"><span>{{industry.text}}</span></div>
          </template>
          <div class="addTags" v-show="uuid == cuuid" @tap.stop.prevent="$router.pushPlus('/my/advantage')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-plus--"></use>
            </svg>{{ resume.info.skill_tags.length < 1 ? '添加专业形象，对接更多机遇':'添加' }}
          </div>
          <div class="bot"></div>
        </div>

        <div class="specialColumn" v-if="resume.info.skill_tags.length > 0 || uuid === cuuid" @tap.stop.prevent="$router.pushPlus('/article/list/' + resume.info.uuid )">
          <div class="titleText">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanlan"></use>
            </svg>
            <span>文章专栏</span>
          </div>
          <div class="iconFont">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jinru"></use>
            </svg>
          </div>
        </div>

        <div class="gray"></div>

        <div class="description">

          <template v-for="(item, index) in list">


            <FeedItem
              :item="item"
              @showItemMore="showItemOptions"
            ></FeedItem>

          </template>

          <div class="noDynamic goAddpage" v-show="uuid !== cuuid && !list.length">
            <div class="empty-IconImg">
              <img src="../../statics/images/empty@3x.png" alt="">
            </div>
            <span>Ta还没有发布分享哦~</span>
          </div>

          <div class="noDynamic goAddpage" v-show="uuid === cuuid">
            <div class="empty-IconImg">
              <img src="../../statics/images/empty@3x.png" alt="">
            </div>
            <span>{{ list.length ? '暂无更多，继续发布你的分享吧~' : '快来创建你的第一条分享吧~' }}</span>
            <div class="releaseButton" @tap.stop.prevent="$router.pushPlus('/discover/add')">
              <button>发分享</button>
            </div>
          </div>
        </div>

        </div>

      </RefreshList>

    </div>

    <Share
      :title="shareOptions.title"
      :shareName="shareOptions.shareName"
      :link="shareUrl"
      :hideShareBtn="true"
      :content="shareOptions.content"
      :imageUrl="shareOptions.imageUrl"
      :thumbUrl="shareOptions.thumbUrl"
      :targetId="uuid"
      :targetType="'resume'"
     ref="shareComponent"
    ></Share>

    <PageMore
      ref="share"
      :shareOption="shareItemOption"
      :hideShareBtn="true"
      :iconMenu="iconMenus"
      @success="shareSuccess"
      @fail="shareFail"
      @clickedItem="iconMenusClickedItem"
    ></PageMore>

  </div>

</template>

<script>
  import groups from '../../components/groups/RecommendGroups.vue'
  import { postRequest } from '../../utils/request'
  import Share from '../../components/Share.vue'
  import { getLocalUserInfo } from '../../utils/user'
  import userAbility from '../../utils/userAbility'
  import { getResumeDetail } from '../../utils/shareTemplate'
  import { isLogined } from '../../utils/auth'
  import RefreshList from '../../components/refresh/MescrollList.vue'
  import { textToLinkHtml, secureHtml, transferTagToLink } from '../../utils/dom'
  import FeedItem from '../../components/Feed.vue'
  import PageMore from '../../components/PageMore.vue'
  import { getIconMenus, iconMenusClickedItem } from '../../utils/feed'

  export default {
    data: () => ({
      isLogined: isLogined(),
      apper: 1,
      iconMenus: [],
      shareOptions: {
        shareName: '',
        title: '',
        content: '',
        imageUrl: '',
        thumbUrl: ''
      },
      shareItemOption: {},
      itemOptionsObj: {},
      im_tokenMsg: '',
      percent: 0,
      uuid: '',
      cuuid: '',
      showQrCode: false,
      isShare: false,
      canBack: false,
      loading: 1,
      shareUrl: '',
      wechatConfig: {},
      downloadHeader: false,
      isShowProjectMore: false,
      isShowItemJobMore: false,
      isShowitemEduMore: false,
      resume: {
        groups: [],
        info: {
          uuid: '',
          name: '',
          avatar_url: '',
          feed_count: '',
          article_count: '',
          article_comment_count: '',
          article_upvote_count: '',
          industry_tags: [],
          skill_tags: [],
          province: {
            key: '',
            name: ''
          },
          city: {
            key: '',
            name: ''
          }
        },
        edus: [],
        projects: [],
        jobs: []

      },
      qRCodeOptions: {
        size: 100,
        padding: 0,
        level: 'H'
      },
      list: [],
      search_type: 5, // 1:关注,2:全部,3:问答,4:分享,5:他的动态,6:推荐,默认2
      emptyDescription: '暂无内容',
      user_uuid: ''
    }),
    components: {
      Share,
      groups,
      RefreshList,
      FeedItem,
      PageMore
    },
    watch: {
      '$route' (to, from) {
        this.getData()
      }
    },
    created () {
      this.getData()
    },
    beforeRouteEnter (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
      next(vm => {
        // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
        vm.$refs.RefreshList && vm.$refs.RefreshList.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
        if (window.mui.os.plus) {
          document.querySelector('.mui-content').classList.add('mui-content-top-0')
          document.querySelector('#immersedWrapper').classList.add('immersedWrapperNone')
        }
        vm.$refs.RefreshList && vm.$refs.RefreshList.beforeRouteEnter()
      })
    },
    beforeRouteLeave (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
      this.$refs.RefreshList && this.$refs.RefreshList.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
      if (window.mui.os.plus) {
        document.querySelector('.mui-content').classList.remove('mui-content-top-0')
        document.querySelector('#immersedWrapper').classList.remove('immersedWrapperNone')
      }
      this.$refs.RefreshList && this.$refs.RefreshList.beforeRouteLeave()
      next()
    },
    mounted () {
      for (var i = 16; i < 50; i++) {
        if (document.querySelector('.immersed' + i + ' ' + '.muiContent')) {
          document.querySelector('.immersed' + i + ' ' + '.muiContent').style.top = i * 0.0266 - 8.573  + 'rem'
          document.querySelector('.immersed' + i + ' ' + '.headersWrapperTop').style.top = i * 0.0266 + 'rem'

        }
      }

      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-resume')
        this.getData()
      })
    },
    methods: {
      prevSuccessCallback () {
        this.$refs.RefreshList.mescroll.optUp.onScroll = function (mescroll, y, isUp) {
          console.log('up --> onScroll 列表当前滚动的距离 y = ' + y + ', 是否向上滑动 isUp = ' + isUp)
          if (y >= 150) {
            document.querySelector('.content-header-hide').classList.add('showHeader')
            document.querySelector('.content-header-hide').style.opacity = y / 250
          } else {
            document.querySelector('.content-header-hide').classList.remove('showHeader')
            document.querySelector('.content-header-hide').style.opacity = y / 250
          }
        }
      },
      goBack () {
        window.mui.back()
      },
      showItemOptions (shareOption, item) {
        this.itemOptionsObj = item
        this.iconMenus = getIconMenus(item)
        this.shareItemOption = shareOption
        this.$refs.share.share()
      },
      shareSuccess () {
      },
      shareFail () {
      },
      iconMenusClickedItem (item) {
        iconMenusClickedItem(this, this.itemOptionsObj, item, () => {
          this.iconMenus = getIconMenus(this.itemOptionsObj)
        })
      },
      toDetail (item) {
        this.$router.pushPlus(item.url, 'list-detail-page')
      },
      textToLink (text) {
        return transferTagToLink(secureHtml(textToLinkHtml(text)))
      },
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      goChat () {
        userAbility.jumpToChat(this.resume.info.id, this)
      },
      share: function () {
        this.$refs.shareComponent.share()
      },
      getData: function () {
        this.loading = 1
        // 获取本地的百分比
        const currentUser = getLocalUserInfo()
        this.percent = currentUser.account_info_complete_percent
        if (this.$route.query.goback) {
          this.canBack = true
        }

        if (this.$route.query.id) {
          this.user_uuid = this.$route.query.id
        }

        this.uuid = currentUser.uuid
        this.cuuid = currentUser.uuid

        var from = this.$router.currentRoute.name
        // var fullUrl = process.env.H5_ROOT

        if (from === 'share-newResume' || from === 'share-newResume-old') {
          this.isShare = true
          this.uuid = this.$route.query.id || this.$route.params.id
        }

        if (!this.uuid) return

        postRequest(`profile/resumeInfo`, {
          uuid: this.uuid
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.resume = response.data.data
          this.apper = this.resume.groups.length
          this.loading = 0
          this.bindWechatShare()

          setTimeout(() => {
            this.$refs.RefreshList.scrollToTop()
          }, 100)
        })
      },
      collectProfessor: function () {
        if (!this.cuuid) {
          window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=/home'
          return
        }

        postRequest(`follow/user`, {
          id: this.uuid
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.resume.is_followed = !this.resume.is_followed
          window.mui.toast(response.data.data.tip)
        })
      },
      bindWechatShare () {
        var shareOptions = getResumeDetail(
          this.uuid,
          this.resume.info.name,
          this.resume.info.company,
          this.resume.info.avatar_url
        )
        this.shareOptions.title = shareOptions.title
        this.shareOptions.content = shareOptions.content
        this.shareOptions.imageUrl = shareOptions.imageUrl
        this.shareOptions.thumbUrl = shareOptions.thumbUrl
        this.shareOptions.shareName = shareOptions.shareName
        this.shareUrl = shareOptions.link
      },
      showJobMore (event) {
        if (!this.cuuid) {
          window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=/home'
          return
        }

        this.isShowItemJobMore = true
        event.target.style.display = 'none'
      },
      showProjectMore (event) {
        if (!this.cuuid) {
          window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=/home'
          return
        }

        this.isShowProjectMore = true

        event.target.style.display = 'none'
      },
      showEduMore (event) {
        if (!this.cuuid) {
          window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=/home'
          return
        }

        this.isShowitemEduMore = true
        event.target.style.display = 'none'
      },
      goAsk (url) {
        if (!this.resume.info.is_expert) {
          window.mui.alert('Ta还不是平台专家，暂时还不能向Ta咨询！')
          return
        }

        if (this.uuid === this.cuuid) {
          window.mui.alert('不能向自己提问！')
          return
        }

        if (window.mui.os.wechat) {
          window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=' + url
        } else {
          this.$router.push(url)
        }

        return
      },
      toggleShareNav () {
        window.mui('#shareShowWrapper').popover('toggle')
      },
      toggleDeatil (event) {
        var Desc = event.target.previousSibling.previousSibling
        if (/hide/.test(Desc.className)) {
          Desc.className = Desc.className.replace(' hide', '')
          Desc.className = Desc.className.replace(' mui-ellipsis-3', '')
          Desc.className += ' show'

          event.target.className = 'toggle hide'
          event.target.innerText = '收起'
        } else {
          Desc.className = Desc.className.replace(' show', '')
          Desc.className += ' hide mui-ellipsis-3'

          event.target.className = 'toggle show'
          event.target.innerText = '查看'
        }
      },
      toggleQrCode () {
        this.showQrCode = !this.showQrCode
      }
    },
    computed: {
      prevOtherData () {
        return {search_type: this.search_type, uuid: this.uuid}
      },
      nextOtherData () {
        return {search_type: this.search_type, uuid: this.uuid}
      }
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;}

  .showHeader {
    position: relative;
    z-index: 9999;
    display: block !important;
  }
  .bot {
    position: absolute;
    right: 0.373rem;
    bottom: 0;
    left: 0.373rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
    /*border: 0.026rem solid #dcdcdc;*/
  }
  .marginTop {
    margin-top: 1.333rem;
  }

  .content-header-hide {
    display: none;
  }
  .mui-bar-nav {
    transition: all ease-out .3s;
    top: 0 ;
    .mui-title {
      /*color: #ffffff;*/
    }
    .openNotice {
      float: right;
      position: relative;
      z-index: 9;
      font-size: 0.64rem;
      padding-top: 0.28rem;
      /*color: #ffffff;*/
    }
    .share {
      float: right;
      padding-right: 0.2rem;
      padding-left: 0.462rem;
    }
  }

  .infoBg {
    width: 100%;
    background: #1C3F6D;
    position: absolute;
    height: 8.573rem;
    border-bottom-left-radius: 0.533rem;
    border-bottom-right-radius: 0.533rem;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-bottom-left-radius: 0.533rem;
      border-bottom-right-radius: 0.533rem;
    }
    .backMask {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      border-bottom-left-radius: 0.533rem;
      border-bottom-right-radius: 0.533rem;
      background:linear-gradient(360deg,rgba(27,68,194,1) 0%,rgba(81,167,254,0.8) 100%);
    }
  }
  .muiContent {
    position: relative;
    /*top: -8.573rem;*/
  }
  .header-wrapper {
    height: 8.573rem;
    /*position: absolute;*/
    /*margin-top: -8.573rem;*/
    position: relative;
  }
  .headers {
    position: relative;
    /*height: 8.573rem;*/
    .title {
      position: absolute;
      top: 0.266rem;
      left: 50%;
      font-size: 0.48rem;
      color: #FFFFFF;
      transform: translateX(-50%);
    }

    .headerBack {
      /*width: 100%;*/
      display: flex;
      height: 1.173rem;
      position: absolute;
      top: 0;
      z-index: 10;
      padding-left: 0.32rem;
      .icon {
        margin-top: 0.266rem;
        font-size: 0.613rem;
        color: #FFFFFF;
      }
    }
    .openNotice {
      position: absolute;
      top: 0.293rem;
      right: 1.6rem;
      .icon {
        font-size: 0.64rem;
        color: #ffffff;
      }
      &.share {
        right: 0.426rem;
      }
    }
    .headPhotowrapper {
      width: 90%;
      position: absolute;
      top: 1.573rem;
      left: 0.693rem;
      z-index: 100;
      .headImages {
        width: 2.453rem;
        height: 2.453rem;
        text-align: center;
        background: #E3E3E3;
        border-radius: 50%;
        border: 0.026rem solid #ffffff;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      .personalInfo {
        .nameAndLevel {
          margin-top: 0.266rem;
          .name {
            color: #FFFFFF;
            font-size: 0.533rem;
            line-height: 0.746rem;
          }
          .level {
            padding: 0.026rem 0.133rem;
            position: relative;
            top: -0.08rem;
            font-style: normal;
            line-height: 0.4rem;
            font-size: 0.266rem;
            color: #FFFFFF;
            text-align: center;
            border-radius: 2.666rem;
            background:linear-gradient(180deg,#07D7FD 0%,#03AEF9 100%);
          }
        }
        .detailInfo {
          margin-top: 0.16rem;
          font-size: 0.32rem;
          line-height: 0.44rem;
          .text {
            color: #ffffff;
            opacity: 0.7;
          }
          .number {
            color: #ffffff;
          }
          i {
            display: inline-block;
            width: 0.053rem;
            height: 0.053rem;
            border-radius: 50%;
            background: #ffffff;
            opacity: 0.7;
            margin: 0 0.133rem 0.08rem;
          }
        }
        .consultWrapper {
          margin-top: 0.48rem;
          display: flex;
          justify-content: space-between;
          .leftButton {
            display: flex;
            .letter {
              margin-right: 0.226rem;
            }
            .border-football {
              color: #ffffff;
              font-size: 0.346rem;
              padding: 0.106rem 0.44rem;
              &:after {
                border-radius: 0.213rem;
                border-color: #85A3E4;
              }
            }
          }
          .rightDetailInfo {
            margin-right: 0.026rem;
            margin-top: 0.173rem;
            span {
              color: #FFFFFF;
              font-size: 0.32rem;
            }
            .icon {
              color: #FFFFFF;
              font-size: 0.133rem;
            }
          }
        }
        .operationWrapper {
          position: absolute;
          top: 0.413rem;
          right: 0;
          display: flex;
          .iconAndText {
            width: 1.173rem;
            text-align: center;
            .word {
              color: #FFFFFF;
              font-size: 0.293rem;
              opacity: 0.7;
            }
            &.code {
              .icon {
                font-size: 0.56rem;
              }
            }
            &.active {
              .icon {
                color: #FA4975;
              }
            }
            .icon {
              color: #ffffff;
              font-size: 0.586rem;
            }
          }
        }
      }
    }
  }

  .counter {
    width: 9.146rem;
    /*height: 1.733rem;*/
    padding: 0.24rem 0 0.36rem;
    position: relative;
    top: 0.693rem;
    left: -0.266rem;
    overflow: hidden;
    text-align: center;
    border-radius: 0.213rem;
    background: #ffffff;
    box-shadow: 0rem 0.133rem 0.266rem 0rem rgba(247,248,250,1);
    .counterList {
      width: 25%;
      float: left;
      span {
        display: block;
      }
      .font-family-medium {
        font-size: 0.506rem;
        color: #444444;
        line-height: 0.706rem;
      }
      .script {
        font-size: 0.293rem;
        line-height: 0.4rem;
        color: #808080;
        margin-top: 0.026rem;
      }
    }
  }

  .domainWrapper {
    padding: 0 0.426rem;
    overflow: hidden;
    position: relative;
    margin-top: 0.986rem;
    .skilledTags {
      height: 1.173rem;
      line-height: 1.173rem;
      margin-bottom: 0.133rem;
      .icon {
        font-size: 0.4rem;
        margin-right: 0.053rem;
      }
      span {
        color: #444444;
        font-size: 0.426rem;
      }
    }
    .tags {
      float: left;
      margin-right: 0.213rem;
      margin-bottom: 0.4rem;
      span {
        float: left;
        background: #ececee;
        border-radius: 1.333rem;
        padding: 0rem 0.266rem;
        line-height: 0.64rem;
        font-size: 0.32rem;
        color: #444444;
      }
    }
    .addTags {
      float: left;
      color: #03AEF9;
      padding: 0rem 0.266rem;
      line-height: 0.64rem;
      font-size: 0.32rem;
      vertical-align: sub;
      margin-bottom: 0.4rem;
      border-radius: 1.333rem;
      border: 0.026rem solid #DCDCDC;
      .icon {
        font-size: 0.32rem;
        color: #B4B4B6;
        margin-right: 0.08rem;
      }
    }
  }

  .specialColumn {
    padding: 0 0.426rem;
    display: flex;
    height: 1.173rem;
    line-height: 1.173rem;
    justify-content: space-between;
    .titleText {
      .icon {
        font-size: 0.4rem;
        margin-right: 0.053rem;
      }
      span {
        color: #444444;
        font-size: 0.426rem;
      }
    }
    .iconFont {
      /*margin-top: 0.413rem;*/
    }
  }

  .noDynamic {
    text-align: center;
    font-size: 1.333rem;
    padding-top: 0.8rem;
    padding-bottom: 0.986rem;
    span {
      color: #C8C8C8;
      font-size: 0.32rem;
      display: block;
    }
    .empty-IconImg {
      width: 1.64rem;
      height: 2.373rem;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &.goAddpage {
      span {
        margin-top: 0.266rem;
        line-height: 0.426rem;
      }
      .releaseButton {
        margin-top: 0.453rem;
        button {
          width: 2.48rem;
          height: 0.96rem;
          border: none;
          color: #FFFFFF;
          font-size: 0.373rem;
          line-height: 0.373rem;
          background: #03AEF9;
          border-radius: 2.666rem;
        }
      }
    }
  }
</style>

<style>
  .mui-content-top-0{
    top:0 !important;
  }
  .immersedWrapperNone{
    display: none !important;
  }
  .openAppH5 .mui-bar-nav {
    top: 0 !important;
  }
  .mescroll {
    position: relative;
  }
</style>
