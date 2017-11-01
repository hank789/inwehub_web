<template>
  <div class="emptyWrapper">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-zanwushuju"></use>
    </svg>
    <div class="description">{{description}}</div>
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
</style>
