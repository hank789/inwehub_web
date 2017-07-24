<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">企业信息</h1>
    </header>

    <div class="mui-content">
      <div class="schedule schedule-4"></div>
      <div class="basic">
        <div class="title">很好</div>
        <div class="titleSub">现在完善你的企业信息</div>
      </div>

      <ul class="mui-table-view companyForm">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">企业名称</label>
            <input type="text"  placeholder="输入企业名称">
          </div>
        </li>

        <li class="mui-table-view-cell noBottomBorder">
          <div class="mui-input-row">
            <label class="mui-navigate">企业简介</label>
            <div class="textarea-wrapper">
              <textarea class="textarea"></textarea>
              <span class="counter"><span>0</span><span>/</span><span>500</span></span>
            </div>
          </div>
        </li>

        <li class="mui-table-view-cell noBottomBorder">
          <div class="mui-input-row">
            <label class="mui-navigate">行业领域</label>
            <input type="text">
            <svg class="icon modify" aria-hidden="true">
              <use xlink:href="#icon-shuru"></use>
            </svg>
          </div>

          <div class="selectedWrapper">
                    <span class="selected">专业服务<svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-guanbi"></use>
                </svg></span>
            <span class="selected">生命科学行业<svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-guanbi"></use>
                </svg></span>
          </div>
        </li>

        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">对接人员</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio">
                    发布者本人
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio" checked="checked">
                    其他人
                </span>
            </div>

          </div>
        </li>

        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">对接人名</label>
            <input type="text" placeholder="输入对接人名">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">对接职位</label>
            <input type="text" placeholder="输入对接人职位">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">对接手机</label>
            <input type="text" placeholder="输入对接人手机">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">对接邮箱</label>
            <input type="text" placeholder="输入对接人邮箱">
          </div>
        </li>

        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">开票信息</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio2" type="radio">
                    不需要
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio2" type="radio" checked="checked">
                    现在填写
                </span>
            </div>

          </div>
        </li>

        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">抬头信息</label>
            <input type="text" placeholder="填写抬头">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">开户银行</label>
            <input type="text" placeholder="填写银行">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">开户账户</label>
            <input type="text" placeholder="填写账户">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">纳税识别号</label>
            <input type="text" placeholder="填写识别号">
          </div>
        </li>

      </ul>



      <div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" disabled="disabled">下一步</button>
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

<style lang="less" rel="stylesheet/less" scoped>
  .schedule{
    width:25%;
    height:3px;
    background: #03aef9;
  }
  .schedule-4{
    margin-left:75%;
  }

  .basic{
    height:150px;
    position: relative;
    text-align: center;
  }

  .basic .title{
    position: relative;
    top:50px;
    font-size:20px;
    color:#444;
  }

  .basic .titleSub{
    position: relative;
    top:55px;
    font-size:14px;
    color:#808080;
  }


  .companyForm{
    font-size:14px;
    margin-top:10px;
  }
  .companyForm:before{
    left:16px;
    background-color: #dcdcdc;
    right:16px;
  }
  .companyForm:after{
    left:16px;
    background-color: #dcdcdc;
    right:16px;
  }

  .companyForm label{
    padding-left:0;
    color:#808080;

  }

  .companyForm input{
    width:61% !important;
    text-align: right;
    font-size:14px;
    padding-right: 0;

  }

  .companyForm .mui-table-view-cell{
    padding:6px 15px;
  }

  .companyForm .mui-table-view-cell:after{
    left:16px;
    right:16px;
    background-color: #dcdcdc;
    transform: scaleY(0.5);

  }

  .companyForm .mui-table-view-cell .modify{
    position: absolute;
    right: 0;
    top:10px;
    color:#c8c8c8;
    font-size:18px;
  }

  .companyForm .unit{
    padding:10px 0;
    float: right;
  }

  .companyForm label{
    width:auto !important;
    max-width: 49%;
    padding-right:0;
    line-height: normal;
  }

  .companyForm label .optional{
    color:#c8c8c8;
  }



  .companyForm input::placeholder{
    color:#c8c8c8;
  }

  .companyForm .inputUnit{
    padding:10px;
    margin-right:15px;
  }

  .companyForm .textRight{
    float: right;
    display: inline-block;
  }

  .radioWrapper {
    display: inline-block;
    padding:11px 0 11px 25px;
    margin-left:18px;
  }
  .radioWrapper:first-child{
    margin-left:0;
  }
  .radioWrapper input[type='radio']{
    left:0;
    top:11px;
  }
  .radioWrapper input[type='radio']:before{
    position: absolute;
    left:0px;
    color:#c8c8c8;
    font-size:20px;
  }
  .radioWrapper input[type='radio']:checked:before{
    color:#03aef9;
  }

  .noBottomBorder:after{
    display: none;
  }

  .buttonWrapper{
    padding:17px 16px 30px;
    background: #fff;
    text-align: center;
  }

  .buttonWrapper button{
    display: inline-block;
    width:115px;
    margin-top:10px;
    background: #03aef9;
    border:1px solid #03aef9;
  }

  .buttonWrapper button:disabled{
    background: #dcdcdc;
    border:1px solid #dcdcdc;
    color:#b4b4b6;
    opacity: 1;
  }

  .selected{
    display: inline-block;
    color:#03aef9;
    border:1px solid #03aef9;
    border-radius: 5px;
    padding:4px 10px 3px;
    font-size:14px;
    margin:7px 7px 0 0;
  }

  .selected .icon{
    color:#c8c8c8;
    font-size:11px;
    margin-left:7px;
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
    height:100%;
    padding-bottom: 0;
  }


</style>
