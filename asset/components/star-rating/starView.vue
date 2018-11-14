<template>
  <div class="starViewWrapper">
    <div class="upStar" :style="'width:' + ratePercentage + '%'">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-xingxingyidian"></use>
      </svg>
    </div>
    <div class="downStar">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-xingxingweidian"></use>
      </svg>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    props: {
      rating: {
        type: Number,
        default: 0
      }
    },
    computed: {
      ratePercentage () {
        return this.rating / 5 * 100
      }
    }
  }
</script>

<style scoped="scoped" lang="less">
  .starViewWrapper{
    position: relative;
    width:2.026rem;
    height:0.56rem;
  }
  .starViewWrapper .icon{
    font-size: 2.026rem;
  }
  .upStar{
    position: absolute;
    color: #fcc816;
    top:-0.72rem;
    overflow: hidden;
  }
  .downStar{
    position: absolute;
    color: #fcc816;
    top:-0.72rem;
    overflow: hidden;
  }
</style>
