<template>
  <div class="emptyWrapper">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-zanwushuju"></use>
    </svg>
    <div class="description">{{description}}</div>

    <slot name="emptyBotttom"></slot>

    <div class="buttonWrapper" v-if="description === '暂无您关注的用户的动态'">
      <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="$router.pushPlus('/userGuide/stepone?from=feed')">去关注</button>
    </div>
    <div class="question_ask" @tap.stop.prevent="$router.pushPlus('/ask')">提问</div>
  </div>
</template>

<script type="text/javascript">

  export default {
    data () {
      return {}
    },
    components: {},
    props: {
      description: {
        type: String,
        default: '暂时还没有数据呀～'
      }
    }
  }
</script>

<style lang="less" scoped>
  .emptyWrapper {
    padding: 0.8rem 0;
    font-size: 1.333rem;
    text-align: center;
    color: #dcdcdc;

    .description {
      margin-top: 0.133rem;
      font-size: 0.32rem;
      color: #c8c8c8;
    }
  }

  .buttonWrapper{
    text-align: center;
    margin-top:0.533rem;
  }

  .mui-btn{
    display: inline-block;
    padding:0.266rem 0.853rem;
    font-size:0.426rem;
    width:auto;
    border-radius: 1.333rem;
  }
  .question_ask{
    width: 115px;
    height: 41px;
    background: #03AEF9;
    border-radius: 50px;
    font-size: 16px;
    color: #ffffff;
    text-align: center;
    line-height: 41px;
    margin: 0 auto;
    margin-top: 6px;
    /*position: absolute;*/
    /*top: 165px;*/
    /*left: 0;*/
    /*right: 0;*/
    /*margin: auto;*/
  }
</style>
