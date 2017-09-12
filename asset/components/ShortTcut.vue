<template>
  <div id="short_all" class="gaussian">
    <ul id="down">
      <li>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="skip(1)">
          <use xlink:href="#icon-fabuxuqiu"></use>
        </svg>
        <span>发布需求</span>
      </li>
      <li>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="skip(2)">
          <use xlink:href="#icon-zhuanyewenda"></use>
        </svg>
        <span>专业问答</span>
      </li>
      <li>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="skip(3)">
          <use xlink:href="#icon-chengweizhuanjia"></use>
        </svg>
        <span>成为专家</span>
      </li>
      <li>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="skip(4)">
          <use xlink:href="#icon-tijiaowenzhang"></use>
        </svg>
        <span>提交文章</span>
      </li>

    </ul>
    <p @tap.stop.prevent="hide()">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-guanbi"></use>
      </svg>
    </p>
  </div>
</template>
<!--/project/basic  /ask /my/pilot  /discover?redirect_url=%2Fsubmit-->
<script type="text/javascript">
  import {setStatusBarBackgroundAndStyle, autoHeight} from '../utils/statusBar.js';
  import {getLocalUserInfo} from '../utils/user';
  
  export default {
    methods: {
      skip(num) {

        var userInfo = getLocalUserInfo();
        switch (num) {
          case 1:
            var companyStatus = parseInt(userInfo.company_status);
            switch (companyStatus) {
              case 0: //没有认证去认证
              case 1:
              case 3:
                this.$router.push('/company/my?back=%2Fmy');
                break;
              case 2:
                this.$router.push('/project/basic');
                break;
            }
            break;
          case 2:
            this.$router.push('/ask');
            break;
          case 3:
            var expertStatus = parseInt(userInfo.expert_apply_status);
            switch(parseInt(expertStatus)) {
              case 0:
              case 3:
                this.$router.push('/my/pilot');
                  break;
              case 2:
                mui.toast('您已经是专家');
                  break;
              case 1:
                mui.toast('认证审核中');
                break;
            }
            break;
          case 4:
            this.$router.push('/discover?redirect_url=%2Fsubmit' + '?' + encodeURIComponent('from=h5' + '&time=' + (new Date()).getTime()));
            break;

        }
        this.hide();
      },
      show() {
        document.getElementById("short_all").style.display = "inline";

        //发现页处理
        if (mui.os.plus) {

          if (this.$route.path.match(/discover/)) {

            var inwehub_embed_webview = plus.webview.getWebviewById('inwehub_embed');
            if (inwehub_embed_webview) {
              inwehub_embed_webview.hide();
            }
          }
        }

        setStatusBarBackgroundAndStyle('#D8D9DC', 'light');

      },
      hide() {
        //	 	document.getElementById("short_all").style.display="none";
        console.log('hide');
        document.getElementById("down").setAttribute("class", "end");
        setTimeout(function () {
          document.getElementById("short_all").style.display = "none";
          document.getElementById("down").classList.remove("end");
          autoHeight();
        }, 300)

        //发现页处理
        if (mui.os.plus) {
          if (this.$route.path.match(/discover/)) {
            setTimeout(() => {
              var inwehub_embed_webview = plus.webview.getWebviewById('inwehub_embed');
              if (inwehub_embed_webview) {
                inwehub_embed_webview.show();
              }
            }, 300);
          }

        }

      }

    },
    mounted() {

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

  #short_all p {
    position: absolute;
    bottom: 38px;
    left: 48%;
    font-size: 17px;
    color: #808080;
    animation: rote 0.5s infinite;
    animation-iteration-count: 1;
  }

  @keyframes rote {
    from {
      transform: rotateZ(0deg);
    }
    to {
      transform: rotateZ(180deg);
    }
  }

  ul {
    position: absolute;
    width: 70%;
    height: 260px;
    /*top: 0;
      bottom: 0;*/
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
    width: 100%;
    height: 260px;
    position: absolute;
    bottom: -230px;
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
    width: 50%;
    height: 130px;
  }

  ul li svg {
    font-size: 53px;
    width: 37%;
    height: 53px;
    margin-left: 31.5%;
    margin-top: 28px;
  }

  ul li span {
    display: inline-block;
    width: 100%;
    text-align: center;
    margin-top: 13px;
  }
</style>
