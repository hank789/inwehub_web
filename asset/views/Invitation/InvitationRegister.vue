<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">邀请注册</h1>
    </header>
    <div class="mui-content absolute">
      <div class="Invitation_t ">
          <img src="../../statics/images/invitation-register.png" />
      </div>
      <div class="invitation-information">
         <div class="SuccessfulInvitation">
            <span>10位</span>
            <span>已成功邀请</span>
         </div>
         <div class="InvitationAward">
           <span>100元</span>
           <span>已获得奖励</span>
         </div>
      </div>

    </div>

  </div>
</template>

<script>

</script>

<style scoped>
.Invitation_t{
  width: 100%;
  height:322px;
  background: #FFFFFF url("../../statics/images/invitation-bg@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
}
.Invitation_t img{
  width:95%;
  height:270px;
  position: absolute;
  bottom:0;
  left:0;
  right:0;
  margin: auto;
}
/*　邀请成功的信息部分*/
.invitation-information{
  width: 100%;
  height:88.5px;
  border:1px solid #cccccc;
  background: #FFFFFF;
  margin-top: 5px;
  padding:0px 25px;
}
.SuccessfulInvitation{
  width:42%;
  height:100%;
  float: left;
  border:1px solid #000000;
}
.SuccessfulInvitation span{
 display:block;
 text-align: center;
}
.InvitationAward{
  width:36%;
  height:100%;
  float:right;
  border:1px solid #000000;
}
.InvitationAward span{
  display:block;
  text-align: center;

}



</style>
