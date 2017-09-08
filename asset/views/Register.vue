<template>

  <div class="mui-content">
    <div class="login">
      <svg class="icon logo" aria-hidden="true">
		  <use xlink:href="#icon-logo"></use>
	  </svg>
      <div class="leftNav" @tap.stop.prevent="goback"><span></span></div>
      <!--账号密码输入框-->
     
      <div class="inputWrapper">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-yaoqingma"></use>
      </svg>
      <input placeholder="请输入邀请码" @focus="focus" @blur="blur"  class="text" type="text" name="yqm" v-model.trim="registrationCode" autocomplete="off" @tap.stop.prevent="entryYqCode"/>
     </div>
     <div class="inputWrapper half">
      <svg class="icon" aria-hidden="true" >
        <use xlink:href="#icon-shoujihao"></use>
      </svg>
      <input placeholder="请输入手机号"  ref="phone"  @focus="focus" @blur="blur" v-tooltip="{content:errorMsg, placement:'bottom', trigger:'manual'}"  @tap.stop.prevent="entryPhone" class="text" type="text" name="phone" v-model.trim.num="phone" autocomplete="off">
      
      <span class="getYzm disabled" @tap.stop.prevent="getCode" v-if="!isCanGetCode">{{getCodeText}}</span>
      <span class="getYzm" @tap.stop.prevent="getCode" v-else>{{getCodeText}}</span>
      
      
      	
      	
      <!--<span class="getYzm" @click.stop.prevent="getCode">{{ getCodeText }}</span>-->
     </div>
     <div class="inputWrapper">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-yanzhengma"></use>
      </svg>
      <input placeholder="请输入验证码" @focus="focus" @blur="blur" class="text" type="text" name="code" v-model.trim.num="code" autocomplete="off" @tap.stop.prevent="entryYzm"/>
     </div>
     <div class="inputWrapper">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-denglu"></use>
      </svg>
      <input placeholder="请输入真实姓名" @focus="focus" @blur="blur" class="text" type="text" name="username" v-model.trim="username" autocomplete="off" @tap.stop.prevent="entryUsername"/>
     </div>
     <div class="inputWrapper">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-mima"></use>
      </svg>
      <input placeholder="请输入登录密码" @focus="focus" @blur="blur" class="text" type="password" name="password" v-model.trim="password" autocomplete="off"/>
     </div>
      
      <!--<div class="title">用户注册</div>
      <div class="inputWrapper">
        <input class="text" type="text" name="username" v-model.trim="username" autocomplete="off"/>
        <label @tap.stop.prevent="entryUsername" v-show="showUsernameLabel">真实姓名</label>
      </div>
      <div class="inputWrapper">
        <input class="text" type="text" name="yqm" v-model.trim="registrationCode" autocomplete="off"/>
        <label @tap.stop.prevent="entryYqCode" v-show="showYqCodeLabel">邀请码</label>
      </div>
      <div class="inputWrapper">
        <input class="text" type="text" name="phone" v-model.trim.num="phone" autocomplete="off"/>
        <label @tap.stop.prevent="entryPhone" v-show="showPhoneLabel">手机号码</label>
      </div>
      <div class="inputWrapper">
        <input class="text" type="text" name="code" v-model.trim.num="code" autocomplete="off"/>
        <label @tap.stop.prevent="entryYzm" v-show="showYzmLabel">验证码</label>
        <span class="getYzm" @click.stop.prevent="getCode">{{ getCodeText }}</span>
      </div>
      <div class="inputWrapper">
        <input class="text" type="password" name="password" v-model.trim="password" autocomplete="off"/>
        <label @tap.stop.prevent="entryPassword" v-show="showPasswordLabel">登录密码</label>
      </div>-->
      <div class="protocol">注册即同意<span @tap.stop.prevent="$router.pushPlus('/protocol/register')">《用户注册服务协议》</span></div>
      
      <button type="button" class="mui-btn mui-btn-block mui-btn-primary" :loading="isLoading"  @click.prevent="register">确定</button>
      <!--:disabled="disableRegister"-->
      <div class="help" @tap.stop.prevent="jumpToForm"><br />
        我没有邀请码?
      </div>

      <!--<div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" :loading="isLoading"
                @click.prevent="register">注册

        </button>-->
      </div>
    </div>
  </div>


</template>

<script>
  import request, {createAPI, apiRequest, postRequest} from '../utils/request';
  import detecdOS from '../utils/detecdOS';
  import localEvent from '../stores/localStorage';
  import errorCodes from '../stores/errorCodes';
  import deleteObjectItems from '../utils/deleteObjectItems';
  import {getUserInfo} from '../utils/user';
  import {USERS_APPEND} from '../stores/types';
  import VTooltip from 'v-tooltip';

  // 手机号码规则
  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
  const usernameReg = /^[a-zA-Z_\u4E00-\u9FA5\uF900-\uFA2D][a-zA-Z0-9_\u4E00-\u9FA5\uF900-\uFA2D]*$/;
  const codeReg = /^[0-9]{4}$/;
  const register = {
    data: () => ({
      phone: '', // 手机号码
      password: '', // 密码
      username: '', // 昵称
      code: '', // 手机验证码
      passwordText: '', // 明文密码
      isDisabled: true, // 提交按钮disabled状态
      isShowClean: false, // 是否显示清除手机号按钮
      isShowUserClean: false,
      isShowPasswordText: false, // 是否显示明文密码
      isShowPassword: true, // 是否显示真实密码
      isCanGetCode: true,
      errors: {}, // 错误对象
      isValidCode: false, // 验证码合法性
      isValidPhone: false, // 是否合法手机号
      isValidPassword: false, // 是否合法密码
      isValidUsername: false, // 用户名是否合法
      CodeText: '获取验证码', // 获取验证码按钮文字
      registrationCode: "",
      time: 0, // 时间倒计时
      showUsernameLabel: true,
      showYqCodeLabel: true,
      showYzmLabel: true,
      showPhoneLabel: true,
      showPasswordLabel: true,
      disableRegister: true,
      errorMsg: '',
      formItem: {
        input: ''
      },
      isRegisterSuccess:false,
      isLoading: false // 登录loading
    }),
    computed: {
      getCodeText () {
        return this.time == 0 ? '获取验证码' : this.time + '秒后重发';
      }
    },
    created () {
      showInwehubWebview();
    },
    mounted(){
      this.getCacheData();
      

      mui(".login").on('focusout', 'input', (e) => {
        switch (e.target.name) {
          case 'username':
            if (!this.username) this.showUsernameLabel = true;
            break;
          case 'yqm':
            if (!this.registrationCode) this.showYqCodeLabel = true;
            break;
          case 'code':
            if (!this.code) this.showYzmLabel = true;
            break;
          case 'phone':
            if (!this.phone) this.showPhoneLabel = true;
            break;
          case 'password':
            if (!this.password) this.showPasswordLabel = true;
            break;
        }
      });

      mui(".login").on('focusin', 'input', (e) => {

        switch (e.target.name) {
          case 'username':
            this.showUsernameLabel = false;
            break;
          case 'yqm':
            this.showYqCodeLabel = false;
            break;
          case 'code':
            this.showYzmLabel = false;
            break;
          case 'phone':
            this.showPhoneLabel = false;
            break;
          case 'password':
            this.showPasswordLabel = false;
            break;
        }
      });
    },
    beforeRouteEnter (to, from, next) {

      mui.plusReady(function () {

        plus.navigator.setFullscreen(true);
      });

      next();
    },
    beforeRouteLeave(to, from, next) {

      mui.plusReady(function () {
        plus.navigator.setFullscreen(false);
      });

      if (!this.isRegisterSuccess) {
        this.setCacheData();
      }

      next();
    },
    methods: {
//  	//关闭；
//  	close(){
//     console.log(document.querySelector('.colse'))
//     document.querySelector('.colse').onclick=function(){
//			console.log(23232);
//			}
//   },
    	//提示
      showTip(obj, msg){
        this.errorMsg = msg;
        obj._tooltip.show();
        setTimeout(() => {
       obj._tooltip.hide();
        }, 2000);
      },
    	//弹窗；
	wran(content,point, callback) {
		var title = 
			'<svg class="icon colse" aria-hidden="true" style="font-size:18px; color:#808080; position: absolute; right:8px; top:8px;">' +
			'<use xlink:href="#icon-guanbi"></use>' +
			'</svg>';
			
	    var cont = '<p style="font-size:16px; margin-bottom:15px" >' +
	                point +
	                '</p>';
	      
		    mui.alert(content, title, cont, callback, 'div');
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
      jumpToForm(){
          this.$router.push('/register/nocode');
      },
      goback () {
        mui.back();
      },
      entryUsername(){
        this.showUsernameLabel = false;
      },
      entryPhone(){
        this.showPhoneLabel = false;
      },
      entryPassword(){
        this.showPasswordLabel = false;
      },
      entryYqCode(){
        this.showYqCodeLabel = false;
      },
      entryYzm(){
        this.showYzmLabel = false;
      },
      timer () {
        if (this.time > 0) {
          this.isCanGetCode = false;
          this.time -= 1;
          if (this.time == 0) {
            this.isCanGetCode = true;
            return;
          }
          setTimeout(this.timer, 1000)
        }
      },
      cleanPhone () {
        this.phone = '';
      },
      setCacheData(){

        var CacheRegister = {
          'username': this.username,
          'registrationCode': this.registrationCode,
          'phone': this.phone,
          'code': this.code,
          'password': this.password,
        };
        localEvent.setLocalItem('CacheRegister', CacheRegister);
      },
      getCacheData(){

        var data = localEvent.getLocalItem('CacheRegister');
        if (data) {
          this.username = data.username;
          this.registrationCode = data.registrationCode;
          this.phone = data.phone;
          this.code = data.code;
          this.password = data.password;

          if (this.username) {
            this.showUsernameLabel = false;
          }

          if (this.registrationCode) {
            this.showYqCodeLabel = false;
          }

          if (this.phone) {
            this.showPhoneLabel = false;
          }

          if (this.code) {
            this.showYzmLabel = false;
          }

          if (this.password) {
            this.showPasswordLabel = false;
          }
        }

      },
      cleanUsername () {
        this.username = '';
      },
      showPassword () {
        if (this.isShowPassword) {
          this.isShowPassword = false;
          this.isShowPasswordText = true;
        } else {
          this.isShowPassword = true;
          this.isShowPasswordText = false;
        }
      },
      // 获取验证码
      getCode () {
        let mobile = this.phone?this.phone:'';
        let type = 'register';

        if (!this.isCanGetCode) {
          return;
        }

        if (!this.registrationCode) {
          mui.toast("请输入邀请码");
          return;
        }

        if (this.registrationCode.length < 6) {
          mui.toast("邀请码至少6位");
          return;
        }

        if (mobile.length !== 11) {
//        mui.toast("请正确填写手机号");
          this.showTip(this.$refs.phone, '请输入有效的手机号码');
          return;
        }

        this.isCanGetCode = false;

        postRequest('auth/sendPhoneCode', {
            mobile,
            type,
            'registration_code': this.registrationCode
          }
        )
          .then(response => {

            var code = response.data.code;
            if (code !== 1000) {
              this.isCanGetCode = true;
//            mui.toast(response.data.message);
              var message = response.data.message;
            //验证码超时； 
                this.wran(message,'重新发送', () => {
//            	  this.$router.push('/register/nocode');
              	  this.getCode();
              });
              return;
            }

            this.time = 60;
            this.timer();

            mui.toast('验证码发送成功');
          })
          .catch(({response: {data = {}} = {}}) => {
            this.isCanGetCode = true;
            const {code = 'xxxx'} = data;
            this.errors = Object.assign({}, this.errors, {serverError: errorCodes[code]});
          })
      },
      //判断否有值
      checkValid(){
      	//手机；
        if (!this.phone) {
          this.disableRegister = true;
          return false;
        }
       //验证码；
        if (!this.code) {
          this.disableRegister = true;
          return false;
        }
        //邀请码；
         if (!this.registrationCode) {
          this.disableRegister = true;
          return false;
        }
         //姓名；
          if (!this.this.username) {
          this.disableRegister = true;
          return false;
        }
         //密码
          if (!this.this.password) {
          this.disableRegister = true;
          return false;
        }
         
        this.disableRegister = false;
      },
      // 注册
      register () {
//    	this.wran("11",'重新发送', () => {
////            	  this.$router.push('/register/nocode');
//            	  this.getCode();
//            });
        let {username, phone, code, password} = this;
        let device_code = detecdOS();
        this.isLoading = true;
        this.isDisabled = true;

        if (!this.registrationCode) {
           mui.toast("请输入邀请码");
		
          return;
        }

         if (this.registrationCode.length < 6) {
          mui.toast("邀请码至少6位");
          return;
        }
        
         if (!phoneReg.test(this.phone)) {
//        mui.toast("请正确输入手机号");
           this.showTip(this.$refs.phone, '请输入有效的手机号码');
          return;
        }
       
         if (!this.code) {
          mui.toast("请输入验证码");
          return;
        }

        if (!codeReg.test(this.code)) {
          mui.toast('验证码错误');
          return;
        }

       

        if (!this.username) {
          mui.toast("请输入真实姓名");
          return;
        }

        if (!usernameReg.test(this.username)) {
          mui.toast("用户名不能包含特殊符号以及空格");
          return;
        } else if (this.username.length > 12 || this.username.length <= 1) {
        	this.disableRegister = true;
          mui.toast("请输入2-12位姓名");
        }


        if (this.password.length < 6) {
         	this.disableRegister = true;
          mui.toast("密码长度必须大于6位");
          return;
        }
        if (mui.os.plus) {
          mui.waiting();
        }
        
        request.post(createAPI('auth/register'), {
            name: username,
            mobile: phone,
            code,
            password,
            device_code,
            'registration_code': this.registrationCode
          }
        )
          .then(response => {
            if (mui.os.plus) {
              mui.closeWaiting();
            }
            var code = response.data.code;
            if (code !== 1000) {
              this.isDisabled = false;
              this.isLoading = false;
              //邀请码；
              mui.toast(response.data.message);
              var message = response.data.message;
                this.wran(message,'获取邀请码', () => {
            	   this.$router.push('/register/nocode');
              });
              return;
            }
            clearAllWebViewCache();

            localEvent.clearLocalItem('CacheRegister');
            this.isRegisterSuccess = true;

            mui.toast("注册成功！");
            localEvent.setLocalItem('UserLoginInfo', response.data.data);
            this.isLoading = false;
            //存储设备信息
            if (mui.os.plus) {
              var device_info = plus.push.getClientInfo();
              apiRequest(`system/device`, {
                client_id: device_info.clientid,
                device_token: device_info.token,
                appid: device_info.appid,
                appkey: device_info.appkey,
                device_type: plus.os.name === 'iOS' ? 2 : 1
              },false).then(res => {

              });
            }

            this.$store.dispatch(USERS_APPEND, cb => getUserInfo(response.data.data.user_id, user => {
              var currentUser = localEvent.getLocalItem('UserInfo');
              //localEvent.setLocalItem('userInfo', currentUser);
              cb(user);
              if (process.env.NODE_ENV === 'production') {
                // mixpanel
                var app_version = localEvent.getLocalItem('app_version');
                if (currentUser.user_id){
                  window.mixpanel.identify(currentUser.user_id);
                  window.mixpanel.people.set({ "email": currentUser.email,"app_version": app_version.version, "gender": currentUser.gender, "phone": currentUser.phone ,"name": currentUser.name, "avatar": currentUser.avatar_url });
                }
              }
              this.$router.pushPlus('/my',true,'none','none',true,true);
            }));
          })
          .catch(({response: {data = {}} = {}}) => {
            if (mui.os.plus) {
              plus.nativeUI.closeWaiting();
            }
            this.isDisabled = false;
            const {code = 'xxxx'} = data;
            this.isLoading = false;
            this.errors = Object.assign({}, this.errors, {serverError: errorCodes[code]});
            mui.toast(errorCodes[code]);
          })
         
      }
      
    },
    watch: {
      phone: function (newMoney, oldValue) {
        const askDetail = /^[0-9]+$/;
        if (!askDetail.test(newMoney) && this.phone) {
          this.phone = oldValue;
        }
      }
    },
   
  }

  export default register;

</script>

<style lang="less" rel="stylesheet/less" scoped>
  .login {
    position: absolute;
    width: 100%;
    min-height: 100%;
    background: #f3f4f6;
    background-size: cover;
    text-align: center;
  }

  /*.title {
    margin: 100px 0 50px;
    font-size: 36px;
    color: #fff;
  }

  input[type='text'], input[type='password'] {
    background-color: transparent;
    border: none;
    text-align: center;

    color: #fff;
    margin-bottom: 0;

  }

  .inputWrapper {
    border-bottom: 1px solid rgba(255, 255, 255, .3);
    margin: 0 60px;
    padding: 10px 0;
    position: relative;
  }

  .inputWrapper label {
    position: absolute;
    left: 0;
    color: #fff;
    width: 100%;
    text-align: center;
    top: 50%;
    margin-top: -8px;
  }

  .inputWrapper .getYzm {
    position: absolute;
    right: 0;
    color: rgba(255, 255, 255, .6);
    bottom: 5px;
    font-size: 14px;
  }

  
  .buttonWrapper {
    padding: 0 112px;
    margin-top: 40px;
  }

  .mui-btn-block {
    padding: 10px 0;
  }*/
 /*协议*/
 .protocol {
    color: rgb(128,128,128);
    font-size: 12px;
    width: 80%;
    margin-left: 10%;
    text-align: left;

  }

  .protocol span {
    color: #3c95f9;
  }
/*登录*/
.button, .mui-btn {
    border-radius: 5px;
    /*color: #f2f2f2;*/
    width: 78%;
    margin-left: 11%;
    margin-top: 15px;
    margin-bottom: 15px;
    
}
   button {
    border-radius: 5px;

    &:disabled {
      background: #dcdcdc;
      border: 1px solid #dcdcdc;
      color: #b4b4b6;

    }
  }
 
 /*邀请码*/
  .help {
    font-size: 14px;
    color: #3c95f9;
    text-align:center;

  }
/*小箭头*/
  .leftNav {
    position: absolute;
    padding: 30px;
    left: 0;
    top: 0;
  }

  .leftNav span {
    background: url(../statics/images/icon-login-left.png) no-repeat;
    background-size: cover;
    width: 10px;
    height: 17px;
    position: absolute;
    left: 10px;
    top: 10px;
  }

 /*图标*/
  .logo{
   
    font-size: 110px;
     margin:40px 0 45px; 
    
  } 

/*输入框的内容*/
   .inputWrapper .icon {
    position: absolute;
    top: 5px;
    font-size: 22px;
    color: #c8c8c8;
    left: 0;
    
  }

  .inputWrapper {
    margin: 0 33px 22px;
    position: relative;
    width: 80%;
    margin-left: 10%;

  }

  .inputWrapper.focus {

    &:after {
      background-color: #3c95f9;
    }

    .icon {
      color: #3c95f9;
    }
  }
/*验证码*/
   .inputWrapper .getYzm {
    display: inline-block;
    font-size: 14px;
    color: #444;
    position: absolute;
    right: 2px;
    top: 4.2px;
    border: 1px solid #dcdcdc;
    border-radius: 5px;
    padding: 3px 14px;
  }

  .inputWrapper .getYzm.disabled {
    border: 1px solid #3c95f9;
    color: #3c95f9;
  }

  .inputWrapper:after {
    position: absolute;
    right: 0;
    bottom: 3px;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .inputWrapper input {
    color: #444;
    border: none;
    margin: 0;
    font-size: 14px;
    background: none;
    display: inline-block;
    height: 36px;
    margin-left: 12px;
  }
  
  
 input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { 
    color:#b4b4b6;
}
input:-moz-placeholder, textarea:-moz-placeholder { 
    color:#b4b4b6;
}
input::-moz-placeholder, textarea::-moz-placeholder { 
    color:#b4b4b6;
}
input:-ms-input-placeholder, textarea:-ms-input-placeholder { 
    color:#b4b4b6;
}

/*手机号input输入框的调整*/
.inputWrapper:nth-of-type(3) input {
    color: #444;
    border: none;
    margin: 0;
    font-size: 14px;
    background: none;
    display: inline-block;
    height: 36px;
    margin-left: 12px;
    /*background: #ccc;*/ 
    width: 60%;
    margin-right: 40%;
}

.half:after {
    position: absolute;
    right: 36%;
    bottom: 3px;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    background-color: #dcdcdc;
}

/*2 3图标大小的微调*/
.inputWrapper:nth-of-type(4) .icon{
    position: absolute;
    top: 3px;
    font-size: 25px;
    /*color: #c8c8c8;*/
    left: 0;
}
.inputWrapper:nth-of-type(5) .icon{
    position: absolute;
    top: 2px;
    font-size: 27px;
    /*color: #c8c8c8;*/
    left: 0;
}
.inputWrapper:nth-of-type(6) .icon{
    position: absolute;
    top: 5px;
    font-size: 21px;
    /*color: #c8c8c8;*/
    left: 0;
}
</style>
