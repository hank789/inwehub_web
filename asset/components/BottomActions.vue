<template>
  <div id="homeHeat" class="mui-popover mui-popover-action mui-popover-bottom">
    <div class="heat-wrapper">
      <div class="heatTop">
        <div class="left">
          <div class="fire"><img src="../statics/images/fire@3x.png"></div>
          <div class="heat"><img src="../statics/images/heat@2x.png"></div>
        </div>
        <div class="right">
          <div class="oneLine"></div>

          <div class="iconList" v-for="(item, index) in iconMenu" :key="index" :class="item.isUpvoted ? 'active' : ''"  @tap.stop.prevent="clickItem(item)">
            <div class="addNumber">
              <span>+3</span>
            </div>
            <span class="iconCircular">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="item.icon"></use>
                </svg>
              </span>
            <div class="text active">{{ item.text }}</div>
          </div>

        </div>
      </div>

      <div class="deleteWrapper">
        <div class="bot"></div>
        <div class="single alertConfirm" @tap.stop.prevent="deleteItem">
            <span class="iconW">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shanchu1"></use>
              </svg>
            </span>
          <span class="text">删除</span>
        </div>
      </div>

      <div class="choiceWrapper">
        <div class="bot"></div>
        <div class="title">设置精选</div>
        <div class="choiceList">
          <span class="" :class="regionsValue === item.value ? 'active' : ''" v-for="(item, index) in regions" :key="index" @tap.stop.prevent="choiceItem(item)">{{ item.text }}</span>
        </div>
      </div>

      <div class="cancelW" @tap.stop.prevent="cancelShare">
        <div class="bot"></div>
        <span>确定</span>
      </div>

      <div class="cancelW" @tap.stop.prevent="cancelShare">
        <div class="bot"></div>
        <span>取消</span>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    data () {
      return {
      }
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      iconMenu: {
        type: Array,
        default: () => {
          return []
        }
      },
      regionsValue: {
        type: Number,
        default: ''
      },
      regions: {
        type: Array,
        default: []
      }
    },
    methods: {
      choiceItem (item) {
        this.$emit('choiceItem', item)
      },
      deleteItem () {
        this.$emit('clickDelete')
      },
      clickItem (item) {
        this.$emit('clickedItem', item)
      },
      cancelShare () {
        window.mui('#homeHeat').popover('toggle')
        this.hide()
      },
      hide () {
        this.$emit('hide')
      },
      show () {
        setTimeout(() => {
          window.mui('#homeHeat').popover('toggle')
          window.mui('body').on('tap', '.mui-backdrop', () => {
            this.hide()
          })
        }, 150)
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .heat-wrapper {
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 999;
    padding-top: 0.533rem;
    background: #ffffff;
    border-top-left-radius: 0.48rem;
    border-top-right-radius: 0.48rem;
  }
  .heat-wrapper .heatTop {
    overflow: hidden;
    padding: 0 0.4rem 0.533rem;
  }
  .heat-wrapper .left {
    display: flex;
    float: left;
    margin-top: 0.373rem;
    margin-left: 0.4rem;
  }
  .heat-wrapper .left .fire {
    width: 0.586rem;
    height: 0.666rem;
    position: relative;
    top: 0.146rem;
    margin-right: 0.213rem;
  }
  .heat-wrapper .left .fire img {
    width: 100%;
    height: 100%;
  }
  .heat-wrapper .left .heat {
    width: 0.906rem;
    height: 0.96rem;
  }
  .heat-wrapper .left .heat img {
    width: 100%;
    height: 100%;
  }
  .heat-wrapper .right {
    float: right;
    display: flex;
  }
  .heat-wrapper .right .oneLine {
    width: 0.026rem;
    height: 1.173rem;
    background: #DCDCDC;
    margin-right: 0.4rem;
    position: relative;
    top: 0.266rem;
  }
  .heat-wrapper .right .iconList {
    margin: 0 0.4rem;
    position: relative;
  }
  .heat-wrapper .right .iconList.active .iconCircular {
    color: #FFFFFF;
    background: #03AEF9;
  }
  .heat-wrapper .right .iconList .addNumber {
    height: 0.373rem;
    line-height: 0.373rem;
    position: absolute;
    top: 0.08rem;
    right: -0.266rem;
    display: inline-block;
    padding: 0 0.133rem;
    background: #E5E5E5;
    border-radius: 2.666rem;
  }
  .heat-wrapper .right .iconList .addNumber span {
    color: #808080;
    font-size: 0.266rem;
    position: relative;
    top: -0.053rem;
  }
  .heat-wrapper .right .iconList .iconCircular {
    width: 1.173rem;
    height: 1.173rem;
    color: #808080;
    font-size: 0.426rem;
    text-align: center;
    line-height: 1.173rem;
    border-radius: 50%;
    display: inline-block;
    background: #F7F8FA;
  }
  .heat-wrapper .right .iconList .text {
    color: #808080;
    font-size: 0.293rem;
    text-align: center;
    margin-top: 0.133rem;
  }
  .heat-wrapper .right .iconList .text.active {
    color: #444444;
  }
  .heat-wrapper .right .iconList .text i {
    color: #FA4975;
  }
  .heat-wrapper .cancelW {
    position: relative;
    text-align: center;
  }
  .heat-wrapper .cancelW .bot {
    top: 0 !important;
  }
  .heat-wrapper .cancelW span {
    color: #444444;
    font-family:PingFangSC-Medium;
    font-size: 0.426rem;
    text-align: center;
    line-height: 1.386rem;
  }

  .deleteWrapper {
    position: relative;
    padding: 0.4rem 0 0.333rem;
  }
  .deleteWrapper .bot {
    top: 0;
  }
  .deleteWrapper .single {
    height: 1.866rem;
    display: inline-block;
    margin-left: 0.8rem;
  }
  .deleteWrapper .single .iconW {
    width: 1.173rem;
    height: 1.173rem;
    /*margin: 0 0.32rem;*/
    /*margin-left: 0.8rem;*/
    line-height: 1.306rem;
    text-align: center;
    display: inline-block;
    border-radius: 0.213rem;
    border: 0.026rem solid #DCDCDC;
    color: #C8C8C8;
  }
  .deleteWrapper .single .iconW .icon {
    font-size: 0.586rem;
  }
  .deleteWrapper .single .text {
    display: block;
    font-size: 0.32rem;
    color: #808080;
    line-height: 0.426rem;
    text-align: center;
    margin-top: 0.213rem;
  }
  .choiceWrapper {
    position: relative;
    padding: 0.32rem 0.8rem 0.4rem;
  }
  .choiceWrapper .bot {
    top: 0;
  }
  .choiceWrapper .title {
    font-size: 0.293rem;
    color: #B4B4B6;
    line-height: 0.4rem;
    margin-bottom: 0.053rem;
  }
  .choiceWrapper .choiceList {}
  .choiceWrapper .choiceList span {
    height: 0.72rem;
    padding: 0 0.266rem;
    line-height: 0.72rem;
    color: #444444;
    font-size: 0.32rem;
    display: inline-block;
    background: #F3F4F6;
    border-radius: 2.666rem;
    margin: 0.266rem 0.266rem 0rem 0;
  }
  .choiceWrapper .choiceList span.active {
    background: #03AEF9;
    color: #FFFFFF;
  }
</style>
