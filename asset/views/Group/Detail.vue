<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">圈子</h1>
    </header>
    <div class="mui-content" v-if="!loading">
      <!--圈子详情-->
      <!--可以浏览-->
      <div v-if="isInGroup">
        <RefreshList
          ref="RefreshList"
          v-model="list"
          :api="'group/submissionList'"
          :prevOtherData="prevOtherData"
          :nextOtherData="nextOtherData"
          :pageMode="true"
          :isShowUpToRefreshDescription="false"
          :autoShowEmpty="false"
          :list="list"
          class="listWrapper"
        >
        <GroupsInfo
          :detail="detail"
          @allOptions="allOptions"
        ></GroupsInfo>
        <div class="gray"></div>
        <div class="menu">
          <span :class="{bold: search_type === 1}" @tap.stop.prevent="chooseType(1)">全部<i
            v-if="search_type === 1"></i></span>
          <span :class="{bold: search_type === 2}" @tap.stop.prevent="chooseType(2)">圈主<i
            v-if="search_type === 2"></i></span>
          <span :class="{bold: search_type === 3}" @tap.stop.prevent="chooseType(3)">精华<i
            v-if="search_type === 3"></i></span>
          <i class="bot"></i>
        </div>
          <div  class="groups-list">
            <template v-for="(item, index) in list">
              <SubmitReadhubAriticle v-if="item.feed_type === 5 && item.feed.domain !== ''" :data="item"
                                     :show='true'
                                     @comment="comment"
                                     @showItemOptions="showItemOptions"
              ></SubmitReadhubAriticle>
            </template>
          </div>
          <!--为空的提示-->
          <div class="Nothing" v-if="!list.length">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zanwushuju"></use>
            </svg>
            <p>暂无数据</p>
          </div>

          <!---->
        </RefreshList>
        <div class="invitation">
          <p @tap.stop.prevent="$router.pushPlus('/discover/add?from=' + encodeURIComponent('/group/detail/' + id))">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-tijiaowenzhang1"></use>
            </svg>
            发分享
          </p>
          <p @tap.stop.prevent="joinShare">邀请加入</p>
        </div>
      </div>


      <!--不可以浏览-->
      <div v-else>
        <GroupsInfo
          :detail="detail"
          @allOptions="allOptions"
        ></GroupsInfo>
        <div class="gray"></div>

        <div class="group-text">
          <p>圈子介绍<i class="bot"></i></p>
          <p>{{ detail.description}}</p>
        </div>
        <div class="join" v-if="detail.is_joined === -1" @tap.stop.prevent="joinIn">加入圈子</div>
        <div class="join wait" v-if="detail.is_joined === 0">入圈审核中</div>
        <div class="join wait" v-if="detail.is_joined === 2">审核不通过</div>
      </div>
    </div>

    <Options
      ref="allOptions"
      :id="'allOptions'"
      :options="['退出']"
      @selectedItem="selectedItem"
    ></Options>

    <Options
      ref="itemOptions"
      :id="'itemOptions'"
      :options="itemOptions"
      @selectedItem="selectedItem"
    ></Options>

    <Share
      ref="share"
      v-if="!loading"
      :title="shareOption.title"
      :shareName="shareOption.shareName"
      :link="shareOption.link"
      :content="shareOption.content"
      :imageUrl="shareOption.imageUrl"
      :thumbUrl="shareOption.thumbUrl"
      :targetId="id"
      :targetType="'group'"
      @success="shareSuccess"
      @fail="shareFail"
      @share="share"
    ></Share>

  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  import Options from '../../components/Options.vue'
  import GroupsInfo from '../../components/groups/GroupsInfo.vue'
  import SubmitReadhubAriticle from '../../components/feed/SubmitReadhubAriticle'
  import { postRequest } from '../../utils/request'
  import { getLocalUserId } from '../../utils/user'
  import { getIndexByIdArray } from '../../utils/array'
  import Share from '../../components/Share.vue'
  import { getGroupDetail } from '../../utils/shareTemplate'

  export default {
    data () {
      return {
        id: null,
        list: [],
        search_type: 1,
        detail: null,
        loading: 1,
        itemOptions: [],
        shareOption: {
          title: '',
          link: '',
          content: '',
          imageUrl: '',
          thumbUrl: '',
          shareName: ''
        },
        isInGroup: false
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
      SubmitReadhubAriticle,
      Options,
      Share
    },
    props: {},
    watch: {
      '$route': 'refreshPageData'
    },
    methods: {
      refreshPageData () {
        this.loading = 1
        this.getData()
      },
      joinIn () {
        postRequest(`group/join`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          if (this.detail.public) {
            this.detail.is_joined = 1
            this.isInGroup = 1
          } else {
            this.detail.is_joined = 0
          }
        })
      },
      share () {
        this.shareOption.title = this.shareOption.title.replace('邀您加入', '')
      },
      joinShare () {
        this.shareOption.title = '邀您加入' + this.shareOption.title
        this.$refs.share.share()
      },
      shareSuccess () {

      },
      shareFail () {

      },
      isShowItemOption (item) {
        if (getLocalUserId() === item.user.id) {
          // 文章是我写的
          return true
        } else {
          // 文章不是我写的， 但我是圈主
          if (this.detail.is_joined === 3) {
            return true
          }
        }
        return false
      },
      showItemOptions (item) {
        if (getLocalUserId() === item.user.id) {
          this.itemOptions = [
            '删除'
          ]
        } else {
          this.itemOptions = [
            '加精'
          ]
        }

        this.$refs.itemOptions.toggle()
      },
      selectedItem (item) {
        switch (item) {
          case '退出':
            this.quit()
            break
          case '删除':
            this.del(item, () => {
              this.$refs.itemOptions.toggle()
            })
            break
          case '加精':
            this.addGood(item, () => {
              this.$refs.itemOptions.toggle()
            })
            break
        }
      },
      addGood (item, callback) {
        // todo 接后台接口
        postRequest(`group/setSubmissionRecommend`, {submission_id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          window.mui.toast('操作成功')
          callback()
        })
      },
      allOptions () {
        if (this.detail.is_joined === 3) {
          this.$router.pushPlus('/group/setting/' + this.id)
        } else {
          this.$refs.allOptions.toggle()
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

          if (this.detail.is_joined === 1 || this.detail.is_joined === 3) {
            this.isInGroup = true
          } else {
            this.isInGroup = false
          }

          this.shareOption = getGroupDetail(
            this.id,
            this.detail.name,
            this.detail.owner.name,
            this.detail.subscribers,
            this.detail.logo
          )

          this.loading = 0
        })
      },
      del (item, callback) {
        var btnArray = ['取消', '确定']
        var list = this.list
        window.mui.confirm('确定删除吗？', ' ', btnArray, function (e) {
          if (e.index === 1) {
            // 进行删除
            postRequest(`article/destroy-submission`, {
              id: item.id
            }).then(response => {
              var code = response.data.code
              // 如果请求不成功提示信息 并且返回上一页；
              if (code !== 1000) {
                window.mui.toast(response.data.message)
                return
              }
              if (response.data.data) {
                var index = getIndexByIdArray(this.list, item.id)
                list.splice(index, 1)
                callback()
                window.mui.toast('删除成功')
              }
            })
          }
        })
      },
      quit () {
        postRequest(`group/quit`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          if (this.detail.is_joined !== 3) {
            this.$refs.allOptions.toggle()
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

  .mui-content {
    background: #ffffff;
  }

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .gray {
    width: 100%;
    height: 10px;
    background: #f3f4f6;
  }

  /*菜单*/
  .menu {
    width: 100%;
    height: 1.173rem;
    background: #FFFFFF;
    font-size: 0.373rem;
    color: #444444;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    top: 178px;
  }

  .menu span {
    position: relative;
    margin-bottom: -0.293rem;
  }

  .menu span.bold {
    font-weight: 500;
  }

  .menu span i {
    position: absolute;
    width: 0.746rem;
    height: 0.04rem;
    border-radius: 1.333rem;
    background: #03aef9;
    top: 0.67rem;
    left: 0;
    right: 0;
    margin: auto;
  }

  .groups-list {
    margin-top: 49px;
  }

  .invitation {
    width: 100%;
    height: 50px;
    background: #ffffff;
    position: fixed;
    bottom: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    border-top: 1px solid #DCDCDC;
  }

  .invitation p {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    color: rgba(128, 128, 128, 1);
  }

  .invitation p:nth-of-type(1) {
    width: 65%;
    height: 100%;
  }

  .invitation p:nth-of-type(1) svg {
    font-size: 24px;
    margin-right: 9px;
  }

  .invitation p:nth-of-type(2) {
    width: 35%;
    height: 100%;
    font-size: 16px;
    color: rgba(255, 255, 255, 1);
    background: rgba(3, 174, 249, 1);
  }

  .group-text{
    width:92%;
    margin-left: 4%;
    overflow: hidden;
  }
  .group-text p:nth-of-type(1){
    width:100%;
    height:43px;
    position: relative;
    font-size: 16px;
    color:rgba(68,68,68,1);
    font-weight: 500;
    line-height: 43px;
  }
  .group-text p:nth-of-type(2){
    width:100%;
    margin-top: 14px;
    position: relative;
    font-size: 16px;
    color:rgba(68,68,68,1);
    line-height: 20px;
  }
  .join{
    width:92%;
    height:44px;
    position: fixed;
    right:0;
    left:0;
    bottom: 15px;
    margin: auto;
    background:rgba(3,174,249,1);
    box-shadow: 0px 1px 10px 0px rgba(205,215,220,1);
    border-radius: 50px ;
    text-align: center;
    line-height: 44px;
    font-size: 16px;
    color:rgba(255,255,255,1);
    font-weight: 500;
  }
  .join.wait{
    background:rgba(220,220,220,1);
    box-shadow: 0px 1px 10px 0px rgba(205,215,220,1);
    color:rgba(180,180,182,1);
  }
  .Nothing{
    width: 211px;
    height: 200px;
    position: absolute;
    font-size: 12px;
    color: rgba(200,200,200,1);
    left: 0;
    right: 0;
    top: 300px;
    text-align: center;
    margin: auto;
  }
  .Nothing svg{
    font-size: 60px;
    margin-bottom: 5px;
  }
</style>
