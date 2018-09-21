<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
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

        <div class="component-group" v-for="(item, index) in list" :key="index" @tap.stop.prevent="selectItem(item)">
          <div class="groupLogo">
            <img class="lazyImg" v-lazy="item.logo" />
          </div>
          <div class="groupContent">
            <div class="groupName">
              <div class="font-family-medium groupOwnerWrapper">
                <span class="text-line-1">{{item.name}}</span><span class="border-football" v-if="item.is_joined === 3">圈主</span>
              </div>
            </div>
            <span class="groupDescribe text-line-1">{{item.description}}</span>
            <span class="groupText">{{item.subscribers}}人气</span>
            <span class="groupText">{{item.articles}}分享</span>
            <span class="groupText" v-if="!item.public">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-simi"></use>
              </svg>
              私密
            </span>
          </div>
          <i class="bot"></i>
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
