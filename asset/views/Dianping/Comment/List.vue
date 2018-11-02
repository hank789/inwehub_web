<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">点评(23)</h1>
    </header>
    <div class="mui-content">
      <feedDianping :isDianping="true" :isFollow="false"></feedDianping>
    </div>
  </div>
</template>

<script>
  import feedDianping from '../../../components/Feed.vue'

  export default {
    data () {
      return {
      }
    },
    components: {
      feedDianping
    },
    mounted () {
    },
    updated () {
      this.$nextTick(() => {
      })
    },
    methods: {
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;
  }

  .mui-android .commentList .commentUser .userInfo .userName span:nth-of-type(2) {
    line-height: 18px;
  }
</style>
