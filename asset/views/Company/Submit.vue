<template>
<div>
  <header class="mui-bar mui-bar-dark mui-bar-nav">
    <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    <h1 class="mui-title">认证企业用户</h1>
  </header>

  <div class="mui-content">
    <div class="title">企业信息</div>
    <ul class="mui-table-view companyForm noBottomBorder">
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">企业名称</label>
          <input type="text"  placeholder="输入企业名称" maxlength="60">
        </div>
      </li>
      <li class="mui-table-view-cell noBottomBorder">
        <div class="mui-input-row">
          <label class="mui-navigate">行业领域</label>
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
          <label class="mui-navigate">公司规模</label>
          <span class="unit">人</span>
          <input type="text" class="inputUnit"  placeholder="输入公司人数">
        </div>
      </li>
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">统一社会信用代码</label>
          <input type="text" placeholder="输入代码">
        </div>
      </li>
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">开户银行</label>
          <input type="text" placeholder="输入银行信息">
        </div>
      </li>
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">开户账户</label>
          <input type="text" placeholder="输入账户信息">
        </div>
      </li>
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">公司地址<span class="optional">（选填）</span></label>
          <input type="text" placeholder="输入详细地址">
        </div>
      </li>
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">公司电话<span class="optional">（选填）</span></label>
          <input type="text" placeholder="输入银行账户">
        </div>
      </li>
    </ul>
    <div class="river"></div>
    <div class="title">对接人信息</div>
    <ul class="mui-table-view companyForm">
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
    </ul>


    <div class="buttonWrapper">
      <button type="button" class="mui-btn mui-btn-block mui-btn-primary">确认</button>
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

<style scoped="scoped">
  .title{
    padding:17px 16px;
    color:#444;
    background: #fff;
    font-weight: bold;
  }

  .buttonWrapper{
    padding:20px 16px;
    background: #fff;
  }

  .buttonWrapper button{
    margin-top:10px;
    border-radius: 5px;
    background: #03aef9;
    border:1px solid #03aef9;
  }

  .companyForm{
    font-size:14px;
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
    text-align: right;
    font-size:14px;
    padding-right: 0;
  }

  .companyForm .mui-table-view-cell{
    padding:5px 15px;
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
    width:55%;
    padding:10px;
  }

  .companyForm .textRight{
    float: right;
    display: inline-block;
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

  .river{
    height:10px;
    background: #ececee;
  }

  .radioWrapper {
    display: inline-block;
    padding:11px 0 11px 25px;
    margin-left:18px;
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
</style>
