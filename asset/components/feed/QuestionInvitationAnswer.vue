<template>
  <div class="freeQuestion-container">
    <div class="freeQuestion-fouce blue">关注问题</div>
    <!--<div class="freeQuestion-fouce">已关注</div>-->

    <div class="freeQuestion-allAnswer bg-blue">一键邀请回答</div>
    <!--<div class="freeQuestion-allAnswer">已邀请</div>-->
    <div class="freeQuestion-upvote">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-zan"></use>
      </svg>
      23
    </div>
    <div class="freeQuestion-comment">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-pinglun"></use>
      </svg>
      23
    </div>
  </div>
</template>
<style>
  .freeQuestion-container{
    width:100%;
    height:51px;
    padding: 10px 0;
    line-height: 30px;
  }
  .freeQuestion-fouce{
    float: left;
    width: 76px;
    height:31px;
    border:1px solid #9e9e9e;
    border-radius: 50px;
    text-align: center;
    line-height: 30px;
    font-size:14px;
    color: #9e9e9e;
  }
  .freeQuestion-fouce.blue{
    border:1px solid #03aef9;
    color: #03aef9;
  }
  .freeQuestion-allAnswer{
    float: left;
    width: 104px;
    height:31px;
    border:1px solid #9e9e9e;
    border-radius: 50px;
    text-align: center;
    line-height: 30px;
    font-size:14px;
    color: #FFFFFF;
    background: #9e9e9e;
    margin-left: 8px;
  }
  .freeQuestion-allAnswer.bg-blue{
    border:1px solid #03aef9;
    background: #03aef9;
  }
  .freeQuestion-upvote{
    float: right;
    color: #808080;
    font-size:13px;
  }
  .freeQuestion-upvote svg{
    font-size:19px;
  }
  .freeQuestion-comment{
    float: right;
    margin-right: 30px;
    color: #808080;
    font-size:13px;
  }
  .freeQuestion-comment svg{
    font-size:19px;
  }
</style>

