<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">圈子</h1>
    </header>

    <div class="mui-content">
      <div class="new-groups">
          <p>创建新的圈子</p>
      </div>
      <!--我的圈子-->
      <groups></groups>
      <!--推荐的圈子-->
      <groups></groups>
      <!--全部圈子-->
      <div class="group">

      </div>
    </div>
  </div>
</template>
<script>
  import RefreshList from '../../components/refresh/List.vue'
  import groups from '../../components/groups/RecommendGroups.vue'
  export default {
    data () {
      return {}
    },
    components: {
      RefreshList,
      groups
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
 .new-groups{
   width:92%;
   margin-left: 4%;
   height:34px;
   background:#cccccc;
   font-size: 14px;
   color:rgba(68,68,68,1);
   line-height:34px;
   padding: 0 15px;
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   align-items: center;
   background: url("../../statics/images/my-groups@3x.png");
   background-size: 100% 100%;
   position: absolute;
   top:0;
  }
</style>

