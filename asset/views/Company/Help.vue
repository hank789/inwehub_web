<template>
<div>
  <div class="mui-content">

    <div class="basic">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <div class="info">
        <h5>开通企业版</h5>
        发布项目
    </div>
    </div>
    <div class="mixed">
      <div class="item item-1">
        <div class="iconWrapper">
        </div>
        <div class="text">
          <h5>资源深度对接</h5>
          平台汇聚行业优质资源
      </div>
      </div>
      <div class="item item-2">
        <div class="text">
          <h5>专属企业服务</h5>
          便捷服务为你省心
      </div>
        <div class="iconWrapper">
        </div>
      </div>
      <div class="item item-3">
        <div class="iconWrapper">
        </div>
        <div class="text">
          <h5>高效智能协同</h5>
          高效协作智能管理高质交付
      </div>
      </div>
    </div>

    <div class="buttonWrapper">
      <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="$router.replace('/company/submit')">立刻申请</button>
    </div>

  </div>

</div>
</template>

<script>

  export default {
    data () {
      return {
        loading: 1
      }
    },
    computed: {

    },
    methods: {

    },
    mounted () {

    },
    created () {

    }
  }
</script>

<style scoped="scoped">
  .mui-content{
    background: #fff;
    position: absolute;
    width:100%;
    top:0;
    left:0;
    bottom:0;
  }

  .basic{
    position: relative;
    background: #ececee;

    width:100%;
    height:129px;
    text-align: center;
  }

  .basic h5{
    font-size:20px;
    color:#444;
    margin-bottom: 3px;
  }

  .basic .info{
    position: absolute;
    left:50%;
    margin-left:-50px;
    top:43px;
    color:#808080;
    font-size:13px;
  }

  .basic a{
    position: absolute;
    color:#444444;
    font-size:30px;
    top:16px;
    left:7px;
  }

  .mixed .item div{
    display: inline-block;
    vertical-align: top;
  }

  .mixed .item h5{
    font-size:17px;
    color:#444;
    margin-bottom: 3px;
  }

  .mixed .item .text{
    font-size:13px;
    color:#808080;
  }


  .mixed .item-1 .iconWrapper{
    margin:30px 6px 30px 40px;
    padding:30px;
    width:80px;
    height: 89px;
    background: url(../../statics/images/illustration3@2x.png) no-repeat;
    background-size: contain;
  }

  .mixed .item-2 .iconWrapper{
    margin-top:19px;
    margin-right:42px;
    padding:30px;
    width:80px;
    height: 89px;
    background: url(../../statics/images/illustration2@2x.png) no-repeat;
    background-size: contain;
  }

  .mixed .item-3 .iconWrapper{
    margin:29px 7px 30px 40px;
    padding:30px;
    width:80px;
    height: 89px;
    background: url(../../statics/images/illustration@2x.png) no-repeat;
    background-size: contain;
  }

  .mixed .item-1 .text{
    margin-top:65px;
  }

  .mixed .item-2 .text{
    margin-top:38px;
    margin-right: 10px;
  }

  .mixed .item-3 .text{
    margin-top:70px;
  }

  .mixed .item-2{
    text-align: right;
  }

  .buttonWrapper{
    margin-top:20px;
    padding:0 16px 10px;
    background: #fff;
  }

  .buttonWrapper button{
    margin-top:10px;
    border-radius: 5px;
    background: #03aef9;
    border:1px solid #03aef9;
  }
</style>
