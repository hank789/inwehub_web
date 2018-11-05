<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">产品服务</h1>
    </header>
    <div class="mui-content">

      <div class="product-introduce">
        <div class="companyLogo">
          <img src="../../statics/images/uicon.jpg" alt="">
        </div>
        <div class="companyNmae font-family-medium">TradeShift</div>
        <div class="companyMark">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shoucangdilantongyi"></use>
          </svg><span>4.3分</span>
          <i></i><span class="comment">6条评论</span>
        </div>
        <div class="companyDescribe">外包此活动为您提供财务空间和更多时间，可用于贵公司的核心竞争力和战略方向</div>
        <div class="supply"><span>供应商</span><span class="font-family-medium">TradeShift</span></div>
      </div>
      <div class="optionlList">
        <div class="list">
          <span>采购软件</span>
          <span class="ranking">No.2</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="line-river-after line-river-after-top"></div>
        <div class="list">
          <span>供应商管理软件</span>
          <span class="ranking">No.2</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
      </div>
      <div class="line-river-big"></div>

      <div class="recommend">
        <div class="recommendTitle">
          <span class="font-family-medium">推荐顾问</span>
          <span>
            排序<svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-paixu"></use>
              </svg>
          </span>
        </div>
        <div class="recommendList">
          <div class="avatar">
            <img src="../../statics/images/uicon.jpg" alt="">
          </div>
          <div class="personalInfo">
            <div class="name">
              <span class="font-family-medium">曹丽</span>
            </div>
            <div class="good">擅长“TradeShift”</div>
          </div>
          <div class="speak"><span class="border-football">沟通</span></div>
        </div>
      </div>
      <div class="line-river-big"></div>

    </div>
  </div>
</template>

<script>

</script>

<style scoped lang="less">
.mui-content {
  background: #ffffff;
}

  .product-introduce {
    width: 9.146rem;
    margin: 0 auto;
    padding: 0.266rem 0 0.453rem;
    background: #ffffff;
    border-bottom-left-radius: 0.533rem;
    border-bottom-right-radius: 0.533rem;
    box-shadow:0rem 0.186rem 0.346rem 0rem rgba(240,242,245,1);
    .companyLogo {
      width: 1.6rem;
      height: 1.6rem;
      margin: 0 auto 0.266rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .companyNmae {
      color: #444444;
      font-size: 0.48rem;
      text-align: center;
      line-height: 0.666rem;
    }
    .companyMark {
      color: #FCC816;
      font-size: 0.293rem;
      line-height: 0.4rem;
      text-align: center;
      margin-top: 0.213rem;
      .comment {
        color: #B4B4B6;
      }
      i {
        width: 0.053rem;
        height: 0.053rem;
        margin-right: 0.133rem;
        vertical-align: middle;
        border-radius: 50%;
        background: #B4B4B6;
        display: inline-block;
      }
    }
    .companyDescribe {
      color: #808080;
      font-size: 0.32rem;
      padding: 0 0.426rem;
      margin-top: 0.24rem;
      line-height: 0.506rem;
      letter-spacing: 0.013rem
    }
    .supply {
      text-align: right;
      padding: 0 0.426rem;
      span {
        color: #444444;
        font-size: 0.32rem;
        line-height: 0.44rem;
        &:nth-of-type(1) {
          color: #B4B4B6;
          margin-right: 0.08rem;
        }
      }
    }
  }
  .optionlList {
    .list {
      color: #444444;
      font-size: 0.373rem;
      padding: 0.32rem 0.426rem;
      display: flex;
      position: relative;
      justify-content: space-between;
      .ranking {
        color: #B4B4B6;
        font-size: 0.266rem;
        right: 0.88rem;
        position: absolute;
      }
      .icon {
        color: #808080;
        margin-top: 0.08rem;
      }
    }
    .line-river-after {
      &:after {
        left: 0.426rem;
        right: 0.426rem;
      }
    }
  }
  .recommend {
    padding-bottom: 0.666rem;
    .recommendTitle {
      padding: 0 0.426rem 0.28rem;
      display: flex;
      justify-content: space-between;
      span {
        &:nth-of-type(1) {
          color: #444444;
          font-size: 0.426rem;
          line-height: 0.6rem;
          margin-top: 0.293rem;
        }
        &:nth-of-type(2) {
          color: #808080;
          font-size: 0.346rem;
          line-height: 0.493rem;
          margin-top: 0.346rem;
          .icon {
            font-size: 0.266rem;
            margin-left: 0.093rem;
          }
        }
      }
    }
    .recommendList {
      width: 8.12rem;
      margin: 0 auto;
      padding: 0.266rem 0.4rem;
      background: #F7F8FA;
      border-radius: 0.213rem;
      overflow: hidden;
      .avatar {
        width: 1.173rem;
        height: 1.173rem;
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .personalInfo {
        float: left;
        margin-top: 0.08rem;
        margin-left: 0.266rem;
        .name {
          color: #565656;
          line-height: 0.533rem;
          font-size: 0.373rem;
        }
        .good {
          color: #B4B4B6;
          font-size: 0.32rem;
          line-height: 0.44rem;
        }
      }
      .speak {
        float: right;
        margin-top: 0.226rem;
        span {
          color: #03AEF9;
          font-size: 0.32rem;
          padding: 0 0.266rem;
          line-height: 0.72rem;
          display: inline-block;
        }
        .border-football {
          &:after {
            border-color: #03AEF9;
          }
        }
      }
    }
  }
</style>
