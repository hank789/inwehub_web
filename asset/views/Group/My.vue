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

      <div slot="emptyBottom">
        <div class="question_ask" @tap.stop.prevent="$router.pushPlus('/groups')">加入圈子</div>
      </div>

      </RefreshList>
  </div>
  </div>
</template>
<script>
  import groupsList from '../../components/groups/GroupsList.vue'
  import RefreshList from '../../components/refresh/List.vue'
  import localEvent from '../../stores/localStorage'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()

  export default {
    data () {
      return {
        id: currentUser.user_id,
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
        localEvent.setLocalItem('selectedGroup' + this.id, item)
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
  .question_ask{
    width:115px;
    height:41px;
    background: #03AEF9;
    border-radius: 50px;
    text-align: center;
    line-height: 41px;
    font-size: 16px;
    color: #FFFFFF;
    margin: auto;
    margin-top: 17px;
  }
</style>
