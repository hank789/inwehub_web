<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">圈子</h1>
    </header>
    <div class="mui-content" v-if="!loading">
      <!--圈子详情-->
      <GroupsInfo
        :detail="detail"
        @allOptions="allOptions"
      ></GroupsInfo>
      <div class="gray"></div>
      <!--导航栏-->
      <div class="menu">
        <span :class="{bold: search_type === 1}" @tap.stop.prevent="chooseType(1)">全部<i v-if="search_type === 1"></i></span>
        <span :class="{bold: search_type === 2}" @tap.stop.prevent="chooseType(2)">圈主<i v-if="search_type === 2"></i></span>
        <span :class="{bold: search_type === 3}" @tap.stop.prevent="chooseType(3)">精华<i v-if="search_type === 3"></i></span>
        <i class="bot"></i>
      </div>
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'group/submissionList'"
        :prevOtherData="prevOtherData"
        :nextOtherData="nextOtherData"
        :pageMode = "true"
        :isShowUpToRefreshDescription="false"
        :list="list"
        class="listWrapper"
      >
        <div v-for="(item, index) in list" class="groups-list">
          <SubmitReadhubAriticle v-if="item.feed_type === 5 && item.feed.domain !== ''" :data="item"
                                 :show = 'true'
                                 @comment="comment"
          ></SubmitReadhubAriticle>
        </div>
      </RefreshList>

    <div class="invitation">
      <p>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-tijiaowenzhang1"></use>
        </svg>
        发分享
      </p>
      <p>邀请加入</p>
    </div>

    </div>


    <div id="expert" class="mui-popover mui-popover-action mui-popover-bottom">
      <div class="allOptions">
        <div class="mui-poppicker-header">
          <button class="mui-btn mui-poppicker-btn-cancel" @tap.stop.prevent="allOptions">取消</button>
          <div class="mui-poppicker-clear"></div>
        </div>
        <div class="mui-poppicker-body">
          <div class="option">退出</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  import GroupsInfo from '../../components/groups/GroupsInfo.vue'
  import SubmitReadhubAriticle from '../../components/feed/SubmitReadhubAriticle'
  import { postRequest } from '../../utils/request'
  export default {
    data () {
      return {
        list: [],
        search_type: 1,
        detail: null,
        loading: 1
      }
    },
    computed: {
      prevOtherData () {
        return {id: 1, type: this.search_type}
      },
      nextOtherData () {
        return {id: 1, type: this.search_type}
      }
    },
    components: {
      RefreshList,
      GroupsInfo,
      SubmitReadhubAriticle
    },
    props: {},
    watch: {},
    methods: {
      allOptions () {
        if (this.detail.is_joined === 3) {
          this.$router.pushPlus('/group/setting/' + this.id)
        } else {
          window.mui('#expert').popover('toggle')
        }
      },
      getData () {
        this.id = parseInt(this.$route.params.id)
        if (!this.id) {
          window.mui.back()
          return
        }
        postRequest(`group/detail`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          this.detail = response.data.data
          this.loading = 0
        })
      },
      quit () {
        postRequest(`group/quit`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          this.$router.pushPlus('/groups')
        })
      },
      chooseType (type) {
        this.list = []
        this.search_type = type
      },
      comment (submissionId, parentId, commentTargetUsername, list, component) {
        // console.log('comment data:' + window.JSON.stringify(data) + ', comment:' + window.JSON.stringify(comment))
        var commentTarget = {
          submissionId: submissionId,
          parentId: parentId || 0,
          commentList: list
        }
        var data = {
          targetUsername: commentTargetUsername || '',
          commentData: commentTarget
        }
        this.commentTargetComponent = component
        this.$refs.ctextarea.comment(data)
      }
    },
    mounted () {
      this.getData()
    },
    updated () {}
  }
</script>

<style scoped="scoped">
  /*清掉自带样式*/
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
  .gray{
    width:100%;
    height:10px;
    background: #f3f4f6;
  }
  /*菜单*/
  .menu{
    width:100%;
    height: 1.173rem;
    background: #FFFFFF;
    font-size:0.373rem;
    color: #444444;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    top: 178px;
  }
  .menu span{
    position:relative;
    margin-bottom: -0.293rem;
  }
  .menu span.bold{
    font-weight: 500;
  }
  .menu span  i{
    position:absolute;
    width:0.746rem;
    height:0.04rem;
    border-radius: 1.333rem;
    background:#03aef9;
    top: 0.67rem;
    left: 0;
    right: 0;
    margin: auto;
  }
  .groups-list{

  }
  .invitation{
    width:100%;
    height:50px;
    background: #ffffff;
    position: fixed;
    bottom: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    border-top: 1px solid #DCDCDC;
  }
  .invitation p{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    color:rgba(128,128,128,1);
  }
  .invitation p:nth-of-type(1){
    width:65%;
    height: 100%;
  }
  .invitation p:nth-of-type(1) svg{
    font-size: 24px;
    margin-right: 9px;
  }
  .invitation p:nth-of-type(2){
    width:35%;
    height: 100%;
    font-size: 16px;
    color:rgba(255,255,255,1);
    background:rgba(3,174,249,1);
  }
  .listWrapper{
    top: 226px;
  }

  .allOptions{
    background:#fff;
  }
  .allOptions .mui-poppicker-body{
    height:auto;
  }
  .allOptions .option{
    text-align: center;
    color:#444;
    height:0.96rem;
    line-height: 0.96rem;
  }
</style>
