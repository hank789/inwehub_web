<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">点评(23)</h1>
    </header>
    <div class="mui-content">
      <div class="commentList">
        <div class="mark">
          <span>评分</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shoucangdilantongyi"></use>
          </svg>
        </div>
        <div class="commentFeedTitle text-line-5">德勤的《未来汽车行业价值链-2025年以后》报告，探讨在如今诸多不确定性的时代，以及汽车行业领导者要如何做出投资决策</div>

        <div class="feed-moreOperation">
          <div class="feed-mord">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-gengduo1"></use>
            </svg>
          </div>
          <div class="feed-operation">
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-pinglun"></use>
            </svg><i>22</i>
          </span>
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-cai"></use>
            </svg><i>10</i>
          </span>
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zan"></use>
            </svg><i>33</i>
          </span>
          </div>
        </div>
        <div class="line-river-after line-river-after-top"></div>
      </div>

    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
      }
    },
    components () {
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;
  }
  .commentList {
    margin-top: 20px;
    .line-river-after {
      margin-top: 0.266rem;
      &:after {
        left: 0.426rem;
        right: 0.426rem;
      }
    }
    .mark {
      padding: 0 16px;
      span {
        color: #B4B4B6;
        font-size: 11px;
        line-height: 15px;
      }
      .icon {
        color: #FCC816;
        font-size: 12px;
      }
    }
    .commentFeedTitle {
      padding: 0 16px;
      color: #444444;
      font-size: 0.373rem;
      line-height: 0.586rem;
      margin-top: 6px;
      letter-spacing: 0.013rem;
    }
    .feed-moreOperation {
      margin-top: 0.266rem;
      color: #808080;
      display: flex;
      padding: 0 0.346rem;
      margin-bottom: 10px;
      justify-content: space-between;
      .feed-mord {

        padding: 0.133rem;
        color: #808080;
      }
      .feed-operation {
        padding-top: 5px;
        span {
          padding: 0.133rem 0.266rem;
          font-size: 0.293rem;
          color: #444444;
          /*margin-left: 0.533rem;*/
          .icon {
            margin-right: 0.133rem;
            color: #808080;
            font-size: 0.4rem;
          }
          i {
            font-style: normal;
          }
        }
        .activeSpan {
          color: #B4B4B6;
          .icon {
            color: #B4B4B6;
          }
        }
      }
    }
  }
</style>
