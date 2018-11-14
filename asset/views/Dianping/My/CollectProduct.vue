<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">我的收藏</h1>
    </header>
    <div class="mui-content">

      <div class="container-searchMenu">
        <span @tap.stop.prevent="$router.replace('/my/collectedAnswers')">问答</span>
        <span @tap.stop.prevent="$router.replace('/my/collectedArticle')">分享</span>
        <span class="font-family-medium">点评<i></i></span>
        <i class="bot"></i>
      </div>

    </div>
  </div>
</template>

<script>

</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;
  }

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .container-searchMenu {
    margin-top: 0;
  }
</style>
