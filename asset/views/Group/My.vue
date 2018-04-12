<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的圈子</h1>
    </header>
    <div class="mui-content">

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'group/mine'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :pageMode = true
        class="listWrapper"
      >
        <template v-for="(item, index) in list">
          <div class="group-container" @tap.stop.prevent="selectItem(item)">
            <groupsList class="big" :list="item">
              <i class="bot"></i>
            </groupsList>
          </div>
        </template>
        <div class="more" @tap.stop.prevent="$router.push('/groups')">加入更多圈子</div>
      </RefreshList>
  </div>
  </div>
</template>
<script>
  import groupsList from '../../components/groups/GroupsList.vue'
  import RefreshList from '../../components/refresh/List.vue'
  import localEvent from '../../stores/localStorage'

  export default {
    data () {
      return {
        from: null,
        list: []
      }
    },
    components: {
      RefreshList,
      groupsList
    },
    props: {},
    methods: {
      selectItem (item) {
        if (!this.from) {
          return
        }
        localEvent.setLocalItem('selectedGroup', item)
        window.mui.back()
      },
      refreshPageData () {
        this.from = this.$route.query.from
      }
    },
    created () {
      this.refreshPageData()
    },
    watch: {
      '$route': 'refreshPageData'
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
  .more{
    width:100%;
    text-align: center;
    font-size: 14px;
    color: #03AEF9;
    margin-top: 11px;
  }
</style>
