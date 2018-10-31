<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">产品服务</h1>
    </header>
    <div class="mui-content">

      <div class="product-introduce">
        <div class="companyLogo">
          <img src="../../../statics/images/uicon.jpg" alt="">
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
        <div class="list" @tap.stop.prevent="$router.replace('/dianping/product')">
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
            <img src="../../../statics/images/uicon.jpg" alt="">
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
    width: 343px;
    margin: 0 auto;
    padding: 10px 0 17px;
    background: #ffffff;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow:0px 7px 13px 0px rgba(240,242,245,1);
    .companyLogo {
      width: 60px;
      height: 60px;
      margin: 0 auto 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
    .companyNmae {
      color: #444444;
      font-size: 18px;
      text-align: center;
      line-height: 25px;
    }
    .companyMark {
      color: #FCC816;
      font-size: 11px;
      line-height: 15px;
      text-align: center;
      margin-top: 8px;
      .comment {
        color: #B4B4B6;
      }
      i {
        width: 2px;
        height: 2px;
        margin-right: 5px;
        vertical-align: middle;
        border-radius: 50%;
        background: #B4B4B6;
        display: inline-block;
      }
    }
    .companyDescribe {
      color: #808080;
      font-size: 12px;
      padding: 0 16px;
      margin-top: 9px;
      line-height: 19px;
      letter-spacing: 0.5px
    }
    .supply {
      text-align: right;
      padding: 0 16px;
      span {
        color: #444444;
        font-size: 12px;
        line-height: 16.5px;
        &:nth-of-type(1) {
          color: #B4B4B6;
          margin-right: 3px;
        }
      }
    }
  }
  .optionlList {
    .list {
      color: #444444;
      font-size: 14px;
      padding: 12px 16px;
      display: flex;
      position: relative;
      justify-content: space-between;
      .ranking {
        color: #B4B4B6;
        font-size: 10px;
        right: 33px;
        position: absolute;
      }
      .icon {
        color: #808080;
        margin-top: 3px;
      }
    }
    .line-river-after {
      &:after {
        left: 16px;
        right: 16px;
      }
    }
  }
  .recommend {
    padding-bottom: 25px;
    .recommendTitle {
      padding: 0 16px 10.5px;
      display: flex;
      justify-content: space-between;
      span {
        &:nth-of-type(1) {
          color: #444444;
          font-size: 16px;
          line-height: 22.5px;
          margin-top: 11px;
        }
        &:nth-of-type(2) {
          color: #808080;
          font-size: 13px;
          line-height: 18.5px;
          margin-top: 13px;
          .icon {
            font-size: 10px;
            margin-left: 3.5px;
          }
        }
      }
    }
    .recommendList {
      width: 304.5px;
      margin: 0 auto;
      padding: 10px 15px;
      background: #F7F8FA;
      border-radius: 8px;
      overflow: hidden;
      .avatar {
        width: 44px;
        height: 44px;
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .personalInfo {
        float: left;
        margin-top: 3px;
        margin-left: 10px;
        .name {
          color: #565656;
          line-height: 20px;
          font-size: 14px;
        }
        .good {
          color: #B4B4B6;
          font-size: 12px;
          line-height: 16.5px;
        }
      }
      .speak {
        float: right;
        margin-top: 8.5px;
        span {
          color: #03AEF9;
          font-size: 12px;
          padding: 0 10px;
          line-height: 27px;
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
