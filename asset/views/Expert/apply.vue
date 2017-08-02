<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav"><a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">专家认证</h1>
    </header>
    <div class="mui-content">
      <div class="professorCard">
        <div class="header">
          <div class="avatar">
            <div class="avatarInner"><img class="avatar" src="http://wx.qlogo.cn/mmopen/PiajxSqBRaEIVaaLLXibu2J52gbpia5qw1VsJdoPmYVoaaB90xEWZHJJkYHe8mBwjictcjpPOONQ0VI8RicDqrpQf6g/0"></div>
          </div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xiangji"></use>
          </svg>
        </div>
        <div class="title">用户头像</div>
      </div>
      <ul class="mui-table-view companyForm noBottomBorder">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">用户姓名</label>
            <input type="text" placeholder="填写用户姓名" maxlength="30">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">用户性别</label>
            <div class="textRight"><span class="mui-radio radioWrapper">
                <input name="sex" type="radio">                    男</span><span class="mui-radio radioWrapper">
                <input name="sex" type="radio" checked="checked">                    女</span></div>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">当前公司</label>
            <input type="text" placeholder="填写公司民称" maxlength="100">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">当前职位</label>
            <input type="text" placeholder="填写当前职位" maxlength="100">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">从业时间</label>
            <input type="text"  class="inputUnit" readonly="readonly">
            <svg class="icon modify" aria-hidden="true">
              <use xlink:href="#icon-shuru"></use>
            </svg>
          </div>
        </li>
      </ul>
      <div class="river"></div>
      <div class="formTitle">详细信息</div>
      <ul class="mui-table-view companyForm noBottomBorder titleBottomForm">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">手机号码</label>
            <input type="text" placeholder="填写手机号码" maxlength="11">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">邮箱地址</label>
            <input type="text" placeholder="填写邮箱地址" maxlength="100">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">详细地址</label>
            <input type="text" placeholder="填写详细地址" maxlength="200">
          </div>
        </li>
        <li class="mui-table-view-cell noBorder">
          <div class="mui-input-row">
            <label class="mui-navigate">个人描述</label>
            <div class="textarea-wrapper">
              <textarea class="textarea"></textarea><span class="counter"><span>0</span><span>/</span><span>500</span></span>
            </div>
          </div>
        </li>
      </ul>
      <div class="buttonWrapper">
        <button class="mui-btn mui-btn-block mui-btn-primary" type="button">提交申请</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {apiRequest, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';

  export default {
    data(){
      return {
        loading: 1
      }
    },
    computed: {
      nothing () {
        return false;
      },
    },
    methods: {
      nothing(){

      }
    },
    mounted(){

    },

    created(){

    }
  };
</script>

<style scoped>
  .professorCard {
    background: #f3f4f6;
    height: 131px;
  }
  .professorCard .header {
    position: relative;
    height: 92px;
  }
  .professorCard .header .avatar {
    position: absolute;
    left: 50%;
    top: 11px;
    margin-left: -34.5px;
    z-index: 9;
    color: #ffffff;
    display: inline-block;
    height: 69px;
    width: 69px;
    font-size: 20px;
    text-align: center;
    border-radius: 50%;
    vertical-align: top;
  }
  .professorCard .header .avatar .avatarInner {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 100%;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
  .professorCard .header .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }
  .professorCard .header .icon {
    position: absolute;
    left: 50%;
    margin-left: 11px;
    font-size: 27px;
    color: #808080;
    top: 59px;
    z-index: 10;
  }
  .professorCard .title {
    padding: 3px 0;
    color: #808080;
    font-size: 14px;
    text-align: center;
  }
  .companyForm {
    font-size: 14px;
    margin-top: 0;
  }
  .companyForm:before {
    display: none;
  }
  .companyForm:after {
    left: 16px;
    background-color: #dcdcdc;
    right: 16px;
  }
  .companyForm label {
    padding-left: 0;
    color: #808080;
    width: auto !important;
    max-width: 39%;
    padding-right: 0;
    line-height: normal;
  }
  .companyForm label .optional {
    color: #c8c8c8;
  }
  .companyForm input {
    width: 61% !important;
    text-align: right;
    font-size: 14px;
    padding-right: 0;
  }
  .companyForm input::placeholder {
    color: #c8c8c8;
  }
  .companyForm .mui-table-view-cell {
    padding: 1px 15px;
  }
  .companyForm .mui-table-view-cell.noBorder:after {
    display: none;
  }
  .companyForm .mui-table-view-cell:after {
    left: 16px;
    right: 16px;
    background-color: #dcdcdc;
    transform: scaleY(0.5);
  }
  .companyForm .mui-table-view-cell .modify {
    position: absolute;
    right: 0;
    top: 10px;
    color: #c8c8c8;
    font-size: 18px;
  }
  .companyForm .unit {
    padding: 10px 0;
    float: right;
  }
  .companyForm .inputUnit {
    padding: 10px;
    margin-right: 17px;
  }
  .companyForm .textRight {
    float: right;
    display: inline-block;
  }
  .textarea-wrapper {
    margin: 46px 0 0 ;
    height: 164px;
    position: relative;
    border-radius: 5px;
    border: 1px solid #dcdcdc;
    background: #fff;
    padding-bottom: 20px;
  }
  .textarea-wrapper .counter {
    position: absolute;
    right: 7px;
    font-size: 14px;
    bottom: 5px;
    color: #c8c8c8;
  }
  .textarea-wrapper textarea {
    border: none;
    margin: 0;
    height: 100%;
    padding-bottom: 0;
  }
  .radioWrapper {
    display: inline-block;
    padding: 11px 0 11px 25px;
    margin-left: 18px;
  }
  .radioWrapper:first-child {
    margin-left: 0;
  }
  .radioWrapper input[type='radio'] {
    left: 0;
    top: 11px;
  }
  .radioWrapper input[type='radio']:before {
    position: absolute;
    left: 0px;
    color: #c8c8c8;
    font-size: 20px;
  }
  .radioWrapper input[type='radio']:checked:before {
    color: #03aef9;
  }
  .river {
    height: 10px;
    background: #f3f4f6;
  }
  .formTitle {
    padding: 11px 16px;
    color: #444;
    background: #fff;
  }
  .titleBottomForm {
    margin-top: 0;
  }
  .titleBottomForm:before {
    display: block;
    background-color: #dcdcdc;
    left: 15px;
  }
  .buttonWrapper {
    padding: 6px 16px 30px;
    background: #fff;
  }
  .buttonWrapper button {
    margin-top: 10px;
    border-radius: 5px;
    background: #03aef9;
    border: 1px solid #03aef9;
    padding: 10px 0;
  }
  .noBottomBorder:after {
    display: none;
  }
</style>
