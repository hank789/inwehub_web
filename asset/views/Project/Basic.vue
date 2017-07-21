<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">项目概况</h1>
    </header>

    <div class="mui-content">
      <div class="schedule"></div>
      <div class="basic">
        <div class="title">说说你的项目</div>
        <div class="titleSub">填写项目概况</div>
      </div>

      <ul class="mui-table-view companyForm noBottomBorder">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目名称</label>
            <input type="text"  placeholder="输入项目名称" maxlength="60">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目类型</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio">
                    一次性
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio" checked="checked">
                    持续性
                </span>
            </div>

          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目阶段</label>
            <input type="text" class="inputUnit" readonly="readonly" value="项目已立项，就等顾问来操刀">
            <svg class="icon modify" aria-hidden="true">
              <use xlink:href="#icon-shuru"></use>
            </svg>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目描述</label>
            <div class="textarea-wrapper">
              <textarea class="textarea"></textarea>
              <span class="counter"><span>0</span><span>/</span><span>500</span></span>
            </div>
          </div>
        </li>
      </ul>

      <div class="fileSelect">添加附件（.jpg）
        <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-plus"></use>
      </svg>
      </div>
      <div class="fileList">
        <div class="item"><svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-times"></use>
        </svg>企业logo.jpg</div>
        <div class="item"><svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-times"></use>
        </svg>整体思维导图.jpg</div>
      </div>

      <div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="$router.push('/project/concrete')">下一步</button>
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
    max-width:39%;
    padding-right:0;
    line-height: normal;
  }

  .companyForm label .optional{
    color:#c8c8c8;
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




  .companyForm input::placeholder{
    color:#c8c8c8;
  }

  .companyForm .inputUnit{
    padding:10px;
    margin-right:17px;
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

  .fileSelect{
    font-size:14px;
    color:#c8c8c8;
    background: #fff;
    padding:11px 15px;
    position: relative;
  }
  .fileSelect .icon{
    position: absolute;
    right:16px;
    color: #03aef9;
    font-size:22px;
  }

  .fileList{
    padding:0 15px 0;
    background: #fff;
    font-size:14px;
  }
  .fileList .item{
    padding:5px 0;
  }
  .fileList .icon{
    font-size:16px;
    color:#c8c8c8;
    margin-right:10px;
  }

  .buttonWrapper{
    padding:7px 16px 30px;
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


</style>
