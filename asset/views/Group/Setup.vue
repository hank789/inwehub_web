<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">{{detail.name}}</h1>
    </header>

    <div class="mui-content">
      <div class="setUpWrapper">
        <div class="setUpList" v-if="!setUpListGray" @tap.stop.prevent="$router.pushPlus('/group/setting/' + detail.id)">
          <span>圈主设置</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="setUpList" v-else :class="setUpListGray ? 'ListGray' : ''">
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

      <div class="signOut font-family-medium" @tap.stop.prevent="getQuit">退出圈子</div>
    </div>

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import { getLocalUuid } from '../../utils/user'

  export default {
    data () {
      return {
        id: null,
        detail: null,
        loading: 1,
        setUpListGray: Boolean,
        uuid: ''
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
        if (getLocalUuid() !== this.uuid) {
          this.setUpListGray = true
        } else {
          this.setUpListGray = false
        }
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
      }
    },
    mounted () {
      this.getData()
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
