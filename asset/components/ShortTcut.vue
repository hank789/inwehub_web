<template>
  <div id="short_all" class="gaussian">
    <!--quick-->
    <!--<div class="quick">-->
      <!--<p @tap.stop.prevent="skip(7)">我要爆料<span></span></p>-->
      <!--<a></a>-->
      <!--<p @tap.stop.prevent="skip(8)">我有建议<span></span></p>-->
      <!--<a></a>-->
      <!--<p @tap.stop.prevent="skip(9)">我的擅长<span></span></p>-->
    <!--</div>-->

    <div id="down">
      <!--<div class="down-title find-title">寻找<i></i></div>-->
      <!--<ul class="find">-->
        <!--<li @tap.stop.prevent="skip(1)">-->
          <!--<p>-->
            <!--<svg class="icon" aria-hidden="true" >-->
              <!--<use xlink:href="#icon-faxuqiu"></use>-->
            <!--</svg>-->
          <!--</p>-->
          <!--<span class="aside_l">待您回答</span>-->
        <!--</li>-->
        <!--<li @tap.stop.prevent="skip(2)">-->
          <!--<p>-->
            <!--<svg class="icon" aria-hidden="true" >-->
              <!--<use xlink:href="#icon-jinghuatuijian"></use>-->
            <!--</svg>-->
          <!--</p>-->
          <!--<span>精华推荐</span>-->
        <!--</li>-->
        <!--<li @tap.stop.prevent="skip(3)">-->
          <!--<p>-->
            <!--<svg class="icon" aria-hidden="true">-->
              <!--<use xlink:href="#icon-bangdan"></use>-->
            <!--</svg>-->
          <!--</p>-->
          <!--<span class="aside_r">用户榜单</span>-->
        <!--</li>-->
        <!--<li @tap.stop.prevent="skip(4)">-->
          <!--<p>-->
            <!--<svg class="icon" aria-hidden="true" >-->
              <!--<use xlink:href="#icon-xiangmujiyu1"></use>-->
            <!--</svg>-->
          <!--</p>-->
          <!--<span class="aside_l">项目机遇</span>-->
        <!--</li>-->
      <!--</ul>-->
      <!--<div class="down-title">添加<i></i></div>-->
      <ul>
        <li @tap.stop.prevent="skip(1)">
          <p>
            <svg class="icon" aria-hidden="true" >
              <use xlink:href="#icon-faxuqiu"></use>
            </svg>
          </p>
          <span class="aside_l">待回答</span>
        </li>
        <!--<li class="bonus" @tap.stop.prevent="skip(5)">-->
          <!--<p class="-yellow">-->
            <!--<i>分红</i>-->
            <!--<svg class="icon" aria-hidden="true">-->
              <!--<use xlink:href="#icon-zhuanyewenda-"></use>-->
            <!--</svg>-->
          <!--</p>-->
          <!--<span class="aside_l">付费问</span>-->
        <!--</li>-->
        <li @tap.stop.prevent="skip(6)">
          <p class="-yellow">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-hudongwenda-"></use>
            </svg>
          </p>
          <span>提问题</span>
        </li>
        <!--<li @tap.stop.prevent="skip(7)">-->
          <!--<p  class="-yellow">-->
            <!--<svg class="icon" aria-hidden="true">-->
              <!--<use xlink:href="#icon-wenzhang"></use>-->
            <!--</svg>-->
          <!--</p>-->
          <!--<span class="aside_r">文章</span>-->
        <!--</li>-->
        <li @tap.stop.prevent="skip(8)">
          <p  class="-yellow">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-tijiaowenzhang1"></use>
            </svg>
          </p>
          <span class="aside_l">发分享</span>
        </li>
      </ul>
    </div>
    <p @tap.stop.prevent="hide()" class="turn">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-guanbi"></use>
      </svg>
    </p>
  </div>
</template>
<script type="text/javascript">
  import { setStatusBarBackgroundAndStyle, autoHeight } from '../utils/statusBar.js'
  import userAbility from '../utils/userAbility'
  import { postRequest } from '../utils/request'
  import localEvent from '../stores/localStorage'
  import { getLocalUserId } from '../utils/user'

  export default {
    methods: {
      skip (num) {
        setTimeout(() => {
          switch (num) {
            case 1:
              this.$router.pushPlus('/unansweredquestions')
              break
            case 2:
              this.$router.pushPlus('/group/recommend')
              break
            case 3:
              this.$router.pushPlus('/growthList')
              break
            case 4:
//              项目与机遇的等级判断
              postRequest(`auth/checkUserLevel`, {
                permission_type: 4
              }).then(response => {
                var code = response.data.code
                // 如果请求不成功提示信息 并且返回上一页；
                if (code !== 1000) {
                  window.mui.alert(response.data.message)
                  window.mui.back()
                  return
                }
                if (response.data.data) {
                  if (response.data.data.is_valid) {
                    this.$router.pushPlus('/home/ActiveList')
                  } else {
                    userAbility.jumpJudgeGrade(this)
                  }
                }
              })
              break
            case 5:
              this.$router.pushPlus('/ask')
              break
            case 6:
              this.$router.pushPlus('/ask')
              break
            case 7:
              this.$router.pushPlus('/discover/publishArticles')
              break
            case 8:
              localEvent.clearLocalItem('selectedGroup' + getLocalUserId())
              this.$router.pushPlus('/discover/add')
              break

          }
        }, 100)

        this.hide()
      },
      show () {
        console.log('ShortCut: show')
        document.getElementById('short_all').style.display = 'inline'
        setStatusBarBackgroundAndStyle('#D8D9DC', 'light')
      },
      hide () {
        console.log('ShortCut: hide')
        document.getElementById('down').setAttribute('class', 'end')
        setTimeout(function () {
          document.getElementById('short_all').style.display = 'none'
          document.getElementById('down').classList.remove('end')
        }, 300)

        autoHeight()
      }
    },
    mounted () {

    }
  }
</script>

<style scoped="scoped">

  ul,
  li,
  div,
  p,
  span {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  #short_all {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: none;
  }

  #short_all .turn {
    position: absolute;
    bottom: 0.373rem;
    left: 44.2%;
    font-size: 0.453rem;
    color: #808080;
    animation: rote 0.5s infinite;
    animation-iteration-count: 1;
    padding: 0 0.32rem;
  }

  @keyframes rote {
    from {
      transform: rotateZ(0deg);
    }
    to {
      transform: rotateZ(360deg);
    }
  }

  ul {
    width: 60%;
    height:2.4rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    bottom: 3.466rem;
    animation: myfirst 0.2s infinite;
    animation-iteration-count: 1;
  }

  @keyframes myfirst {
    from {
      width:60%;
      padding: 0 8%;
      opacity: 0.6;
    }
    to {
      width:100%;
      padding: 0 8%;
      opacity: 1;
    }
  }

  /*结束动画*/

  .end {
    width:100%;
    height:2.4rem;
    position: absolute;
    bottom: -10.133rem;
    animation: myend 0.1s infinite;
    animation-iteration-count: 1;
  }

  @keyframes myend {
    from {
      bottom: 2.933rem;
      opacity: 0.7;
    }
    to {
      bottom: -3.733rem;
      opacity: 1;
    }
  }
 /*内容区域*/
  .down-title{
    width:90%;
    font-size: 0.373rem;
    color: #808080;
    position: absolute;
    left: 8%;
    bottom: 6.133rem;
  }
  .down-title i{
    display: block;
    width: 85%;
    height: 0.013rem;
    background: #dcdcdc;
    position: absolute;
    left: 0.986rem;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  ul{

    }
  ul li{
    display: flex;
    flex-direction:column;
    width: 1.6rem;
    height:2.4rem;
    align-items: center;
  }
  ul li p{
    width:1.6rem;
    height:1.6rem;
    background:#b4b4b6;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ul li p svg{
    font-size: 0.933rem;
  }
  ul li span{
   font-size: 0.373rem;
    color: #444444;
    margin-top: 0.24rem;
  }
  .down-title.find-title{
    bottom: 10.133rem;
  }
  ul.find{
    bottom: 7.466rem;
  }
  ul li p.-yellow{
    background: #fcc816;
  }
  /*分红*/
  ul li.bonus {
    position: relative;
  }
  ul li.bonus p i {
    position: absolute;
    font-style: normal;
    width: 0.8rem;
    height: 0.453rem;
    font-size: 0.32rem;
    color: #FFFFFF;
    border-radius: 0.106rem;
    background: #fa4975;
    text-align: center;
    line-height: 0.453rem;
    top: 0.08rem;
    right: -0.48rem;
  }

  ul li.bonus p i:after{
    content: "";
    display: block;
    width: 0.16rem;
    height: 0.16rem;
    background: #fa4975;
    /*border: 0.026rem solid #dcdcdc;*/
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    left: -0.08rem;
    /*border-top-color: #FFFFFF;
    border-left-color: #FFFFFF;*/
    top: 0rem;
    bottom: 0;
    margin: auto;
  }


</style>
