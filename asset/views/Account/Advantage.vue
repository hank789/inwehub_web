<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的擅长</h1>
    </header>

    <div class="mui-content absolute">
      <ul class="myLabel">
        <p>擅长标签</p>
        <li>
          高科技
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-times--"></use>
          </svg>
          
        </li>
        <li>
          SAP
         <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-times--"></use>
          </svg></li>
        <li>
          模型
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-times--"></use>
          </svg>
        </li>
        <li>
          高科
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-times--"></use>
          </svg>
        </li>
        <li>
          机械制造
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-times--"></use>
          </svg>
        </li>
      </ul>
      <div class="gray"></div>
      
      <ul class="addLable">
        <p>添加标签</p>
        <div class="search">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-times--"></use>
          </svg>
          <input type="text" />
        </div>
        
      </ul>

    </div>
  </div>
</template>

<script>
</script>

<style scoped>
  ul,li,p,span,a,i{
    margin: 0;
    padding: 0;
    list-style: none;
   }
   .mui-content{
     background: #FFFFFF;
   }
   
   .myLabel{
     width: 100%;
     overflow:hidden;
     background: #FFFFFF;
     padding: 0 4% 15px 2%;
    
   }
  .myLabel p{
    font-size:13px;
    margin-top: 15px;
    margin-bottom: 4px;
    color:#808080;
    margin-left: 10px;
    
  }
  .myLabel li{
    display: inline-block;
    background:#f3f4f6;
    border:8px;
    border-radius: 4px;
    padding: 5px 12px 5px 10px;
    margin-top: 10px;
    margin-left: 10px;
  }
  .myLabel li svg{
    font-size:10px;
    color: #c8c8c8;
    margin-bottom:2px;
    margin-left: 5px;
  }
  
  .gray{
    width: 100%;
    height: 10px;
    background:#f3f4f6;
  }
  
  .addLable{
    width:100%;
    background: #FFFFFF;
    padding: 15px 4% 0 4%;
   
  }
  .addLable p{ 
    font-size:13px;
    color: #808080;
  }
  .search{
    width: 100%;
    height: 38px;
    margin-top: 9px;
    background:#F3F4F5;
    border-radius: 100px;
  }
</style>