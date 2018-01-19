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
      <div class="down-title find-title">寻找<i></i></div>
      <ul class="find">
        <li @tap.stop.prevent="skip(1)">
          <p>
            <svg class="icon" aria-hidden="true" >
              <use xlink:href="#icon-faxuqiu"></use>
            </svg>
          </p>
          <span class="aside_l">待答问题</span>
        </li>
        <li @tap.stop.prevent="skip(2)">
          <p>
            <svg class="icon" aria-hidden="true" >
              <use xlink:href="#icon-jinghuatuijian"></use>
            </svg>
          </p>
          <span>精华推荐</span>
        </li>
        <li @tap.stop.prevent="skip(3)">
          <p>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-bangdan"></use>
            </svg>
          </p>
          <span class="aside_r">用户榜单</span>
        </li>
        <li @tap.stop.prevent="skip(4)">
          <p>
            <svg class="icon" aria-hidden="true" >
              <use xlink:href="#icon-xiangmujiyu1"></use>
            </svg>
          </p>
          <span class="aside_l">项目机遇</span>
        </li>
      </ul>
      <div class="down-title">添加<i></i></div>
      <ul>
        <li class="bonus" @tap.stop.prevent="skip(5)">
          <p class="-yellow">
            <i>分红</i>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanyewenda-"></use>
            </svg>
          </p>
          <span class="aside_l">付费问</span>
        </li>
        <li @tap.stop.prevent="skip(6)">
          <p class="-yellow">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-hudongwenda-"></use>
            </svg>
          </p>
          <span>提问</span>
        </li>
        <li @tap.stop.prevent="skip(7)">
          <p  class="-yellow">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-wenzhang"></use>
            </svg>
          </p>
          <span class="aside_r">文章</span>
        </li>
        <li @tap.stop.prevent="skip(8)">
          <p  class="-yellow">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-tijiaowenzhang1"></use>
            </svg>
          </p>
          <span class="aside_l">动态</span>
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

  export default {
    methods: {
      skip (num) {
        setTimeout(() => {
          switch (num) {
            case 1:
              this.$router.pushPlus('/unansweredquestions')
              break
            case 2:
              this.$router.pushPlus('/selectionrecommend')
              break
            case 3:
              this.$router.pushPlus('/cionsList')
              break
            case 4:
              this.$router.pushPlus('/home/ActiveList')
              break
            case 5:
              this.$router.pushPlus('/ask')
              break
            case 6:
              this.$router.pushPlus('/ask/interaction')
              break
            case 7:
              this.$router.pushPlus('/discover/publishArticles')
              break
            case 8:
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
    bottom: 14px;
    left: 44.2%;
    font-size: 17px;
    color: #808080;
    animation: rote 0.5s infinite;
    animation-iteration-count: 1;
    padding: 0 12px;
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
    width:100%;
    height:90px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    padding: 0 8%;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    bottom: 130px;
    animation: myfirst 0.2s infinite;
    animation-iteration-count: 1;
  }

  @keyframes myfirst {
    from {
      width:100%;
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
    height:90px;
    position: absolute;
    bottom: -380px;
    animation: myend 0.1s infinite;
    animation-iteration-count: 1;
  }

  @keyframes myend {
    from {
      bottom: 110px;
      opacity: 0.7;
    }
    to {
      bottom: -140px;
      opacity: 1;
    }
  }
 /*内容区域*/
  .down-title{
    width:90%;
    font-size: 14px;
    color: #808080;
    position: absolute;
    left: 8%;
    bottom: 230px;
  }
  .down-title i{
    display: block;
    width: 85%;
    height: 0.5px;
    background: #dcdcdc;
    position: absolute;
    left: 37px;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  ul{

    }
  ul li{
    display: flex;
    flex-direction:column;
    width: 60px;
    height:90px;
    align-items: center;
  }
  ul li p{
    width:60px;
    height:60px;
    background:#b4b4b6;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ul li p svg{
    font-size: 35px;
  }
  ul li span{
   font-size: 14px;
    color: #444444;
    margin-top: 9px;
  }
  .down-title.find-title{
    bottom: 380px;
  }
  ul.find{
    bottom: 280px;
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
    width: 30px;
    height: 17px;
    font-size: 12px;
    color: #FFFFFF;
    border-radius: 4px;
    background: #fa4975;
    text-align: center;
    line-height: 17px;
    top: 3px;
    right: -18px;
  }

  ul li.bonus p i:after{
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    background: #fa4975;
    /*border: 1px solid #dcdcdc;*/
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    left: -3px;
    /*border-top-color: #FFFFFF;
    border-left-color: #FFFFFF;*/
    top: 0px;
    bottom: 0;
    margin: auto;
  }


</style>
