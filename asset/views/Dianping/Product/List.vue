<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">点评</h1>
    </header>
    <div class="mui-content">
      <div class="listSelect">
        <div>
          <span class="font-family-medium">采购软件</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xiangxiajiantou"></use>
          </svg>
        </div>
        <div>
          <span class="font-family-medium">好评</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-paixu"></use>
          </svg>
        </div>
      </div>

      <div class="list">
        <div class="comment-product">
          <div class="product-info">
            <div class="product-img">
              <img src="../../../statics/images/uicon.jpg" alt="">
            </div>
            <div class="product-detail">
              <div class="productName font-family-medium">Studio Science Reviews</div>
              <div class="productMark">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shoucangdilantongyi"></use>
                </svg><span>4.3分</span>
                <i></i><span>6条评论</span>
              </div>
            </div>
          </div>
          <div class="line-river-after line-river-after-top"></div>
        </div>
        <div class="comment-product">
          <div class="product-info">
            <div class="product-img">
              <img src="../../../statics/images/uicon.jpg" alt="">
            </div>
            <div class="product-detail">
              <div class="productName font-family-medium">Studio Science Reviews</div>
              <div class="productMark">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shoucangdilantongyi"></use>
                </svg><span>4.3分</span>
                <i></i><span>6条评论</span>
              </div>
            </div>
          </div>
          <div class="line-river-after line-river-after-top"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;
  }
  .listSelect {
    height: 34px;
    padding: 0 16px;
    line-height: 34px;
    display: flex;
    justify-content: space-between;
    box-shadow:0px 5px 10px 0px rgba(249,249,251,1);
    div {
      color: #444444;
      font-size: 13px;
      &:nth-of-type(1) {
        .icon {
          font-size: 7px;
          margin-bottom: 1px;
        }
      }
      &:nth-of-type(2) {
        .icon {
          font-size: 10px;
        }
      }
    }
  }

  .list {
    margin-top: 1.5px;
  }
  .comment-product {
    padding: 14px 15px 0;
    .product-info {
      overflow: hidden;
      padding-bottom: 16px;
      .product-img {
        width: 44px;
        height: 44px;
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }
      .product-detail {
        float: left;
        margin-left: 10px;
        .productName {
          color: #444444;
          font-size: 16px;
          line-height: 22.5px;
        }
        .productMark {
          .icon {
            color: #FCC816;
            font-size: 12px;
          }
          span {
            color: #B4B4B6;
            font-size: 11px;
            line-height: 15px;
            &:nth-of-type(1) {
              color: #FCC816;
              margin-left: 3px;
            }
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
      }
    }
  }
</style>
