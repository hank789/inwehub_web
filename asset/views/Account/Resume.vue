<template>
  <div class="vueWrapper">
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <Back v-show="!isShare || (isShare && canBack)"></Back>
      <h1 class="mui-title">个人名片</h1>
      <svg class="icon" aria-hidden="true" @tap.stop.prevent="share">
        <use xlink:href="#icon-shoucang-xiao"></use>
      </svg>
    </header>

    <div class="mui-content resumeWrapper" v-show="!loading">

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'feed/list'"
        :prevOtherData="prevOtherData"
        :nextOtherData="nextOtherData"
        :pageMode="true"
        :isShowUpToRefreshDescription="true"
        :autoShowEmpty="false"

        :emptyDescription="emptyDescription"
        class="listWrapper"
      >

        <div class="erweimaWrapper" v-show="showQrCode" @tap.stop.prevent="toggleQrCode">
          <div class="header">
            <div class="avatar">
              <div class="avatarInner">
                <img :src="resume.info.avatar_url" class="avatar"/>
              </div>
            </div>
          </div>

          <div class="realname">
            <span class="font-family-medium">{{ resume.info.name }}</span>
            <svg class="icon" aria-hidden="true" v-show="resume.info.is_expert">
              <use xlink:href="#icon-zhuanjiabiaoji"></use>
            </svg>
          </div>

          <div class="erweimaSplite">
            <span></span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-logowenzi"></use>
            </svg>
            <span></span>
          </div>
          <div class="qRCode qRCode-resume">
            <qr-code :text="shareUrl" :size="170" error-level="M"></qr-code>
          </div>
          <div class="qRhelp">
            扫一扫试试?

          </div>
        </div>

        <div class="professor">

        </div>

        <div class="basic">
          <div class="cardWrapper" id="cardWrapper">
            <div class="card">
              <div class="erweima" @tap.stop.prevent="toggleQrCode"><img
                src="../../statics/images/resume_erweima_3x.png"/></div>
              <!--关注-->
              <div class="collect" v-show="uuid !== cuuid && !resume.is_followed" @tap.stop.prevent="collectProfessor">
                关注Ta

              </div>
              <div class="collect active" @tap.stop.prevent="collectProfessor"
                   v-show="uuid !== cuuid && resume.is_followed">
                已关注

              </div>
              <div class="header">
                <div class="avatar">
                  <div class="avatarInner">
                    <img :src="resume.info.avatar_url" class="avatar"/>
                    <div class="expert" v-if="resume.info.expert_apply_status =='2'">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-zhuanjiabiaozhishixin"></use>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div class="detail">
                <div class="realname">
                  <span>{{ resume.info.name }}</span>
                  <span>L{{resume.info.user_level}}</span>
                </div>
                <div class="item">
                  <div class="my-detail">
                    <span>被赞<i>{{resume.info.supports}}</i></span>
                    <i class="spot"></i>
                    <span>{{resume.info.total_score}}<i></i></span>
                  </div>
                  <div class="detailInfo" @tap.stop.prevent="$router.pushPlus('/my/detailInfo/' + resume.info.uuid)">
                    <span>详细资料</span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-chakangengduojiantou"></use>
                    </svg>
                    <div class="bot"></div>
                  </div>
                </div>
                <div class="counter">
                  <div class="counterList" @tap.stop.prevent="$router.pushPlus('/my/focus/'+uuid)">
                    <span class="font-family-medium">{{resume.info.followed_number}}</span>
                    <span>关注Ta的人</span>
                  </div>

                  <div class="counterList" @tap.stop.prevent="$router.pushPlus('/followed/'+uuid)">
                    <span class="font-family-medium">{{resume.info.follow_user_number}}</span>
                    <span>Ta关注的人</span>
                  </div>

                  <div class="counterList" @tap.stop.prevent="$router.pushPlus('/my/publishAnswers/'+uuid)">
                    <span class="font-family-medium">{{resume.info.publishes}}</span>
                    <span>发布</span>
                  </div>

                  <div class="counterList" @tap.stop.prevent="$router.pushPlus('/group/my/'+uuid)">
                    <span class="font-family-medium">{{resume.info.group_number}}</span>
                    <span>圈子</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="gray"></div>
          <!--Ta的擅长-->
          <div class="skilled" v-if="resume.info.skill_tags.length > 0 || uuid === cuuid">
            <div class="skilledTags">擅长领域
              <div class="bot"></div>
            </div>
            <template v-for="(industry, index) in resume.info.skill_tags">
              <div class="tags" @tap.stop.prevent="toTagDetail(industry.text)"><span>{{industry.text}}</span></div>
            </template>
            <div class="addTags" v-show="uuid == cuuid" @tap.stop.prevent="$router.pushPlus('/my/advantage')">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-plus--"></use>
              </svg>
              添加

            </div>
          </div>
          <!--Ta的专栏-->
          <div class="gray" v-if="resume.info.skill_tags.length > 0 || uuid === cuuid"></div>
          <div class="specialColumn" @tap.stop.prevent="$router.pushPlus('/article/list/' + resume.info.uuid )">
            <p>专栏</p>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-chakangengduojiantou"></use>
            </svg>
            <!--<i class="bot"></i>-->
          </div>

          <div class="grey"></div>
          <div class="specialColumn dynamicWrapper">
            <p>动态</p>
            <i class="bot"></i>
          </div>
          <div class="description">

            <div class="noDynamic" v-if="list.length === 0 && uuid !== cuuid">
              <div class="empty-IconImg">
                <img src="../../statics/images/empty@3x.png" alt="">
              </div>
              <span>暂无动态</span>
            </div>

            <div class="noDynamic goAddpage" v-if="list.length === 0 && uuid === cuuid">
              <div class="empty-IconImg">
                <img src="../../statics/images/dynamic@3x.png" alt="">
              </div>
              <span>快来创建你的第一条分享吧~</span>
              <div class="releaseButton" @tap.stop.prevent="$router.pushPlus('/discover/add')">
                <button>发布</button>
              </div>
            </div>

            <template v-for="(item, index) in list" v-else>
              <div class="component-feed-item-guide" v-if="index === 2 && search_type === 6">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-gongkai"></use>
                </svg>
                <div class="desc">关注你感兴趣的人和圈子，了解他们的最新动态</div>
                <div class="buttonWrapper" @tap.stop.prevent="$router.pushPlus('/userGuide/stepone')">
                  <button>去看看</button>
                </div>
              </div>

              <div class="line-river-big" v-if="index === 2 && search_type === 6"></div>

              <FeedItem
                :item="item"
                :index="index"
                @showItemMore="showItemOptions"
              ></FeedItem>


              <!--<div class="line-river-big"></div>-->
            </template>

          </div>
        </div>
      </RefreshList>
    </div>


    <Share :title="shareOptions.title"
           :shareName="shareOptions.shareName"
           :link="shareUrl"
           :hideShareBtn="true"
           :content="shareOptions.content"
           :imageUrl="shareOptions.imageUrl"
           :thumbUrl="shareOptions.thumbUrl"
           :targetId="uuid"
           :targetType="'resume'"
           ref="shareComponent"></Share>

    <div class="buttonWrapper">
      <div class="edit" @tap.stop.prevent="$router.pushPlus('/my/info')" v-if="!isShare || uuid === cuuid"
           v-show="!loading">
        <div>继续编辑</div>
      </div>
      <div class="consultWrapper" v-else v-show="!loading">
        <div class="buttonLeft" @tap.stop.prevent="goChat()">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-faxiaoxi"></use>
          </svg>
          发私信

        </div>
        <div class="buttonRight" @tap.stop.prevent="goAsk('/ask/'+uuid)">向他咨询</div>
      </div>
    </div>


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
    mounted () {
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-resume')
        this.getData()
      })
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

        if (from === 'share-resume' || from === 'share-resume-old') {
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

<style lang="less" rel="stylesheet/less" scoped>
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

  /***************清除自带样式*****************/
  p,
  span,
  ul,
  li,
  i,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  .component-label {
    padding: 0rem 0.133rem;
  }

  .mui-bar {
    .icon {
      position: absolute;
      right: 0.426rem;
      top: 0.293rem;
      font-size: 0.586rem;
      color: #3C3E44;
    }
  }

  .professor {
    background-color: #ffffff;
    text-align: center;
    position: relative;
    height: 2.08rem;
  }

  .erweimaWrapper {
    position: absolute;
    left: 0.426rem;
    background: #444;
    margin-top: 0.213rem;
    width: 81%;
    border-radius: 0.106rem;
    z-index: 777;
    text-align: center;
    padding-bottom: 0.48rem;
    .header {
      position: relative;
      height: 2.453rem;
      .avatar {
        position: absolute;
        left: 50%;
        margin-top: 0.4rem;
        margin-left: -0.92rem;
        z-index: 9;
        color: #ffffff;
        display: inline-block;
        height: 1.84rem;
        width: 1.84rem;
        font-size: 0.533rem;
        text-align: center;
        border-radius: 50%;
        vertical-align: top;
      }
      .avatar .avatarInner {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        width: 100%;
        height: 100%;
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
      }
      .avatar img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .realname {
      margin-top: 0.533rem;
      color: #fff;
      font-size: 0.373rem;
      /*font-weight: bold;*/
      span {
        position: relative;
        right: -0.08rem;
      }
      .icon {
        vertical-align: top;
        font-size: 0.533rem;
        color: #3c95f9;
      }
    }
    .erweimaSplite {
      margin-top: -0.8rem;
      span {
        display: inline-block;
        width: 1.653rem;
        margin: 0 0.08rem;
        border-bottom: 0.026rem solid #808080;
      }
      .icon {
        color: #252525;
        font-size: 1.333rem;
        position: relative;
        top: 0.453rem;
      }
    }
    .qRCode {
      margin-top: 0.266rem;
      position: relative;
      text-align: center;
      height: 5.066rem;
      div {
        position: absolute;
        left: 50%;
        margin-left: -2.533rem;
        width: 5.066rem;
        height: 5.066rem;
        border-radius: 0.106rem;
        background: #fff;
        padding: 0.266rem;
        img {
          width: 4.533rem;
          height: 4.533rem;
          margin-top: 0.266rem !important;
          border-radius: 0.106rem;
        }
      }
    }
    .qRhelp {
      margin-top: 0.213rem;
      text-align: center;
      color: #fff;
      font-size: 0.346rem;
    }
  }

  /*个人简历*/
  .specialColumn.dynamicWrapper {
    padding: 0.213rem 0.373rem;
  }

  .basic {
    background: #fff;
    .description {
      font-size: 0.373rem;
      color: #808080;
      /*padding: 0.293rem 0.373rem 0.346rem;*/
      line-height: 0.64rem;
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
          width: 1.653rem;
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
          .empty-IconImg {
            width: 2.666rem;
            height: 1.973rem;
            margin: 0 auto;
            img {
              width: 100%;
              height: 100%;
            }
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
    }
  }

  .separate {
    display: inline-block;
    height: 0.266rem;
    margin: 0 0.213rem;
    border-left: 0.026rem solid #c8c8c8;
  }

  .cardWrapper {
    margin-top: -1.84rem;
    padding: 0 0.426rem 0.4rem;
    width: 100%;
    .card {
      border-radius: 0.106rem;
      background: #ececee;
      width: 100%;
      position: relative;
      padding-bottom: 0.4rem;
      .erweima {
        width: 1.466rem;
        height: 1.36rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      /*关注*/
      .collect {
        position: absolute;
        font-size: 0.373rem;
        right: 0.4rem;
        top: 0.4rem;
        color: #ffffff;
        background: #03aef9;
        border-radius: 1.333rem;
        padding: 0.053rem 0.213rem;
        &.active {
          background: #dbdbdb;
          color: #b4b4b6;
        }
      }
      /*名片*/
      .Card {
        position: absolute;
        right: 1.466rem;
        top: 1.44rem;
        border: 0.026rem solid #b4b4b6;
        border-radius: 1.333rem;
        padding: 0.053rem 0.426rem;
        color: #444444;
        font-size: 0.373rem;

      }
      .share {
        position: absolute;
        font-size: 0.64rem;
        right: 0.506rem;
        top: 0.373rem;
        color: #808080;
      }
      .header {
        height: 2.453rem;
        margin-top: -0.533rem;
        position: relative;
        .expert {
          position: absolute;
          right: 0.16rem;
          bottom: 0rem;
          z-index: 10;
          .icon {
            font-size: 0.746rem;
            border: 0.053rem solid #FFF;
            border-radius: 50%;
            background: #FFF;
          }
        }
        .avatar {
          position: absolute;
          left: 50%;
          margin-left: -1.226rem;
          z-index: 9;
          color: #ffffff;
          display: inline-block;
          height: 2.426rem;
          width: 2.426rem;
          font-size: 0.533rem;
          text-align: center;
          border-radius: 50%;
          vertical-align: top;
        }
        .avatar .avatarInner {
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          width: 100%;
          height: 100%;
          -webkit-box-align: center;
          -webkit-align-items: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -webkit-justify-content: center;
          -ms-flex-pack: center;
          justify-content: center;
        }
        .avatar img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .detail {
        margin-top: 0.266rem;
        text-align: center;
        .realname {
          font-weight: bold;
          span {
            &:nth-of-type(1) {
              position: relative;
              right: -0.08rem;
              color: #444444;
              font-size: 0.48rem;
            }
            &:nth-of-type(2) {
              padding: 0.026rem 0.133rem;
              position: relative;
              top: -0.08rem;
              font-style: normal;
              line-height: 0.4rem;
              font-size: 0.266rem;
              color: #FFFFFF;
              text-align: center;
              border-radius: 2.666rem;
              background: linear-gradient(180deg, #07D7FD 0%, #03AEF9 100%);
            }
          }
          .icon {
            vertical-align: bottom;
            font-size: 0.586rem;
            color: #3c95f9;
          }
        }
        .counter {
          width: 91%;
          margin-left: 4.5%;
          padding-top: 0.24rem;
          /*margin-top: 0.32rem;*/
          /*border-top: 0.026rem solid #dcdcdc;*/
          font-size: 0.346rem;
          color: #444444;
          overflow: hidden;
          .counterList {
            width: 25%;
            float: left;
            span {
              display: block;
              color: #808080;
              &:nth-of-type(1) {
                color: #444444;
                font-size: 0.506rem;
              }
            }
          }

        }
        .item {
          color: #808080;
          font-size: 0.346rem;
          margin: 0.186rem 0.186rem 0.053rem 0.186rem;
          .icon {
            color: #b4b4b6;
            font-size: 0.426rem;
          }
          &.industry span {
            border: 0.026rem solid #c8c8c8;
            display: inline-block;
            border-radius: 1.333rem;
            color: #808080;
            font-size: 0.32rem;
            padding: 0 0.186rem;
            margin: 0 0.053rem 0.213rem;
          }
          .my-detail {
            line-height: 0.426rem;
            margin-bottom: 0.24rem;
            span {
              font-size: 0.346rem;
              color: #B4B4B6;
              i {
                font-style: normal;
                color: #808080;
              }
            }
            .spot {
              display: inline-block;
              width: 0.053rem;
              height: 0.053rem;
              border-radius: 50%;
              background: #B4B4B6;
              margin: 0 0rem 0.08rem;
            }
          }
          .detailInfo {
            position: relative;
            padding-bottom: 0.32rem;
            .bot {
              right: 0.213rem;
              left: 0.213rem;
            }
            span {
              color: #808080;
              font-size: 0.373rem;
            }
            .icon {
              color: #808080;
              font-size: 0.32rem;
              vertical-align: -0.026rem;
              margin-left: -0.08rem;
            }
          }
        }
      }
    }
  }

  button {
    border-radius: 0;
    padding: 0.32rem 0;
    height: 1.28rem;
    margin: 0;
    font-size: 0.453rem;
  }

  .shareWrapper {
    .title {
      background: #ececee;
      text-align: center;
      font-size: 0.373rem;
      padding: 0.32rem 0;
    }
    .more {
      background: #fff;
      padding: 0.266rem;
      .single {
        width: 1.466rem;
        height: 1.466rem;
        margin: 0 0.266rem;
        display: inline-block;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  #shareShowWrapper {
    position: absolute;
    right: 0;
    top: 0;
    .icon {
      color: #fff;
      position: absolute;
      right: 0.4rem;
      top: 0.266rem;
      font-size: 1.866rem;
    }
  }

  /*.vueWrapper {*/
  /*padding-bottom: 1.28rem;*/
  /*}*/

  .buttonWrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1.333rem;
    overflow: hidden;
    background: #ffffff;
    &:before {
      position: absolute;
      top: 0.053rem;
      width: 100%;
      height: .02667rem;
      content: '';
      transform: scaleY(0.5);
      background-color: #DCDCDC;
    }
    .edit {
      padding: 0.186rem 0;
      div {
        width: 9.146rem;
        height: 0.96rem;
        color: #ffffff;
        margin: 0 auto;
        font-size: 0.426rem;
        line-height: 0.96rem;
        text-align: center;
        border-radius: 0.213rem;
        background: #03AEF9;
      }
    }
    .consultWrapper {
      div {
        margin-top: 0.213rem;
      }
      .buttonLeft {
        float: left;
        width: 25%;
        color: #B4B4B6;
        font-size: 0.266rem;
        text-align: center;
        .icon {
          color: #808080;
          font-size: 0.533rem;
          text-align: center;
          display: block;
          margin-left: 0.986rem;
        }
      }
      .buttonRight {
        float: right;
        width: 7.066rem;
        height: 0.96rem;
        color: #ffffff;
        margin-right: 0.426rem;
        line-height: 0.96rem;
        text-align: center;
        border-radius: 0.213rem;
        background: #03AEF9;
      }
    }
  }

  .bottomButton {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 11;
  }

  .seeMoreWrapper {
    background: #fff;
    padding-bottom: 0.8rem;
    margin-top: -0.053rem;
    z-index: 5;
    position: relative;
    .seeMore {
      font-size: 0.373rem;
      color: #3c95f9;
      text-align: center;
      padding: 0.24rem 0 0.213rem;
      background: #fff;
      border: 0.026rem solid #dcdcdc;
      border-radius: 0.106rem;
      margin: 0 0.533rem;
    }
  }

  /***********评论和回复************/

  .news {
    padding: 0.32rem 0.373rem;
    overflow: hidden;
    position: relative;
  }

  .news div {
    font-size: 0.373rem;
    color: #808080;
    margin-bottom: 0.213rem;
  }

  .news a {
    display: inline-block;
    float: left;
    width: 0.026rem;
    height: 0.293rem;
    border-right: 0.026rem solid #c8c8c8;
    margin: 0.133rem 0.586rem 0 0.586rem;
  }

  .news p {
    float: left;
    font-size: 0.32rem;
    color: #808080;
    text-align: center;
  }

  .news p:nth-of-type(1) {
    text-align: left;
  }

  .news p span {
    font-size: 0.373rem;
    color: #444444;
    font-weight: 500;
  }

  /*.news p:nth-of-type(1) {
    text-align: right;
  }

  .news p:nth-of-type(2) {
    text-align: left;
  }*/

  .resumeWrapper {
    bottom: 1.28rem;
  }

  /*动态*/
  .dynamic {
    overflow: hidden;
    padding: 0.32rem 0.373rem;
    position: relative;
    p {
      float: left;
      font-size: 0.373rem;
      color: #808080;
      i {
        font-weight: 500;
        color: #444444;
      }
    }
    svg {
      float: right;
      font-size: 0.4rem;
      color: #808080;
    }
  }

  /*Ta的专栏*/
  .specialColumn {
    overflow: hidden;
    padding: 0.32rem 0.373rem;
    position: relative;
  }

  .specialColumn p {
    float: left;
    font-size: 0.32rem;
    color: #b4b4b6;

  }

  .specialColumn p span {
    color: rgb(128, 128, 128);
  }

  .specialColumn p i {
    display: inline-block;
    width: 0.026rem;
    height: 0.266rem;
    background: #c8c8c8;
    margin: 0  0.133rem -0.026rem 0.133rem;

  }

  .specialColumn svg {
    float: right;
    font-size: 0.4rem;
    color: #808080;
    margin-top: 0.106rem;
  }

  .specialColumn p:nth-of-type(1) {
    font-size: 0.373rem;
    color: #808080;
    margin-right: 0.133rem;
  }

  /*擅长*/
  .skilled {
    padding: 0.32rem 0.373rem 0rem 0.373rem;
    overflow: hidden;
    position: relative;
    .tags {
      float: left;
      margin-right: 0.213rem;
      margin-bottom: 0.293rem;
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
    .skilledTags {
      .bot {
        left: 0;
        right: 0;
      }
      position: relative;
      color: #808080;
      font-size: 0.373rem;
      padding-bottom: 0.213rem;
      margin-bottom: 0.32rem;
    }
    .addTags {
      float: left;
      color: #03AEF9;
      padding: 0rem 0.266rem;
      line-height: 0.64rem;
      font-size: 0.32rem;
      vertical-align: sub;
      margin-bottom: 0.24rem;
      border-radius: 1.333rem;
      border: 0.026rem solid #DCDCDC;
      .icon {
        font-size: 0.32rem;
        color: #B4B4B6;
        margin-right: 0.08rem;
      }
    }
  }

  /*向他咨询*/
  .btn {
    border-top: 0.026rem solid #dcdcdc;
    width: 100%;
    height: 1.306rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .btn P {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .btn P:nth-of-type(1) {
    width: 32%;
    background: #f3f4f6;
    font-size: 0.373rem;
    color: #444444;

  }

  .btn P:nth-of-type(1) svg {
    font-size: 0.453rem;
    color: #808080;
    margin-right: 0.106rem;
    margin-top: -0.053rem;
  }

  .btn P:nth-of-type(2) {
    width: 68%;
    background: #03aef9;
    font-size: 0.453rem;
    color: #ffffff;
  }

  .grey {
    width: 100%;
    height: 0.266rem;
    background: #F3F4F5;
  }

  .newLink {
    margin-top: 0.24rem;
    // padding: 0 0.426rem;
    .newLinkBox {
      margin-top: 0.266rem;
      padding: 0.293rem 0.4rem 0.293rem;
      background: #F7F8FA;
      border-radius: 0.106rem;
      img {
        // width: 8.373rem;
        // height: 2.986rem;
        border-radius: 0.106rem;
      }
      .linkContent {
        font-size: 0.373rem;
        color: #808080;
        line-height: 0.533rem;
        margin-top: 0.106rem;
      }
      .link {
        font-size: 0.32rem;
        color: #B4B4B6;
      }
    }
  }
</style>
