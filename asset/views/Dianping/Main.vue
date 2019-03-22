<template>
  <div class="mui-content">

    <div class="topTitle font-family-medium">热门专题</div>
    <div class="heatAlbum">
      <div class="albumList">
        <div class="componentCarAlbum">
          <div class="albumName font-family-medium">表单调查工具大全</div>
          <div class="tags"><span>必看</span></div>
          <div class="backgroundSmall">
            <img src="../../statics/images/remen_zhunti_small2@3x.png" style="width: 100%;">
          </div>
          <div class="backgroundBig">
            <img src="../../statics/images/remen_zhunti_big1@3x.png">
          </div>
        </div>
      </div>
    </div>

    <div class="topTitle font-family-medium">热门产品</div>
    <div class="heatProduct">
      <div class="productList">
        <div class="componentCarProduct">
          <div class="topInfo">
            <div class="left">
              <div class="logo">
                <img
                  src="../../statics/images/remen_zhunti_big1@3x.png">
              </div>
              <div class="nameMark">
                <div class="title font-family-medium">阿里云</div>
                <div class="stars">
                  <span class="span">4分</span>
                </div>
              </div>
            </div>
            <div class="right">
              <div class="heatICon">
                <img src="../../statics/images/zhuanti_fill@3x.png">
              </div>
              <div class="textNumber">2862</div>
            </div>
          </div>
          <div class="bottom">
            <div class="describe">提供快速内存和最新的英特尔CPU，可帮助您为云应用程序提供动力。</div>
          </div>
        </div>
      </div>
    </div>

    <div class="topTitle font-family-medium">专题集</div>
    <div class="specialWrapper">
      <div class="display">
        <div>
          <div class="specialList">
            <div class="mask"></div>
            <div class="img"><img src="../../statics/images/remen_zhunti_big1@3x.png"></div>
            <div class="text font-family-medium">分析与商业智能</div>
          </div>
          <div class="expectWrapper specialList">
            <div class="content">
              <span class="iconfont icon-tianjia"></span>
              <span class="expectText">我期待</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<style scoped lang="less">
  .mui-content {
    background: #fff !important;
  }

  .topTitle {
    color: #3C3E44;
    font-size: 0.533rem;
    padding: 0.48rem 0.426rem 0;
  }

  .heatAlbum {
    padding: 0 0.426rem;
    margin-top: 0.346rem;

    .albumList {
      display: inline-block;
    }
  }

  .albumList {
    .componentCarAlbum {
      width: 3.013rem;
      height: 4.066rem;
      position: relative;
      border-radius: 0.106rem;
      margin: 0.053rem 0.053rem 0 0;
      background: linear-gradient(39deg, rgba(60, 87, 119, 1) 0%, rgba(28, 44, 66, 1) 100%);

      &:nth-of-type(2) {
        margin-right: 0;
      }

      .albumName {
        position: relative;
        z-index: 1;
        color: #FFFFFF;
        font-size: 0.373rem;
        padding: 0.533rem 0.4rem 0;
        line-height: 0.586rem;
      }

      .tags {
        position: absolute;
        z-index: 1;
        left: 0.4rem;
        bottom: 0.533rem;
        height: 0.4rem;
        padding: 0 0.133rem;
        line-height: 0.4rem;
        border-radius: 0rem 0.106rem 0rem 0.106rem;
        background: linear-gradient(45deg, rgba(83, 223, 221, 1) 0%, rgba(41, 188, 184, 1) 100%);

        span {
          color: #1C2C42;
          font-size: 0.266rem;
          line-height: 0.373rem;
        }
      }

      .backgroundSmall {
        position: absolute;
        top: 0;
        left: 0;
        width: 3.013rem;
        height: 4.066rem;
      }

      .backgroundBig {
        position: absolute;
        top: 0;
        left: 0;
        width: 6.08rem;
        height: 4.066rem;
        display: none;
      }
    }
  }

  .albumList .componentCarAlbum .backgroundSmall image,
  .albumList .componentCarAlbum .backgroundBig img {
    width: 100%;
    height: 100%;
  }

  .heatProduct {
    margin-top: 0.4rem;
  }

  .productList {
    margin-top: 0.266rem;
    padding: 0 0.426rem;
  }

  .componentCarProduct {
    padding: 0.4rem;
    background: #FFFFFF;
    border-radius: 0.106rem;
    box-shadow: 0rem 0rem 0.693rem 0rem rgba(232, 241, 241, 1);

    .topInfo {
      display: flex;
      justify-content: space-between;

      .left {
        display: flex;

        .nameMark {
          .title {
            color: #3C3E44;
            font-size: 0.426rem;
            line-height: 0.6rem;
            margin-bottom: 0.186rem;
          }

          .stars {
            display: flex;

            .span {
              font-size: 0.293rem;
              line-height: 0.4rem;
              margin-left: 0.08rem;
              margin-top: 0.04rem;
            }
          }
        }

        .logo {
          width: 1.173rem;
          height: 1.173rem;
          margin-right: 0.266rem;
          overflow: hidden;
          border-radius: 0.106rem;
          border: 0.013rem solid #ECECEE;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .right {
        display: flex;

        .heatICon {
          width: 0.24rem;
          height: 0.306rem;
          margin-right: 0.106rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .textNumber {
          color: #3C3E44;
          font-size: 0.32rem;
          line-height: 0.386rem;
          margin-top: 0.026rem;
        }
      }
    }

    .bottom {
      .describe {
        color: #808080;
        font-size: 0.373rem;
        line-height: 0.6rem;
        margin-top: 0.266rem;
      }
    }
  }

  .specialWrapper {
    width: 100%;
    height: 11.906rem;
    padding: 0rem 0 0 0rem;
    overflow: hidden;
    white-space: nowrap;
    margin-bottom: 0.8rem;

    .specialList {
      position: relative;
      margin: 0.266rem 0rem 0 0;

      .img {
        width: 4.44rem;
        height: 2.12rem;
        border-radius: 0.106rem;
      }

      img {
        height: 100%;
        width: 100%;
        border-radius: 0.106rem;
      }

      .text {
        font-size: 0.346rem;
        color: #FFFFFF;
        position: absolute;
        bottom: 0.4rem;
        left: 0.4rem;
        white-space: normal;
        padding-right: 0.4rem;
      }

      .mask {
        width: 4.44rem;
        height: 2.12rem;
        background: linear-gradient(180deg, rgba(28, 44, 66, 0) 0%, rgba(28, 44, 66, 1) 100%);
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 0.106rem;
      }
    }
  }

  .display {
    display: inline-block;
    vertical-align: top;
    margin-left: 0.266rem;

    &:last-child {
      margin-right: 0.266rem;
    }
  }

  .marginR {
    margin-right: 0.533rem;
  }

  .expectWrapper {
    width: 4.44rem;
    height: 2.08rem;

    .content {
      height: 100%;
      line-height: 2.08rem;
      border-radius: 0.106rem;
      border: 0.013rem solid #DCDCDC;

      .iconfont {
        font-size: 0.346rem;
        color: #3C3E44;
        margin-left: 0.4rem;
        margin-right: 0.093rem;
      }

      .expectText {
        color: #808080;
        font-size: 0.346rem;
      }
    }
  }
</style>
