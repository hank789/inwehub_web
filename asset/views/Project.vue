<template>
<div>
  <header class="mui-bar mui-bar-dark mui-bar-nav">
    <a class="mui-icon myicon myicon-project2 mui-pull-left" @tap.stop.prevent="$router.push('/home')"></a>
    <h1 class="mui-title">发布项目</h1>
  </header>

  <div class="mui-content">
    <div class="professor">
      <div class="title">我的项目</div>
      <div class="titleSub">0个项目</div>
    </div>

    <div class="empty">
      <span class="mui-icon myicon myicon-project"></span>
      <div class="title">尚未发布任何项目需求</div>

    </div>


    <div class="askDetail">
      <div class="titleSub">点击“+”号可以发布新项目<br/>
        并选择您所需要的委托类型</div>
      <div class="buttonAsk"><span>+</span> 发布需求</div>
    </div>

  </div>
</div>
</template>

<script>
  export default {};
</script>

<style scoped="scoped">
  .professor{
    background-color:#161616;
    text-align: center;
    position:relative;
    height:136px;

  }

  .professor .title{
    padding-top:30px;
    font-size:20px;
    color:#fff;
    font-weight:bolder;
  }

  .professor .titleSub{
    padding-top:5px;
    font-size:14px;
    color:#fff;
    font-weight:bolder;
  }


  .empty{
    text-align: center;
    padding-top:30px;
  }
  .empty .myicon{
    width:125px;
    height:106px;
  }
  .empty .title{
    color:#9B9B9B;
    font-size:14px;
    margin-top:10px;
  }
  .askDetail{
    position: absolute;
    bottom:100px;
    left:50%;
    margin-left:-84px;
  }
  .askDetail .titleSub{
    color:#9B9B9B;
    font-size:14px;
    margin-bottom:20px;
  }
  .askDetail{
    height:67px;
    text-align: center;
    margin-top:5px;
  }
  .askDetail .buttonAsk{
    position: relative;
    background: #4990E2;
    display: inline-block;
    width:125px;
    height:37px;
    font-size:14px;
    line-height: 37px;
    text-align: center;
    border-radius: 50px;
    padding-left:20px;

    color:#fff;
  }
  .askDetail .buttonAsk span{
    position: absolute;
    font-size: 30px;
    left: 20px;
    top: -4px;
  }

  .mui-bar  .myicon{
    width:18px;
    height:18px;
    left: 10px;
    top: 10px;
  }
</style>
