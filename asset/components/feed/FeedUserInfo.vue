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


    <div class="mui-media-body realnameMtop">
      {{ realname }}
      <div class="feedSetTop" v-if="showSetTop">顶</div>
      <div class="detail" v-if="isShowPositionAndCompany">
        <span class="position">{{ position }}</span>
        <span class="split"></span>
        <span class="company">{{ company }}</span>
      </div>

      <div class="detail" v-if="time">
        <span class="position" v-if="isTime(time)"><timeago :since="timeago(time)" :auto-update="60"></timeago> </span>
        <span class="position" v-else>{{time}}</span>
        <span class="container-feedAddress" v-if="address">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-dingwei1"></use>
          </svg>{{address}}
        </span>
      </div>

      <div class="followWrapper" v-if="isFollow && realname !== '匿名' && uuid !== localUuid">
        <span class="followButton active border-football" @tap.stop.prevent="collectProfessor()" v-if="isFollowed">已关注</span>
        <span class="followButton border-football" v-show="uuid" @tap.stop.prevent="collectProfessor()" v-else>关注</span>
      </div>
      <!--<div class="timeData">-->
      <!--<span>-->
      <!--<timeago :since="timeago(detail.created_at)" :auto-update="60"></timeago>-->
      <!--</span>-->
      <!--</div>-->
    </div>
  </div>
</template>
<script type="text/javascript">

  import { postRequest } from '../../utils/request'
  import { getLocalUserInfo } from '../../utils/user'

  export default {
    data () {
      return {
        localUuid: 0,
        detail: {
          created_at: ''
        }
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
      showSetTop: {
        type: Number,
        default: 0
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
      },
      isNiming: {
        type: Boolean,
        default: false
      },
      time: {
        type: String,
        default: ''
      },
      address: {
        type: String,
        default: ''
      },
      timeDesc: {
        type: String,
        default: ''
      }
    },
    created () {
      var user = getLocalUserInfo()
      this.localUuid = user.uuid
    },
    methods: {
      isTime (time) {
        return /^[0-9\-\\:\s]+$/.test(time)
      },
      toResume () {
        var uuid = this.uuid
        if (!uuid) {
          return false
        }

        if (this.isNiming) {
          return false
        }

        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
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
    height: 0.906rem;
    width: 0.906rem;
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
    padding-left: 0.16rem;
    min-height: 1.2rem;
  }
  .feedSetTop {
    height: 0.4rem;
    padding: 0 0.133rem;
    color: #FFFFFF;
    font-size: 0.266rem;
    text-align: center;
    line-height: 0.4rem;
    background: #FA4975;
    border-radius: 0.106rem;
    display: inline-block;
  }

  .mui-table-view-cell:after {
    display: none;
  }

  .detail {
    font-size: 0.32rem;
    color: #C8C8C8;
    margin-top: -0.08rem;
  }
  .container-feedAddress {
    margin-left: 4px;
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
    width: 1.653rem;
    height: 0.72rem;
    color: #03aef9;
    line-height: 0.773rem;
    text-align: center;
    font-size: 0.373rem;
    display: inline-block;
    border-radius: 1.333rem;
  }
  .mui-android .followButton {
    line-height: 0.773rem;
  }

  .followButton.active {
    color: #B4B4B6;
  }

  .mui-media-body {
    font-size: 0.346rem;
    color: #808080;
    position: relative;
    margin-top: -0.05rem;
  }

  .mui-media-body .followWrapper {
    position: absolute;
    top: 0.106rem;
    right: 0.026rem;
  }

  .avatarInner {
    position: relative;
  }

  .avatarInner .icon {
    position: absolute;
    width: 0.533rem;
    height: 0.533rem;
    right: -0.1rem;
    bottom: -0.07rem;
    font-size: 0.64rem;
    color: #03aef9;
  }

  .userInfoWrapper {
    padding: 0.4rem;
  }

</style>
