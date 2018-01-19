<template>
  <div class="emptyWrapper">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-zanwushuju"></use>
    </svg>
    <div class="description">{{description}}</div>

    <div class="buttonWrapper" v-if="description === '暂无您关注的内容'">
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
      }
    }
  }
</script>

<style lang="less" scoped>
  .emptyWrapper {
    padding: 30px 0;
    font-size: 50px;
    text-align: center;
    color: #dcdcdc;

    .description {
      margin-top: 5px;
      font-size: 12px;
      color: #c8c8c8;
    }
  }

  .buttonWrapper{
    text-align: center;
    margin-top:20px;
  }

  .mui-btn{
    display: inline-block;
    padding:10px 32px;
    font-size:16px;
    width:auto;
    border-radius: 50px;
  }
</style>
