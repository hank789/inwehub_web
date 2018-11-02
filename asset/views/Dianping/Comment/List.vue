<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">点评(23)</h1>
    </header>
    <div class="mui-content">
      <div class="commentList">
        <div class="commentUser">
          <div class="userInfo">
            <div class="avatar">
              <img src="../../../statics/images/uicon.jpg" alt="">
            </div>
            <div class="userName">
              <span class="font-family-medium">郭伟</span>
              <span class="border-football">优质</span>
              <div class="time">3分钟前</div>
            </div>
          </div>
          <div class="mark font-family-medium">4.0分</div>
        </div>
        <div class="commentFeedTitle text-line-5">德勤的《未来汽车行业价值链-2025年以后》报告，探讨在如今诸多不确定性的时代，以及汽车行业领导者要如何做出投资决策以及汽车行业领导者要如何做出投资决策以及汽车行业领导者要如何做出投资决策以及汽车行业领导者要如何做出投资决策以及汽车行业领导者要如何做出投资决策以及汽车行业领导者要如何做出投资决策以及汽车行业领导者要如何做出投资决策以及汽车行业领导者要如何做出投资决策</div>
        <div class="feed-open-all font-family-medium"  @tap.stop.prevent="extendAll">展开全部</div>
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
    },
    mounted () {
      this.renderShowOpenAll()
    },
    updated () {
      this.$nextTick(() => {
        this.renderShowOpenAll()
      })
    },
    methods: {
      renderShowOpenAll () {
        var titles = document.querySelectorAll('.commentFeedTitle')
        titles.forEach((item) => {
          if (item.scrollHeight > item.offsetHeight) {
            item.nextElementSibling.classList.add('showOpenAll')
          } else {
            item.nextElementSibling.classList.remove('showOpenAll')
          }
        })
      },
      extendAll (event) {
        event.target.previousElementSibling.classList.remove('text-line-5')
        event.target.style.display = 'none'
      }
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
    .commentUser {
      display: flex;
      padding: 0 16px;
      justify-content: space-between;
      .userInfo {
        display: flex;
        .avatar {
          width: 34px;
          height: 34px;
          margin-right: 8px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
        }
        .userName {
          margin-top: -2px;
          .border-football {
            &:after {
              border-radius: 8px;
              border-color: #FA4975;
            }
          }
          span {
            &:nth-of-type(1) {
              color: #444444;
              font-size: 13px;
              line-height: 18.5px;
            }
            &:nth-of-type(2) {
              height: 15px;
              color: #FA4975;
              font-size: 10px;
              padding: 0 5px;
              line-height: 15px;
              display: inline-block;
            }
          }
          .time {
            color: #B4B4B6;
            font-size: 11px;
            line-height: 15px;
            margin-top: 2px;
          }
        }
      }
      .mark {
        color: #FCC816;
        font-size: 13px;
        line-height: 18.5px;
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
    .feed-open-all {
      color: #03AEF9;
      font-size: 0.346rem;
      margin-top: 0.213rem;
      display: none;
      padding: 0 0.426rem;
      line-height: 0.48rem;
      &.showOpenAll {
        display: block;
      }
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

  .mui-android .commentList .commentUser .userInfo .userName span:nth-of-type(2) {
    line-height: 18px;
  }
</style>
