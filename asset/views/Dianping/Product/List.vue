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
    height: 0.906rem;
    padding: 0 0.426rem;
    line-height: 0.906rem;
    display: flex;
    justify-content: space-between;
    box-shadow:0rem 0.133rem 0.266rem 0rem rgba(249,249,251,1);
    div {
      color: #444444;
      font-size: 0.346rem;
      &:nth-of-type(1) {
        .icon {
          font-size: 0.186rem;
          margin-bottom: 0.026rem;
        }
      }
      &:nth-of-type(2) {
        .icon {
          font-size: 0.266rem;
        }
      }
    }
  }

  .list {
    margin-top: 0.04rem;
  }
  .comment-product {
    padding: 0.373rem 0.4rem 0;
    .product-info {
      overflow: hidden;
      padding-bottom: 0.426rem;
      .product-img {
        width: 1.173rem;
        height: 1.173rem;
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 0.106rem;
        }
      }
      .product-detail {
        float: left;
        margin-left: 0.266rem;
        .productName {
          color: #444444;
          font-size: 0.426rem;
          line-height: 0.6rem;
        }
        .productMark {
          .icon {
            color: #FCC816;
            font-size: 0.32rem;
          }
          span {
            color: #B4B4B6;
            font-size: 0.293rem;
            line-height: 0.4rem;
            &:nth-of-type(1) {
              color: #FCC816;
              margin-left: 0.08rem;
            }
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
      }
    }
  }
</style>
