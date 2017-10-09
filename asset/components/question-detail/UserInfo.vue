<template>
  <div class="mui-table-view-cell">
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


      <div class="detail">
        <span class="position">{{ position }}</span>
        <span class="split"></span>
        <span class="company">{{ company }}</span>
      </div>

      <div class="followWrapper" v-if="isFollow && realname !== '匿名'">
        <span class="followButton active" @tap.stop.prevent="collectProfessor()" v-if="isFollowed">已关注</span>
        <span class="followButton" @tap.stop.prevent="collectProfessor()" v-else>关注</span>
      </div>
    </div>

  </div>
</template>
<script type="text/javascript">

  import {createAPI, addAccessToken, postRequest} from '../../utils/request';

  export default {
    data () {
      return {}
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
      }
    },
    created(){

    },
    methods: {
      toResume(){
        var uuid = this.uuid;
        if (!uuid) {
            return false;
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()));
      },
      collectProfessor: function () {
        if (!this.uuid) {
          return;
        }

        postRequest(`follow/user`, {
          id: this.uuid
        }).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          var is_followed = response.data.data.type === 'follow' ? 1 : 0;

          mui.toast(response.data.data.tip);

          this.$emit('setFollowStatus', is_followed);
        });
      },
    }
  };
</script>

<style scoped="scoped">
  .avatar {
    z-index: 0;
    color: #ffffff;
    float: left;
    background-color: #bdbdbd;
    display: inline-block;
    height: 45px;
    width: 45px;
    font-size: 20px;
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
    padding-left: 10px;
  }

  .mui-table-view-cell:after {
    display: none;
  }

  .detail {
    font-size: 14px;
    color: #808080;
  }

  .split {
    position: relative;
    top: 3px;
    margin: 0 4px;
    display: inline-block;
    width: 1px;
    height: 13px;
    background: #c8c8c8;
    transform: scaleX(.5);
  }

  .followButton {
    display: inline-block;
    border: 1px solid #03aef9;
    line-height: 17px;
    border-radius: 50px;
    font-size: 13px;
    color: #03aef9;
    padding: 2px 15px;
  }

  .followButton.active{
    background-color: #03aef9;
    color:#fff;
  }

  .mui-media-body {
    position: relative;
  }

  .mui-media-body .followWrapper {
    position: absolute;
    top: 5px;
    right: 0;
  }

  .avatarInner {
    position: relative;
  }

  .avatarInner .icon {
    position: absolute;
    right: -6px;
    bottom: -1px;
    font-size: 24px;
    color: #03aef9;
  }


</style>
