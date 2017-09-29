<template>
  <div>
    <a class="mui-icon shareBtn mui-pull-right" @tap.stop.prevent="share()">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-fenxiang"></use>
      </svg>
    </a>

    <div id="shareWrapper" class="shareWrapper mui-popover mui-popover-action mui-popover-bottom">
      <div class="title">分享到</div>
      <div class="more">
        <div class="single" id="wechatShareBtn" @tap.stop.prevent="shareToHaoyou()">
          <img src="../statics/images/wechat_2x.png" />
        </div>
        <div class="single" id="wechatShareBtn2" @tap.stop.prevent="shareToPengyouQuan()">
          <img src="../statics/images/pengyouquan.png" />
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

<script type="text/javascript">

  import Share from '../utils/share';

  export default {
    data () {
      return {

      }
    },
    components: {

    },
    props: {
      title: {
        type: String,
        default: ''
      },
      link: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      },
      imageUrl: {
        type: String,
        default: ''
      },
      thumbUrl: {
        type: String,
        default: ''
      }
    },
    watch: {
      'link'(newVal, oldVal) {
        var data = {
          title: this.title,
          link:  this.link,
          content: this.content,
          imageUrl: this.imageUrl,
          thumbUrl: this.thumbUrl,
        };

        Share.bindShare(
          this,
          data,
          this.successCallback,
          this.failCallback
        );
      },
    },
    mounted(){


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
        setTimeout(() => {
          mui('#shareWrapper').popover('toggle');
          mui("body").on('tap','.mui-backdrop', () => {
            this.hide();
          })
        }, 150);
      },
      hide(){

      },
    }
  };
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .shareBtn{
    position: fixed;
    right:10px;
    top:10px;
    z-index:11;
    color:#fff;
  }

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
