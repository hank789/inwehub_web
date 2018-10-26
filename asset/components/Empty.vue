<template>
  <div class="emptyWrapper">
    <div class="emptyWrapper-IconImg" v-if="defaultShow">
      <img src="../statics/images/commentwait@3x.png" alt="">
    </div>
    <div class="emptyWrapper-IconImg" v-if="emptyAnswerShow">
      <img src="../statics/images/commentwait@3x.png" alt="">
    </div>
    <div class="AnswerClose-IconImg" v-if="answerCloseShow">
      <img src="../statics/images/empty@3x.png" alt="">
    </div>
    <div class="description">{{description}}</div>

    <slot name="emptyBottom"></slot>

    <div class="buttonWrapper" v-if="description === '暂无您关注的用户的动态'">
      <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="$router.pushPlus('/userGuide/stepone?from=feed')">去关注</button>
    </div>
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
      },
      emptyAnswerShow: {
        type: Boolean,
        default: false
      },
      answerCloseShow: {
        type: Boolean,
        default: false
      },
      defaultShow: {
        type: Boolean,
        default: true
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
    .emptyWrapper-IconImg {
      width: 1.866rem;
      height: 2.373rem;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .AnswerClose-IconImg {
      width: 1.626rem;
      height: 2.373rem;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
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

</style>
