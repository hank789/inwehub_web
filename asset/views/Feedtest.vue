<template>
  <div>
    <header class="hidewechattitle mui-bar mui-bar-nav component-homeHeader">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-logowenzi"></use>
      </svg>
    </header>

    <div class="mui-content" v-show="!loading">
      <div class="container-1-yuan mui-navigate-right">你的首问1元特惠还剩<span>71<i class="font-10">时</i>20<i class="font-10">分</i>14<i class="font-10">秒</i></span></div>
      <div class="container-item">
        <div class="container-avatarAndText">
          <div class="author">
            <div class="avatar">
              <div class="avatarInner"><img src="images/expert.png">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </div>
            </div>
            <div class="mui-media-body">张红回答了专业问答</div>
          </div>
        </div>
        <div class="text-16-444 mui-ellipsis-2">最近开始研究S4 HANA，请问专家1610版本在PP主数据上有什么样的新变化？</div>
      </div>
      <div class="container-item">
        <div class="container-avatarAndText">
          <div class="author">
            <div class="avatar">
              <div class="avatarInner"><img src="images/expert.png">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </div>
            </div>
            <div class="mui-media-body">郭伟回答了互动问答</div>
          </div>
        </div>
        <div class="text-16-444 mui-ellipsis">敢在抢在iPhone8发布之前登场, 究竟是谁给了小</div>
        <div class="text-14-808080 mui-ellipsis-2 margin-10-0-0">发布会一上来，雷军就说小米终于回到全球出货量前五名了！排在三星、苹果、华为和OPPO后面，估计是因</div>
      </div>
      <div class="container-item">
        <div class="container-avatarAndText">
          <div class="author">
            <div class="avatar">
              <div class="avatarInner"><img src="images/expert.png">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </div>
            </div>
            <div class="mui-media-body">张红回答了专业问答</div>
          </div>
        </div>
        <div class="text-16-444 mui-ellipsis-2">最近开始研究S4 HANA，请问专家1610版本在PP主数据上有什么样的新变化？</div>
        <div class="labelWrapper"><span class="font-12 color-b4b4b6 line-vertical">回答2</span><span class="font-12 color-03aef9">关注问题23</span></div>
      </div>
      <div class="container-item">
        <div class="container-avatarAndText">
          <div class="author">
            <div class="avatar">
              <div class="avatarInner"><img src="images/expert.png">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </div>
            </div>
            <div class="mui-media-body">郭伟发布了文章</div>
          </div>
        </div>
        <div class="container-image margin-10-0-0">
          <image src="images/bg.png"></image>
        </div>
        <div class="text-16-444 mui-ellipsis-2 margin-10-0-0">客户虐我千百遍，爱意如初永感念。客户虐我千百遍，爱意如初永感念-baidu.com</div>
      </div>
      <div class="container-item">
        <div class="container-avatarAndText">
          <div class="author">
            <div class="avatar">
              <div class="avatarInner"><img src="images/expert.png">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </div>
            </div>
            <div class="mui-media-body">张红关注了互动问答</div>
          </div>
        </div>
        <div class="text-16-444 mui-ellipsis-2">最近开始研究S4 HANA，请问专家1610版本在PP主数据上有什么样的新变化？</div>
        <div class="labelWrapper"><span class="font-12 color-b4b4b6 line-vertical">回答2</span><span class="font-12 color-03aef9">关注问题23</span></div>
      </div>
      <div class="container-item">
        <div class="color-808080 font-13">郭伟关注了新的朋友</div>
        <div class="flex space-between margin-5-0-0">
          <div class="left">
            <div class="container-avatarAndText">
              <div class="author">
                <div class="avatar">
                  <div class="avatarInner"><img src="images/expert.png">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                    </svg>
                  </div>
                </div>
                <div class="mui-media-body color-565656">郭伟</div>
              </div>
            </div>
          </div>
          <div class="middle grow-2">
            <div class="component-follow">
              <div class="circle">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-plus--"></use>
                </svg>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="container-avatarAndText">
              <div class="author">
                <div class="avatar">
                  <div class="avatarInner"><img src="images/expert.png">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                    </svg>
                  </div>
                </div>
                <div class="mui-media-body color-565656">郭伟</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-item">
        <div class="container-avatarAndText">
          <div class="author">
            <div class="avatar">
              <div class="avatarInner"><img src="images/expert.png">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </div>
            </div>
            <div class="mui-media-body">张红评论了专业回答</div>
          </div>
        </div>
        <div class="text-14-444 mui-ellipsis">发布会一上来，雷军就说小米终于回到全球出货量前五名了！排在三星、苹果、华为和OPPO后面，估计是因</div>
        <div class="container-answer margin-5-0-0">
          <div class="color-808080 font-13">回答者：郭伟</div>
          <div class="color-444 font-16 margin-5-0-0 mui-ellipsis-2">最近开始研究S4 HANA，请问专家1610版本在PP主数据上有什么样的新变化？</div>
        </div>
      </div>
      <div class="container-item">
        <div class="container-avatarAndText">
          <div class="author">
            <div class="avatar">
              <div class="avatarInner"><img src="images/expert.png">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </div>
            </div>
            <div class="mui-media-body">张红评论了互动回答</div>
          </div>
        </div>
        <div class="text-14-444 mui-ellipsis">发布会一上来，雷军就说小米终于回到全球出货量前五名了！排在三星、苹果、华为和OPPO后面，估计是因</div>
        <div class="container-answer margin-5-0-0">
          <div class="color-808080 font-13">回答者：郭伟</div>
          <div class="color-444 font-16 margin-5-0-0 mui-ellipsis">最近开始研究S4 HANA，请问专家1610版本在PP主数据上有什么样的新变化？</div>
          <div class="color-808080 font-14 margin-5-0-0 mui-ellipsis-2">发布会一上来，雷军就说小米终于回到全球出货量前五名了！排在三星、苹果、华为和OPPO后面，估计是因</div>
        </div>
      </div>
      <div class="container-item">
        <div class="container-avatarAndText">
          <div class="author">
            <div class="avatar">
              <div class="avatarInner"><img src="images/expert.png">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </div>
            </div>
            <div class="mui-media-body">张红评论了文章</div>
          </div>
        </div>
        <div class="text-14-444 mui-ellipsis">发布会一上来，雷军就说小米终于回到全球出货量前五名了！排在三星、苹果、华为和OPPO后面，估计是因</div>
        <div class="container-answer margin-5-0-0">
          <div class="color-808080 font-13">发布者：郭伟</div>
          <div class="container-image margin-10-0-0">
            <image src="images/bg.png"></image>
          </div>
          <div class="color-444 font-16 margin-10-0-0 mui-ellipsis-2">最近开始研究S4 HANA，请问专家1610版本在PP主数据上有什么样的新变化？</div>
        </div>
      </div>
      <div class="container-item">
        <div class="container-avatarAndText">
          <div class="author">
            <div class="avatar">
              <div class="avatarInner"><img src="images/expert.png">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </div>
            </div>
            <div class="mui-media-body">张红赞了专业回答</div>
          </div>
        </div>
        <div class="container-answer">
          <div class="color-808080 font-13">回答者：郭伟</div>
          <div class="color-444 font-16 margin-5-0-0 mui-ellipsis-2">最近开始研究S4 HANA，请问专家1610版本在PP主数据上有什么样的新变化？</div>
        </div>
      </div>
      <div class="container-item">
        <div class="container-avatarAndText">
          <div class="author">
            <div class="avatar">
              <div class="avatarInner"><img src="images/expert.png">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </div>
            </div>
            <div class="mui-media-body">张红赞了互动回答</div>
          </div>
        </div>
        <div class="container-answer">
          <div class="color-808080 font-13">回答者：郭伟</div>
          <div class="color-444 font-16 margin-5-0-0 mui-ellipsis">最近开始研究S4 HANA，请问专家1610版本在PP主数据上有什么样的新变化？</div>
          <div class="text-14-808080 margin-5-0-0 mui-ellipsis-2">发布会一上来，雷军就说小米终于回到全球出货量前五名了！排在三星、苹果、华为和OPPO后面，估计是因</div>
        </div>
      </div>
      <div class="container-item">
        <div class="container-avatarAndText">
          <div class="author">
            <div class="avatar">
              <div class="avatarInner"><img src="images/expert.png">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </div>
            </div>
            <div class="mui-media-body">张红赞了文章</div>
          </div>
        </div>
        <div class="container-answer">
          <div class="color-808080 font-13">发布者：郭伟</div>
          <div class="container-image margin-10-0-0">
            <image src="images/bg.png"></image>
          </div>
          <div class="color-444 font-16 margin-10-0-0 mui-ellipsis-2">最近开始研究S4 HANA，请问专家1610版本在PP主数据上有什么样的新变化？</div>
        </div>
      </div>
      <div class="flex center font-12 color-c8c8c8 padding-13-0-20-0">你已经到达我的底线</div>
    </div>
    <div id="statusBarStyle" background="#f3f4f6" bgColor="#f3f4f6" mode="dark"></div>
  </div>

</template>
<script>
  import {NOTICE, ASK_INFO, ASK_TYPE_SELECT} from '../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../utils/request';

  const Feed = {
    data: () => ({
      loading: false,
    }),
    created() {

    },
    components: {

    },
    //缓存；
    activated: function () {

    },
    mounted() {

    },
    computed: {
      //首页倒计时；
      couponExpireAtText() {
        if (this.couponExpireAtTime) {
          return TimeEndText(this.currentTime, this.couponExpireAtTime);
        }
      }
    },
    methods: {

    }
  };
  export default Feed;
</script>

<style lang="less" scoped>

</style>
