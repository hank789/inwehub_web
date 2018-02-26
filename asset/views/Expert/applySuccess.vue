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


      <h5 v-if="!type">专家认证申请成功!</h5>
      <h5 v-if="type">专家认证申请正在审核</h5>
      <div class="h5e" v-if="type">请耐心等待</div>
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

  export default {
    data () {
      return {
        loading: 1,
        type: null
      }
    },
    computed: {},
    methods: {},
    mounted () {

    },
    created () {
      this.type = this.$route.query.type
    }
  }
</script>

<style scoped="scoped">
  .mui-content {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    background: #ececee;
    text-align: center;
  }

  .mui-content h5 {
    margin-top: 5rem;
    font-size: 2rem;
    color: #323232;
  }

  .mui-content .h5e {
    margin-top: 0.7rem;
    font-size: 2rem;
    color: #808080;
    font-weight: normal;
  }

  .mui-content .tip {
    margin: 1.7rem 0 1.5rem;
    color: #808080;
    font-size: 1.4rem;
  }

  .basic {
    position: relative;
    width: 100%;
    height: 12.9rem;
    text-align: center;
  }

  .basic a {
    position: absolute;
    color: #b4b4b6;
    font-size: 3rem;
    top: 1.7rem;
    left: 0.6rem;
  }

  .iconWrapper {
    text-align: center;
    padding-top: 1.3rem;
  }

  .iconWrapper .icon {
    font-size: 12.4rem;
    color: #dcdcdc;
  }

  .flowWrapper {
    text-align: center;
  }

  .flow {
    display: inline-block;
    height: 2.1rem;
    background: url("../../statics/images/flow@2x.png") no-repeat;
    background-size: cover;
    width: 31.2rem;
  }

  .flowWrapper .fText {
    position: relative;
    display: inline-block;
    width: 31.2rem;
    font-size: 1.2rem;
    color: #808080;
    height: 2.2rem;
    top: -0.4rem;

  }

  .fText .f1 {
    position: absolute;
    left: 0;
  }

  .fText .f2 {
    position: absolute;
    left: 7.1rem;
  }

  .fText .f3 {
    position: absolute;
    right: 7.2rem;
  }

  .fText .f4 {
    position: absolute;
    right: 0;
  }

  .cover {
    bottom: 0rem !important;
  }
</style>
