<template>
  <div class="mui-table-view-cell userInfoWrapper">
    <div class="avatar">
      <div class="avatarInner" @tap.stop.prevent="toResume()">
        <img :src="avatar">

        <svg class="icon" aria-hidden="true" v-show="isExpert">
          <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
        </svg>
      </div>
    </div>


    <div class="mui-media-body">
      {{ realname }}

      <div class="detail" v-if="isShowPositionAndCompany">
        <span class="position">{{ position }}</span>
        <span class="split"></span>
        <span class="company">{{ company }}</span>
      </div>

      <div class="followWrapper" v-if="isFollow && realname !== '匿名' && uuid !== localUuid">
        <span class="followButton active" @tap.stop.prevent="collectProfessor()" v-if="isFollowed">已关注</span>
        <span class="followButton" v-show="uuid" @tap.stop.prevent="collectProfessor()" v-else>关注</span>
      </div>
    </div>

  </div>
</template>
<script type="text/javascript">

  import { postRequest } from '../../utils/request'
  import { getLocalUserInfo } from '../../utils/user'

  export default {
    data () {
      return {
        localUuid: 0
      }
    },
    props: {

      uuid: {
        default: ''
      },
      avatar: {
        type: String,
        default: ''
      },
      realname: {
        type: String,
        default: ''
      },
      position: {
        type: String,
        default: ''
      },
      company: {
        type: String,
        default: ''
      },
      isFollow: {
        type: Boolean,
        default: false
      },
      isFollowed: {
        type: Boolean,
        default: false
      },
      isExpert: {
        type: Number,
        default: false
      },
      isShowPositionAndCompany: {
        type: Boolean,
        default: false
      }
    },
    created () {
      var user = getLocalUserInfo()
      this.localUuid = user.uuid
    },
    methods: {
      toResume () {
        var uuid = this.uuid
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      collectProfessor: function () {
        if (!this.uuid) {
          return
        }

        postRequest(`follow/user`, {
          id: this.uuid
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          var isFollowed = response.data.data.type === 'follow' ? 1 : 0

          window.mui.toast(response.data.data.tip)

          this.$emit('setFollowStatus', isFollowed)
        })
      }
    }
  }
</script>

<style scoped="scoped">
  .avatar {
    z-index: 0;
    color: #ffffff;
    float: left;
    background-color: #bdbdbd;
    display: inline-block;
    height: 1.2rem;
    width: 1.2rem;
    font-size: 0.533rem;
    text-align: center;
    border-radius: 50%;
  }

  .avatar .avatarInner {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 100%;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .mui-media-body {
    padding-left: 0.266rem;
    min-height: 0.666rem;
  }

  .mui-table-view-cell:after {
    display: none;
  }

  .detail {
    font-size: 0.346rem;
    color: #808080;
  }

  .split {
    position: relative;
    top: 0.08rem;
    margin: 0 0.106rem;
    display: inline-block;
    width: 0.026rem;
    height: 0.346rem;
    background: #c8c8c8;
    transform: scaleX(.5);
  }

  .followButton {
    display: inline-block;
    border: 0.026rem solid #03aef9;
    line-height: 0.453rem;
    border-radius: 1.333rem;
    font-size: 0.346rem;
    color: #03aef9;
    padding: 0.026rem 0.4rem;
  }

  .followButton.active {
    background-color: #03aef9;
    color: #fff;
  }

  .mui-media-body {
    position: relative;
  }

  .mui-media-body .followWrapper {
    position: absolute;
    top: 0;
    right: 0;
  }

  .avatarInner {
    position: relative;
  }

  .avatarInner .icon {
    position: absolute;
    right: -0.16rem;
    bottom: -0.026rem;
    font-size: 0.64rem;
    color: #03aef9;
  }

  .userInfoWrapper {
    padding: 0.4rem;
  }

</style>
