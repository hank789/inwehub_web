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
  }

  .basic{
    position: relative;
    background: #ececee;

    width:100%;
    height:3.44rem;
    text-align: center;
  }

  .basic h5{
    font-size:0.533rem;
    color:#444;
    margin-bottom: 0.08rem;
  }

  .basic .info{
    position: absolute;
    left:50%;
    margin-left:-1.333rem;
    top:1.146rem;
    color:#808080;
    font-size:0.346rem;
  }

  .basic a{
    position: absolute;
    color:#444444;
    font-size:0.8rem;
    top:0.426rem;
    left:0.186rem;
  }

  .mixed .item div{
    display: inline-block;
    vertical-align: top;
  }

  .mixed .item h5{
    font-size:0.453rem;
    color:#444;
    margin-bottom: 0.08rem;
  }

  .mixed .item .text{
    font-size:0.346rem;
    color:#808080;
  }


  .mixed .item-1 .iconWrapper{
    margin:0.8rem 0.16rem 0.8rem 1.066rem;
    padding:0.8rem;
    width:2.133rem;
    height: 2.373rem;
    background: url(../../statics/images/illustration3@2x.png) no-repeat;
    background-size: contain;
  }

  .mixed .item-2 .iconWrapper{
    margin-top:0.506rem;
    margin-right:1.12rem;
    padding:0.8rem;
    width:2.133rem;
    height: 2.373rem;
    background: url(../../statics/images/illustration2@2x.png) no-repeat;
    background-size: contain;
  }

  .mixed .item-3 .iconWrapper{
    margin:0.773rem 0.186rem 0.8rem 1.066rem;
    padding:0.8rem;
    width:2.133rem;
    height: 2.373rem;
    background: url(../../statics/images/illustration@2x.png) no-repeat;
    background-size: contain;
  }

  .mixed .item-1 .text{
    margin-top:1.733rem;
  }

  .mixed .item-2 .text{
    margin-top:1.013rem;
    margin-right: 0.266rem;
  }

  .mixed .item-3 .text{
    margin-top:1.866rem;
  }

  .mixed .item-2{
    text-align: right;
  }

  .buttonWrapper{
    margin-top:0.533rem;
    padding:0 0.426rem 0.266rem;
    background: #fff;
  }

  .buttonWrapper button{
    margin-top:0.266rem;
    border-radius: 0.133rem;
    background: #03aef9;
    border:0.026rem solid #03aef9;
  }
</style>
