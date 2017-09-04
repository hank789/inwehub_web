<template>
  <div>
    <!--手机端-->
    <div class="suspend" v-if="isH5">
     	<p>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="close('isH5')">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
      </p>
      <p>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-logotuxing"></use>
        </svg>
      </p>
      <p>
        <span>下载APP</span>
        <span>查看更多专家信息</span>
      </p>
      <p>
        <a id="btnOpenAppH5" :href="url" target="_blank">立即打开</a>
      </p>
    </div>

    <!--微信端-->
    <div class="suspension" v-if="isWeixin">
     <p>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="close('isWeixin')">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
      </p>
      <p>
        <svg class="icon" aria-hidden="true" >
          <use xlink:href="#icon-logotuxing"></use>
        </svg>
      </p>
      <p>下载APP</p>
      <p> <a id="btnOpenAppWeixin" :href="url" target="_blank">立即打开</a></p>
    </div>
  </div>
</template>

<script type="text/javascript">
  import localEvent from '../stores/sessionStorage';

  export default {
    created() {
      this.showOpenApp();
    },
    mounted() {
      var mlink = 'https://adsolj.mlinks.cc/'+process.env.DEEP_LINK_KEY;

      if (this.isH5) {
        //深度链接
        new Mlink({
          mlink: mlink,//短链地址
          button:document.querySelector('a#btnOpenAppH5')
        });
      }

      if (this.isWeixin) {
        //深度链接
        new Mlink({
          mlink: mlink,//短链地址
          button:document.querySelector('a#btnOpenAppWeixin')
        });
      }
    },
    watch: {
      $route(to) {
          if (this.$route.path === '/share/resume') {
              this.check();
          } else {
              this.showOpenApp();
          }
      }
    },
    methods: {
      stopShowOpenApp(){
          var stopShowOpenApp = localEvent.getLocalItem('stopShowOpenApp');
          if (stopShowOpenApp.stop && stopShowOpenApp.stop === true) {
              return true;
          }
          return false;
      },
      showOpenApp(){
        var isStop = this.stopShowOpenApp();
        if (!isStop) {
          //显示
          this.check();
        } else {
          //不显示
          this.hideOpenApp();
        }
      },
      hideOpenApp(){
        this.isWeixin = false;
        this.isH5 = false;
        document.body.classList.remove('openAppWechat');
        document.body.classList.remove('openAppH5');
      },
      check(){
        if (!mui.os.plus) {

          if (mui.os.wechat) {
            this.isWeixin = true;
            document.body.classList.add('openAppWechat');
          } else {
            document.body.classList.add('openAppH5');
            this.isH5 = true;
          }
        }
      },
      close(type){
          if (this.$route.path === '/share/resume') {
              return false;
          }

         switch(type) {
           case 'isWeixin':
               this.isWeixin = false;
               localEvent.setLocalItem('stopShowOpenApp', {stop:true});
               document.body.classList.remove('openAppWechat');
               break;
           case 'isH5':
             this.isH5 = false;
             localEvent.setLocalItem('stopShowOpenApp', {stop:true});
             document.body.classList.remove('openAppH5');
             break;
         }
      },
    },
    data(){
      return {
        url:'http://a.app.qq.com/o/simple.jsp?pkgname=com.inwehub.InwehubApp',
        isWeixin:false,
        isH5:false,
      }
    }
  }
</script>

<style scoped="scoped">
  /*手机端*/
  .suspend{
    width: 100%;
    height:54px;
   /* border-radius:4px;*/
    background:#252525;
    position: fixed;
    opacity: 0.9;
    top:0;
    z-index: 999;
  }
  .suspend p:nth-of-type(1){
    float: left;
    margin-left: 23px;
    width: 30px;
    height: 47px;
    margin-top: 7px;

  }
  .suspend p:nth-of-type(1) svg{
    font-size: 18px;
    color: #FFFFFF;
    margin-top: 12px;
  }
  .suspend p:nth-of-type(2){
    float: left;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: #F3F4F6;
    margin-top: 7px;

    text-align: center;
  }
  .suspend p:nth-of-type(2)>svg{
    font-size: 34px;
    margin-top: 6px;
    color: #009fe8;
  }
  .suspend p:nth-of-type(3){
    width: 96px;
    height: 47px;
    margin-top: 7px;
    margin-left: 10px;
   /* padding-top: 5px;*/
    float: left;
  }
  .suspend p:nth-of-type(3)>span{
    display: block;
    color: #FFFFFF;
    font-size: 12px;
  }
  .suspend p:nth-of-type(3)>span:nth-of-type(1){
    font-size:16px
  }
  .suspend p:nth-of-type(3)>span:nth-of-type(2){
    margin-top: 0.5px;
  }
  .suspend a{
    float:right;
    width: 76px;
    height:30px;
    border-radius:4px;
    background:#3c95f9;
    text-align: center;
    line-height: 30px;
    color: #FFFFFF;
    margin-top: 12px;
    margin-right: 10.5px;
  }
  /*微信端*/
  .mui-wechat .suspension{
    width: 100%;
    height: 49px;
    position: fixed;
    opacity: 0.9;
    top: 0px;
    background: #FFFFFF;
    z-index: 997;
    box-shadow:0px 3px 5px #b4b4b6;
    -webkit-box-shadow:0px 3px 5px #b4b4b6;
    -moz-box-shadow:0px 3px 5px #b4b4b6;
  }
  .suspension{
    width: 100%;
    height: 49px;
    position: absolute;
    top: 44px;
    background: #FFFFFF;
    z-index: 997;
    box-shadow:0px 3px 5px #b4b4b6;
    -webkit-box-shadow:0px 3px 5px #b4b4b6;
    -moz-box-shadow:0px 3px 5px #b4b4b6;
  }
   .suspension p:nth-of-type(1){
    float: left;
    color: #b4b4b6;
    margin-left: 23px;
    margin-top: 15px;
    margin-right:20px ;
    font-size: 16px;

  }
  .suspension p:nth-of-type(2){
    float: left;
    width:35px;
    height:35px;
    border-radius:9px;
    background: #f3f4f6;
    margin-top: 7px;
    text-align: center;
  }
  .suspension p:nth-of-type(2) svg{
    font-size: 25px;
    margin-top: 6px;
    color: #009fe8;
  }
  .suspension p:nth-of-type(3){
    float: left;
    font-size:16px;
    color:#171616;
    margin-top: 14px;
    margin-left: 10px;
  }
  .suspension a{
    float:right;
    width:76px;
    height:30px;
    border-radius:4px;
    background: #3c95f9;
    font-size: 14px;
    color: #FFFFFF;
    text-align: center;
    line-height: 30px;
    margin-top: 10px;
    margin-right: 14px;
  }
</style>
