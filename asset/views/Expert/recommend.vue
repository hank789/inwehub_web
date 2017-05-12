<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">推荐专家</h1>
    </header>

    <div id="expert_commend" class="mui-content">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">专家姓名</label>
            <input id="name" type="text" class="mui-input-clear" v-model="expertItem.name" placeholder="必填">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">专家性别</label>
            <input id="gender" type="text" class="mui-input-clear" v-model="expertItem.gender" placeholder="必填">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">从业时间</label>
            <input id="work_years" type="text" class="mui-input-clear" v-model="expertItem.work_years" placeholder="必填">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">行业领域</label>
            <input id="industry_tags" type="text" class="mui-input-clear" v-model="expertItem.industry_tags" placeholder="必填">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">联系电话</label>
            <input id="mobile" type="text" class="mui-input-clear" v-model="expertItem.mobile" placeholder="必填">
          </div>
        </li>

        <li class="mui-table-view-cell">

        </li>
      </ul>
      <div class="account_item_title">
        在这里补充推荐专家信息：
      </div>
      <div class="textarea-wrapper">
        <textarea id="description" v-model.trim="expertItem.description" rows="5" class="mui-input-clear" placeholder="描述"></textarea>
        <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
      </div>
      <div class="account_item_title">
        上传专家名片：
      </div>
      <div id='image-list' class="row image-list"></div>
      <div class="button-wrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary">提交</button>
      </div>
    </div>

  </div>
</template>
<script>
  import {createAPI, apiRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';

  export  default {
    data: () => ({
      descMaxLength: 2000,
      expertItem: {
        name: '',
        gender: '',
        work_years: '',
        mobile: '',
        industry_tags: '',
        description: '',
        head_img: ''
      }
    }),
    created () {

    },
    computed: {
      descLength() {
        if(this.expertItem.description)
          return this.expertItem.description.length;
        else return 0;
      }
    },
    methods: {

    },
    mounted(){

    }
  }

</script>

<style scoped>

  .mui-table-view {
    margin-top: 15px;
  }

  .mui-table-view-cell{
    padding:0;
  }

  .expert-setting-field {
    position: absolute;
    text-align: right;
    font-size: 12px;
    width: 200px;
    right: 40px;
    color: #3f51b5;
  }

  .mui-table-view-cell .mui-navigate
  {
    color: #999;
  }

  .account_item_title {
    padding: 5px;
    color: #a6a6a6;
    font-size: 12px;
  }
  .textarea-wrapper {
    padding:2px;
    height:100%;
    position: relative;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 4px;
    font-size:12px;
    bottom: 10px;
    color: #b0b0b0;
  }

  .textarea-wrapper textarea {
    border-radius: 5px;
    margin:0;
  }

  .image-list {
    width: 100%;
    height: 85px;
    background-size: cover;
    padding: 10px 10px;
    overflow: hidden;
  }
  .image-item {
    width: 65px;
    height: 65px;
    /*background-image: url(../images/iconfont-tianjia.png);*/
    background-size: 100% 100%;
    display: inline-block;
    position: relative;
    border-radius: 5px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: solid 1px #e8e8e8;
    vertical-align: top;
  }
  .image-item .file {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 0;
  }
  .image-item.space {
    border: none;
  }
  .image-item .image-close {
    position: absolute;
    display: inline-block;
    right: -6px;
    top: -6px;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    border-radius: 12px;
    background-color: #FF5053;
    color: #f3f3f3;
    border: solid 1px #FF5053;
    font-size: 9px;
    font-weight: 200;
    z-index: 1;
  }
  .image-item .image-up{
    height: 65px;
    width: 65px;
    border-radius: 10px;
    line-height: 65px;
    border: 1px solid #ccc;
    color: #ccc;
    display: inline-block;
    text-align: center;
  }
  .image-item .image-up:after{
    font-family: "微软雅黑";
    content: '+';
    font-size: 60px;
  }
  .button-wrapper{
    padding:0 50px;
  }
</style>
