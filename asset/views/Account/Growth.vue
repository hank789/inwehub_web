<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">成长说明</h1>
    </header>
    <div class="mui-content absolute">
      <div class="integral">
        <p class="GetPoints">
          <span>我的积分</span>
          <span @tap.stop.prevent="warn()">如何获取积分</span>
          <i class="bot"></i>
        </p>
        <div class="growth">
          <p>
            <span>{{user_credits}}</span>
            <span>成长值</span>
          </p>
          <p>
            <i></i>
            <span>平台日常参与度与活跃度</span>
          </p>
        </div>
        <!--贡献值-->
        <div class="contribution">
          <p>
            <span>{{user_coins}}</span>
            <span>贡献值</span>
          </p>
          <p>
            <i></i>
            <span>平台价值贡献，后续开放积分兑换礼品等活动</span>
          </p>
        </div>
      </div>
      <!--我的等级-->
      <div class="Grade">
        <p class="myGrades">
          <span>我的等级</span>
          <i class="bot"></i>
        </p>
        <div class="Member">
          <p>会员等级L{{user_level}}</p>
          <p>由当前成长值决定，成长值从产生开始有效期1年</p>
          <p class="Prompt">
            <b :style="'left:'+ (percent-6) +'%'">{{user_credits}}</b>
          </p>
          <div class="ProgressBar">
            <div>
              <i :style="'width:'+ percent +'%'"></i>
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
      </div>
      <!--等级特权-->
      <div class="privilege">
        <p class="myprivilege">
          <span>等级特权</span>
          <i class="bot"></i>
        </p>
        <!--等级-->
        <div class="power">
          <p>
            <span :class="{bg:user_level >= 1}">1</span>
            <span class="mui-ellipsis">L1（注册用户)</span>
          </p>
          <ul class="powerdetail">
            <li>
              <svg class="icon yellow" aria-hidden="true" v-if="user_level >='1'">
                <use xlink:href="#icon-chengchangye-zhuanyewenda"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-chengchangye-zhuanyewenda"></use>
              </svg>
              <p>专业问答</p>
              <p class="text_yellow" v-if="user_level >='1'">已获取</p>
              <p v-else>升级解锁</p>

            </li>
            <li>
              <svg class="icon yellow" aria-hidden="true" v-if="user_level >='1'">
                <use xlink:href="#icon-chengchangye-hudongpinglun"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-chengchangye-hudongpinglun"></use>
              </svg>
              <p>评论互动</p>
              <p class="text_yellow" v-if="user_level >='1'">已获取</p>
              <p v-else>升级解锁</p>

            </li>
            <li v-if="!newbie_unfinish_tasks.ask">
              <svg class="icon blue" aria-hidden="true" v-if="user_level >='1'">
                <use xlink:href="#icon-chengchangye-wendarenwu"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-chengchangye-wendarenwu"></use>
              </svg>
              <p>问答任务</p>
              <p class="text_blue" v-if="user_level >='1'">待完成</p>
              <p v-else>升级解锁</p>

            </li>
            <li v-if="!newbie_unfinish_tasks.readhub_comment">
              <svg class="icon blue" aria-hidden="true" v-if="user_level >='1'">
                <use xlink:href="#icon-hudongrenwu"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-hudongrenwu"></use>
              </svg>
              <p>互动任务</p>
              <p class="text_blue" v-if="user_level >='1'">待完成</p>
              <p v-else>升级解锁</p>
            </li>
            <li>
              <svg class="icon yellow" aria-hidden="true" v-if="user_level >='1'">
                <use xlink:href="#icon-wendashequ"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-wendashequ"></use>
              </svg>
              <p>问答社区</p>
              <p class="text_yellow" v-if="user_level >='1'">已获取</p>
              <p v-else>升级解锁</p>
            </li>
          </ul>

        </div>
        <div class="power">
          <p>
            <span :class="{bg:user_level >= 2}">2</span>
            <span class="mui-ellipsis">L2（成长值满500)</span>
          </p>
          <ul class="powerdetail">
            <li>
              <svg class="icon yellow" aria-hidden="true" v-if="user_level >='2'">
                <use xlink:href="#icon-chengchangye-chengweizhuanjia"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-chengchangye-chengweizhuanjia"></use>
              </svg>
              <p>成为专家</p>
              <p class="text_yellow" v-if="user_level >='2'">已获取</p>
              <p v-else>升级解锁</p>
            </li>
            <li>
              <svg class="icon yellow" aria-hidden="true" v-if="user_level >='2'">
                <use xlink:href="#icon-chengchangye-chengweizhuanjia"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-chengchangye-chengweizhuanjia"></use>
              </svg>
              <p>活动报名</p>
              <p class="text_yellow" v-if="user_level >='2'">已获取</p>
              <p v-else>升级解锁</p>
            </li>


          </ul>

        </div>
        <div class="power">
          <p>
            <span :class="{bg:user_level >= 3}">3</span>
            <span class="mui-ellipsis">L3（成长值满5000)</span>
          </p>
          <ul class="powerdetail">
            <li>
              <svg class="icon yellow" aria-hidden="true" v-if="user_level >='3'">
                <use xlink:href="#icon-chengchangye-fabuqiyexuqiu"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-chengchangye-fabuqiyexuqiu"></use>
              </svg>
              <p>企业需求对接</p>
              <p class="text_yellow" v-if="user_level >='3'">已获取</p>
              <p v-else>升级解锁</p>
            </li>

            <li>
              <svg class="icon yellow" aria-hidden="true" v-if="user_level >='3'">
                <use xlink:href="#icon-xiangmujiyu"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-xiangmujiyu"></use>
              </svg>
              <p>项目机遇</p>
              <p class="text_yellow" v-if="user_level >='3'">已获取</p>
              <p v-else>升级解锁</p>
            </li>
            <li>
              <svg class="icon yellow" aria-hidden="true" v-if="user_level >='3'">
                <use xlink:href="#icon-fujinqiye"></use>
              </svg>
              <svg class="icon " aria-hidden="true" v-else>
                <use xlink:href="#icon-chengchangye-zhuanshumishu"></use>
              </svg>
              <p>附近企业</p>
              <p class="text_yellow" v-if="user_level >='3'">已获取</p>
              <p v-else>升级解锁</p>
            </li>
            <li class="commodity">
              <img src="../../statics/images/ipad_air2@3x.png" class="air"/>
              <p>iPad air2 32G</p>
              <p  class="text_yellow" v-if="user_level >='3'">
              <i class="num_yellow">25000</i>
              <i class="num_yellow">贡献值兑换</i>
              </p>
              <p v-else><i>25000</i><i>贡献值兑换</i></p>
            </li>
          </ul>

        </div>
        <div class="power">
          <p>
            <span :class="{bg:user_level >= 4}">4</span>
            <span class="mui-ellipsis">L4（成长值满50000)</span>
          </p>
          <ul class="powerdetail">
            <li>
              <svg class="icon yellow" aria-hidden="true" v-if="user_level >='4'">
                <use xlink:href="#icon-chengchangye-zhuanshumishu"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-fujinqiye"></use>
              </svg>
              <p>专属秘书</p>
              <p class="text_yellow" v-if="user_level >='4'">已获取</p>
              <p v-else>升级解锁</p>
            </li>
            <li>
              <svg class="icon yellow" aria-hidden="true" v-if="user_level >='4'">
                <use xlink:href="#icon-gengduozhuanjia"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-gengduozhuanjia"></use>
              </svg>
              <p>更多专家</p>
              <p class="text_yellow" v-if="user_level >='4'">已获取</p>
              <p v-else>升级解锁</p>
            </li>
            <li>
              <svg class="icon yellow" aria-hidden="true" v-if="user_level >='4'">
                <use xlink:href="#icon-fangke"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-fangke"></use>
              </svg>
              <p>更多访客</p>
              <p class="text_yellow" v-if="user_level >='4'">已获取</p>
              <p v-else>升级解锁</p>
            </li>
            <li class="commodity">
              <img src="../../statics/images/case.png" class="case"/>
              <p class="mui-ellipsis">日默瓦 CF 20寸</p>
              <p class="text_yellow"  v-if="user_level >='4'">
                <i class="num_yellow">50000</i>
                <i class="num_yellow">贡献值兑换</i></p>
              <p v-else ><i>50000</i><i>贡献值兑换</i></p>
            </li>
            <li class="commodity">
              <img src="../../statics/images/iphone8@3x.png" class="iphone"/>
              <p class="mui-ellipsis">iPhone8 256GB</p>
              <p class="text_yellow" v-if="user_level >='4'">
                <i class="num_yellow">80000</i>
                <i class="num_yellow">贡献值兑换</i></p>
              <p v-else><i>80000</i><i>贡献值兑换</i></p>
            </li>

          </ul>

        </div>
        <div class="power">
          <p>
            <span :class="{bg:user_level >= 5}">5</span>
            <span>L5（成长值满500000，平台定向邀请开放秘密特权)</span>
          </p>


        </div>

      </div>
      <!--积分申明-->
      <div class="instruction">
        <p>积分申明： </p>
        <p>为保证用户权益，平台可能会在一段时间内适当调整积分和等级计划。</p>
        <p>法律允许的范围内，本公司保留对成长计划的最终解释权。</p>
      </div>

    </div>
    <div id="statusBarStyle" background="#FEFFFE" bgColor="#3c3e44" mode="light"></div>
  </div>
</template>

<script>
  import { getLocalUserInfo, getUserInfo, getUserLevelPercentage } from '../../utils/user'
  import { USERS_APPEND } from '../../stores/types'

  var userInfo = getLocalUserInfo('UserInfo')
  export default {
    data () {
      return {
        loading: 1,
        percent: 0,  // 百分比
        user_credits: userInfo.user_credits, // 成长值
        user_coins: userInfo.user_coins,   // 贡献值
        user_level: userInfo.user_level,  // 等级
        newbie_unfinish_tasks: userInfo.newbie_unfinish_tasks ? userInfo.newbie_unfinish_tasks : {}
      }
    },
    methods: {
      initData () {
        // 执行刷新
        console.log('refresh-my')
        this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
          cb(user)
          this.user_credits = user.info.user_credits
          this.user_coins = user.info.user_coins
          this.user_level = user.info.user_level

          this.newbie_unfinish_tasks = user.info.newbie_unfinish_tasks
          console.log(this.newbie_unfinish_task)
          this.percent = getUserLevelPercentage()
        }))
      },
      // 警告框
      warn () {
        var title = '<p style="font-size:0.426rem; margin-bottom:0.4rem">' + '获取积分提升等级解锁特权' + '</p>'
        var font = '<p style="text-align: left; font-size:0.373rem; color: #808080; margin-bottom:0.4rem">' +
          '<i style="display:inline-block; width:0.106rem; height:0.106rem; background:#03aef9; border-radius:50%; margin-bottom: 0.106rem; margin-right: 0.133rem;">' + '</i>' +
          '积极参与平台活动任务，可有效累积成长与贡献值，提升等级解锁新特权。' +
          '</p>' +
          '<p style="text-align: left; font-size:0.373rem; color: #808080; margin-bottom:0.4rem">' +
          '<i style="display:inline-block; width:0.106rem; height:0.106rem; background:#03aef9; border-radius:50%; margin-bottom: 0.106rem; margin-right: 0.133rem;">' + '</i>' +
          '常见获取积分的手段有：每日登陆并维护个人资料，完成新手任务，提交文章参与评论互动，积极提问回答问题，认证平台专家，报名活动，对接企业项目需求等。' + '</p>' +
          '<p style="text-align: left; font-size:0.373rem; color: #808080;">' +
          '<i style="display:inline-block; width:0.106rem; height:0.106rem; background:#03aef9; border-radius:50%; margin-bottom: 0.106rem; margin-right: 0.133rem;">' + '</i>' +
          '用户每次可获取的平台成长和贡献值，一般按照以上顺序及贡献程度依次增加。' + '</p>'

        // var btnArray = ['取消', '确认'];
        window.mui.alert(font, title, function () {}, 'div')
      }
    },
    mounted () {
//  console.log(userInfo.newbie_unfinish_tasks?userInfo.newbie_unfinish_tasks:"1");
//  this.initData();
    },
    activated: function () {
      console.log('activated')
      this.initData()
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
    left: 0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .mui-content.absolute {
    background: #FEFFFE;
    padding: 0rem 0.426rem 0 0.426rem;
  }

  /*页面内容*/
  .integral {
    width: 100%;
    height: 6.4rem;
    /*background: #CCCCCC;*/
  }

  /*积分*/
  .GetPoints {
    width: 100%;
    height: 1.173rem;
    line-height: 1.173rem;
    position: relative;
  }

  .GetPoints span:nth-child(1) {
    float: left;
    font-size: 0.426rem;
    color: #444444;
    font-weight: 500;
  }

  .GetPoints span:nth-child(2) {
    float: right;
    font-size: 0.346rem;
    color: #03aef9;
  }

  /* 成长值*/
  .growth {
    width: 50%;
    height: 5.226rem;
    float: left;
    position: relative;
    /*background: #CCCCCC;*/
  }

  .growth p:nth-child(1) {
    width: 2.506rem;
    height: 2.506rem;
    border: 0.04rem solid #03aef9;
    border-radius: 50%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0.533rem;
    margin: auto;
  }

  .growth p:nth-child(1) span:nth-child(1) {
    display: block;
    color: #03aef9;
    font-size: 0.666rem;
    margin-top: 0.56rem;
    text-align: center;
  }

  .growth p:nth-child(1) span:nth-child(2) {
    display: block;
    color: #444444;
    font-size: 0.426rem;
    margin-top: 0.08rem;
    text-align: center;
    font-weight: 500;
  }

  .growth p:nth-child(2) {
    margin-top: 3.6rem;
    text-align: center;
    position: relative;
  }

  .growth p:nth-child(2) i {
    display: inline-block;
    width: 0.16rem;
    height: 0.16rem;
    background-color: #03aef9;
    border-radius: 50%;
    position: absolute;
    top: 0.133rem;

  }

  .growth p:nth-child(2) span {
    display: inline-block;
    width: 3.733rem;
    text-align: left;
    margin-left: 0.266rem;
    color: #808080;
    font-size: 0.346rem;
  }

  /*贡献值*/
  .contribution {
    width: 50%;
    height: 5.226rem;
    float: right;
    position: relative;

  }

  .contribution p:nth-child(1) {
    width: 2.506rem;
    height: 2.506rem;
    border: 0.04rem solid #fa4975;
    border-radius: 50%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0.533rem;
    margin: auto;
  }

  .contribution p:nth-child(1) span:nth-child(1) {
    display: block;
    color: #fa4975;
    font-size: 0.666rem;
    margin-top: 0.56rem;
    text-align: center;
  }

  .contribution p:nth-child(1) span:nth-child(2) {
    display: block;
    color: #444444;
    font-size: 0.426rem;
    margin-top: 0.08rem;
    text-align: center;
    font-weight: 500;
  }

  .contribution p:nth-child(2) {
    margin-top: 3.6rem;
    text-align: center;
    position: relative;
  }

  .contribution p:nth-child(2) i {
    display: inline-block;
    width: 0.16rem;
    height: 0.16rem;
    background-color: #fa4975;
    border-radius: 50%;
    position: absolute;
    top: 0.133rem;

  }

  .contribution p:nth-child(2) span {
    display: inline-block;
    width: 3.733rem;
    text-align: left;
    margin-left: 0.266rem;
    color: #808080;
    font-size: 0.346rem;
  }

  /*等级*/
  .Grade {
    width: 100%;
    height: 7.733rem;
    /*background: #CCCCCC;*/
  }

  .myGrades {
    width: 100%;
    height: 1.173rem;
    line-height: 1.173rem;
    position: relative;
  }

  .myGrades span {
    float: left;
    font-size: 0.426rem;
    color: #444444;
    font-weight: 500;
  }

  .Member {
    width: 100%;
    height: 4.933rem;
    background: url(../../statics/images/Grade.png) no-repeat;
    background-size: cover;
    margin-top: 0.533rem;
    border-radius: 0.106rem;
  }

  .Member > p:nth-of-type(1) {
    width: 100%;
    text-align: center;
    font-size: 0.533rem;
    color: #dcdcdc;
    font-weight: 500;
    height: 1.333rem;
    line-height: 2rem;
  }

  .Member > p:nth-of-type(2) {
    width: 100%;
    text-align: center;
    color: #DCDCDC;
    font-size: 0.32rem;
    margin-top: 0.08rem;
  }

  .Prompt {
    width: 86%;
    height: 1.066rem;
    top: 0.533rem;
    margin-left: 7%;
    /*background: #CCCCCC;*/
    position: relative;
  }

  /*进度条*/

  .ProgressBar {
    width: 100%;
    height: 1.066rem;
    margin-top: 0.16rem;
    position: relative;
    /*background: #CCCCCC;*/

  }

  .ProgressBar > div {
    width: 86%;
    height: 0.053rem;
    background: #7F807F;
    margin-left: 7%;
    margin-top: 0.4rem;
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
    /*background: #007AFF;*/
    top: 0.16rem;
    position: absolute;
  }

  .number span {
    display: block;
    float: left;
    color: #dcdcdc;
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

  /*特权*/
  .privilege {
    width: 100%;
    min-height: 16rem;
    /*background: #CCCCCC;*/
  }

  .myprivilege {
    width: 100%;
    height: 1.173rem;
    line-height: 1.173rem;
    position: relative;
  }

  .myprivilege span {
    float: left;
    font-size: 0.426rem;
    color: #444444;
    font-weight: 500;
  }

  /*等级*/
  .power {
    width: 100%;
    /*min-height:4rem;*/
    /*background: #C8C7CC;*/
    margin-top: 0.48rem
  }

  .power p {
    width: 100%;
    overflow: hidden;
    margin-bottom: 0.133rem;
  }

  .power p span:nth-of-type(1) {
    display: block;
    float: left;
    width: 5.5%;
    height: 0.56rem;
    line-height: 0.426rem;
    background: url(../../statics/images/grading.png) no-repeat;
    background-size: 100%;
    text-align: center;
    font-size: 0.32rem;
    color: #FFFFFF;
  }

  .power p span:nth-of-type(2) {
    display: block;
    float: left;
    width: 80%;
    font-size: 0.346rem;
    font-weight: 500;
    color: #444444;
    margin-left: 2%;
    margin-top: -0.026rem;
  }

  .powerdetail {
    width: 97%;
    border-left: 0.026rem solid #03aef9;
    margin-left: 2.5%;
    overflow: hidden;
  }

  .powerdetail li {
    width: 32%;
    height: 3.2rem;
    float: left;
    text-align: center;
  }

  .powerdetail li svg {
    font-size: 1.066rem;
    color: #DCDCDC;
    margin-top: 0.266rem;
  }

  .powerdetail li p:nth-of-type(1) {
    font-size: 0.346rem;
    color: #808080;
    margin-top: 0.186rem;
  }

  .powerdetail li p:nth-of-type(2) {
    width: 70%;
    height: 0.8rem;
    line-height: 0.8rem;
    margin-left: 15%;
    border-radius: 0.106rem;
    border: 0.026rem solid #DCDCDC;
    font-size: 0.373rem;
    color: #444444;
    margin-top: 0.186rem;
    position: relative;
  }

  .powerdetail li:nth-child(1), .powerdetail li:nth-child(4) {
    margin-left: 3%;

  }


  /****积分说明*****/
  .instruction {
    width: 100%;
    height: 3.6rem;
    border-top: 0.026rem solid #DCDCDC;
  }

  .instruction p {
    font-size: 0.346rem;
    color: #808080;

  }

  .instruction p:nth-of-type(1) {
    margin-top: 0.453rem;
  }

  /*动态添加的样式*/
  .powerdetail li .blue {
    color: #03aef9;
  }

  .powerdetail li p.text_blue {
    width: 70%;
    height: 0.8rem;
    line-height: 0.8rem;
    margin-left: 15%;
    border-radius: 0.106rem;
    border: 0.026rem solid #03aef9;
    font-size: 0.373rem;
    color: #03aef9;
    margin-top: 0.186rem;

  }

  .powerdetail li .yellow {
    color: #fcc816;
    border-color: #fcc816;
  }

  .powerdetail li p.text_yellow {
    width: 70%;
    height: 0.8rem;
    line-height: 0.8rem;
    margin-left: 15%;
    border-radius: 0.106rem;
    border: 0.026rem solid #fcc816;
    font-size: 0.373rem;
    color: #fcc816;
    margin-top: 0.186rem;

  }

  .power p span.bg:nth-of-type(1) {
    background: url(../../statics/images/rank.png) no-repeat;
    background-size: 100%;

  }

  b {
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

  b::after {
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
  /*商品的通用样式*/
  .commodity{
    width:32%;
    height:3.2rem;
    /*background:#e3e3e3;*/
  }
  .commodity img{
    width: 0.986rem;
    height: 1.066rem;
    margin-top:0.133rem;
}
  .commodity .case{
    width: 0.693rem;

  }
  .commodity .iphone{
    width: 1.333rem;

  }
  .commodity p:nth-of-type(2) i:nth-of-type(1) {
  display: block;
  font-size: 0.32rem;
  color: #444444;
  text-align: center;
  position: absolute;
  bottom: 0.133rem;
  left: 0;
  right: 0;
  margin: auto;
  }


  .commodity p:nth-of-type(2) i:nth-of-type(2) {
  display: block;
  font-size: 0.32rem;
  color: #444444;
  text-align: center;
  position: absolute;
  top: 0.133rem;
  left: 0;
  right: 0;
  margin: auto;
  }

  .commodity  p:nth-of-type(2) i.num_yellow {
    color: #fcc916;
  }


</style>

