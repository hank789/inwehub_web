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
        <div class="setUpList ListGray"  v-if="uuid !== groupUuid">
          <span>圈主设置</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="gray"></div>
        <div class="setUpList" @tap.stop.prevent="$router.pushPlus('/group/users/' + detail.id)">
          <span>圈子成员</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="line-river-after line-river-after-short"></div>
        <div class="setUpList" @tap.stop.prevent="toGroupChat">
          <span>聊天消息</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
          <div class="chatInformation">
            <span>3</span>
          </div>
        </div>
        <div class="line-river-after line-river-after-short"></div>
        <div class="setUpList">
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

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import { getLocalUuid } from '../../utils/user'
  // const currentUser = getLocalUserInfo()

  export default {
    data () {
      return {
        id: null,
        detail: null,
        loading: 1,
        uuid: '',
        groupUuid: getLocalUuid()
      }
    },
    methods: {
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
      padding: 11px 16px;
      background: #ffffff;
      display: flex;
      color: #444444;
      font-size: 16px;
      position: relative;
      justify-content: space-between;
      &.ListGray {
        background: #ececec;
      }
      .icon {
        color: #808080;
        font-size: 13px;
        margin-top: 4px;
      }
      .chatInformation {
        position: absolute;
        right: 32px;
        top: 9px;
        span {
          width: 18px;
          height: 18px;
          color: #FFFFFF;
          font-size: 11px;
          line-height: 18px;
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
      padding: 11px 16px;
      color: #444444;
      font-size: 16px;
      display: inline-block;
    }
    .groupIntroduceText {
      padding: 11px 16px;
      color: #808080;
      font-size: 16px;
      line-height: 22px;
    }
  }

  .signOut {
    width: 343px;
    height: 44px;
    margin: 15px auto 0;
    font-size: 16px;
    color: #ffffff;
    text-align: center;
    line-height: 44px;
    background: #03AEF9;
    border-radius: 4px;
  }
</style>
