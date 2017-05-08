<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <h1 class="mui-title">发现</h1>
    </header>

    <div class="mui-content discover">
      <div class="title">随时随地<br/>解决各种SAP方面的难题</div>
      <div class="titleSub">149名行业专家入驻 20万顾问的共同选择</div>
      <div class="split"></div>
      <div class="tabs">
        <div class="tabs-item">
          <span class="mui-icon fa fa-question-circle"></span>
          <span class="text">快速提问</span>
        </div>
        <div class="tabs-item">
          <span class="mui-icon fa fa-users"></span>
          <span class="text">专家在线</span>
        </div>
        <div class="tabs-item">
          <span class="mui-icon fa fa-bolt"></span>
          <span class="text">闪电回复</span>
        </div>
        <div class="tip">个人信息不完整还不能查看本页内容<br/>请先完善个人信息。</div>
        <div class="buttons">
          <button type="button" @tap.stop.prevent="$router.push('/my/info')">点击前往维护个人档案</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {};
</script>


<style scoped>
  .discover{
    position:absolute;
    padding:0 50px;
    width:100%;
    top:0;
    bottom:0;
    background:url("../../statics/images/thumb_raw_1493885990.jpeg") ;
    background-size:100% 100%;
    opacity: 0.6;
    color:#fff;
  }

  .discover .title{
    font-size:22px;
    color:#fff;
    line-height: 32px;
    padding-top:70px;
  }

  .discover .titleSub{
    font-size:12px;
    color:#fff;
    font-weight:bold;
    padding-top:15px;
  }

  .discover .split{
    height:2px;
    background: #fff;
    position: relative;
    margin-top:15px;
  }

  .discover .tabs{
    margin-top:20px;
  }
  .discover .tabs .tabs-item{
    display: inline-block;
    text-align: center;
    width:32%;
  }

  .discover .tabs .tabs-item .mui-icon{
    display: block;
    font-size:36px;
  }
  .discover .text{
    font-size:12px;
    font-weight:bold;
  }
  .discover .tip{
    text-align: center;
    margin-top:50px;
    font-size:16px;
    font-weight:bold;
  }
  .discover .buttons{
    text-align: center;
  }
  .discover button{
    color:#fff;
    width:193px;
    height:45px;
    border:none;
    box-shadow: 0px 0px 5px 0px #fff;
    background: none;
    font-size:16px;
    margin-top:40px;
  }
</style>
