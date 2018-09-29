<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">{{detail.name}}</h1>
    </header>

    <div class="mui-content">
      <div class="setUpWrapper">
        <div class="setUpList" v-if="uuid === groupUuid" @tap.stop.prevent="$router.pushPlus('/group/setting/' + detail.id)">
          <span>圈主设置</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="gray" v-if="uuid === groupUuid"></div>
        <div class="setUpList" @tap.stop.prevent="$router.pushPlus('/group/users/' + detail.id)">
          <span>圈子成员</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="line-river-after line-river-after-short" v-if="this.detail.room_id > 0"></div>
        <div class="setUpList" @tap.stop.prevent="toGroupChat" v-if="this.detail.room_id > 0">
          <span>聊天消息</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
          <div class="chatInformation" v-if="detail.unread_group_im_messages">
            <span>{{detail.unread_group_im_messages}}</span>
          </div>
        </div>
        <div class="line-river-after line-river-after-short"></div>
        <div class="setUpList" @tap.stop.prevent="joinShare">
          <span>邀请加入</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="gray"></div>
      </div>
      <div class="groupIntroduce">
        <span class="font-family-medium">圈子介绍</span>
        <div class="line-river-after"></div>

        <div class="groupIntroduceText">{{detail.description}}</div>
      </div>

      <div class="signOut font-family-medium" v-if="groupUuid !== detail.owner.uuid" @tap.stop.prevent="getQuit">退出圈子</div>
    </div>

    <GroupsShare
      ref="share"
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
    ></GroupsShare>

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import { getLocalUuid } from '../../utils/user'
  import { getGroupDetail } from '../../utils/shareTemplate'
  import GroupsShare from '../../components/GroupsShare.vue'
  import localEvent from '../../stores/localStorage'
  // const currentUser = getLocalUserInfo()

  export default {
    data () {
      return {
        id: null,
        detail: null,
        loading: 1,
        uuid: '',
        groupUuid: getLocalUuid(),
        shareOption: {
          title: '',
          link: '',
          content: '',
          imageUrl: '',
          thumbUrl: '',
          shareName: ''
        }
      }
    },
    components: {
      GroupsShare
    },
    methods: {
      joinShare () {
        this.$refs.share.share()
      },
      shareSuccess () {

      },
      shareFail () {

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
            this.$router.replace('/groups')
            return
          }

          this.detail = response.data.data
          this.uuid = response.data.data.owner.uuid

          localEvent.setLocalItem('roomId', this.detail.room_id.toString())

          this.shareOption = getGroupDetail(
            this.id,
            this.detail.name,
            this.detail.owner.name,
            this.detail.subscribers,
            this.detail.logo
          )
        })
      },
      getQuit () {
        postRequest(`group/quit`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.$router.goBack()
        })
      },
      toGroupChat () {
        this.$router.pushPlus('/group/chat/' + this.detail.room_id)
      },
      refreshPageData () {
        this.getData()
      }
    },
    mounted () {},
    activated () {
      this.refreshPageData()
    }
  }
</script>

<style lang="less" scoped>
  .mui-content {
    /*background: #FFFFFF;*/
  }

  .setUpWrapper {
    .setUpList {
      padding: 0.293rem 0.426rem;
      background: #ffffff;
      display: flex;
      color: #444444;
      font-size: 0.426rem;
      position: relative;
      justify-content: space-between;
      &.ListGray {
        background: #ececec;
      }
      .icon {
        color: #808080;
        font-size: 0.346rem;
        margin-top: 0.106rem;
      }
      .chatInformation {
        position: absolute;
        right: 0.853rem;
        top: 0.24rem;
        span {
          width: 0.48rem;
          height: 0.48rem;
          color: #FFFFFF;
          font-size: 0.293rem;
          line-height: 0.48rem;
          border-radius: 50%;
          text-align: center;
          background: #F03C69;
          display: inline-block;
        }
      }
    }
  }

  .groupIntroduce {
    background: #ffffff;
    .font-family-medium {
      padding: 0.293rem 0.426rem;
      color: #444444;
      font-size: 0.426rem;
      display: inline-block;
    }
    .groupIntroduceText {
      padding: 0.293rem 0.426rem;
      color: #808080;
      font-size: 0.426rem;
      line-height: 0.586rem;
    }
  }

  .signOut {
    width: 9.146rem;
    height: 1.173rem;
    margin: 0.4rem auto 0;
    font-size: 0.426rem;
    color: #ffffff;
    text-align: center;
    line-height: 1.173rem;
    background: #03AEF9;
    border-radius: 0.106rem;
  }
</style>
