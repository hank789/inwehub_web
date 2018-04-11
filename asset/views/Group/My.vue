<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的圈子</h1>
    </header>
    <div class="mui-content">
    <div class="group-container" >
      <groupsList class="big">
        <i class="bot"></i>
      </groupsList>
    </div>
  </div>
  </div>
</template>
<script>
  import groupsList from '../../components/groups/GroupsList.vue'
  export default {
    data () {
      return {}
    },
    components: {
      groupsList
    },
    props: {},
    watch: {},
    methods: {

    },
    mounted () {
    },
    updated () {}
  }
</script>
<style scoped>
  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }
  .mui-content{
    background: #ffffff;
  }
  .bot {
    position: absolute;
    right:0;
    bottom: 0;
    left:0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .group-container{
    width:92%;
    margin-left: 4%;
    overflow: hidden;
  }
</style>
