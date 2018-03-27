<template>
  <div :style="style">
    <!--点击时间添加class -> alertConfirm-->
    <!--级别限制提示的弹窗-->
    <div id="test">
      <div class="p-level">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xitongbengkuimeiyouwangluo"></use>
        </svg>
        <p>努努力 升升级 即可解锁功能</p>
        <p>
          <span>当前等级</span>
          <span>{{ options.level ? options.level : ''}}</span>
        </p>
      </div>
    </div>
    <!-- 升级的弹窗-->
    <div id="p-upgrade">
      <div class="p-upgrade">
        <div class="upgrade_t">
          <p><span>恭喜你升级L{{options.level ? options.level : ''}}</span>
            <span>{{options.level ? options.level : ''}}</span>
          </p>
          <p>以下特权已解锁</p>
        </div>
        <div class="upgrade_b">
          <p v-if="options.level =='1'">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-chengchangye-zhuanyewenda"></use>
            </svg>
            <span>专业问答</span>
          </p>
          <p v-if="options.level =='1'">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-chengchangye-hudongpinglun"></use>
            </svg>
            <span>评论互动</span>
          </p>
          <p v-if="options.level =='2'">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-chengchangye-baominghuodong"></use>
            </svg>
            <span>活动报名</span>
          </p>
          <p v-if="options.level =='2'">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-chengchangye-baominghuodong"></use>
            </svg>
            <span>活动报名</span>
          </p>
          <p v-if="options.level =='3'">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-chengchangye-fabuqiyexuqiu"></use>
            </svg>
            <span>企业需求对接</span>
          </p>
          <p v-if="options.level =='3'">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-wendashequ"></use>
            </svg>
            <span>问答社区</span>
          </p>
          <p v-if="options.level =='3'">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiangmujiyu"></use>
            </svg>
            <span>项目机遇</span>
          </p>
          <p v-if="options.level =='3'">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-chengchangye-zhuanshumishu"></use>
            </svg>
            <span>专属秘书</span>
          </p>
          <p v-if="options.level =='4'">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fujinqiye"></use>
            </svg>
            <span>附近企业</span>
          </p>
          <p v-if="options.level =='4'">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-gengduozhuanjia"></use>
            </svg>
            <span>更多专家</span>
          </p>
        </div>
        <div class="upgrade_btn alertConfirm">确定</div>
      </div>
    </div>
    <!-- 领取新手任务-->
    <div id="p-task">
      <div class="p-task">
        <div class="task_t">
          <p>快来领取新手任务!</p>
          <p>完成任务参与积分奖励，升级L2获取新特权！</p>
        </div>

        <ul class="task_b">
          <li>
            <p>完善顾问名片</p>
            <p>个人信息保持90%以上完整度</p>
          </li>
          <li>
            <p>参与评论互动</p>
            <p>前往发现阅读，参与评论</p>
          </li>
          <li>
            <p>发起专业提问</p>
            <p>送你首次提问1元特惠卷</p>
          </li>
        </ul>
        <div class="task_btn alertConfirm">确定</div>
      </div>
    </div>
    <!-- 完善名片提示-->
    <div id="p-perfectCard">
      <div id="perfectCard-t">
        <div class="perfectCard-t">
          <p>恭喜！你的名片比较完善了</p>
          <p>（成长值<i>+{{options.perfectCard_credits}}</i>）</p>
        </div>
      </div>
      <div id="perfectCard-b">
        <div class="perfectCard-b alertConfirm">
          查看名片并可分享
        </div>
      </div>
    </div>

    <!--提问页的分红细则-->
    <div id="fenhongxize">
      <div class="fenhongxize">
        <div class="title">分红细则</div>
        <div class="desc">依支付金额不同，问题被查看后提问者与回答者按照以下比例结算：</div>
        <ul class="items">
          <li class="item">28元提问，按3:7分成</li>
          <li class="item">60元提问，按5:5分成</li>
          <li class="item">88元提问，按7:3分成</li>
          <li class="item">首问一元特惠提问，查看收入全部归回答者所有</li>
        </ul>
      </div>
    </div>

    <!--提问页内的弹窗-->
    <div id="helpWrapper">
      <div class="helpWrapper">
        <div class="title">什么是专业问答？</div>
        <div class="desc">InweHub致力于营造高品质专家帮助社区，通过平台入驻的专家，解决您面临的咨询或SAP的相关疑问。</div>
        <div class="desc desc-1">专家准入具有较高门槛，我们会根据您的提问自动匹配回答专家，提问请遵守相关问答规范。</div>
      </div>
    </div>

    <!--问答社区详情页分享成功-->
    <div id="askCommunityDetailShare" class="boxWrapper">
      <div id="askCommunityDetailShare_title">
        <div class="askCommunityDetailShare_title">
          <div class="title">分享成功！</div>
          <div class="titleSub">（成长值<span>+1</span>）</div>
        </div>
      </div>
      <div id="askCommunityDetailShare_body">
        <div class="askCommunityDetailShare_body">
          <div class="title">相关阅读推荐</div>
          <ul class="normal">
            <li>开发中...</li>
            <li>开发中...</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 专家申请成功呢提示-->
    <div id="p-expertapplication">
      <div id="expertapplication-t">
        <div class="expertapplication-t">
          <p>恭喜！您已成为平台专家</p>
          <p>（成长值<i>+{{options.expert_credits}}</i>，贡献值<i>+{{options.expert_coins}}</i>）</p>
        </div>
      </div>
      <div id="expertapplication-b">
        <div class="expertapplication-b alertConfirm">
          查看个人海报并可分享
        </div>
      </div>
    </div>
    <!--互动问答答案提交成功-->
    <div id="community_t">
      <div class="article_t">
        <p>你的答案已成功提交！</p>
        <p>（成长值<i>+{{options.answercredits}}</i>，贡献值<i>+{{options.answercoins}}</i>）</p>
      </div>
    </div>
    <div id="community_b">
      <ul class="hotAnswer_b">
        <span class="share alertConfirm">分享我的回答</span>
      </ul>
    </div>

    <!--互动问答提问成功-->
    <div id="ask_t">
      <div class="article_t">
        <p>提问成功！可邀请好友回答</p>
        <p>（成长值<i>+{{options.askcredits}}</i>，贡献值<i>+{{options.askcoins}}</i>）</p>
      </div>
    </div>
    <div id="ask_b">
      <ul class="hotAnswer_b">
        <span class="ask_share alertConfirm">邀请好友回答</span>
      </ul>

    </div>
    <!--专业问答的提问成功-->
    <div id="majoraskSubmit_t">
      <div class="article_t">
        <p>提问成功！正为你匹配专家</p>
        <p>（成长值<i>+{{options.major_ask_credits }}</i>，贡献值<i>+{{options.major_ask_coins}}</i>）</p>
      </div>
    </div>
    <div id="majoraskSubmit_b">
      <ul class="hotAnswer_b">
        <span class="ask_share alertConfirm">返回问答社区</span>
      </ul>

    </div>
    <!--专业问答的回答成功-->
    <div id="majoraskAnswer_t">
      <div class="article_t">
        <p>你的答案已成功提交！</p>
        <p>（成长值<i>+{{options.major_answer_credits}}</i>，贡献值<i>+{{options.major_answer_coins}}</i>）</p>
      </div>
    </div>
    <div id="majoraskAnswer_b">
      <ul class="hotAnswer_b">
        <span class="alertConfirm share">分享我的问答</span>
        <span class="ask_divided">其他人查看答案，你可从中获取分成</span>
      </ul>
    </div>

    <!--专业问答提问者的评论成功-->
    <div id="majoraskcomment_t">
      <div class="article_t">
        <p>你的评价已成功提交！</p>
        <p>（成长值<i>+{{options.major_comment_credits}}</i>，贡献值<i>+{{options.major_comment_coins}}</i>）</p>
      </div>
    </div>
    <div id="majoraskcomment_b">
      <ul class="hotAnswer_b">
        <span class="alertConfirm share">分享我的问答</span>
        <span class="ask_divided">其他人查看答案，你可从中获取分成</span>
      </ul>
    </div>
    <!--专业问答围观者的评论成功-->
    <div id="OnlookersAskcomment_t">
      <div class="article_t">
        <p>你的评价已成功提交！</p>
        <p>（成长值<i>+{{options.Onlookers_comment_credits}}</i>，贡献值<i>+{{options.Onlookers_comment_coins}}</i>）</p>
      </div>
    </div>
    <div id="OnlookersAskcomment_b">
      <ul class="hotAnswer_b">
        <span class="alertConfirm share">分享我的围观</span>
      </ul>
    </div>

    <div id="AnswerRepeat">
      <div class="AnswerRepeat">
        <p>手慢了一步</p>
        <p>很遗憾，已经有专家抢先回答</p>
      </div>
    </div>

    <div id="CompanyUser">
      <div class="CompanyUser">
        <p>申请企业服务或获取详情介绍！</p>
        <p>会有销售顾问尽快联系您</p>
      </div>
    </div>

    <div id="Company">
      <div class="Company">
        <p>您还不是企业版用户！</p>
        <p>暂不能申请企业服务</p>
      </div>
    </div>
    <!--个人简历 -> 聊天界面 个人名片资料完整度不足94%的弹窗-->
    <div id="chat">
      <div class="chat">
        <p>资料完整才能发私信！</p>
        <p>完整是为了对方更容易识别您，您离资料完成还差{{90 - options.percent}}%</p>
      </div>
    </div>
    <!--签到的弹窗-->
    <div id="signIn">
      <div class="signIn">
         <div class="signIn_t">
           <img src="../statics/images/sign_title@2x.png">
           <p>连续签到将获现金红包，漏签将清零重置！</p>
         </div>
         <ul class="signIn_m">
           <li v-for="(day, index) in options.signList.info">
             <!--点击签到-->
             <p class="click-signIn alertConfirm" v-if="(options.signList.days === 0 ? 1 : options.signList.days) === day.day && day.signed === 0 && day.coupon_type === 0"><span>点击签到</span></p>
             <!--默认天数-->
             <p v-else-if="day.signed === 0 && day.coupon_type === 0">第{{day.day}}天</p>
             <!--点击签到红包-->
             <p  class="alertConfirm"  v-else-if="options.signList.days + 1 === day.day && day.signed === 0 && day.coupon_type != 0">
               <img src="../statics/images/signIn-money@2x.png"/>
             </p>
             <!--默认红包样式-->
             <p  v-else-if="day.signed === 0 && day.coupon_type != 0">
              <img src="../statics/images/money-disabled@2x.png"/>
             </p>
             <!--红包领取后的样式-->
             <p  v-else-if="day.signed === 1 && day.coupon_type != 0">
               <img src="../statics/images/getCoupon@2x.png"/>
             </p>
             <!--领取后的样式-->
             <p v-else-if="day.signed === 1 && day.coupon_type === 0">
               <img src="../statics/images/signIn-succeed@2x.png"/>
             </p>
             <p v-if="day.signed === 1">已领取</p>
             <p v-else-if="day.coupon_type === 2">小红包</p>
             <p v-else-if="day.coupon_type === 3">大红包</p>
             <p v-else>成长值{{day.credits}}</p>

           </li>
         </ul>
         <div class="signIn_b">
           <p>当前成长值：{{options.signList.total_credits}} <i>（我的>我的分值）</i></p>
           <p>钱包余额：¥{{options.signList.total_money}} <i>（我的>我的红包）</i></p>
         </div>
      </div>
    </div>
    <!--签到获取的成长值弹窗-->
    <div id="scoreDetail">
      <div class="scoreDetail">
        <svg class="icon alertClose" aria-hidden="true">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
        <p>您已成功签到{{options.signDaily.days}}天！</p>
        <p>成长值<i>+{{options.signDaily.credits}}</i></p>
        <div class="scoreDetail-m">
          <p class="Prompt">
            <b :style="'left:'+ (options.current_credits_Percent - 6) +'%'">{{options.signDaily.current_credits}}</b>
          </p>
          <div class="ProgressBar">
            <div>
              <i :style="'width:'+ options.current_credits_Percent +'%'"></i>
            </div>
            <p class="fouce">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </p>
            <p class="number">
              <span>L1</span>
              <span>L2</span>
              <span>L3</span>
              <span>L4</span>
              <span>L5</span>
            </p>
          </div>
        </div>
        <p class="alertConfirm">查看分值详情</p>
      </div>
    </div>
    <!--红包的金额详情-->
    <div id="animationContainerTop" style="width:7.813rem; height:8.96rem">
      <div id="animationContainer" style="width:7.813rem; height:8.96rem">
        <canvas id="canvas" width="293" height="336"></canvas>
        <div id="domOverlayContainer" style="pointer-events:none; overflow:hidden; width:7.813rem; height:8.96rem; position: absolute; left: 0rem; top: 0rem; display: block;">
        </div>
        <!--红包详情-->
        <div class="my-cash" id="my-cash">
          <p><span>¥</span>{{options.Coupon.coupon_value}}</p>
          <i></i>
          <div class="home_invitation"  v-if="options.Coupon.coupon_type === 4">
            <p>{{options.Coupon.coupon_description}}</p>
            <p>受邀注册红包</p>
          </div>
          <p v-else-if="options.Coupon.coupon_value_type === 1">现金红包</p>
          <p v-else-if="options.Coupon.coupon_value_type === 2">成长值红包</p>
          <p v-else-if="options.Coupon.coupon_value_type === 3">贡献值红包</p>



        </div>
        <!--跳转按钮-->
        <p class="my-wallet alertConfirm" id="my-wallet" v-if="options.Coupon.coupon_type === 4">前往付费围观专业回答</p>
        <p class="my-wallet alertConfirm" id=" my-wallet" v-else>前往付费围观专业回答</p>
        <!---->
      </div>
      <!--关闭按钮-->
      <div class="cash-button alertClose">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
      </div>
    </div>

    <!--开启通知-->
    <div id="openNotice">
      <div class="openNotice">
        <p>现在开启通知，不错过任何一次可能的平台合作机会呦~</p>
        <p>“设置”-“通知”-开启InweHub</p>
        <ul>
          <li class="alertConfirm">现在开启</li>
          <li class="alertConfirm">不再提醒</li>
          <li class="alertConfirm">稍后提醒</li>
        </ul>
      </div>
    </div>
    <!--抽奖弹窗-->
    <div id="luckDraw">
      <div class="luckDraw">
        <p class="qualification">恭喜您获得抽奖资格!</p>

        <div class="title_invitation">
          <div class="cions-avatar">
            <img :src="options.invitation.user_avatar" @tap.stop.prevent="toAvatar(invitationList.user_uuid)"/>
            <svg class="icon" aria-hidden="true" v-if="options.invitation.user_is_expert">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
          <div class="text">
            <p>{{ options.invitation.user_name}}<i></i>本月已邀请{{ options.invitation.current_month_invited_users}}人</p>
            <p>手机号：{{ options.invitation.user_mobile}}</p>
          </div>
        </div>

        <div class="search">扫码或搜索hiinwe添加小哈微信，截此页图给小哈，由小哈邀请加入抽奖群。</div>

        <div class="wechat">
          <img src="../statics/images/dialog-wechat@2x.png" />
        </div>
        <div class="waiting">入群后点击抽奖链接，并等待开奖。</div>
        <p class="btn alertClose">确定</p>
      </div>
    </div>
    <!--bot-->

  </div>
</template>
<script type="text/javascript">
  import { getUserLevelPercentage } from '../utils/user'

  export default {
    data () {
      return {
        style: 'display:none',
        options: {
          ok: 'test',
          level: 3,
          questlist: [],
          answerlist: [],
          askcredits: '',
          askcoins: '',
          answercoins: '',
          answercredits: '',
          expert_coins: '',
          expert_credits: '',
          readhub_commen_credits: '',
          perfectCard_credits: '',
          major_ask_credits: '',
          major_ask_coins: '',
          major_answer_credits: '',
          major_answer_coins: '',
          major_comment_coins: '',
          major_comment_credits: '',
          Onlookers_comment_coins: '',
          Onlookers_comment_credits: '',
          percent: '',
          signList: {
            info: [],
            days: '',
            total_credits: '',
            total_coins: '',
            total_money: ''
          },
          signDaily: {
            days: '',
            credits: '',
            coins: '',
            current_credits: ''
          },
          current_credits_Percent: getUserLevelPercentage(),
          Coupon: {
            coupon_value: '',
            coupon_value_type: '',
            coupon_description: ''
          },
          invitation: {
            user_name: '',
            user_mobile: '',
            user_is_expert: '',
            user_avatar: '',
            current_month_invited_users: ''
          }
        }
      }
    },
    created () {
      if (this.$route.path === '/dialog/list') {
        this.style = ''
      } else {
        this.style = 'display:none'
      }
    },
    methods: {
      getHtml (id, options, callback) {
        this.options = Object.assign(this.options, options)
        this.$nextTick(() => {
          var obj = document.getElementById(id)
          if (obj) {
            callback(obj.innerHTML.toString().trim().replace(/\n/g, ''))
          } else {
            callback('')
          }
        })
      }
    },
    mounted () {
    }
  }
</script>

<style scoped="scoped">
  #test {
    width: 6.4rem;
    height: 2.933rem;
    border: 0.026rem solid #007AFF;
  }

  ul,
  li,
  p,
  span,
  a,
  i {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  /*显示等级弹窗样式*/

  .p-level {
    width: 6.4rem;
    height: 2.933rem;
    /*background: #CCCCCC;*/
    text-align: center;
  }

  .p-level > svg {
    font-size: 1.333rem;
  }

  .p-level > p:nth-of-type(1) {
    font-size: 0.426rem;
    color: #444444;
    margin-top: 0.266rem;
    width: 100%;
    height: 0.533rem;
    text-align: center;
    line-height: 0.533rem;
  }

  .p-level > p:nth-of-type(2) {
    width: 36%;
    margin-left: 32%;
    height: 0.533rem;
    margin-top: 0.08rem;
    /*background: #CCCCCC;*/
  }

  .p-level > p:nth-of-type(2) span:nth-of-type(1) {
    display: block;
    width: 80%;
    height: 100%;
    float: left;
    font-size: 0.373rem;
    color: #b4b4b6;
  }

  .p-level > p:nth-of-type(2) span:nth-of-type(2) {
    display: block;
    float: left;
    width: 20%;
    height: 100%;
    background: url(../statics/images/rank.png) no-repeat;
    background-size: 100%;
    margin-top: 0.053rem;
    text-align: center;
    line-height: 0.32rem;
    color: #FFFFFF;
  }

  /*升级的弹窗*/

  #p-upgrade {
    width: 6.4rem;
    /*height: 4.266rem;*/
    border: 0.026rem solid #009689;
  }

  .p-upgrade {
    width: 6.4rem;
    /*height: 4.266rem;*/
  }

  .upgrade_t {
    width: 100%;
    height: 1.733rem;
    border-bottom: 0.013rem dashed #DCDCDC;
  }

  .upgrade_t p:nth-of-type(1) {
    width: 60%;
    margin-left: 20%;
    height: 0.56rem;
  }

  .upgrade_t p:nth-of-type(1) span:nth-of-type(1) {
    color: #03aef9;
    font-size: 0.506rem;
    float: left;
    width: 85%;
    /*background: #007AFF;*/
  }

  .upgrade_t p:nth-of-type(1) span:nth-of-type(2) {
    width: 15%;
    height: 100%;
    background: url(../statics/images/rank.png) no-repeat;
    background-size: 100%;
    float: left;
    text-align: center;
    line-height: 0.48rem;
    color: #FFFFFF;
  }

  .upgrade_t p:nth-of-type(2) {
    width: 50%;
    margin-left: 20%;
    text-align: center;
    line-height: 0.48rem;
    margin-top: 0.08rem;
    font-size: 0.373rem;
    color: #808080;
  }

  .upgrade_b {
    width: 100%;
    /*height: 2.533rem;*/
    overflow: hidden;
    text-align: center;
    border-bottom: 0.013rem solid #DCDCDC;
  }

  .upgrade_b > p {
    width: 27%;
    height: 2.666rem;
    float: left;
    margin-left: 4.75%;
  }

  .upgrade_b > p svg {
    font-size: 1.066rem;
    color: #fcc916;
    margin-top: 0.48rem;
  }

  .upgrade_b > p span {
    display: block;
    font-size: 0.346rem;
    color: #444444;
  }

  .upgrade_btn {
    width: 100%;
    height: 1.333rem;
    /*background: #CCCCCC;*/
    text-align: center;
    line-height: 1.333rem;
    color: #03aef9;
    font-size: 0.426rem;
  }

  /*领取新手任务*/

  #p-task {
    width: 6.533rem;
    height: 8.533rem;
  }

  .p-task {
    width: 6.533rem;
    height: 8.533rem;
    border: 0.026rem solid #ffffff;
  }

  .task_t {
    width: 100%;
    height: 1.306rem;
  }

  .task_t p:nth-of-type(1) {
    color: #03aef9;
    font-size: 0.426rem;
    font-weight: 500;
    text-align: center;
  }

  .task_t p:nth-of-type(2) {
    color: #808080;
    font-size: 0.32rem;
    text-align: center;
  }

  .task_b {
    width: 100%;
    height: 6.16rem;
    margin: 0;
  }

  .task_b li {
    width: 100%;
    height: 2.053rem;
    text-align: center;
    border-bottom: 0.013rem solid #DCDCDC;
    padding-top: 0.453rem;
  }

  .task_b li p:nth-of-type(1) {
    width: 100%;
    text-align: center;
    font-size: 0.426rem;
    color: #444444;
  }

  .task_b li p:nth-of-type(2) {
    font-size: 0.373rem;
    color: #808080;
  }

  .task_btn {
    width: 100%;
    height: 1.333rem;
    /*background: #CCCCCC;*/
    text-align: center;
    line-height: 1.333rem;
    color: #03aef9;
    font-size: 0.426rem;
  }

  /*完善名片提示*/

  #perfectCard-t {
    width: 6.4rem;
    height: 3.12rem;
  }

  .perfectCard-t {
    width: 6.666rem;
    height: 2.666rem;
    /*border: 0.026rem solid #DCDCDC;*/
  }

  .perfectCard-t p:nth-child(1) {
    font-size: 0.506rem;
    color: #444444;
    text-align: center;
    margin-top: 0.826rem;
  }

  .perfectCard-t p:nth-child(2) {
    font-size: 0.373rem;
    color: #808080;
    text-align: center;
    margin-top: 0.2rem;
  }

  .perfectCard-t p:nth-child(2) i {
    color: #03aef9;
    font-style: normal;
  }

  #perfectCard-b {
    width: 6.4rem;
    height: 1.44rem;
    /*background: #CCCCCC;*/
  }

  .perfectCard-b {
    width: 6.4rem;
    height: 1.44rem;
    font-size: 0.426rem;
    color: #03aef9;
    text-align: center;
    line-height: 1.44rem;
  }

  .fenhongxize .title {
    text-align: center;
    font-size: 0.426rem;
    color: #444;
  }

  .fenhongxize .desc {
    margin-top: 0.533rem;
    font-size: 0.373rem;
    line-height: 0.56rem;
    color: #808080;
  }

  .fenhongxize ul {
    padding: 0 0 0 0.533rem;
    margin: 0.213rem 0 0;
  }

  .fenhongxize ul li.item {
    position: relative;
    list-style: none;
    font-size: 0.373rem;
    padding: 0.213rem 0;
    color: #808080;
  }

  .fenhongxize ul li.item:before {
    content: '';
    background: #03aef9;
    border: 0.026rem solid #03aef9;
    position: absolute;
    border-radius: 50%;
    width: 0.08rem;
    height: 0.08rem;
    left: -0.373rem;
    top: 0.426rem;
  }

  .helpWrapper {
    background: #fff;
    position: relative;
  }

  .helpWrapper .title {
    font-size: 0.426rem;
    text-align: center;
    color: #444;
    margin-bottom: 0.4rem;
  }

  .helpWrapper .desc {
    font-size: 0.373rem;
    color: #444;
  }

  .helpWrapper .desc-1 {
    margin-top: 0.533rem;
  }

  .boxWrapper {
    border: 0.026rem solid blue;
  }

  .askCommunityDetailShare_title {
    text-align: center;
    margin-top: 0.453rem;
  }

  .askCommunityDetailShare_title .title {
    font-size: 0.506rem;
    color: #444;
  }

  .askCommunityDetailShare_title .titleSub {
    margin-top: 0.266rem;
    font-size: 0.373rem;
    color: #808080;
  }

  .askCommunityDetailShare_title .titleSub span {
    color: #03aef9;
  }

  .askCommunityDetailShare_body .title {
    font-size: 0.373rem;
    color: #808080;
  }

  /*认证专家*/
  /*完善名片提示*/

  #expertapplication-t {
    width: 6.4rem;
    height: 3.12rem;
    border: 0.026rem solid #DCDCDC;
  }

  .expertapplication-t {
    width: 6.666rem;
    height: 2.666rem;
  }

  .expertapplication-t p:nth-child(1) {
    font-size: 0.506rem;
    color: #444444;
    text-align: center;
    margin-top: 0.826rem;
  }

  .expertapplication-t p:nth-child(2) {
    font-size: 0.373rem;
    color: #808080;
    text-align: center;
    margin-top: 0.2rem;
  }

  .expertapplication-t p:nth-child(2) i {
    color: #03aef9;
    font-style: normal;
  }

  #expertapplication-b {
    width: 6.4rem;
    height: 1.44rem;
    /*background: #CCCCCC;*/
  }

  .expertapplication-b {
    width: 6.4rem;
    height: 1.44rem;
    font-size: 0.426rem;
    color: #03aef9;
    text-align: center;
    line-height: 1.44rem;
  }

  /*文章*/

  .article_t {
    /*width: 6.4rem;*/
    /*height: 2.666rem;*/
    /* border: 0.026rem solid #CCCCCC;*/
    margin-top: 0.533rem;
  }

  .article_t p:nth-child(1) {
    font-size: 0.506rem;
    color: #444444;
    text-align: center;
    margin-top: 0.4rem;
  }

  .article_t p:nth-child(2) {
    font-size: 0.373rem;
    color: #808080;
    margin-top: 0.213rem;
    text-align: center;
  }

  .article_t p:nth-child(2) i {
    font-size: 0.373rem;
    color: #03aef9;
    font-style: normal;
  }

  .article_b li {
    font-size: 0.373rem;
    color: #444444;
    margin-bottom: 0.32rem;
    position: relative;
    margin-left: 0.346rem;
  }

  .article_b span {
    font-size: 0.373rem;
    color: #808080;
    margin-top: 0.4rem;
    margin-bottom: 0.32rem;
    display: block;
  }

  .article_b li:before {
    content: '';
    background: #03aef9;
    border: 0.026rem solid #03aef9;
    position: absolute;
    border-radius: 50%;
    width: 0.08rem;
    height: 0.08rem;
    top: 0.213rem;
    left: -0.266rem;
  }

  .article_b p {
    color: #03aef9;
    font-size: 0.426rem;
    border-top: 0.026rem solid #dcdcdc;
    text-align: center;
    padding-top: 0.4rem;
    padding-bottom: 0rem;
  }

  /*互动问答答案提交成功*/

  .hotAnswer_b {
    width: 100%;
    overflow: hidden;
  }

  .hotAnswer_b li {
    width: 100%;
    overflow: hidden;
    padding: 0.32rem 0;
    position: relative;
  }

  .hotAnswer_b li > p {
    font-size: 0.373rem;
    color: #444444;
  }

  .hotAnswer_d {
    width: 100%;
    height: 0.853rem;
    margin-top: 0.12rem;
  }

  .hotAnswer_d p {
    float: left;
  }

  .hotAnswer_d p:nth-child(1) {
    width: 0.853rem;
    height: 0.853rem;
    /*background: #CCCCCC;*/
    position: relative;
  }

  .hotAnswer_d p:nth-child(1) > svg {
    position: absolute;
    font-size: 0.373rem;
    bottom: 0;
    right: -0.106rem;
  }

  .hotAnswer_d p:nth-child(1) > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .hotAnswer_d p:nth-child(2) {
    /*width: 9.066rem;*/
    height: 0.48rem;
    margin-top: 0.24rem;
    line-height: 0.48rem;
    font-size: 0.346rem;
    color: #808080;
    /*background: #CCCCCC;*/
    margin-left: 0.213rem;
  }

  .hotAnswer_recommend {
    font-size: 0.373rem;
    color: #808080;
    /*margin-top: 0.4rem;*/
  }

  .hotAnswer_b .share {
    display: block;
    width: 100%;
    height: 1.066rem;
    background: #03aef9;
    border-radius: 0.106rem;
    font-size: 0.426rem;
    color: #FFFFFF;
    text-align: center;
    line-height: 1.066rem;
    margin-top: 0.133rem;
  }

  /*提问成功*/

  .hotAnswer_b .ask_share {
    display: block;
    width: 100%;
    height: 1.066rem;
    font-size: 0.426rem;
    color: #03aef9;
    text-align: center;
    line-height: 1.066rem;
    margin-top: 0.133rem;
  }

  .hotAnswer_b .ask_divided {
    display: block;
    width: 100%;
    height: 0.8rem;
    font-size: 0.346rem;
    color: #808080;
    text-align: center;
    margin-top: 0.266rem;
  }

  /*
   * 专业问答被抢答之后的弹窗；
   */
  .AnswerRepeat {
    width: 100%;

  }

  .AnswerRepeat p:nth-of-type(1) {
    font-size: 0.426rem;
    color: #444444;
    text-align: center;
  }

  .AnswerRepeat p:nth-of-type(2) {
    font-size: 0.373rem;
    color: #444444;
    text-align: center;
    margin-top: 0.4rem;
  }
/* 是企业用户判读*/

  .CompanyUser {
    width: 100%;
  }
  .CompanyUser p:nth-of-type(1) {
    font-size: 0.426rem;
    color:#444444;
    text-align: center;
    margin-top: 0.533rem;
  }

  .CompanyUser p:nth-of-type(2) {
    font-size: 0.373rem;
    color: #808080;
    text-align: center;
    margin-top: 0.08rem;
  }
  /* 不是企业用户判读*/

  .Company {
    width: 100%;
  }
  .Company p:nth-of-type(1) {
    font-size: 0.426rem;
    color:#444444;
    text-align: center;
    margin-top: 0.533rem;
  }

  .Company p:nth-of-type(2) {
    font-size: 0.373rem;
    color: #808080;
    text-align: center;
    margin-top: 0.08rem;
  }
  /*聊天条件弹窗样式*/
  .chat {
    width: 100%;
  }
  .chat p:nth-of-type(1) {
    font-size: 0.426rem;
    color:#444444;
    text-align: center;
    margin-top: 0.533rem;
  }

  .chat p:nth-of-type(2) {
    font-size: 0.373rem;
    color: #808080;
    text-align: center;
    margin-top: 0.08rem;
  }
  /* 签到的弹窗 */
  .signIn {
    width:100%;
  }
  .signIn_t{
    width:100%;
    margin: 0 auto;
    text-align: center;
  }
  .signIn_t img{
    height:0.666rem;
  }
  .signIn_t p{
    font-size:0.373rem;
    color: #444444;
    margin-bottom: 0.426rem;
  }
  .signIn_m{
    width:104%;
    margin: 0 auto;
    overflow: hidden;
    padding: 0.453rem 0;
    border-bottom:0.026rem dashed #dcdcdc;
    border-top:0.026rem dashed #dcdcdc;
  }
  .signIn_m li{
    width:25%;
    height:2.01rem;
    text-align: center;
    float: left;
    text-align: center;
  }
  .signIn_m li:nth-of-type(1){
    margin-left: 12.5%;
  }
  .signIn_m li:nth-of-type(3){
    margin-right: 12.5%;
  }
  .signIn_m li p:nth-of-type(1){
    width:1.36rem;
    height:1.36rem;
    background:#c8c8c8;
    border-radius: 50%;
    border:0.04rem solid #d8d8d8;
    text-align: center;
    line-height: 1.36rem;
    font-size:0.373rem;
    color: #808080;
    margin: 0 auto;
    position: relative;
  }
  .signIn_m li p:nth-of-type(1) img{
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    margin: auto;
  }
  .signIn_m li p:nth-of-type(2){
    font-size:0.32rem;
    color: #808080;
    margin-top: 0.053rem;
  }
  .signIn_m li p.click-signIn{
    background:rgb(252,200,22);
    border:0.04rem solid #444444;
  }
  .signIn_m li p.click-signIn span{
    display: inline-block;
    width: 0.8rem;
    line-height: 0.453rem;
    margin-top: 0.213rem;
    font-size: 0.346rem;
    color: #FFFFFF;
  }

  .signIn_b{
     width:100%;
     margin: 0 auto;
     height:1.546rem;
     text-align:left;
     font-size:0.373rem;
     color: #444444;
   }
  .signIn_b p i{
    font-size: 0.32rem;
    color: #b4b4b6;
  }
  .signIn_b p:nth-of-type(1){
    margin-top: 0.4rem;
  }
 /*签到获取的成长值弹窗*/
.scoreDetail{
  width:9.146rem;
  height:6.4rem;
  border-radius: 0.48rem;
  background:#f93277;
  text-align: center;
  margin: auto;
  position: relative;
  padding-top: 0.666rem;
}
.scoreDetail svg{
  font-size:0.533rem;
  color: #ffc2d7;
  position: absolute;
  right:0.373rem;
  top:0.346rem;
}
.scoreDetail p:nth-of-type(1){
  font-size:0.613rem;
  color: #ffffff;
  font-weight:500;
}
.scoreDetail p:nth-of-type(2){
  font-size:0.426rem;
  color: #ffffff;
  margin-top: 0.293rem;
  margin-bottom: 0.56rem;
}
.scoreDetail p:nth-of-type(2) i{
  font-size:0.72rem;
  color: #fcc816;
}
.scoreDetail p:nth-of-type(3){
  width:91%;
  height:0.906rem;
  text-align: center;
  line-height: 0.906rem;
  margin:0 auto;
  bottom: 0.666rem;
  font-size:0.373rem;
  color: #ffffff;
  border:0.026rem solid #fc98bb;
  border-radius: 1.333rem;
  margin-top: 0.4rem;
}
  .scoreDetail-m{
    width:91%;
    height:1.813rem;
    margin: 0 auto;
    border-top:0.026rem dashed #fc98bb;
    position: relative;
  }
  .Prompt {
    width: 86%;
    height: 1.066rem;
    margin-left: 7%;
    position: relative;
    top:0.266rem;
  }
  .Prompt b {
    display: block;
    width: 1.2rem;
    padding: 0 0.053rem;
    height: 0.666rem;
    background: #03aef9;
    text-align: center;
    font-size: 0.32rem;
    color: #FFFFFF;
    line-height: 0.666rem;
    border-radius: 0.213rem;
    position: absolute;

  }

  .Prompt b::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border: 0.16rem solid transparent;
    border-right: 0.16rem solid #03aef9;
    border-bottom: 0.16rem solid #03aef9;
    position: absolute;
    transform: rotate(45deg);
    bottom: -0.053rem;
    left: 0.426rem;
  }

  /*进度条*/

  .ProgressBar {
    width: 100%;
    height: 1.066rem;
    position: absolute;
    top:1.2rem;

  }

  .ProgressBar > div {
    width: 86%;
    height: 0.053rem;
    background: #fc98bb;
    margin-left: 7%;
  }

  .ProgressBar > div i {
    display: block;
    width: 25%;
    height: 0.053rem;
    background: #03aef9;
  }

  .fouce {
    width: 86%;
    height: 0.053rem;
    left: 7%;
    /*background: #007AFF;*/
    top: -0.026rem;
    position: absolute;
  }

  .fouce span {
    display: block;
    float: left;
    width: 0.106rem;
    height: 0.106rem;
    background: #FFFFFF;
    border-radius: 50%;
    position: absolute;
  }

  .fouce span:nth-of-type(1) {
    left: 0;
  }

  .fouce span:nth-of-type(2) {
    left: 25%;
  }

  .fouce span:nth-of-type(3) {
    left: 50%;
  }

  .fouce span:nth-of-type(4) {
    left: 75%;
  }

  .fouce span:nth-of-type(5) {
    left: 100%;
  }

  .number {
    width: 86%;
    height: 0.533rem;
    left: 7%;
    position: absolute;
  }

  .number span {
    display: block;
    float: left;
    color: #ffc2d7;
    font-size: 0.32rem;
    position: absolute;
  }

  .number span:nth-of-type(1) {
    left: 0;
  }

  .number span:nth-of-type(2) {
    left: 24%;
  }

  .number span:nth-of-type(3) {
    left: 49%;
  }

  .number span:nth-of-type(4) {
    left: 74%;
  }

  .number span:nth-of-type(5) {
    left: 99%;
  }
  /*红包的金额详情*/
  #animationContainer {
    position:absolute;
    margin:auto;
    left:0;right:0;
    top:0;bottom:0;
    z-index: 999;
  }

  .animationContainerWrapper{
    position:absolute;
    left:0;right:0;
    top:0;bottom:0;
    z-index: 10000;
  }
  /*关闭按钮*/
  .cash-button{
    width:0.773rem;
    height:0.773rem;
    border-radius:50%;
    background: #808080;
    position: absolute;
    left:0;
    right:0;
    bottom:50%;
    margin:auto;
    z-index: 999;
    -webkit-transform: translate(0rem,5.6rem);
    -moz-transform:translate(0rem,5.6rem);
    transform: translate(0rem,5.6rem);
  }
  .cash-button svg{
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    color: #FFFFFF;
    font-size:0.533rem;
    margin:auto;
  }
  /*跳转按钮*/
  .my-wallet{
    width:88%;
    height:0.906rem;
    background: #fcc816;
    border-radius: 1.333rem;
    text-align: center;
    line-height: 0.906rem;
    font-size:0.373rem;
    color: #444444;
    position: absolute;
    left:0;
    right:0;
    bottom: 1.466rem;
    margin:auto;
    opacity: 0;
  }
  /*红包详情*/
  .my-cash{
    width:58%;
    height:3.333rem;
    position: absolute;
    left:0;
    right:0;
    top: 1.6rem;
    margin:auto;
    opacity: 0;
  }
  .my-cash i{
    position: absolute;
    width: 100%;
    height:0.04rem;
    background: #808080;
    left:0;
    right:0;
    top:0rem;
    bottom: 0;
    margin:auto;
  }
  .my-cash p{
    width:100%;
    height:1.386rem;
    text-align: center;
    line-height:1.386rem;
    color: #444444;
  }
  .my-cash p:nth-of-type(1){
    font-size:1.706rem;
    font-weight: 500;
  }
  .my-cash p:nth-of-type(1) span{
    font-size: 0.64rem;
    font-weight: 500;
    position: relative;
    top: -0.8rem;
  }
  .my-cash p:nth-of-type(2){
    font-size: 0.426rem;
    font-weight: 500;
    margin-top: 0.266rem;
  }

  .home_invitation p:nth-of-type(1){
    font-size:0.426rem;
    color: #444444;
    font-weight: 500;
  }
  .home_invitation p:nth-of-type(2){
    font-size: 0.32rem;
    color: #444444;
    font-weight: normal;
    margin-top: -0.16rem;
    line-height: 0;
  }
  /*开启通知*/
  .openNotice{
    width:100%;
    height:7.2rem;
    background: #FFFFFF;
    border-radius:0.48rem;
    padding-top: 0.826rem;
  }
  .openNotice p:nth-of-type(1){
    font-size: 0.426rem;
    line-height: 0.64rem;
    color: #444444;
    padding: 0 0.48rem 0 0.48rem;
    margin-bottom: 0.186rem;
  }
  .openNotice p:nth-of-type(2){
    font-size: 0.346rem;
    color: #808080;
    padding: 0 0.48rem 0 0.48rem;
    margin-bottom: 0.853rem;
  }
  .openNotice ul li{
    width:100%;
    height:1.146rem;
    text-align: center;
    line-height: 1.146rem;
    font-size: 0.426rem;
    color: #03aef9;
    border-top:0.013rem solid #dcdcdc;
  }
  /*抽奖弹窗*/
  .luckDraw{
    width:100%;
    height:11.2rem;
    border-radius:0.48rem;
    background: #ffffff;
    padding-top: 0.826rem;
  }
  .luckDraw .qualification{
    text-align: center;
    font-size:0.506rem;
    color: #03aef9;
    font-weight: 500;
  }

  .luckDraw .title_invitation{
    width:100%;
    height:1.173rem;
    margin-top: 0.4rem;
    position: relative;
    padding: 0 0.4rem;
  }
  .luckDraw  .title_invitation .cions-avatar{
    float: left;
    position: relative;
    width: 1.173rem;
    height: 1.173rem;
    border-radius: 50%;
    background: #cccccc;
  }
  .luckDraw  .title_invitation .cions-avatar img{
    width: 1.173rem;
    height: 1.173rem;
    border-radius: 50%;
  }
  .luckDraw  .title_invitation .cions-avatar svg{
    position: absolute;
    font-size: 0.533rem;
    right: -0.133rem;
    bottom: -0.053rem;
  }
  .luckDraw  .text{
    margin-left: 0.266rem;
    float: left;
  }
  .luckDraw  .text p:nth-of-type(1){
    font-size: 0.373rem;
    color: #444444;
    font-weight: 500;
  }
  .luckDraw  .text p:nth-of-type(1) i{
    display: inline-block;
    width:0.026rem;
    height:0.32rem;
    background: #b4b4b6;
    margin:0 0.133rem -0.026rem 0.133rem;
  }
  .luckDraw  .text p:nth-of-type(2){
    font-size: 0.32rem;
    color: #444444;
    margin-left: -0.106rem;
  }
 /**/
  .luckDraw .search{
    margin-top: 0.373rem;
    font-size: 0.373rem;
    color: #808080;
    padding: 0 0.4rem;
  }
  .luckDraw .wechat{
    width:2.986rem;
    height:3.253rem;
    border-radius: 0.106rem;
    border: 0.026rem solid #979797;
    margin: 0 auto;
    margin-top: 0.613rem;
  }
  .luckDraw .wechat img{
    width: 100%;
    height:100%;
  }

  .luckDraw  .waiting{
    margin-top: 0.32rem;
    font-size: 0.373rem;
    color: #808080;
    text-align: center;
  }
  .luckDraw  .btn{
    width:100%;
    margin-top: 0.533rem;
    height:1.413rem;
    line-height: 1.413rem;
    text-align: center;
    font-size: 0.426rem;
    color: #03aef9;
    border-top:0.026rem solid #dcdcdc;
  }


</style>
