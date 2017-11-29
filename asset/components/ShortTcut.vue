<template>
  <div id="short_all" class="gaussian">
    <!--quick-->

    <div class="quick">
      <p @tap.stop.prevent="skip(7)">我要爆料<span></span></p>
      <a></a>
      <p @tap.stop.prevent="skip(8)">我有建议<span></span></p>
      <a></a>
      <p @tap.stop.prevent="skip(9)">我的擅长<span></span></p>
    </div>

    <ul id="down">
      <li>
        <p>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="skip(1)">
            <use xlink:href="#icon-faxuqiu"></use>
          </svg>
        </p>
        <span class="aside_l">发需求</span>

      </li>
      <li>
        <p>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="skip(2)">
            <use xlink:href="#icon-zhaoguwen"></use>
          </svg>
        </p>
        <span>找顾问</span>
      </li>
      <li>
        <p>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="skip(3)">
            <use xlink:href="#icon-xunhezuo"></use>
          </svg>
        </p>
        <span class="aside_r">寻合作</span>
      </li>
      <li>
        <p>
          <i>分红</i>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="skip(4)">
            <use xlink:href="#icon-zhuanyewenda-"></use>
          </svg>
        </p>
        <span class="aside_l">专业问答</span>
      </li>
      <li>
        <p>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="skip(5)">
            <use xlink:href="#icon-hudongwenda-"></use>
          </svg>
        </p>
        <span>互动问答</span>
      </li>
      <li>
        <p>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="skip(6)">
            <use xlink:href="#icon-tijiaowenzhang1"></use>
          </svg>
        </p>
        <span class="aside_r">动态分享</span>
      </li>

    </ul>
    <p @tap.stop.prevent="hide()" class="turn">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-guanbi"></use>
      </svg>
    </p>
  </div>
</template>
<!--/project/basic  /ask /my/pilot  /discover?redirect_url=%2Fsubmit-->
<script type="text/javascript">
  import { setStatusBarBackgroundAndStyle, autoHeight } from '../utils/statusBar.js'
  import userAbility from '../utils/userAbility'

  export default {
    methods: {
      skip (num) {
        setTimeout(() => {
          switch (num) {
            case 1:
              userAbility.jumpToAddProject()
              break
            case 2:
              this.$router.pushPlus('/feedback/consultant')
              break
            case 3:
              this.$router.pushPlus('/seekingCooperation')
              break
            case 4:
              userAbility.jumpToAddAsk()
              break
            case 5:
              this.$router.pushPlus('/ask/interaction')
              break
            case 6:
              this.$router.pushPlus('/discover/add')
              break
            case 7:
              this.$router.pushPlus('/feedback/news')
              break
            case 8:
              this.$router.pushPlus('/feedback/advise')
              break
            case 9:
              this.$router.pushPlus('/my/advantage')
              break

          }
        }, 100)

        this.hide()
      },
      show () {
        document.getElementById('short_all').style.display = 'inline'
        // 发现页处理
//        if (window.mui.os.plus) {
//          if (this.$route.path.match(/discover/)) {
//            var inwehubEmbedWebview = window.plus.webview.getWebviewById('inwehub_embed')
//            if (inwehubEmbedWebview) {
//              inwehubEmbedWebview.hide()
//            }
//          }
//        }

        setStatusBarBackgroundAndStyle('#D8D9DC', 'light')
      },
      hide () {
        // document.getElementById("short_all").style.display="none";
        console.log('hide')
        document.getElementById('down').setAttribute('class', 'end')
        setTimeout(function () {
          document.getElementById('short_all').style.display = 'none'
          document.getElementById('down').classList.remove('end')
        }, 300)

        autoHeight()

        // 发现页处理
//        if (window.mui.os.plus) {
//          if (this.$route.path.match(/discover/)) {
//            setTimeout(() => {
//              var inwehubEmbedWebview = window.plus.webview.getWebviewById('inwehub_embed')
//              if (inwehubEmbedWebview) {
//                inwehubEmbedWebview.show()
//              }
//            }, 100)
//          }
//        }
      }
    },
    mounted () {

    }
  }
</script>

<style scoped="scoped">

  @media (min-width: 320px) {
    ul {
      width: 80%;

    }
    .quick {
      width: 80%;
    }
  }

  @media (min-width: 375px) {
    ul {
      width: 72.5%;
    }

    .quick {
      width: 72.5%;
    }

  }

  @media (min-width: 414px) {
    ul {
      width: 72.5%;
    }

    .quick {
      width: 72.5%;
    }
  }

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
    position: absolute;
    /* width:72.5%;*/
    /*width: 300px;*/
    height: 220px;
    left: 0;
    right: 0;
    margin: auto;
    bottom: 110px;
    /*background:#CCCCCC;*/
    animation: myfirst 0.3s infinite;
    animation-iteration-count: 1;
  }

  @keyframes myfirst {
    from {
      bottom: -130px;
      opacity: 0.6;
    }
    to {
      bottom: 110px;
      opacity: 1;
    }
  }

  /*结束动画*/

  .end {
    width: 63.3%;
    height: 260px;
    position: absolute;
    bottom: -250px;
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

  /**************/

  ul li {
    float: left;
    width: 33.3%;
    height: 110px;
    /*background:#CCCCCC;*/
    position: relative;
  }

  ul li:nth-of-type(2) p, ul li:nth-of-type(5) p {
    width: 64px;
    height: 64px;
    background: #b5e8fe;
    border-radius: 50%;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
  }

  ul li:nth-of-type(1) p, ul li:nth-of-type(4) p {
    width: 64px;
    height: 64px;
    background: #b5e8fe;
    border-radius: 50%;
    position: absolute;
  }

  ul li:nth-of-type(3) p, ul li:nth-of-type(6) p {
    width: 64px;
    height: 64px;
    background: #b5e8fe;
    border-radius: 50%;
    position: absolute;
    right: 0;

  }

  /*分红*/
  ul li:nth-of-type(4) p i {
    position: absolute;
    font-style: normal;
    width: 35px;
    height: 20px;
    font-size: 12px;
    color: #FFFFFF;
    border-radius: 4px;
    background: #fa4975;
    text-align: center;
    line-height: 20px;
    top: 5px;
    right: -25px;

  }

  ul li:nth-of-type(4) p i:after {
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

  /**/

  ul li p svg {
    font-size: 35px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  ul li span {
    display: inline-block;
    width: 100%;
    text-align: center;
    position: absolute;
    top: 73px;
    font-size: 14px;
    color: #444444;
  }

  ul li .aside_r {
    width: 64px;
    right: 0;

  }

  ul li .aside_l {
    width: 64px;
    left: 0;

  }

  /*quick*/

  .quick {
    height: 14px;
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .quick a {
    display: inline-block;
    float: left;
    width: 0.5px;
    height: 14px;
    color: red;
  }

  .quick p {
    /*width: 25%;*/
    float: left;
    font-size: 13px;
    color: #444444;
    text-align: center;
    line-height: 14px;

  }


  .quick a {
    position: absolute;
    width: 1px;
    height: 14px;
    background: #dcdcdc;
    margin-left: 32%;
  }
  .quick a:nth-of-type(2){
    position: absolute;
    width: 1px;
    height: 14px;
    background: #dcdcdc;
    margin-left: 72%;
  }

  .quick > p span {
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 6px solid #a8dff7;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    margin-left: 6px;
  }


</style>
