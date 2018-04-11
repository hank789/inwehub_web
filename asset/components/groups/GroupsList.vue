<template>
  <div class="-group">
    <img src="http://img5.imgtn.bdimg.com/it/u=2348549693,626845470&fm=27&gp=0.jpg" />
    <div class="group-right">
      <div class="unread"></div>
      <div class="join">加入</div>
      <p>
        <span class="-group-name">供应链</span>
      </p>
      <p class="text-line-2 text">供应链的概念是从扩大的生产概念发展而来，现代管理教育对供应链的定义为“供应链是围绕核心企业，通过对商流、信息流、物流... 资金 控制，从采购原材料开始到制成中间产品及最终产品、最后由销售网络把产品送到消费者手中的一个由供应商、制造商、分销商（零售商，批发商等）直到最终用户所连成的整体功能网链结构”。 中文名 供应链 外文名 Supply Chain</p>
      <p class="-group-info">
              <span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-simi"></use>
                </svg>
                私密
              </span>
        <span><i>23</i>/人气</span>
        <span><i>23</i>/分享</span>
      </p>
    </div>
    <i class="bot"></i>
  </div>
</template>
<style scoped>
  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }
  .bot {
    position: absolute;
    right:0;
    bottom: 0;
    left:0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  /*圈子*/
  .big.-group{
    padding: 15px 0;
    position: relative;
  }
  .small.-group{
    padding: 10px 0;
  }
  .-group{
    width:100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .big img{
    width:92px;
    height:92px;
  }
  .small img{
    width:44px;
    height:44px;
  }
  .-group img{
    border-radius: 4px;
    margin-right: 10px;
  }
  .group-right{
    width: 90%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  /*/*/
  .big .-group-name{
    font-size: 18px;
  }
  .small .-group-name{
    font-size: 14px;
  }
  .-group-name{
    font-weight: 500;
    color: #444444;
  }
  .group-right .text{
    font-size: 12px;
    color: #808080;
    margin-top: 8px;
    line-height: 16px;
  }
  .big .-group-info{
    margin-top: 8px;
  }
  .small .-group-info{
    margin-top: 1px;
  }
  .-group-info{
    font-size: 12px;
    color: #B4B4B6;
  }
  .-group-info span{
    margin-right: 9px;
  }
  .-group-info span i{
    font-size: 14px;
    color:#808080;
    font-weight: bold;
  }
  .join{
    border:1px solid #03AEF9;
    font-size: 14px;
    color: #03AEF9;
    padding:0px 10px;
    border-radius: 4px;
    position: absolute;
    top: 15px;
    right: 0;
  }
  .unread{
    width:8px;
    height:8px;
    background: #FA4975;
    border-radius: 50%;
    position: absolute;
    top: 15px;
    right: 0;
  }
</style>
