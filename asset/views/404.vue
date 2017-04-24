<template>
<div>
<header class="mui-bar mui-bar-nav">
  <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
  <h1 class="mui-title">登录</h1>
</header>

<div class="mui-content">
  <form class="mui-input-group">
    <div class="mui-input-row">
      <label>手机号</label>
      <input type="text" class="mui-input-clear" placeholder="请输入手机号">
    </div>
    <div class="mui-input-row">
      <label>密码</label>
      <input type="password" class="mui-input-password" placeholder="请输入密码">
    </div>
  </form>

  <div class="mui-content-padded">
    <button class="mui-btn mui-btn-block mui-btn-primary">登录</button>
  </div>
  <div class="login-nav">
    <span class="left">手机快速注册</span>
    <span class="right">忘记密码</span>
  </div>

</div>
</div>
</template>

<script>
  export default {
    mounted: function () {


      this.$nextTick(function () {
        console.log(window.mui);
       
        mui.ready(function(){
          mui.alert('ok');
      });
    })
    }
  }
</script>
