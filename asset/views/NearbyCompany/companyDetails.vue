<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">企业详情</h1>
    </header>

  <div class="mui-content absolute">
    <div class="companyDetail">
      <div class="gray"></div>
      <div class="company_image">
        <img src="../../statics/images/guide_01.png" />
      </div>
      <ul class="information">
        <li>距离我< 200m</li>
        <li>上海金蝶</li>
        <li>高科技行业<i></i>其他</li>
        <li>上海浦东新区市浦东张江高科园区晨晖路88号金蝶软件园</li>
      </ul>
    </div>
    <!-- 相关人员-->
    <div class="Relevant">
      <div class="Relevant_title">
        相关人员
        <i class="bot"></i>
      </div>
      <ul class="Relevant_list">
        <li>
          <div class="Relevant_avatar">
            <img src="../../statics/images/guide_01.png" />
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
          <div class="Relevant_detail">
            <p class="mui-ellipsis">
               安三
               <span>3</span>
              （项目）
            </p>
            <p class="mui-ellipsis">显示个人签名</p>
          </div>
          <div class="Relevant_follow">
            关注Ta
          </div>
          <i class="bot"></i>
        </li>
        <li>
          <div class="Relevant_avatar">
            <img src="../../statics/images/guide_01.png" />
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
          <div class="Relevant_detail">
            <p class="mui-ellipsis">
              安三
              <span>3</span>
              （项目）
            </p>
            <p class="mui-ellipsis">显示个人签名</p>
          </div>
          <div class="Relevant_follow">
            关注Ta
          </div>
          <i class="bot"></i>
        </li>
        <li>
          <div class="Relevant_avatar">
            <img src="../../statics/images/guide_01.png" />
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
          <div class="Relevant_detail">
            <p class="mui-ellipsis">
              安三
              <span>3</span>
              （项目）
            </p>
            <p class="mui-ellipsis">显示个人签名</p>
          </div>
          <div class="Relevant_follow">
            关注Ta
          </div>
          <i class="bot"></i>
        </li>
      </ul>
    </div>


    <button>我也是相关人员</button>



  </div>
  </div>
</template>

<script>

</script>

<style scoped>
  ul,
  li,
  p,
  span,
  a,
  i,
  input{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .mui-content{
    background: #ffffff;
  }

  .bot {
    position: absolute;
    right:  0;
    bottom: 0;
    left:  0;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  /*公司的详情部分*/
.companyDetail{
  width:100%;
  height:203px;
  background:#ececee;
  position: relative;
}
.gray{
  width:100%;
  height:14px;
  background:#3c3e44;
}
.companyDetail .company_image{
  width:92px;
  height:92px;
  position: absolute;
  left:0;
  right:0;
  top:0px;
  margin: auto;
}
.companyDetail .company_image img{
  width:100%;
  height:100%;
  border-radius: 4px;
}
.information{
  width:100%;
  height:189px;
  padding-top: 13px;
}
.information li:nth-of-type(1){
  text-align: right;
  font-size:12px;
  color:#808080;
  margin-right: 15px;
}
.information li:nth-of-type(2){
  text-align: center;
  font-size:16px;
  color:#444444;
  margin-top:61px;
}
.information li:nth-of-type(3){
  text-align: center;
  font-size:14px;
  color:#808080;
  margin-top:8px;
}
.information li:nth-of-type(3) i{
  display: inline-block;
  width:1px;
  height:13px;
  background: #dcdcdc;
  margin: 0px 6px -1px 6px;
}
.information li:nth-of-type(4){
  text-align: center;
  font-size:12px;
  color:#808080;
  margin-top:2px;
}
  /*相关人员*/
  .Relevant{
    width:100%;
    padding: 0 4%;
    overflow: hidden;
  }
  .Relevant_title{
    width:100%;
    height:45px;
    position: relative;
    font-size:16px;
    color:#444444;
    line-height: 45px;
  }
  .Relevant_list{
    width:100%;
    overflow: hidden;
  }
  .Relevant_list li{
    width:100%;
    height:64px;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items:center;
    flex-wrap:nowrap;
  }
  .Relevant_avatar{
    width:44px;
    height:44px;
    border-radius: 50%;
    float: left;
    position: relative;
  }
  .Relevant_avatar img{
    width:100%;
    height:100%;
    border-radius: 50%;
  }
  .Relevant_avatar svg{
   position: absolute;
    font-size:17px;
    bottom: 0;
    right:-6px;
  }
  /*详细的信息*/
  .Relevant_detail{
    width:70%;
    height:100%;
    margin-left: 7px;
  }
  .Relevant_detail p:nth-of-type(1){
    font-size:14px;
    color:#565656;
    margin-top: 12px;
    display: flex;
    flex-direction: row;
    align-items:center;
  }
  .Relevant_detail p:nth-of-type(1) span{
      width:16px;
      height:15px;
      background: url("../../statics/images/rank.png") no-repeat;
      background-size: 100% 100%;
      color:#FFFFFF;
      font-size:10px;
      line-height: 13px;
      margin-left: 3px;
      display: flex;
      flex-direction: row;
      justify-content:center;
  }
  .Relevant_detail p:nth-of-type(2){
    font-size:13px;
    color:#b4b4b6;
  }
  /*关注*/
  .Relevant_follow{
    width: 64px;
    height: 27px;
    background: #03aef9;
    color: #FFFFFF;
    line-height:27px;
    border-radius: 50px;
    text-align: center;
  }
  button{
    width:100%;
    height:46px;
    font-size:17px;
    color: #FFFFFF;
    text-align: center;
    background:#03aef9;
    border-radius: 0;
    position: fixed;
    bottom: 0;

  }
</style>
