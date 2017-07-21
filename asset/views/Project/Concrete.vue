<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">具体需求</h1>
    </header>

    <div class="mui-content">
      <div class="schedule schedule-2"></div>
      <div class="basic">
        <div class="title">有什么具体要求</div>
        <div class="titleSub">我们会根据你的需求提供匹配的服务</div>

      </div>

      <ul class="mui-table-view companyForm noBottomBorder">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">顾问数量</label>
            <input type="text">
            <svg class="icon modify" aria-hidden="true">
              <use xlink:href="#icon-shuru"></use>
            </svg>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">顾问级别</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio">
                    熟练
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio" checked="checked">
                    精通
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio" checked="checked">
                    资深
                </span>
            </div>

          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目预算</label>
            <span class="unit">万</span>
            <input type="text" class="inputUnit">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">计费模式</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio2" type="radio">
                    按人天算
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio2" type="radio" checked="checked">
                    整体打包
                </span>
            </div>

          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">开始时间</label>
            <input type="text">
            <svg class="icon modify" aria-hidden="true">
              <use xlink:href="#icon-shuru"></use>
            </svg>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目周期</label>
            <input type="text">
            <svg class="icon modify" aria-hidden="true">
              <use xlink:href="#icon-shuru"></use>
            </svg>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">工作密度</label>
            <input type="text">
            <svg class="icon modify" aria-hidden="true">
              <use xlink:href="#icon-shuru"></use>
            </svg>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">远程工作</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio3" type="radio">
                    接受
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio3" type="radio" checked="checked">
                    不接受
                </span>
            </div>

          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">差旅费用</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio4" type="radio">
                    包含在项目内
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio4" type="radio" checked="checked">
                    单独结算
                </span>
            </div>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">工作地点</label>
            <input type="text">
            <svg class="icon modify" aria-hidden="true">
              <use xlink:href="#icon-shuru"></use>
            </svg>
          </div>

          <div class="selectedWrapper">
                    <span class="selected">江苏 南京<svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-guanbi"></use>
                </svg></span>
            <span class="selected">上海<svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-guanbi"></use>
                </svg></span>
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
  .schedule-2{
    margin-left:25%;
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

  .fileSelect{
    font-size:14px;
    color:#c8c8c8;
    background: #fff;
    padding:15px;
    position: relative;
  }
  .fileSelect .icon{
    position: absolute;
    right:15px;
    color: #03aef9;
    font-size:22px;
  }

  .fileList{
    padding:0 15px 30px;
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
    padding:14px 16px 30px;
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
    margin:5px 7px 0 0;
  }

  .selected .icon{
    color:#c8c8c8;
    font-size:11px;
    margin-left:7px;
  }


</style>
