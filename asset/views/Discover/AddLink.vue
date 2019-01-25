<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">发布</h1>
      <div class="submit font-family-medium">确认发布</div>
    </header>
    <div class="mui-content">

      <div class="shareTitle font-family-medium">分享到首页</div>

      <div class="inputWrapper">
        <input class="input" type="text" placeholder="输入文章链接">
        <div class="line-river-after line-river-after-top"></div>
      </div>

      <div class="linkWrapper">
        <div class="leftText">
          <div class="text font-family-medium text-line-2">两位设计师创始人他们是如何把Airbnb从零到300亿？…还有戏吗</div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-times--"></use>
          </svg>
        </div>
        <div class="right">
          <div class="articleImg">
            <img src="../../statics/images/uicon.jpg" alt="">
          </div>
        </div>
      </div>

      <div class="tagsWapper">
        <div class="title">所属领域</div>

        <div class="tagsList">
          <span class="active">服务</span>
          <span class="">服务</span>
        </div>
      </div>

      <div class="footerWrapper">
        <div class="text"><span>1.</span>分享的文章链接会出现在首页的全部中</div>
        <div class="text"><span>2.</span>热门的文章链接会被推荐</div>
        <div class="text"><span>3.</span>优质内容会得到更多的曝光和传播</div>
      </div>

    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        loading: 1,
        lists: [],
        listDataConfig: [
          {
            api: 'recommendRead',
            data: {},
            autoShow: true
          },
          {
            api: 'recommendRead',
            data: {},
            autoShow: false
          }
        ]
      }
    },
    components: {
    },
    methods: {
      curNavIndexChange: (index) => {
        console.log('当前页数:' + index)
      }
    }
  }
</script>
<style scoped lang="less">
  .mui-content {
    background: #FFF;
  }
  .submit {
    color: #03AEF9;
    font-size: 15px;
    position: absolute;
    right: 16px;
    top: 11.5px;
  }
  .shareTitle {
    font-size: 20px;
    color: #444444;
    text-align: center;
    margin: 35px 0 55px;
  }

  .inputWrapper {
    padding: 0 25px;
    .input {
      border: none;
      margin-bottom: 0;
      padding-left: 0;
    }
  }

  .linkWrapper {
    display: flex;
    padding: 0 25px;
    margin-top: 20px;
    justify-content: space-between;
    .leftText {
      .text {
        color: #444444;
        font-size: 16px;
        line-height: 23px;
      }
      .icon {
        font-size: 8px;
        color: #808080;
        margin-top: 11px;
      }
    }
    .right {
      margin-left: 14px;
      .articleImg {
        width: 97px;
        height: 71px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          object-fit: cover;
        }
      }
    }
  }
  .tagsWapper {
    padding: 0 25px;
    margin-top: 20px;
    .title {
      color: #B4B4B6;
      font-size: 11px;
    }
    .tagsList {
      margin-top: 8px;
      font-size: 0;
      span {
        color: #444444;
        font-size: 12px;
        padding: 5px 10px;
        border-radius: 100px;
        display: inline-block;
        background: #F3F4F6;
        margin-right: 10px;
        margin-bottom: 10px;
        &.active {
          color: #FFF;
          background: #03AEF9;
        }
      }
    }
  }

  .footerWrapper {
    position: absolute;
    bottom: 30px;
    left: 25px;
    .text {
      color: #C8C8C8;
      font-size: 11px;
      line-height: 19px;
      span {
        margin-right: 8px;
      }
    }
  }
</style>
