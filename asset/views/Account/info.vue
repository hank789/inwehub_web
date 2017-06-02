<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的名片</h1>
      <!--<a class="mui-icon myicon myicon-share mui-pull-right"></a>-->
    </header>

    <div class="mui-content" v-show="!loading">

      <div class="professor">
        <div class="avatar" @tap.stop.prevent="changeAvatar">
          <div class="avatarInner">
            <img :src="user.info.avatar_url" class="avatar"/>
          </div>
          <span class="mui-icon myicon myicon-plus"></span>
        </div>
        <div class="text">
          <div class="realname" v-show="user.info.name">{{ user.info.name }}</div>
          <div class="postion" v-show="user.info.title">{{ user.info.title }}</div>
          <div class="company" v-show="user.info.company">{{ user.info.company }}</div>
          <div class="phone" v-show="user.info.mobile"><span class="mui-icon myicon myicon-phone"></span>{{ user.info.mobile }}</div>
          <div class="email" v-show="user.info.email"><span class="mui-icon myicon myicon-email"></span>{{ user.info.email }}</div>
          <!--<div class="address" v-show="user.info.address_detail"><span class="mui-icon myicon myicon-position"></span>{{ user.info.address_detail }}</div>-->
        </div>
      </div>

      <div class="part2">
        资料完整度  {{ user.info.account_info_complete_percent }}%
        <div class="progressBar">
          <div class="progress" :style="'width:'+ user.info.account_info_complete_percent +'%'"><span></span></div>
        </div>

        <span class="mui-icon fa fa-warning" @tap.stop.prevent="warning"></span>

        <div class="tip" v-if="user.info.account_info_complete_percent < 90">还差{{ 90-user.info.account_info_complete_percent }}%名片信息才较为完整</div>
        <div class="tip" v-if="user.info.account_info_complete_percent >= 90 && user.info.account_info_complete_percent !== 100">距离满分只有一步之遥啦，请再接再厉！</div>
      </div>

      <div class="part3">
        <ul class="mui-table-view mui-table-view-chevron firstItem">
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.push('/my/info/basic')"><span class="mui-icon myicon myicon-wallet"></span>基本资料
                <span class="desc important">{{ user.infos }}</span>
            </a>

          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.push('/my/info/jobs')"><span class="mui-icon myicon myicon-coupon"></span>工作经历
                <span class="desc" v-if="user.jobs">{{ user.jobs }}</span>
                <span class="desc important" v-else>请添加工作经历</span>
            </a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.push('/my/info/projects')"><span class="mui-icon myicon myicon-huiyuan"></span>项目经历
                <span class="desc" v-if="user.projects">{{ user.projects }}</span>
                <span class="desc important" v-else>请添加项目经历</span>
            </a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.push('/my/info/edus')"><span class="mui-icon myicon myicon-heart"></span>教育经历
                <span class="desc" v-if="user.edus">{{ user.edus }}</span>
                <span class="desc important" v-else>请添加教育经历</span>
            </a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.push('/my/info/trains')"><span class="mui-icon myicon myicon-help"></span>培训认证
                <span class="desc" v-if="user.trains">{{ user.trains }}</span>
                <span class="desc important" v-else>请添加培训认证</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="paizhao">
        <!--<div class="mui-icon myicon myicon-paizhao" @tap.stop.prevent="uploadFile"></div>-->
        填写嫌麻烦，可发送简历到 <a class="mailLink" href="mailto:hi@inwehub.com?subject=简历维护：用户姓名+注册手机号码">hi@inwehub.com</a> ，客服小哈帮您维护！
       </div>
    </div>
  </div>
</template>

<script>
  import {NOTICE, USERS_APPEND} from '../../stores/types';
  import {apiRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';
  import ACCOUNT_API from '../../api/account';
  import {updateUserInfoCache, getUserInfo} from '../../utils/user';
  export default {
    data: () => ({
      user: {
        info: {
          name:'',
          gender:'',
          company:'',
          title:'',
          province:'',
          city:'',
          hometown_city:'',
          hometown_province:'',
          account_info_complete_percent:0,
          address_detail:'',
          email:'',
          birthday:'',
          description:'',
          industry_tags:[],
        },
      },
      loading: true,
      loading_gif: loading_gif
    }),
    created () {
      this.getUserInfo();
    },
    methods: {
      warning:function(){
          mui.confirm("<div style='text-align: left'>InweHub是一个真实诚信的社区，每一位用户的信息都真实有效，我们保证对平台所有个人信息绝对保密，绝不会提供给任何第三方，平台中个人信息的开放范围完全取决于用户个性的设置，默认值为不开放。\n【注意】您填写个人信息时务必真实，如发现虚假信息，第一次将给予警告，第二次发现将永久封号。</div>", '警告说明', ['我已了解', '继续补充'], function(){}, 'div');
      },
      changeAvatar:function(){
        if (mui.os.plus) {
          var a = [{
            title: "拍照"
          }, {
            title: "从手机相册选择"
          }];
          plus.nativeUI.actionSheet({
            title: "修改头像",
            cancel: "取消",
            buttons: a
          }, (b) => {
            switch (b.index) {
              case 0:
                break;
              case 1:
                this.getImage();
                break;
              case 2:
                this.galleryImg();
                break;
              default:
                break
            }
          })
        }
      },
      uploadFile(){
          mui.alert('开发中');
      },
      getImage:function(){
        var t = this;
        var c = plus.camera.getCamera();
        c.captureImage(function (e) {
          t.toClip(e);

        }, function (s) {
          console.log("error" + s);
        }, {
          filename: "_doc/head.jpg"
        })
      },
      toClip(path)
      {
        var t = this;
        plus.zip.compressImage({
            src: path,
            dst: "_doc/c.jpg",
            overwrite: true,
            quality: 20
          },
          function (event) {

            var newurl = plus.io.convertLocalFileSystemURL(event.target);
            if (mui.os.ios) {
              newurl = 'file://' + newurl;
            }

            plus.io.resolveLocalFileSystemURL(newurl, function (entry) {
              t.localUrl = entry.toRemoteURL();
              localEvent.setLocalItem('avatar', {url: t.localUrl, path: entry.toLocalURL()});
              t.$router.push('/header');
            }, function (error) {
              alert(error.message);
            });
          }, function (error) {
            alert("Compress error!" + error.message);
          });
      },
      galleryImg:function(){
        plus.gallery.pick((a) => {
          this.toClip(a);
        }, function (a) {
        }, {
          filter: "image"
        })
      },
      getUserInfo()
      {

        this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
          cb(user);

          var newJobs = [];
          for (var i in user.jobs) {
            var info = user.jobs[i];
            var id = info.id;
            newJobs[id] = info;
          }
          localEvent.setLocalItem('jobs', newJobs);


          var newProjects = [];
          for (var i in user.projects) {
            var info = user.projects[i];
            var id = info.id;
            newProjects[id] = info;
          }
          localEvent.setLocalItem('projects', newProjects);


          var newEdus = [];
          for (var i in user.edus) {
            var info = user.edus[i];
            var id = info.id;
            newEdus[id] = info;
          }
          localEvent.setLocalItem('edus', newEdus);


          var newTrains = [];
          for (var i in user.trains) {
            var info = user.trains[i];
            var id = info.id;
            newTrains[id] = info;
          }
          localEvent.setLocalItem('trains', newTrains);

          this.work_city = user.info.province.name + ' ' + user.info.city.name;
          this.home_city = user.info.hometown_province.name + ' ' + user.info.hometown_city.name;

          this.user = user;
          this.loading = 0;

        }));
      }
    }
  }
</script>
<style scoped>
  .mui-bar .myicon {
    width: 16px;
    height: 16px;
    right: 8px;
    top: 8px;
  }

  .professor {
    background-color: #161616;
    text-align: center;
    position: relative;
    height: 136px;
  }

  .professor .myicon-plus {
    width: 41px;
    height: 41px;
    position: absolute;
    z-index: 77;
    bottom: -10px;
    right: 0;
  }

  .professor .text {
    width: 65%;
    height: 100%;
    padding-top: 20px;
    padding-left: 20px;
    display: inline-block;
    color: #fff;
    text-align: left;
    font-size: 12px;
    position: relative;
  }

  .professor .text .realname {
    font-size: 20px;
    font-weight: bolder;
    margin-bottom: 5px;
  }

  .professor .text .postion {
    position: absolute;
    right: 10px;
    top: 20px;
  }

  .professor .text .mui-icon {
    width: 12px;
    height: 12px;
    vertical-align: middle;
    margin-right: 5px;
  }

  .avatar {
    z-index: 9;
    color: #ffffff;
    display: inline-block;
    margin-top: 10px;
    height: 100px;
    width: 100px;
    font-size: 20px;
    text-align: center;
    border-radius: 50%;
    vertical-align: top;
    position: relative;
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

  .part2 {
    padding: 17px 0 17px 20px;
    background: #fff;
  }

  .part2:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #D9D9D9;
  }

  .part2 .progressBar {
    position: relative;
    border: 2px solid #4990E2;
    display: inline-block;
    width: 120px;
    text-align: right;
    overflow: hidden;
    top: 4px;
    left: 10px;
    height: 20px;
  }

  .part2 .progressBar .progress {
    background: #4990e2;
    color: #fff;
    width: 75%;
  }

  .part2 .progressBar .progress span {
    display: inline-block;
    position: relative;
    top: -2px;
    right: 40px;
  }

  .part2 .tip {
    margin-top: 20px;
    color: #F6A623;
    font-size: 16px;
  }

  .part2 .fa-warning{
    margin-left:20px;
    color:#F6A623;
  }

  .mui-navigate-right:after, .mui-push-right:after {
    color: #4a4a4a;
  }

  .mui-table-view-cell {
    color: #4A4A4A;
    padding-top: 12px;
    padding-bottom: 13px;
  }

  .paizhao {
    position: relative;
    padding:20px;
    font-size:14px;
  }



  .paizhao .mui-icon {

    width: 100px;
    height: 100px;
  }

  .part3 .desc {
    margin-left: 40px;
    font-size: 12px;
  }

  .part3 .important {
    color: #F6A623;
  }

  @media (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) {
    .part2 .progressBar{
        width:160px !important;
    }
  }

  @media (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
    .part2 .progressBar{
      width:160px !important;
    }
  }
</style>
