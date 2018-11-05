<template>
  <div>
    <div class="mui-content">
      <div class="container-control-logoAndTabsAndSearch">
        <svg class="icon logoIcon" aria-hidden="true">
          <use xlink:href="#icon-logowenzi"></use>
        </svg><span class="splitCircle"></span>
        <div class="logoAndTabsAndSearchTabs">
          <div class="tab" @tap.stop.prevent="$router.replace('/groups')">圈子</div>
          <div class="tab" @tap.stop.prevent="$router.replace('/ask/offers')">问答</div>
          <div class="tab active" @tap.stop.prevent="$router.replace('/comment/index')">点评</div>
        </div>
        <svg class="icon searchIcon" aria-hidden="true"  @tap.stop.prevent="$router.pushPlus('/searchSubmission','list-detail-page-three')">
          <use xlink:href="#icon-sousuo"></use>
        </svg>
      </div>

      <div class="line-river-after line-river-after-top"></div>

      <div class="container-product-comment">
        <div class="comment-info">
          <div class="avatarImg">
            <img src="../../statics/images/uicon.jpg" alt="">
          </div>
          <div class="comment-name">
            <div class="font-family-medium">郭伟</div>
            <div>3分钟前</div>
          </div>
          <div class="comment-mark font-family-medium">4.3分</div>
        </div>
        <div class="comment-content text-line-3">德勤的《未来汽车行业价值链-2025年以后》报告，探讨在如今诸多不确定性的时代德勤的《未来汽车行业价值链-2025年以后》报告德勤的《未来汽车行业价值链-2025年以后》报告</div>
        <div class="comment-product">
          <div class="product-info">
            <div class="product-img">
              <img src="../../statics/images/uicon.jpg" alt="">
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
        </div>
      </div>

      <div class="container-product-list">
        <div class="productMenu">
          <div class="productType">产品类型</div>
          <div class="productSort">排序</div>
        </div>

        <div class="productList">
          <div class="comment-product">
            <div class="product-info">
              <div class="product-img">
                <img src="../../statics/images/uicon.jpg" alt="">
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
                <img src="../../statics/images/uicon.jpg" alt="">
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
                <img src="../../statics/images/uicon.jpg" alt="">
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
                <img src="../../statics/images/uicon.jpg" alt="">
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
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    methods: {
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background:linear-gradient(180deg,#DCDCDC 0%,#F3F4F6 100%);
  }
  .container-control-logoAndTabsAndSearch {
    background: #FFFFFF;
  }

  .container-product-comment {
    width: 8.346rem;
    background: #ffffff;
    margin: 0.4rem auto 0;
    border-radius: 0.213rem;
    .comment-info {
      overflow: hidden;
      padding: 0.4rem 0.4rem 0.266rem;
      .avatarImg {
        width: 0.906rem;
        height: 0.906rem;
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .comment-name {
        color: #B4B4B6;
        font-size: 0.293rem;
        line-height: 0.4rem;
        float: left;
        margin-left: 0.213rem;
        .font-family-medium {
          color: #444444;
          font-size: 0.346rem;
          line-height: 0.48rem;
          margin-bottom: 0.053rem;
        }
      }
      .comment-mark {
        float: right;
        color: #FCC816;
        font-size: 0.346rem;
        line-height: 0.48rem;
      }
    }
    .comment-content {
      color: #444444;
      font-size: 0.373rem;
      line-height: 0.6rem;
      padding: 0 0.4rem;
    }
  }

  .comment-product {
    padding: 0.293rem 0.4rem 0.4rem;
    .product-info {
      overflow: hidden;
      background: #F7F8FA;
      padding: 0.266rem;
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
  .container-product-list {
    background: #ffffff;
    margin-top: 0.8rem;
    padding-bottom: 0.4rem;
    border-top-left-radius: 0.426rem;
    border-top-right-radius: 0.426rem;
    .productMenu {
      height: 0.906rem;
      display: flex;
      color: #808080;
      font-size: 0.346rem;
      padding: 0 0.426rem;
      line-height: 0.906rem;
      justify-content: space-between;
      box-shadow:0rem 0.133rem 0.266rem 0rem rgba(249,249,251,1);
    }
    .productList {
      .comment-product {
        padding: 0.346rem 0.4rem 0;
        .product-info {
          padding: 0 0 0.4rem;
          background: none;
        }
      }
    }
  }
</style>
