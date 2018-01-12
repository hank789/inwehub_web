<template>
  <div id="Withdrawals" class="Withdrawals">
    <div class="Withdrawals-title">
      <p>取消</p>
      <p>提现</p>
      <i class="bot"></i>
    </div>

    <div class="inputWrapper" :class="{'input-blue': password}">
      <svg class="icon" :class="{'svg-gray': password}" aria-hidden="true">
        <use xlink:href="#icon-mima"></use>
      </svg>
      <input type="password" v-model.trim="password" placeholder="请输入登录密码" @focus="focus" @blur="blur"/>
    </div>
    <p class="forget-password"><span v-if="errorMesg">{{errorMesg}}</span>忘记密码？</p>

    <button :class="{'button-blue': password.length >= 6}" @tap.stop.prevent="submit">确认提现</button>
  </div>
</template>

<script type="text/javascript">
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
      submit () {
        this.$emit('submitPassword', this.password)
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
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }
  .Withdrawals{
    display: none;
    width:100%;
    height:215px;
    background: #FFFFFF;
    border: 1px solid #cccccc;
    position: absolute;
    z-index:999;
    bottom:0;
  }
  .Withdrawals-title{
    width:100%;
    height:44px;
    line-height: 44px;
    position: relative;
  }
  .Withdrawals-title p:nth-of-type(1){
    position: absolute;
    font-size:16px;
    color: #808080;
    padding: 0 11px;
  }
  .Withdrawals-title p:nth-of-type(2){
    font-size:14px;
    color: #808080;
    text-align: center;
  }

  button{
    width:91%;
    height:44px;
    border:none;
    background:#dcdcdc;
    font-size:16px;
    color: #b4b4b6;
    position: absolute;
    left: 4.5%;
    bottom: 20px;
  }

  .forget-password{
    padding: 0 10%;
    text-align: right;
    font-size:12px;
    color: #235280;
    padding-top: 13px;
  }
  .forget-password span{
    font-size:12px;
    color: #fa4975;
    float: left;
  }



  .inputWrapper {
    margin: 0 33px 22px;
    position: relative;
    width: 80%;
    margin-left: 10%;
    top: 30px;
    border-bottom:1px solid #dcdcdc;
  }
  /*.inputWrapper:after {*/
    /*position: absolute;*/
    /*right: 0;*/
    /*bottom: 3px;*/
    /*left: 0;*/
    /*height: 1px;*/
    /*content: '';*/
    /*-webkit-transform: scaleY(0.5);*/
    /*transform: scaleY(0.5);*/
    /*background-color: #dcdcdc;*/
  /*}*/

  .inputWrapper .icon {
    position: absolute;
    top: 6px;
    font-size: 20px;
    color: #c8c8c8;
    left: 0;
  }

  .inputWrapper input {
    color: #444;
    border: none;
    margin: 0;
    /*padding: 0 0 0 36px;*/
    font-size: 14px;
    background: none;
    display: inline-block;
    height: 36px;
    margin-left: 15px;
    margin-bottom: -5px;
  }

  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    font-size: 14px;
    color: #b4b4b6;
  }

  input:-moz-placeholder, textarea:-moz-placeholder {
    font-size: 14px;
    color: #b4b4b6;
  }

  input::-moz-placeholder, textarea::-moz-placeholder {
    font-size: 14px;
    color: #b4b4b6;
  }

  input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    font-size: 14px;
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
</style>
