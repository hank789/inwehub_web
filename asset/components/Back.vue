<template>
  <div class="backWrapper" @tap="back">
    <svg class="icon" aria-hidden="true" v-if="!text">
      <use xlink:href="#icon-fanhui"></use>
    </svg>
    <template v-else><a>{{text}}</a></template>
  </div>
</template>

<script type="text/javascript">
  export default {
    methods: {
      back () {
        if (this.tapCallback) {
          this.tapCallback()
        } else {
          window.mui.back()
        }
      }
    },
    props: {
      tapCallback: {
        type: Function,
        default: null
      },
      text: {
        type: String,
        default: ''
      }
    }
  }
</script>


<style scoped="scoped" lang="less" rel="stylesheet/less">
  .backWrapper{
    display: inline-block;
    padding-right:10px;
  }
.mui-bar-nav {
  /*background: #d9dadc;*/
  .icon {
    color: #3C3E44;
    font-size: 0.613rem;
    margin-top: 0.293rem;
  }
}
</style>
