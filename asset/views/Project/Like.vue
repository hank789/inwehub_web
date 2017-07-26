<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">偏好设置</h1>
    </header>

    <div class="mui-content">
      <div class="schedule schedule-4"></div>
      <div class="basic">
        <div class="title">马上就可以发布了</div>
        <div class="titleSub">还有什么要交代的</div>

      </div>

      <ul class="mui-table-view companyForm">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <div class="fileSelect">资质要求<span class="option">（选填）</span>
              <svg class="icon" aria-hidden="true" @tap.stop.prevent="inputQualification()">
                <use xlink:href="#icon-plus"></use>
              </svg>
            </div>
            <div class="fileList">
              <div class="item" v-for="(item, index) in qualification_requirements"><svg class="icon" aria-hidden="true" @tap.stop.prevent="closeQualification(index)">
                <use xlink:href="#icon-times"></use>
              </svg>{{item}}</div>

            </div>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <div class="fileSelect">其他条件<span class="option">（选填）</span>
              <svg class="icon" aria-hidden="true" @tap.stop.prevent="inputOther()">
                <use xlink:href="#icon-plus"></use>
              </svg>
            </div>
            <div class="fileList">
              <div class="item" v-for="(item, index) in other_requirements"><svg class="icon" aria-hidden="true" @tap.stop.prevent="closeOtherRequirements(index)">
                <use xlink:href="#icon-times"></use>
              </svg>{{ item }}</div>

            </div>

          </div>
        </li>

        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">是否需要查看顾问简历</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio2" type="radio" value="1" v-model="is_view_resume">
                    是
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio2" type="radio" value="0" v-model="is_view_resume">
                    否
                </span>
            </div>

          </div>
        </li>

        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">是否需要顾问投递申请</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio3" type="radio" value="1" v-model="is_apply_request">
                    是
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio3" type="radio" value="0" v-model="is_apply_request">
                    否
                </span>
            </div>

          </div>
        </li>
      </ul>



      <div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block preview" @tap.stop.prevent="submit(true)"><svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gongkai"></use>
        </svg><span>预览</span></button>
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit()">完成</button>
      </div>
    </div>

  </div>
</template>

<script>
  import {apiRequest, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';
  import {setCacheInfo, getCacheInfo, clearCacheIno} from '../../utils/project';

  export default {
    data(){

      var cacheData = getCacheInfo();
      if (cacheData && cacheData.like) {
        return cacheData.like;
      }

      return {
        qualification_requirements:[],
        other_requirements:[],
        is_view_resume:0,
        is_apply_request:0,
        loading: 1
      }
    },
    computed: {
      nothing () {
        return false;
      },
    },
    methods: {
      closeQualification(index) {
        this.qualification_requirements.splice(index, 1);
      },
      closeOtherRequirements(index) {
        this.other_requirements.splice(index, 1);
      },
      inputQualification(){
        mui.prompt('输入资质要求', '', ' ', ['确定','取消'], (e) => {
          if (e.index === 0) {
            if (e.value) {
              this.qualification_requirements.push(e.value);
            }
          }
        }, 'div');
      },
      inputOther(){
        mui.prompt('输入其他条件', '', ' ', ['确定','取消'], (e) => {
          if (e.index === 0) {
              if (e.value) {
                this.other_requirements.push(e.value);
              }
          }
        }, 'div');
      },
      submit(isReview = false){
        var data = {
          project_id:this.project_id,
          qualification_requirements:this.qualification_requirements,
          other_requirements:this.other_requirements,
          is_view_resume:this.is_view_resume,
          is_apply_request:this.is_apply_request,
        };
        postRequest(`project/step_four`, data).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }



          if (isReview) {
            setCacheInfo('like', this.$data);
            this.$router.push('/project/review?id='+this.project_id);
          } else {
            clearCacheIno();
            mui.alert('发布完成!');
          }
        });
      }

    },
    mounted(){

    },

    created(){
      this.project_id = this.$route.query.id;
      if (!this.project_id) {
        mui.back();
      }
    }
  };
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .mui-content{
    position: fixed;
    height:100%;
    width:100%;
    background: #fff;
  }
  .schedule-4{
    margin-left:75%;
  }

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

  .fileSelect{
    font-size:14px;
    color:#808080;
    background: #fff;
    padding:11px 0;
    position: relative;
  }
  .fileSelect .icon{
    position: absolute;
    right:1px;
    color: #03aef9;
    top:9px;
    font-size:22px;
  }
  .fileSelect .option{
    color:#c8c8c8;
  }

  .fileList{
    padding:0 15px 0 0;
    background: #fff;
    font-size:14px;
  }
  .fileList .item{
    position: relative;
    line-height: 22px;
    padding:1px 0 10px 25px;
    color:#808080;
  }
  .fileList .icon{
    position: absolute;
    left:0;
    top:4px;
    font-size:16px;
    color:#c8c8c8;
  }

  .buttonWrapper{
    padding:14px 16px 30px;
    background: #fff;
    text-align: right;
  }

  .buttonWrapper button{
    position: relative;
    display: inline-block;
    width:115px;
    margin-top:10px;
    background: #03aef9;
    border:1px solid #03aef9;
  }



  .buttonWrapper button .icon{
    color:#03aef9;
    font-size:26px;
    position: absolute;
    top:6px;
    left:21px;
    margin-right:5px;
    vertical-align: top;
  }



  .buttonWrapper button.preview{
    background: #ececee;
    border:1px solid #ececee;
    color:#03aef9;
    opacity:1;
    float:left;
  }

  .buttonWrapper button.preview span{
    margin-left:24px;
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
</style>
