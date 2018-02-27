<template>
  <div>
    <transition :name="transitionName" mode="in-out">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        transitionName: 'my-slide-left'
      }
    },
    beforeRouteUpdate (to, from, next) {
      let isBack = this.$router.isBack
      if (isBack) {
        this.transitionName = 'my-slide-right'
      } else {
        this.transitionName = 'my-slide-left'
      }
      this.$router.isBack = false
      next()
    }
  }
</script>

<style scoped>
  .child-view {
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    width:100%;
    transition: all .2s cubic-bezier(.55,0,.1,1);
  }
  .my-slide-left-enter, .my-slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(0, 1.333rem);
    transform: translate(0, 1.333rem);
  }
  .my-slide-left-leave-active, .my-slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(0, -1.333rem);
    transform: translate(0, -1.333rem);
  }
</style>
