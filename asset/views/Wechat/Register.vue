<template>
  <div class="register">


     <div class="logo">
       <svg class="icon" aria-hidden="true">
         <use xlink:href="#icon-logo"></use>
       </svg>
     </div>

    <div class="inputWrapper">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-yaoqingma"></use>
      </svg>
      <input class="text" type="text" @focus="focus" @blur="blur" placeholder="请输入邀请码 已注册用户可忽略" name="registrationCode" v-model.trim.num="registrationCode" autocomplete="off"/>
    </div>

    <div class="inputWrapper">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-shoujihao"></use>
      </svg>
      <input class="text" ref="phone" id="phone" type="text" @focus="focus" @blur="blur" maxlength="11" placeholder="输入手机号" name="phone" @hover.stop.prevent="" v-model.trim.num="phone" autocomplete="off" v-tooltip="{content:'请输入有效的手机号码', placement:'bottom', trigger:'manual'}"/>

      <span class="getYzm" @click.stop.prevent="getCode">发送验证</span>
    </div>

    <div class="inputWrapper">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-yanzhengma"></use>
      </svg>
      <input class="text" type="text" @focus="focus" @blur="blur" placeholder="输入验证码" name="code" v-model.trim.num="code" autocomplete="off"/>
    </div>

    <div class="buttonWrapper">
      <button type="button" class="mui-btn mui-btn-block mui-btn-primary" disabled="disabled"
              @click.prevent="register">确认
        </button>
    </div>



    <div class="help">
      我没有邀请码？
    </div>



  </div>
</template>


<script>

  import Vue from 'vue'
  import VTooltip from 'v-tooltip'
  Vue.use(VTooltip);

  export default {
    data: () => ({
      registrationCode:'', //邀请码
      phone: '', // 手机号码
      code: '', // 手机验证码
    }),
    methods: {
      getCode(){

      },
      focus(event){
        event.target.parentElement.className = event.target.parentElement.className.replace('focus', '');
        event.target.parentElement.className = event.target.parentElement.className.replace('blur', '');
          event.target.parentElement.className += ' focus';
      },
      blur(){
        event.target.parentElement.className = event.target.parentElement.className.replace('focus', '');
        event.target.parentElement.className = event.target.parentElement.className.replace('blur', '');
        event.target.parentElement.className += ' blur';
      },
      register () {
        this.$refs.phone._tooltip.show();


      },
      mounted(){

      }
    }
  }
</script>


<style lang="less" rel="stylesheet/less" scoped>
  .logo{
    margin:42px 0 38px;
    text-align: center;
  }
  .logo .icon{
    font-size:125px;
  }

  .inputWrapper .icon{
    position: absolute;
    top:4px;
    font-size:24px;
    color:#c8c8c8;
  }

  .inputWrapper {
    margin: 0 33px 22px;
    position: relative;


  }

  .inputWrapper.focus{

    &:after{
      background-color: #3c95f9;
    }

    .icon{
      color:#3c95f9;
    }
  }

  .inputWrapper .getYzm{
    display: inline-block;
    font-size: 14px;
    color: #3c95f9;
    position: absolute;
    right: 2px;
    top: 6px;
    border: 1px solid #3c95f9;
    border-radius: 5px;
    padding: 3px 14px;
  }

  .inputWrapper:after{
      position: absolute;
      right: 0;
      bottom: 3px;
      left: 0;
      height: 1px;
      content: '';
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: rgb(220,220,220);
  }

  .inputWrapper input{
    color:#444;
    border:none;
    margin:0;
    padding:0 0 0 36px;
    font-size:14px;
    background: none;
    display: inline-block;
  }

  .register{
    background: #f3f4f6;
    position: absolute;
    top:0;
    bottom:0;
    width:100%;
  }

  .buttonWrapper{
    margin:40px 36px 16px;
  }

  ::-webkit-input-placeholder{
    color:#b4b4b6;
  }

  .buttonWrapper button{
    border-radius: 5px;

    &:disabled{
      background: #dcdcdc;
      border:1px solid #dcdcdc;
      color:#b4b4b6;

    }
  }



  .help{
    font-size:14px;
    color: #3c95f9;
    text-align: center;
  }

  .bgCover{
    position: absolute;
    z-index:999;
    width:100%;
    height:100%;
    background: url("http://web/myzhizuo/facsimile/test.png");
  }
</style>
