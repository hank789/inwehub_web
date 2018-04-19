<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">圈子</h1>
    </header>

    <div class="mui-content">
      <div class="new-groups" @tap.stop.prevent="$router.pushPlus('/group/add')">
        <p>创建新的圈子</p>
      </div>
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'group/recommend'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :pageMode = true
        class="listWrapper"
      >
        <!--我的圈子-->
        <!--swiper滑动-->
        <groups
          :groupsList="groupsList"
          :loading="loading"
          :apper="apper"
          :title = "'我的'"
        ></groups>
        <!--全部圈子 .groupsList-->
        <div class="group-title font-family-medium">全部</div>


        <template v-for="(item, index) in list">
          <div class="group-container" @tap.stop.prevent="$router.pushPlus('/group/detail/' + item.id)">
            <groupsList class="big"
                        :list="item"
                        @goJoin="goJoin"
                        :description = "'已加入'">
              <i class="bot"></i>
            </groupsList>
          </div>

        </template>
      </RefreshList>

    </div>
  </div>
</template>
<script>

  import RefreshList from '../../components/refresh/List.vue'
  import groups from '../../components/groups/RecommendGroups.vue'
  import groupsList from '../../components/groups/GroupsList.vue'
  import { postRequest } from '../../utils/request'

  export default {
    data () {
      return {
        list: [],
        loading: 1,
        groupsList: [],
        apper: 0
      }
    },
    components: {
      RefreshList,
      groups,
      groupsList
    },
    props: {},
    watch: {},
    methods: {
      refreshPageData () {
        this.getGroups()
      },
      getGroups () {
        postRequest(`group/mine`, {
          page: 1
        }).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data.data) {
            this.groupsList = response.data.data.data
            this.apper = this.groupsList.length
            setTimeout(() => {
              this.loading = 0
            }, 300)
          }
        })
      },
      goJoin (id) {
        postRequest(`group/join`, {id: id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          window.mui.toast(response.data.message)
          // 请求成功后跳转详情页面
          this.$router.pushPlus('/group/detail/' + id)
        })
      }
    },
    mounted () {
      this.getGroups()
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
    right:0;
    bottom: 0;
    left:0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
 .new-groups{
   width:92%;
   margin-left: 4%;
   height:0.906rem;
   background:#cccccc;
   font-size: 0.373rem;
   color:rgba(68,68,68,1);
   line-height:0.906rem;
   padding: 0 0.4rem;
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   align-items: center;
   background: url("../../statics/images/my-groups@3x.png");
   background-size: 100% 100%;
   position: absolute;
   top:0;
  }
  .group-title{
    font-size: 0.426rem;
    color: #444444;
    padding-top: 12px;
    padding-left:4%;
  }
 .group-container{
   width:92%;
   margin-left: 4%;
   overflow: hidden;
 }
  .listWrapper{
    top:0.933rem;
  }
</style>

