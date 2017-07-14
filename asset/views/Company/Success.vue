<template>
<div>

  <div class="mui-content">
    <div class="basic">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </div>

    <div class="iconWrapper">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-check-circle-o" v-if="!type"></use>
        <use xlink:href="#icon-zhongbiao" v-else></use>
      </svg>
    </div>

    <h5>企业账户申请正在审核</h5>
    <div class="h5e">请耐心等待</div>
    <div class="tip">认证流程</div>
    <div class="flowWrapper">
      <div class="flow"></div>

    </div>
    <div class="flowWrapper">
      <div class="fText">
        <span class="f1">提交申请</span>
        <span class="f2">等待审核</span>
        <span class="f3">通过/未通过</span>
        <span class="f4">申请成功</span>
      </div>
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
        loading: 1,
        type:null,
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

      this.type = this.$route.query.type;
    }
  };
</script>

<style scoped="scoped">
  .mui-content{
    position: absolute;
    width:100%;
    top:0;
    left:0;
    bottom:0;
    background: #ececee;
    text-align: center;
  }
  .mui-content h5{
    margin-top:50px;
    font-size:20px;
    color:#323232;
  }
  .mui-content .h5e{
    margin-top:7px;
    font-size:20px;
    color:#808080;
    font-weight: normal;
  }

  .mui-content .tip{
    margin:17px 0 15px;
    color:#808080;
    font-size:14px;
  }
  .basic{
    position: relative;
    width:100%;
    height:129px;
    text-align: center;
  }

  .basic a{
    position: absolute;
    color:#b4b4b6;
    font-size:30px;
    top:17px;
    left:6px;
  }

  .iconWrapper{
    text-align: center;
    padding-top:13px;
  }
  .iconWrapper .icon{
    font-size:124px;
    color:#dcdcdc;
  }

  .flowWrapper{
    text-align: center;
  }
  .flow{
    display: inline-block;
    height:21px;
    background: url("../../statics/images/flow@2x.png") no-repeat;
    background-size:cover;
    width:312px;
  }
  .flowWrapper .fText{
    position: relative;
    display: inline-block;
    width:312px;
    font-size:12px;
    color:#808080;
    height:22px;
    top:-4px;

  }
  .fText .f1{
    position: absolute;
    left:0;
  }
  .fText .f2{
    position: absolute;
    left:71px;
  }
  .fText .f3{
    position: absolute;
    right:72px;
  }
  .fText .f4{
    position: absolute;
    right:0;
  }

  .cover{
    bottom:0px !important;
  }
</style>
