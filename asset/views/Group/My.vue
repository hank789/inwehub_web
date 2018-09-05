<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-if="uuid === this.$route.params.uuid">我的圈子</h1>
      <h1 class="mui-title" v-else>Ta的圈子</h1>
    </header>
    <div class="mui-content">

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'group/mine'"
        :prevOtherData="{uuid: this.$route.params.uuid}"
        :nextOtherData="{uuid: this.$route.params.uuid}"
        :pageMode = true
        class="listWrapper"
      >
        <template v-for="(item, index) in list" v-if="list.length">
          <div class="group-container" @tap.stop.prevent="selectItem(item)" v-if="isShowItem(item)">
            <groupsList class="big" :list="item" :tapNothing="true">
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
  import { getLocalUserInfo, getLocalUuid } from '../../utils/user'
  const currentUser = getLocalUserInfo()

  export default {
    data () {
      return {
        id: currentUser.user_id,
        from: null,
        list: [],
        uuid: getLocalUuid()
      }
    },
    components: {
      RefreshList,
      groupsList
    },
    props: {},
    methods: {
      isShowItem (item) {
        if (!this.from) {
          return true
        } else {
          if (item.audit_status === 1) {
            return true
          }
          return false
        }
      },
      selectItem (item) {
        if (!this.from) {
          item.unread_count = 0
          this.$router.pushPlus('/group/detail/' + item.id)
          return
        }
        localEvent.setLocalItem('selectedGroup' + this.id, item)
        window.mui.back()
      },
      refreshPageData () {
        this.from = this.$route.query.from
        this.uuid = getLocalUuid()
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
    font-size: 0.373rem;
    color: #03AEF9;
    margin-top: 0.293rem;
  }
  .question_ask{
    width:3.066rem;
    height:1.093rem;
    background: #03AEF9;
    border-radius: 1.333rem;
    text-align: center;
    line-height: 1.093rem;
    font-size: 0.426rem;
    color: #FFFFFF;
    margin: auto;
    margin-top: 0.453rem;
  }
</style>
