<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">圈子</h1>
    </header>
    <div class="mui-content">
      <!--圈子详情-->
      <GroupsInfo></GroupsInfo>
      <div class="gray"></div>

    </div>
  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  import GroupsInfo from '../../components/groups/GroupsInfo.vue'
  export default {
    data () {
      return {}
    },
    components: {
      RefreshList,
      GroupsInfo
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

<style scoped="scoped">
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
    right:5%;
    bottom: 0;
    left:5%;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .gray{
    width:100%;
    height:10px;
    background: #f3f4f6;
  }

</style>
