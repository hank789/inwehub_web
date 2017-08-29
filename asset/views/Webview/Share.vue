<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{ title }}</h1>

      <a class="mui-icon mui-pull-right" @tap.stop.prevent="share()">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fenxiang"></use>
        </svg>
      </a>

    </header>

    <div class="mui-content">

    </div>

    <div id="shareWrapper" class="shareWrapper mui-popover mui-popover-action mui-popover-bottom">
      <div class="title">分享到</div>
      <div class="more">
        <div class="single" id="wechatShareBtn" @tap.stop.prevent="shareToHaoyou()">
          <img src="../../statics/images/wechat_2x.png" />
        </div>
        <div class="single" id="wechatShareBtn2" @tap.stop.prevent="shareToPengyouQuan()">
          <img src="../../statics/images/pengyouquan.png" />
        </div>
      </div>
    </div>

    <div id="shareShowWrapper" class="mui-popover mui-popover-action mui-popover-top" @tap.stop.prevent="toggleShareNav()">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-dianzheli"></use>
      </svg>
    </div>

  </div>
</template>


<script>
  import localEvent from '../../stores/localStorage';
  import Share from '../../utils/share';

  export default {
    data: () => ({
      title: '',
    }),
    created () {
      if (mui.os.plus) {
        mui.plusReady(() => {
          var currentWebview = plus.webview.currentWebview();
          this.title =  currentWebview.title;
          var data = {
            title: currentWebview.title,
            link: currentWebview.link,
            content: currentWebview.content,
            imageUrl: currentWebview.imageUrl,
            thumbUrl: currentWebview.thumbUrl,
          };

          Share.bindShare(
            this,
            data,
            this.successCallback,
            this.failCallback
          );
        });
      } else {
        var data = {
          title: 'test',
          link: 'test',
          content: 'test',
          imageUrl: 'test',
          thumbUrl: 'test',
        };

        Share.bindShare(
          this,
          data,
          this.successCallback,
          this.failCallback
        );
      }

    },
    methods: {
      toggleShareNav() {
          mui('#shareShowWrapper').popover('toggle');
      },
      shareToHaoyou(){
          this.sendHaoyou();
          if (mui.os.plus) {
            mui('#shareWrapper').popover('toggle');
          } else {
            mui('#shareWrapper').popover('toggle');
            mui('#shareShowWrapper').popover('toggle');
          }
        this.hide();
      },
      shareToPengyouQuan(){
          this.sendPengYouQuan();
          if (mui.os.plus) {
            mui('#shareWrapper').popover('toggle');
          } else {
            mui('#shareWrapper').popover('toggle');
            mui('#shareShowWrapper').popover('toggle');
          }
        this.hide();
      },
      successCallback(){
        mui.toast('分享成功');

      },
      failCallback(error){
        console.log(JSON.stringify(error));
        mui.toast('分享失败');
      },
      share(){
        if (mui.os.plus) {
          mui.plusReady(function () {
            var currentWebview = plus.webview.currentWebview();
            currentWebview.setStyle({
              height: '100%',
              opacity: 0.97,
            });
          });
        }

        setTimeout(() => {
          mui('#shareWrapper').popover('toggle');
          mui("body").on('tap','.mui-backdrop', () => {
               this.hide();
          })
        }, 150);

      },
      hide(){
        if (mui.os.plus) {
          mui.plusReady(function () {
            var currentWebview = plus.webview.currentWebview();
            currentWebview.setStyle({
              height: '44px',
              opacity: 1,
            });
          });
        }
      },
    },
    computed: {}
    ,
    watch: {}
    ,
    mounted()
    {

    }
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>


  .mui-content {
    padding: 200px;
    text-align: center;
  }


  .shareWrapper {
    .title {
      background: #ececee;
      text-align: center;
      font-size: 14px;
      padding: 12px 0;
    }
    .more {
      background: #fff;
      padding: 10px;
      .single {
        width: 55px;
        height: 55px;
        margin: 0 10px;
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
      right: 15px;
      top: 10px;
      font-size: 70px;
    }
  }



</style>
