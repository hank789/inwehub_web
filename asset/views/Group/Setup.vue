<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">更多设置</h1>
    </header>

    <div class="mui-content">
      <div class="setUpWrapper">
        <div class="setUpList">
          <span>圈主设置</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="gray"></div>
        <div class="setUpList">
          <span>圈子成员</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="line-river-after line-river-after-short"></div>
        <div class="setUpList">
          <span>聊天消息</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="line-river-after line-river-after-short"></div>
        <div class="setUpList">
          <span>邀请加入</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="gray"></div>
      </div>
      <div class="groupIntroduce">
        <span class="font-family-medium">圈子介绍</span>
        <div class="line-river-after"></div>

        <div class="groupIntroduceText">供应链的概念是从扩大的生产()概念发展而来，对供应链的定义为“供应链是围绕核心企业，从配套零件开始到制成中间产品及最终产品、最后由销售网络把产品送到消费者手中的一个由供应商、制造商、分销商直到最终用户所连成的整体功能网链结构”。</div>
      </div>

      <div class="signOut font-family-medium">退出圈子</div>
    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {}
    }
  }
</script>

<style lang="less" scoped>
  .mui-content {
    /*background: #FFFFFF;*/
  }

  .setUpWrapper {
    .setUpList {
      padding: 11px 16px;
      background: #ffffff;
      display: flex;
      color: #444444;
      font-size: 16px;
      position: relative;
      justify-content: space-between;
      .icon {
        color: #808080;
        font-size: 13px;
        margin-top: 4px;
      }
    }
  }

  .groupIntroduce {
    background: #ffffff;
    .font-family-medium {
      padding: 11px 16px;
      color: #444444;
      font-size: 16px;
      display: inline-block;
    }
    .groupIntroduceText {
      padding: 11px 16px;
      color: #808080;
      font-size: 16px;
      line-height: 22px;
    }
  }

  .signOut {
    width: 343px;
    height: 44px;
    margin: 15px auto 0;
    font-size: 16px;
    color: #ffffff;
    text-align: center;
    line-height: 44px;
    background: #03AEF9;
    border-radius: 4px;
  }
</style>
