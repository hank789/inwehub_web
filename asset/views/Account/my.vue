<template>
  <div>
    <div class="mui-content">
      <div class="my-top">
        <div class="account_info" @tap.stop.prevent="$router.pushPlus('/my/info')">编辑名片 {{account_info_complete_percent}}%</div>
        <div class="professor">
          <div class="my-img"  @tap.stop.prevent="$router.pushPlus('/my/resume')">
            <img :src="avatar" class="avatar" />
          </div>

          <div class="my-personal">
            <div class="my-info">
              <span class="mui-ellipsis">{{name}}</span>
              <p>{{ user_level }}</p>
              <svg class="icon" aria-hidden="true" v-if="expert_apply_status =='2'">
                <use xlink:href="#icon-zhuanjiabiaoji"></use>
              </svg>
            </div>
         <div class="my-detail">
              <span @tap.stop.prevent="$router.pushPlus('/my/Growth', 'list-detail-page')">等级详情 ></span>
              <i></i>
              <span @tap.stop.prevent="$router.pushPlus('/my/advantage', 'backAndClose')">我的擅长 ></span>

            </div>
          </div>

        </div>

        <!--邀请活动-->
        <div class="my-activity">
          <div v-if="show_my_wallet" class="my-news" @tap.stop.prevent="$router.pushPlus('/invitation/index')">
            <i>返现</i>
            <span>邀请我的好友</span>
            <p><a>5%</a>返现等你拿</p>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-chakangengduojiantou"></use>
            </svg>
          </div>
          <div class="my-signIn"  @tap.stop.prevent="toSignIGift()">
            <i></i>
            签到
          </div>
        </div>


      </div>
      <!--灰色-->
      <div class="gray"></div>

      <!--part2-->
      <ul class="part2">
        <li @tap.stop.prevent="$router.pushPlus('/my/publishAnswers')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wodefankuijianyi"></use>
          </svg>
          <span>我的发布</span>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/collectUser')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wodeguanzhu"></use>
          </svg>
          <span>我的关注</span>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/my/collectedAnswers')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wodeshoucang"></use>
          </svg>
          <span>我的收藏</span>
        </li>
        <i class="bott"></i>
      </ul>
      <!--part3认证-->
      <ul class="part3">
        <li>
          <p>平台认证<i></i></p>
        </li>
        <li @tap.stop.prevent="toApply(expert_apply_status)">
          <p v-if="expert_apply_status =='0'">点击前往认证</p>
          <p v-if="expert_apply_status =='1'">认证处理中</p>
          <p v-if="expert_apply_status =='2'">身份已认证</p>
          <p v-if="expert_apply_status =='3'">失败，重新认证</p>
          <p v-if="expert_apply_status =='2'">平台认证专家</p>
          <p v-else>申请专家认证</p>
        </li>
        <li @tap.stop.prevent="toApprove(expert_apply_status)">
          <p v-if="company_apply_status =='0'">点击前往申请</p>
          <p v-if="company_apply_status =='1'">申请审核中</p>
          <p v-if="company_apply_status =='2'">切换至企业版</p>
          <p v-if="company_apply_status =='3'">失败，重新认证</p>
          <p v-if="company_apply_status =='2'">企业账号已认证</p>
          <p v-else>申请企业账号</p>
        </li>
      </ul>
      <!--gray-->
      <div class="gray"></div>
      <!--列表内容-->
      <ul class="my-option">
        <li @tap.stop.prevent="$router.pushPlus('/my/Finance')" v-if="show_my_wallet">
          <span>我的钱包</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <i class="bot"></i>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/my/Discount')">
          <span>我的报名</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <i class="bot"></i>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/feedback/advise', 'list-detail-page')">
          <span>反馈建议</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <i class="bot"></i>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/setting', 'list-detail-page')">
          <span>设置</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <i class="bot"></i>
        </li>
      </ul>

    </div>

    <div id="statusBarStyle" background="#fff" bgColor="#fff" mode="dark"></div>

  </div>
</template>
<script>
  import localEvent from '../../stores/localStorage'
  import { USERS_APPEND } from '../../stores/types'
  import { getUserInfo } from '../../utils/user'
  import userAbility from '../../utils/userAbility'

  export default {
    data () {
      const currentUser = localEvent.getLocalItem('UserInfo')
      const infomation = localEvent.getLocalItem('UserInfoReal')

      return {
        attention: infomation.info.followers,
        advisory: infomation.info.questions,
        grade: infomation.info.feedbacks,
        total_score: infomation.info.total_score,
        expert_apply_status: infomation.info.expert_apply_status,
        company_apply_status: infomation.info.company_status,
        im_tokenMsg: '',
        name: currentUser.name,
        phone: currentUser.phone,
        avatar: currentUser.avatar_url,
        title: currentUser.title,
        company: currentUser.company,
        account_info_complete_percent: currentUser.account_info_complete_percent,
        isExpert: currentUser.is_expert,
        total_money: currentUser.total_money,
        user_level: currentUser.user_level,
        user_credits: currentUser.user_credits,
        user_coins: currentUser.user_coins,
        user_submission_karma: currentUser.submission_karma,
        user_comment_karma: currentUser.comment_karma,
        user_id: currentUser.id,
        questions: currentUser.questions,
        answers: currentUser.answers,
        enroll: currentUser.my_activity_enroll,
        tasks: currentUser.tasks,
        projects: currentUser.projects,
        expert_level: currentUser.expert_level,
        show_my_wallet: currentUser.show_my_wallet,
        show_resume: true,
        my: ''
      }
    },
    methods: {
      // 签到
      // 每日签到
      toSignIGift () {
        userAbility.signIGift(this)
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
      // 认证专家跳转判断；
      toApprove () {
        this.$router.pushPlus('/company/my?back=/my')
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
          this.account_info_complete_percent = user.info.account_info_complete_percent
          this.isExpert = user.info.is_expert
          this.user_level = user.info.user_level
          this.user_credits = user.info.user_credits
          this.user_coins = user.info.user_coins
          this.user_submission_karma = user.info.submission_karma
          this.user_comment_karma = user.info.comment_karma
          this.user_id = user.info.id
          this.questions = user.info.questions
          this.enroll = user.info.my_activity_enroll
          this.answers = user.info.answers
          this.tasks = user.info.tasks
          this.projects = user.info.projects
          this.expert_level = user.info.expert_level
          this.show_my_wallet = user.info.show_my_wallet
          this.expert_apply_status = user.info.expert_apply_status
          this.company_apply_status = user.info.company_status
          this.avatar = user.info.avatar_url
          this.name = user.info.name
          this.title = user.info.title
          this.show_my_wallet = user.info.show_my_wallet
          if (window.mui.os.plus && window.mui.os.android) {
            this.show_my_wallet = true
          }
          userAbility.newbieTask(this)
        }))
      }
    },
    activated: function () {
      console.log('activated')
      this.initData()
    },
    mounted () {
    }
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

  .my-top {
    width: 92%;
    overflow: hidden;
    margin-left: 4%;
    background-color: #ffffff;

  }

  .professor {
    width: 100%;
    height: 3.2rem;
  }
  .professor .my-img{
    /*width: 21%;*/
    height: 100%;
    float: left;
  }
  .professor .avatar {
    width: 1.84rem;
    height: 1.826rem;
    border-radius: 50%;
    margin-top: 0.666rem;

  }

  .my-personal {
    /*width: 79%;*/
    height: 1.84rem;
    margin-top: 0.666rem;
    float: left;
  }

  .my-personal .my-info {
    width: 100%;
    height: 0.8rem;
    margin-top: 0.24rem;
    position: relative;
  }

  .my-personal .my-info span:nth-of-type(1) {
    display: inline-block;
    max-width: 1.92rem;
    font-size: 0.48rem;
    font-weight: 600;
    color: #444444;
    margin-right: 0.04rem;
    margin-bottom: -0.106rem;
  }

  .my-personal .my-info p:nth-of-type(1) {
    width: 0.506rem;
    height: 0.48rem;
    display: inline-block;
    position: relative;
    top: -0.08rem;
    font-style: normal;
    line-height: 0.4rem;
    font-size: 0.266rem;
    color: #FFFFFF;
    text-align: center;
    background: url("../../statics/images/rank.png") no-repeat;
    background-size: 0.506rem 0.48rem;
    background-position: top;
  }

  .my-personal .my-info svg:nth-of-type(1) {
    font-size: 0.693rem;
    margin-bottom: -0.106rem;
    margin-left: -0.08rem;
    color: rgb(3, 174, 249);
    position: relative;
  }
  /**********等级 擅长部分***************/

  .my-personal .my-detail {
    width: 100%;
    height: 0.8rem;
  }

  .my-detail span {
    font-size: 0.346rem;
    color: #444444;
  }

  .my-detail i {
    display: inline-block;
    width: 0.026rem;
    height: 0.32rem;
    background: #DCDCDC;
    margin-left: 0.24rem;
    margin-right: 0.24rem;
    margin-bottom: -0.053rem;
  }
  /**********名片***************/

  .account_info {
    position: absolute;
    right: 0;
    top: 4%;
    height: 0.773rem;
    border-radius: 2.666rem 0 0 2.666rem;
    background: #03aef9;
    line-height: 0.773rem;
    color: #FFFFFF;
    font-size: 0.373rem;
    padding-left: 0.346rem;
    padding-right: 0.4rem;
    z-index: 9;
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
  }

  .my-news i {
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
  }

  .my-news i:after {
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

  .my-news span {
    font-size: 0.373rem;
    color: #444444;
    line-height: 1.093rem;
  }
  .my-news p{
    font-size: 0.32rem;
    color: #444444;
    position: absolute;
    top: 0;
    bottom: 0;
    right:0.933rem;
    line-height:1.093rem;
  }
  .my-news p a{
    color:rgb(250,73,117);
    font-style: 0.32rem;
    letter-spacing:0.053rem;
  }

  .my-news svg {
    font-size: 0.373rem;
    color: #808080;
    position: absolute;
    right: 0.4rem;
    top: 0;
    bottom: 0;
    margin: auto;
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
  }
  .my-signIn i{
    position: absolute;
    width: 0;
    height: 0;
    border-top: 0.4rem solid #65D2F2;
    border-right: 0.4rem solid transparent;
    left:0;
    top:0;
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
    height: 1.92rem;
    padding-left: 0.4rem;
    padding-right: 0.4rem;
    background: #FFFFFF;
    position: relative;
  }

  .part2 li {
    float: left;
    width: 33%;
    height: 100%;
    text-align: center;
    position: relative;
  }

  .part2 li svg {
    font-size: 0.64rem;
    margin-top: 0.266rem;
  }

  .part2 li span {
    font-size: 0.32rem;
    color: #808080;
    display: block;
    margin-top: 0.186rem;
  }
  /*part3认证*/

  .part3 {
    list-style: none;
    width: 100%;
    height: 1.946rem;
    padding-left: 0.4rem;
    padding-right: 0.4rem;
    background: #FFFFFF;
    position: relative;
  }

  .part3 li {
    float: left;
    width: 33%;
    height: 100%;
    text-align: center;
    position: relative;
  }

  .part3 li p:nth-of-type(1) {
    display: inline-block;
    height: 0.506rem;
    font-size: 0.346rem;
    text-align: center;
    color: #ffffff;
    line-height: 0.506rem;
    background: #fcc816;
    border-radius: 2.666rem;
    margin-top: 0.32rem;
    padding: 0 0.133rem 0 0.133rem;
  }

  .part3 li p:nth-of-type(2) {
    text-align: center;
    font-size: 0.346rem;
    color: #808080;
    position: absolute;
    top: 1.066rem;
    left: 0;
    right: 0;
    margin: auto;
  }

  .part3 li:nth-of-type(1) p {
    background: #FFF;
    font-size: 0.346rem;
    color: #808080;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .part3 li:nth-of-type(1) p i {
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 0.213rem solid transparent;
    border-bottom: 0.16rem solid transparent;
    border-left: 0.16rem solid #dcdcdc;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    margin-left: 0.16rem;
  }
  /*底部*/

  .my-option {
    width: 100%;
    background: #FFFFFF;
    padding: 0;
    margin: 0;
    list-style: none;
    padding-left: 0.426rem;
    padding-right: 0.426rem;
    margin-bottom: 2.106rem;
  }

  .my-option li {
    width: 100%;
    height: 1.173rem;
    padding-top: 0.32rem;
    padding-bottom: 0.32rem;
    position: relative;
  }

  .my-option li span {
    font-size: 0.373rem;
    color: #444444;
  }

  .my-option li svg {
    float: right;
  }

  .mui-popup-inner {
    padding: 0.613rem 0.4rem 0.026rem 0.4rem;
  }

  .mui-content {
    background: #fff;
  }

  /*container-image */
   /* 适配*/
@media (min-width: 320px) {
  .professor .my-img{
    width: 26%;
    }
    .my-personal {
     width: 74%;
    }

}
@media (min-width: 375px) {
   .professor .my-img{
    width: 23%;
    }
    .my-personal {
     width: 77%;
    }

}
@media (min-width: 414px) {
    .professor .my-img{
     width: 21%;
    }
    .my-personal {
     width: 79%;
    }
}

</style>
