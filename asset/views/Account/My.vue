<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <div class="setUp" @tap.stop.prevent="$router.pushPlus('/setting')">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shezhi"></use>
        </svg>
      </div>
      <div class="code" @tap.stop.prevent="$router.pushPlus('/my/qrcode')">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-erweima"></use>
        </svg>
      </div>
    </header>
    <div class="mui-content">
      <div class="my-top" @tap.stop.prevent="$router.pushPlus('/my/resume')">
        <div class="account_info">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="professor">
          <div class="my-img"  @tap.stop.prevent="$router.pushPlus('/my/resume')">
            <img :src="avatar" class="avatar" />
            <div class="expert" v-if="expert_apply_status =='2'">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhuanjiabiaozhishixin"></use>
              </svg>
            </div>
             <!--  -->
          </div>

          <div class="my-personal">
            <div class="my-info">
              <span class="mui-ellipsis font-family-medium">{{name}}</span>
              <span @tap.stop.prevent="$router.pushPlus('/my/Growth')">L{{ user_level }}</span>
            </div>
            <div class="my-detail">
              <span @tap.stop.prevent="$router.pushPlus('/my/focus/'+uuid)">关注我的人{{followed_number}}</span>
              <i></i>
              <span @tap.stop.prevent="$router.pushPlus('/my/visitors')">访客人气{{popularity}}</span>
            </div>
          </div>
        </div>
      </div>

      <!--part2 $router.pushPlus('/my/publishAnswers')-->
      <ul class="part2">
        <li @tap.stop.prevent="$router.pushPlus('/my/publishAnswers')">
          <span class="font-family-medium">{{publishes}}</span>
          <span>发布</span>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/collectUser')">
          <span class="font-family-medium">{{attention}}</span>
          <span>关注</span>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/my/collectedAnswers')">
          <span class="font-family-medium">{{collections}}</span>
          <span>收藏</span>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/group/my/'+uuid)">
          <span class="font-family-medium">{{groups}}</span>
          <span>圈子</span>
        </li>
      </ul>
      <div class="enjoy" @tap.stop.prevent="$router.pushPlus('/my/choiceRole')">
        <img src="../../statics/images/enjoy2x.png" alt="">
      </div>
      <div class="gray"></div>

      <!--列表内容-->
      <div class="component-option">
        <div v-if="show_my_wallet" class="optionList" @tap.stop.prevent="$router.pushPlus('/my/Finance')">
          <span>我的钱包</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="gray"></div>
        <div v-if="show_my_wallet" class="optionList invite" @tap.stop.prevent="$router.pushPlus('/invitation/index')">
          <span>邀请好友</span>
          <span>5%返现</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
          <i class="bot"></i>
        </div>
        <div v-if="show_my_wallet" class="optionList signIn" @tap.stop.prevent="toSignIGift()">
          <span>每日签到</span>
          <span v-if="!current_day_signed"></span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
          <i class="bot"></i>
        </div>
        <div class="optionList" @tap.stop.prevent="$router.pushPlus('/feedback/advise')">
          <span>意见反馈</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="gray"></div>
      </div>

      <div class="guessLike">
        <div class="component-block-title">
          <div class="left">猜您喜欢</div>
        </div>
        <div class="line-river-after line-river-after-short"></div>
        <template  v-for="(item, index) in list">
          <div class="line-river-big" v-if="index === 5"></div>
          <div class="component-item-article" @tap.stop.prevent="goDetail(item)">
            <div class="itemArticleLeft">
              <div class="titleWrapper">
                <div class="title text-line-2 text-content"><!--<span class="number" v-if="index < 5">{{index+1}}.</span>-->{{item.data.title}}</div>
              </div>
              <div class="explain">
                <label v-if="item.tips">{{item.tips}}</label><span v-if="item.type_description">{{item.type_description}}</span><timeago :since="timeago(item.created_at)" :auto-update="60">
              </timeago>
              </div>
            </div>
            <div class="itemArticleRight"><img class="lazyImg" v-lazy="item.data.img"></div>
          </div>
          <div class="line-river-after line-river-after-short" v-if="index !== 4 && index !== list.length-1"></div>
        </template>
      </div>

    </div>

    <div id="statusBarStyle" background="#fff" bgColor="#fff" mode="dark"></div>

  </div>
</template>
<script>
  import {postRequest} from '../../utils/request'
  import localEvent from '../../stores/localStorage'
  import { USERS_APPEND } from '../../stores/types'
  import { getUserInfo } from '../../utils/user'
  import userAbility from '../../utils/userAbility'
  // import { alertshi } from '../../utils/dialogList'

  export default {
    data () {
      const currentUser = localEvent.getLocalItem('UserInfo')
      const infomation = localEvent.getLocalItem('UserInfoReal')

      return {
        attention: infomation.info.followers,
        expert_apply_status: infomation.info.expert_apply_status,
        collections: currentUser.collections,
        publishes: currentUser.publishes,
        groups: currentUser.groups,
        followed_number: currentUser.followed_number,
        popularity: currentUser.popularity,
        name: currentUser.name,
        avatar: currentUser.avatar_url,
        title: currentUser.title,
        user_level: currentUser.user_level,
        user_id: currentUser.id,
        uuid: currentUser.uuids,
        answers: currentUser.answers,
        show_my_wallet: currentUser.show_my_wallet,
        my: '',
        list: [],
        current_day_signed: ''
      }
    },
    methods: {
      // publishAnswers () {
      //   if (this.publishes) {
      //     this.$router.pushPlus('/my/publishAnswers')
      //   } else {
      //     alertshi(this)
      //   }
      // },
      recommendRead () {
        postRequest(`getRelatedRecommend`, {source_id: 0, source_type: 0}, false).then(response => {
          this.list = response.data.data.data
        })
      },
      goDetail (item) {
        switch (item.read_type) {
          case 1:
            window.trackMixpanelEvent('redirect-to-recommend', '/c/' + item.data.category_id + '/' + item.data.slug, 'discover_detail', '分享', this.$router.fullPath)
            this.$router.pushPlus('/c/' + item.data.category_id + '/' + item.data.slug)
            break
          case 2:
            window.trackMixpanelEvent('redirect-to-recommend', '/askCommunity/major/' + item.source_id, 'askCommunity-major-detail', '问答社区', this.$router.fullPath)
            this.$router.pushPlus('/askCommunity/major/' + item.source_id)
            break
          case 3:
            window.trackMixpanelEvent('redirect-to-recommend', '/ask/offer/answers/' + item.source_id, 'ask-offer-answers', '问答社区-悬赏问答-回答列表页', this.$router.fullPath)
            this.$router.pushPlus('/ask/offer/answers/' + item.source_id)
            break
          case 4:
            this.$router.pushPlus('/EnrollmentStatus/' + item.source_id)
            break
          case 5:
            this.$router.pushPlus('/EnrollmentStatus/' + item.source_id)
            break
          case 6:
            window.trackMixpanelEvent('redirect-to-recommend', '/ask/offer/' + item.source_id, 'ask-offer-detail', '问答社区-悬赏问答-详情页', this.$router.fullPath)
            this.$router.pushPlus('/ask/offer/' + item.source_id)
            break
          default:
        }
      },
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      // 签到
      // 每日签到
      toSignIGift () {
        userAbility.signIGift(this, () => {
          this.current_day_signed = 1
        })
      },
      // 警告框
      wran () {
        var font = '<p style="text-align: left; color: #444444; margin-bottom:0.533rem">' + '为保证每位用户信息都真实有效，请务必如实填写。如发现不实，首次将给予警告，第二次将永久封号。' + '</p>' +
          '<p style="text-align: left; color: #444444;">' + '平台对所有个人信息绝对保密，不会提供给任何第三方。' + '</p>'
        var title = '<p style="font-size:0.426rem; margin-bottom:0.4rem">' +
          '<svg class="icon" aria-hidden="true" style="font-size:0.48rem; color:#fcc816; margin-right:0.053rem; margin-bottom:-0.026rem">' +
          '<use xlink:href="#icon-jinggao"></use>' +
          '</svg>' +
          '警告说明 ' +
          '</p>'

        // var btnArray = ['取消', '确认'];
        window.mui.confirm(font, title, function () {}, 'div')
      },
      // 我的项目跳转判断
      exclusive (status) {
        switch (status) {
          case 2:
            this.$router.pushPlus('/project/list?back=/my')
            break
          default:
            window.mui.toast('您还不是企业版账号，请点击申请企业账号前往认证')
        }
      },
      // 认证专家；
      toApply () {
        userAbility.jumpToApplyProfessor(this)
      },
      getNumbers: function (number) {
        var html = ''
        number = number.toString()
        for (var i = 0; i < number.length; i++) {
          var num = number[i]
          html += '<svg class="icon a" aria-hidden="true"><use xlink:href="#icon-' + num + '"></use></svg>'
        }
        return html
      },
      yaoqing () {
        window.mui.alert('您可以通过贡献值换取邀请码，邀请更多的用户注册并获取更多回报。在此之前请先提升您的平台成长值和等级。')
      },
      shareOut () {
        window.mui.alert('我们还暂时不建议您分享！')
      },
      integralDemo () {
        // mui.alert('小哈正在帮大家争取福利，请再稍等一阵！');
      },
      share () {
        setTimeout(() => {
          window.mui('#shareWrapper').popover('toggle')
        }, 150)
      },
      initData () {
        // 执行刷新
        console.log('refresh-my')
        this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
          cb(user)
          this.user_level = user.info.user_level
          this.user_id = user.info.id
          this.uuid = user.info.uuid
          this.answers = user.info.answers
          this.show_my_wallet = user.info.show_my_wallet
          this.expert_apply_status = user.info.expert_apply_status
          this.avatar = user.info.avatar_url
          this.name = user.info.name
          this.title = user.info.title
          this.publishes = user.info.publishes
          this.collections = user.info.collections
          this.groups = user.info.groups
          this.followed_number = user.info.followed_number
          this.popularity = user.info.popularity
          this.current_day_signed = user.info.current_day_signed
          this.attention = user.info.followers
          if (window.mui.os.plus && window.mui.os.android) {
            this.show_my_wallet = true
          }
          userAbility.newbieTask(this)
          this.recommendRead()
        }, true))
      }
    },
    activated: function () {
      this.initData()
    },
    mounted () {}
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  ul,
  li,
  p,
  span,
  a,
  i {
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

  .bott {
    position: absolute;
    right: 0.4rem;
    bottom: 0;
    left: 0.4rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .mui-bar {
    padding-top: 0.306rem;
    display: flex;
    justify-content: space-between;
    .icon {
      font-size: 0.56rem;
      color: #444444;
    }
    .setUp {
      display: flex;
      padding-left: 0.106rem;
    }
    .code {
      display: flex;
      padding-right: 0.106rem;
    }
  }

  .my-top {
    overflow: hidden;
    background-color: #ffffff;
    padding: 0 0.426rem;
  }

  .professor {
    margin-top: 0.4rem;
    display: flex;
    .my-img{
      width: 1.573rem;
      height: 1.573rem;
      position: relative;
      .expert {
        position: absolute;
        bottom: -0.026rem;
        right: -0.08rem;
        .icon {
          font-size: 0.586rem;
          color: #FCC816;
          border: 0.053rem solid #FFF;
          border-radius: 50%;
          background: #FFF;
        }
      }
    }
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .my-personal {
    margin-top: 0.106rem;
    margin-left: 0.266rem;
    position: relative;
    z-index: 98;
    .my-info {
      position: relative;
      span {
        display: inline-block;
        &:nth-of-type(1) {
          max-width: 2.92rem;
          font-size: 0.533rem;
          color: #444444;
          margin-right: 0.04rem;
          margin-bottom: -0.106rem;
        }
        &:nth-of-type(2) {
          position: relative;
          z-index: 1;
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
      p {
        &:nth-of-type(1) {

        }
      }
      svg {
        :nth-of-type(1) {
          font-size: 0.693rem;
          margin-bottom: -0.106rem;
          margin-left: -0.08rem;
          color: rgb(3, 174, 249);
          position: relative;
        }
      }
    }
    .my-detail {
      margin-top: 0.106rem;
      span {
        font-size: 0.346rem;
        color: #444444;
      }
      i {
        display: inline-block;
        width: 0.053rem;
        height: 0.053rem;
        border-radius: 50%;
        background: #B4B4B6;
        margin: 0 0rem 0.08rem;
      }
    }
  }
  /**********名片***************/

  .account_info {
    position: absolute;
    right: 0;
    top: 0.586rem;
    height: 0.773rem;
    border-radius: 2.666rem 0 0 2.666rem;
    line-height: 0.773rem;
    color: #FFFFFF;
    font-size: 0.346rem;
    padding-left: 0.346rem;
    padding-right: 0.4rem;
    z-index: 9;
    .icon {
      color: #808080;
    }
  }
  /**********邀请我的好友***************/
   .my-activity{
     width:100%;
     overflow: hidden;
   }
  .my-news {
    width: 82%;
    height: 1.093rem;
    border-radius: 0.213rem;
    background:url(../../statics/images/mask@3x.png) no-repeat;
    background-size:100% 100%;
    -webkit-box-shadow: 0 0 0.266rem rgb(243, 244, 246);
    -moz-box-shadow: 0 0 0.266rem rgb(243, 244, 246);
    box-shadow: 0 0 0.266rem rgb(243, 244, 246);
    position: relative;
    margin-bottom: 0.533rem;
    float: left;
    i {
      font-style: normal;
      display: inline-block;
      width: 0.8rem;
      height: 0.453rem;
      background: #E95D8C;
      font-size: 0.32rem;
      color: #FFFFFF;
      text-align: center;
      line-height: 0.453rem;
      border-radius: 0.106rem;
      margin-left: 0.3rem;
      margin-right: 0.266rem;
      position: relative;
      /*渐变*/
      background: -webkit-gradient(linear, 0 0, 100% 0, from(rgb(250, 73, 117)), to(rgb(253, 128, 173)));
      &:after {
        content: "";
        display: block;
        width: 0.16rem;
        height: 0.16rem;
        background: rgb(253, 128, 173);
        position: absolute;
        -webkit-transform: rotate(135deg);
        transform: rotate(135deg);
        right: -0.053rem;
        top: 0rem;
        bottom: 0;
        margin: auto;
      }
    }
    span {
      font-size: 0.373rem;
      color: #444444;
      line-height: 1.093rem;
    }
    p{
      font-size: 0.32rem;
      color: #444444;
      position: absolute;
      top: 0;
      bottom: 0;
      right:0.933rem;
      line-height:1.093rem;
      a{
        color:rgb(250,73,117);
        letter-spacing:0.053rem;
      }
    }
    svg {
      font-size: 0.373rem;
      color: #808080;
      position: absolute;
      right: 0.4rem;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
  .my-signIn{
    margin-left: 2%;
    float: right;
    width:16%;
    height: 1.093rem;
    text-align: center;
    line-height: 1.093rem;
    font-size: 0.373rem;
    border-radius: 0.213rem;
    color: #03AEF9;
    border:0.04rem solid #65D2F2;
    position: relative;
    overflow: hidden;
    i{
      position: absolute;
      width: 0;
      height: 0;
      border-top: 0.4rem solid #65D2F2;
      border-right: 0.4rem solid transparent;
      left:0;
      top:0;
    }
  }
  .gray {
    width: 100%;
    height: 0.266rem;
    background: #F3F4F5;
  }
  /*中间的发布认证*/

  .part2 {
    list-style: none;
    width: 100%;
    height: 1.013rem;
    margin-top: 0.506rem;
    padding-left: 0.4rem;
    padding-right: 0.4rem;
    background: #FFFFFF;
    position: relative;
    li {
      float: left;
      width: 25%;
      height: 100%;
      text-align: center;
      position: relative;
      svg {
        font-size: 0.64rem;
        margin-top: 0.266rem;
      }
      span {
        &:nth-of-type(1) {
          color: #444444;
          font-size: 0.506rem;
          line-height: 0.586rem;
        }
        &:nth-of-type(2) {
          font-size: 0.32rem;
          color: #808080;
          display: block;
          /*margin-top: 0.186rem;*/
        }
      }
    }
  }

  .enjoy {
    width: 9.146rem;
    margin: 0.453rem auto 0;
    padding-bottom: 0.25rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .component-option{
    .invite {
      span {
        &:nth-of-type(2) {
          position: absolute;
          right: 1.093rem;
          color: #B4B4B6;
          font-size: 0.32rem;
        }
      }
    }
    .signIn {
      span {
        &:nth-of-type(2) {
          width: 0.213rem;
          height: 0.213rem;
          position: absolute;
          left: 2.1rem;
          top: 0.266rem;
          border-radius: 50%;
          background: #FA4975;
          display: inline-block;
        }
      }
    }
    .optionList {
      /*width: 92%;*/
      margin: 0 auto;
      color: #444444;
      font-size: 0.4rem;
      padding: 0.293rem 0.4rem;
      position: relative;
      display: flex;
      justify-content: space-between;
      span {
        display: flex;
      }
      .icon {
        font-size: 0.346rem;
        display: flex;
        margin-top: 0.08rem;
        color: #808080;
      }
      .bot {
        right: 0.48rem;
        left: 0.426rem;
      }
    }
  }

  .guessLike {
    .component-block-title {
      height: 0.906rem;
      line-height: 0.906rem;
      .left {
        font-size: 0.346rem;
        color: #808080;
        font-family: PingFangSC-Regular;
      }
    }
  }

  .my-option {
    width: 100%;
    background: #FFFFFF;
    margin: 0;
    list-style: none;
    padding: 0 0.426rem;
    margin-bottom: 2.106rem;
    li {
      width: 100%;
      height: 1.173rem;
      padding-top: 0.32rem;
      padding-bottom: 0.32rem;
      position: relative;
      span {
        font-size: 0.373rem;
        color: #444444;
      }
      svg {
        float: right;
      }
    }
  }
  .mui-popup-inner {
    padding: 0.613rem 0.4rem 0.026rem 0.4rem;
  }

  .mui-content {
    background: #fff;
    bottom: 50px; /* px不转换 */
  }

</style>
