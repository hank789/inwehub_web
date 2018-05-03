<template>
  <div class="search mui-bar-nav">
    <div class="search-l" @tap.stop.prevent="$router.pushPlus('/chat/' + contact_id)">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-kefu"></use>
      </svg>
      <span>客服</span>
      <i v-if="unread_count"></i>
    </div>
    <div class="search-r" @tap.stop.prevent="$router.pushPlus('/searchQuestion','list-detail-page-three')">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-sousuo"></use>
      </svg>
      <span>搜内容、问答、圈子</span>
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
      unread_count: {
        type: Number,
        default: 0
      },
      contact_id: {
        default: 0
      }
    }
  }
</script>

<style scoped>
  .search{
    width: 100%;
    height: 1.386rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    z-index: 2;
    background: #ffffff;
    padding: 0 0.426rem;
  }
  .search-l{
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .search-l svg{
    font-size:0.666rem;
    color: rgba(200,200,200,1);
  }
  .search-l span{
    font-size:0.266rem;
    color: rgba(128,128,128,1);
    line-height: 0.373rem;
    margin-bottom: 0.133rem;
  }
  .search-l i{
    width:0.213rem;
    height:0.213rem;
    background: #FA4975;
    border-radius: 50%;
    position: absolute;
    top: 0.16rem;
    right: -0.266rem;
  }

  .search-r{
    width: 77%;
    height: 0.906rem;
    background:rgba(243,244,246,1);
    opacity:0.9477;
    border-radius: 1.333rem;
    font-size: 0.373rem;
    color:rgba(128,128,128,1);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .search-r svg{
    font-size: 0.453rem;
    color: rgba(68,68,68,1);
    margin-left: 0.426rem;
    margin-right: 0.16rem;
  }
</style>
