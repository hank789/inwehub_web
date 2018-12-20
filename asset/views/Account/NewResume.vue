<template>
  <div class="resume">

    <div class="mui-content">

      <header class="mui-bar mui-bar-nav content-header-hide">
        <Back></Back>
        <h1 class="mui-title">个人信息</h1>
        <div class="openNotice share">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shoucang-xiao"></use>
          </svg>
        </div>
      </header>

      <div class="header">
        <img class="lazyImg" src="../../statics/images/uicon.jpg">
        <div class="backMask"></div>
        <div class="headerBack">
          <div @tap.stop.prevent="goBack">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fanhui"></use>
            </svg>
          </div>
        </div>
        <div class="title font-family-medium">个人名片</div>
        <div class="openNotice share">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shoucang-xiao"></use>
          </svg>
        </div>

        <div class="headPhotowrapper">
          <div class="headImages">
            <img class="lazyImg" src="../../statics/images/uicon.jpg">
          </div>
          <div class="personalInfo">
            <div class="nameAndLevel">
              <span class="name font-family-medium">蓝色小白</span>
              <span class="level">L2</span>
            </div>
            <div class="detailInfo">
              <span class="text">被赞</span><span class="number font-family-medium">23</span> <i></i> <span class="text">综合评分1.4</span>
            </div>
            <div class="consultWrapper">
              <div class="leftButton">
                <div class="border-football font-family-medium">详细资料</div>
                <div class="border-football font-family-medium letter">发私信</div>
                <div class="border-football font-family-medium">提问题</div>
              </div>
              <div class="rightDetailInfo">
                <span class="font-family-medium">详细资料</span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-jinru"></use>
                </svg>
              </div>
            </div>
            <div class="operationWrapper">
              <div class="code iconAndText">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-erweima"></use>
                </svg>
                <div class="word">个人码</div>
              </div>
              <div class="iconAndText">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shoucang"></use>
                </svg>
                <div class="word">关注</div>
              </div>
              <div class="active iconAndText">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shoucanghover"></use>
                </svg>
                <div class="word">已关注</div>
              </div>
            </div>
          </div>

          <div class="counter">
            <div class="counterList" @tap.stop.prevent="$router.pushPlus('/my/focus/'+uuid)">
              <span class="font-family-medium">12</span>
              <span class="script">谁关注Ta</span>
            </div>

            <div class="counterList" @tap.stop.prevent="$router.pushPlus('/followed/'+uuid)">
              <span class="font-family-medium">34</span>
              <span class="script">Ta关注谁</span>
            </div>

            <div class="counterList" @tap.stop.prevent="$router.pushPlus('/my/publishAnswers/'+uuid)">
              <span class="font-family-medium">45</span>
              <span class="script">发布</span>
            </div>

            <div class="counterList" @tap.stop.prevent="$router.pushPlus('/group/my/'+uuid)">
              <span class="font-family-medium">45</span>
              <span class="script">圈子</span>
            </div>
          </div>
        </div>

      </div>

      <div class="domainWrapper">
        <div class="skilledTags">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shanchang"></use>
          </svg>
          <span>擅长领域</span>
        </div>
        <template>
          <div class="tags" @tap.stop.prevent="toTagDetail(industry.text)"><span>消费品分析</span></div>
          <div class="tags" @tap.stop.prevent="toTagDetail(industry.text)"><span>消费品分析</span></div>
          <div class="tags" @tap.stop.prevent="toTagDetail(industry.text)"><span>消费品分析</span></div>
        </template>
        <div class="addTags" @tap.stop.prevent="$router.pushPlus('/my/advantage')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-plus--"></use>
          </svg>添加
        </div>
        <div class="bot"></div>
      </div>

      <div class="specialColumn">
        <div class="titleText">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhuanlan"></use>
          </svg>
          <span>文章专栏</span>
        </div>
        <div class="iconFont">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
      </div>

      <div class="gray"></div>

    </div>

  </div>

</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;}
  .bot {
    position: absolute;
    right: 0.373rem;
    bottom: 0;
    left: 0.373rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
    /*border: 0.026rem solid #dcdcdc;*/
  }

  .content-header-hide {
    display: none;
  }
  .mui-bar-nav {
    transition: all ease-out .3s;
    top: 0 !important;
    .mui-title {
      /*color: #ffffff;*/
    }
    .openNotice {
      float: right;
      position: relative;
      z-index: 9;
      font-size: 0.64rem;
      padding-top: 0.28rem;
      /*color: #ffffff;*/
    }
    .share {
      float: right;
      padding-right: 0.2rem;
      padding-left: 0.462rem;
    }
  }

  .header {
    background: #1C3F6D;
    position: relative;
    height: 321.5px;
    border-bottom-left-radius: 0.533rem;
    border-bottom-right-radius: 0.533rem;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-bottom-left-radius: 0.533rem;
      border-bottom-right-radius: 0.533rem;
    }
    .title {
      position: absolute;
      top: 10px;
      left: 50%;
      font-size: 18px;
      color: #FFFFFF;
      transform: translateX(-50%);
    }
    .backMask {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      border-bottom-left-radius: 0.533rem;
      border-bottom-right-radius: 0.533rem;
      background:linear-gradient(360deg,rgba(27,68,194,1) 0%,rgba(81,167,254,0.8) 100%);
    }
    .headerBack {
      /*width: 100%;*/
      display: flex;
      height: 1.173rem;
      position: absolute;
      top: 0;
      z-index: 10;
      padding-left: 0.32rem;
      .icon {
        margin-top: 0.266rem;
        font-size: 0.613rem;
        color: #FFFFFF;
      }
    }
    .openNotice {
      position: absolute;
      top: 0.293rem;
      right: 1.6rem;
      .icon {
        font-size: 0.64rem;
        color: #ffffff;
      }
      &.share {
        right: 0.426rem;
      }
    }
    .headPhotowrapper {
      width: 90%;
      position: absolute;
      top: 59px;
      left: 26px;
      z-index: 100;
      .headImages {
        width: 92px;
        height: 92px;
        text-align: center;
        background: #E3E3E3;
        border-radius: 50%;
        border: 1px solid #ffffff;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      .personalInfo {
        .nameAndLevel {
          margin-top: 10px;
          .name {
            color: #FFFFFF;
            font-size: 20px;
            line-height: 28px;
          }
          .level {
            padding: 0.026rem 0.133rem;
            position: relative;
            top: -0.08rem;
            font-style: normal;
            line-height: 0.4rem;
            font-size: 0.266rem;
            color: #FFFFFF;
            text-align: center;
            border-radius: 2.666rem;
            background:linear-gradient(180deg,#07D7FD 0%,#03AEF9 100%);
          }
        }
        .detailInfo {
          margin-top: 6px;
          font-size: 12px;
          line-height: 16.5px;
          .text {
            color: #ffffff;
            opacity: 0.7;
          }
          .number {
            color: #ffffff;
          }
          i {
            display: inline-block;
            width: 0.053rem;
            height: 0.053rem;
            border-radius: 50%;
            background: #ffffff;
            opacity: 0.7;
            margin: 0 5px 0.08rem;
          }
        }
        .consultWrapper {
          margin-top: 18px;
          display: flex;
          justify-content: space-between;
          .leftButton {
            display: flex;
            .letter {
              margin-right: 8.5px;
            }
            .border-football {
              color: #ffffff;
              font-size: 13px;
              padding: 4px 16.5px;
              &:after {
                border-radius: 8px;
                border-color: #85A3E4;
              }
            }
          }
          .rightDetailInfo {
            margin-right: 1px;
            margin-top: 6.5px;
            span {
              color: #FFFFFF;
              font-size: 12px;
            }
            .icon {
              color: #FFFFFF;
              font-size: 5px;
            }
          }
        }
        .operationWrapper {
          position: absolute;
          top: 15.5px;
          right: 0;
          display: flex;
          .iconAndText {
            width: 44px;
            text-align: center;
            .word {
              color: #FFFFFF;
              font-size: 11px;
              opacity: 0.7;
            }
            &.code {
              .icon {
                font-size: 21px;
              }
            }
            &.active {
              .icon {
                color: #FA4975;
              }
            }
            .icon {
              color: #ffffff;
              font-size: 22px;
            }
          }
        }
      }
    }
  }

  .counter {
    width: 343px;
    /*height: 65px;*/
    padding: 9px 0 13.5px;
    position: relative;
    top: 26px;
    left: -10px;
    overflow: hidden;
    text-align: center;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0px 5px 10px 0px rgba(247,248,250,1);
    .counterList {
      width: 25%;
      float: left;
      span {
        display: block;
      }
      .font-family-medium {
        font-size: 19px;
        color: #444444;
        line-height: 26.5px;
      }
      .script {
        font-size: 11px;
        line-height: 15px;
        color: #808080;
        margin-top: 1px;
      }
    }
  }

  .domainWrapper {
    padding: 0 16px;
    overflow: hidden;
    position: relative;
    margin-top: 37px;
    .skilledTags {
      height: 44px;
      line-height: 44px;
      margin-bottom: 5px;
      .icon {
        font-size: 15px;
        margin-right: 2px;
      }
      span {
        color: #444444;
        font-size: 16px;
      }
    }
    .tags {
      float: left;
      margin-right: 0.213rem;
      margin-bottom: 15px;
      span {
        float: left;
        background: #ececee;
        border-radius: 1.333rem;
        padding: 0rem 0.266rem;
        line-height: 0.64rem;
        font-size: 12px;
        color: #444444;
      }
    }
    .addTags {
      float: left;
      color: #03AEF9;
      padding: 0rem 0.266rem;
      line-height: 0.64rem;
      font-size: 0.32rem;
      vertical-align: sub;
      margin-bottom: 15px;
      border-radius: 1.333rem;
      border: 0.026rem solid #DCDCDC;
      .icon {
        font-size: 0.32rem;
        color: #B4B4B6;
        margin-right: 0.08rem;
      }
    }
  }

  .specialColumn {
    padding: 0 16px;
    display: flex;
    height: 44px;
    line-height: 44px;
    justify-content: space-between;
    .titleText {
      .icon {
        font-size: 15px;
        margin-right: 2px;
      }
      span {
        color: #444444;
        font-size: 16px;
      }
    }
    .iconFont {
      /*margin-top: 15.5px;*/
    }
  }

</style>

