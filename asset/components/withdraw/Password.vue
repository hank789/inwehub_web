<template>
  <div>
    <div id="Withdrawals" class="Withdrawals mui-popover mui-popover-action mui-popover-bottom">
      <div class="Withdrawals-title">
        <p @tap.stop.prevent="hide()">取消</p>
        <p>提现</p>
        <i class="bot"></i>
      </div>

      <div class="inputWrapper" :class="{'input-blue': password}">
        <svg class="icon" :class="{'svg-gray': password}" aria-hidden="true">
          <use xlink:href="#icon-mima"></use>
        </svg>
        <input type="password" v-model.trim="password" placeholder="请输入登录密码" @focus="focus" @blur="blur"/>
      </div>
      <p class="forget-password"><span class="error" v-if="errorMesg">{{errorMesg}}</span><span @tap.stop.prevent="toFindPassword()">忘记密码？</span></p>

      <button :class="{'button-blue': password.length >= 6}" @tap.stop.prevent="submit">确认提现</button>
    </div>
  </div>
</template>

<script type="text/javascript">
  import userAbility from '../../utils/userAbility'

  export default {
    data () {
      return {
        password: '',
        errorMesg: ''
      }
    },
    components: {},
    props: {

    },
    created () {
    },
    watch: {},
    mounted () {
    },
    methods: {
      toFindPassword () {
        userAbility.logout(this, () => {
          window.mui('#Withdrawals').popover('toggle')
          this.$router.pushPlus('/findpassword')
        })
      },
      hide () {
        window.mui('#Withdrawals').popover('hide')
      },
      submit () {
        this.$emit('submitPassword', this.password)
      },
      success () {
        this.hide()
        this.password = ''
        this.errorMesg = ''
      },
      fail (msg) {
        this.errorMesg = msg
        window.mui('#Withdrawals').popover('show')
      },
      requirePassword () {
        window.mui('#Withdrawals').popover('toggle')
      },
      focus () {

      },
      blur () {

      }
    }
  }
</script>

<style scoped="scoped">
  ul,li,div,p,span,i,a,button{
    margin:0;
    padding: 0;
  }
  .bot{
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.026rem;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }
  .Withdrawals{
    display: none;
    width:100%;
    height:5.733rem;
    background: #FFFFFF;
    border: 0.026rem solid #cccccc;
    position: absolute;
    z-index:999;
    bottom:0;
  }
  .Withdrawals-title{
    width:100%;
    height:1.173rem;
    line-height: 1.173rem;
    position: relative;
  }
  .Withdrawals-title p:nth-of-type(1){
    position: absolute;
    font-size:0.426rem;
    color: #808080;
    padding: 0 0.293rem;
  }
  .Withdrawals-title p:nth-of-type(2){
    font-size:0.373rem;
    color: #808080;
    text-align: center;
  }

  button{
    width:91%;
    height:1.173rem;
    border:none;
    background:#dcdcdc;
    font-size:0.426rem;
    color: #b4b4b6;
    position: absolute;
    left: 4.5%;
    bottom: 0.533rem;
  }

  .forget-password{
    padding: 0 10%;
    text-align: right;
    font-size:0.32rem;
    color: #235280;
    padding-top: 0.346rem;
  }
  .forget-password .error{
    font-size:0.32rem;
    color: #fa4975;
    float: left;
  }



  .inputWrapper {
    margin: 0 0.88rem 0.586rem;
    position: relative;
    width: 80%;
    margin-left: 10%;
    top: 0.8rem;
    border-bottom:0.026rem solid #dcdcdc;
  }
  /*.inputWrapper:after {*/
    /*position: absolute;*/
    /*right: 0;*/
    /*bottom: 0.08rem;*/
    /*left: 0;*/
    /*height: 0.026rem;*/
    /*content: '';*/
    /*-webkit-transform: scaleY(0.5);*/
    /*transform: scaleY(0.5);*/
    /*background-color: #dcdcdc;*/
  /*}*/

  .inputWrapper .icon {
    position: absolute;
    top: 0.16rem;
    font-size: 0.533rem;
    color: #c8c8c8;
    left: 0;
  }

  .inputWrapper input {
    color: #444;
    border: none;
    margin: 0;
    /*padding: 0 0 0 0.96rem;*/
    font-size: 0.373rem;
    background: none;
    display: inline-block;
    height: 0.96rem;
    margin-left: 0.4rem;
    margin-bottom: -0.133rem;
  }

  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    font-size: 0.373rem;
    color: #b4b4b6;
  }

  input:-moz-placeholder, textarea:-moz-placeholder {
    font-size: 0.373rem;
    color: #b4b4b6;
  }

  input::-moz-placeholder, textarea::-moz-placeholder {
    font-size: 0.373rem;
    color: #b4b4b6;
  }

  input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    font-size: 0.373rem;
    color: #b4b4b6;
  }
  /*颜色class*/
  .inputWrapper .svg-gray{
    color: #808080;
  }
  .button-blue{
    background: #03aef9;
    color: #FFFFFF;
  }
  .inputWrapper.input-blue{
    border-color: #03aef9;;
  }

  #Withdrawals{
    background: #fff;
    position: absolute;
    z-index:999;
    display: none;
  }
</style>
