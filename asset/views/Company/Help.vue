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
    height:12.9rem;
    text-align: center;
  }

  .basic h5{
    font-size:2rem;
    color:#444;
    margin-bottom: 0.3rem;
  }

  .basic .info{
    position: absolute;
    left:50%;
    margin-left:-5rem;
    top:4.3rem;
    color:#808080;
    font-size:1.3rem;
  }

  .basic a{
    position: absolute;
    color:#444444;
    font-size:3rem;
    top:1.6rem;
    left:0.7rem;
  }

  .mixed .item div{
    display: inline-block;
    vertical-align: top;
  }

  .mixed .item h5{
    font-size:1.7rem;
    color:#444;
    margin-bottom: 0.3rem;
  }

  .mixed .item .text{
    font-size:1.3rem;
    color:#808080;
  }


  .mixed .item-1 .iconWrapper{
    margin:3rem 0.6rem 3rem 4rem;
    padding:3rem;
    width:8rem;
    height: 8.9rem;
    background: url(../../statics/images/illustration3@2x.png) no-repeat;
    background-size: contain;
  }

  .mixed .item-2 .iconWrapper{
    margin-top:1.9rem;
    margin-right:4.2rem;
    padding:3rem;
    width:8rem;
    height: 8.9rem;
    background: url(../../statics/images/illustration2@2x.png) no-repeat;
    background-size: contain;
  }

  .mixed .item-3 .iconWrapper{
    margin:2.9rem 0.7rem 3rem 4rem;
    padding:3rem;
    width:8rem;
    height: 8.9rem;
    background: url(../../statics/images/illustration@2x.png) no-repeat;
    background-size: contain;
  }

  .mixed .item-1 .text{
    margin-top:6.5rem;
  }

  .mixed .item-2 .text{
    margin-top:3.8rem;
    margin-right: 1rem;
  }

  .mixed .item-3 .text{
    margin-top:7rem;
  }

  .mixed .item-2{
    text-align: right;
  }

  .buttonWrapper{
    margin-top:2rem;
    padding:0 1.6rem 1rem;
    background: #fff;
  }

  .buttonWrapper button{
    margin-top:1rem;
    border-radius: 0.5rem;
    background: #03aef9;
    border:0.1rem solid #03aef9;
  }
</style>
