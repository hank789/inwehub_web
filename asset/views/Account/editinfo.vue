<template>
  <div>
    <!--页面主结构开始-->
    <div id="app_account_info" class="mui-views">
      <div class="mui-view">
        <div class="mui-navbar">
        </div>
        <div class="mui-pages">
        </div>
      </div>
    </div>
    <!--页面主结构结束-->
    <!--单页面开始-->
    <div id="setting" class="mui-page">
      <!--页面标题栏开始-->
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <button type="button" class="mui-left mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-left">
          <span class="mui-icon mui-icon-left-nav"></span>
        </button>
        <h1 class="mui-center mui-title">个人信息</h1>
      </div>
      <!--页面标题栏结束-->
      <!--页面主内容区开始-->
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view mui-table-view-chevron">
              <li class="mui-table-view-cell mui-media">
                <a class="mui-navigate-right" href="#account">
                  <img class="mui-media-object mui-pull-left head-img" id="head-img" :src="user.info.avatar_url">
                  <div class="mui-media-body">
                    {{ user.info.name }}
                    <p class='mui-ellipsis' v-show="user.info.title"><b>{{ user.info.title }}</b><b class="mui-badge3">V</b></p>
                  </div>
                </a>
              </li>
            </ul>
            <h5 class="mui-content-padded">工作经历</h5>
            <ul class="mui-table-view mui-table-view-chevron">
              <li v-for="job in user.jobs" class="mui-table-view-cell">
                <a :href="'#job_'+job.id" class="mui-navigate-right">
                  {{ job.company }} | {{ job.title }}
                </a>
              </li>
            </ul>
            <h5 class="mui-content-padded">教育经历</h5>
            <ul class="mui-table-view mui-table-view-chevron">
              <li v-for="edu in user.edus" class="mui-table-view-cell">
                <a :href="'#edu_'+edu.id" class="mui-navigate-right">
                  {{ edu.school }} | {{ edu.major }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!--页面主内容区结束-->
    </div>
    <!--单页面结束-->
    <!--个人信息页面开始-->
    <div id="account" class="mui-page">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <button type="button" class="mui-left mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-left">
          <span class="mui-icon mui-icon-left-nav"></span>个人信息
        </button>
        <h1 class="mui-center mui-title">编辑</h1>
        <button type="button" @tap.stop.prevent="submitInfo" class="mui-left mui-btn mui-btn-nav mui-pull-right">
          保存
        </button>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <a id="head" class="mui-navigate-right">头像
                  <span class="mui-pull-right head">
									<img class="head-img mui-action-preview" id="head-img1" :src="user.info.avatar_url"/>
								</span>
                </a>
              </li>
              <li class="mui-table-view-cell">
                <a href="#account_name" class="mui-navigate-right">姓名<span class="mui-pull-right account-setting-field" v-text="user.info.name"></span></a>
              </li>
              <li class="mui-table-view-cell">
                <a id="showUserPicker" class="mui-navigate-right">性别<span class="mui-pull-right account-setting-field" id="user_gender" v-text="genderName"></span></a>
              </li>
            </ul>
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <a href="#account_company" class="mui-navigate-right">公司<span class="mui-pull-right account-setting-field" v-text="user.info.company"></span></a>
              </li>
              <li class="mui-table-view-cell">
                <a href="#account_title" class="mui-navigate-right">职位<span class="mui-pull-right account-setting-field" v-text="user.info.title"></span></a>
              </li>
              <li class="mui-table-view-cell">
                <a class="mui-navigate-right">手机号<span class="mui-pull-right" v-text="user.info.mobile"></span></a>
              </li>
              <li class="mui-table-view-cell">
                <a href="#account_email" class="mui-navigate-right">邮箱地址<span class="mui-pull-right account-setting-field" v-text="user.info.email"></span></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--个人信息页面结束-->

    <!--编辑姓名开始-->
    <div id="account_name" class="mui-page">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <button type="button" class="mui-left mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-left">
          <span class="mui-icon mui-icon-left-nav"></span>个人信息
        </button>
        <h1 class="mui-center mui-title">编辑</h1>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label>姓名</label>
                  <input type="text" class="mui-input-clear" v-model="user.info.name">
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--编辑姓名结束-->

    <!--编辑公司开始-->
    <div id="account_company" class="mui-page">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <button type="button" class="mui-left mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-left">
          <span class="mui-icon mui-icon-left-nav"></span>个人信息
        </button>
        <h1 class="mui-center mui-title">编辑</h1>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label>公司</label>
                  <input type="text" class="mui-input-clear" v-model="user.info.company">
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--编辑公司结束-->

    <!--编辑职位开始-->
    <div id="account_title" class="mui-page">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <button type="button" class="mui-left mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-left">
          <span class="mui-icon mui-icon-left-nav"></span>个人信息
        </button>
        <h1 class="mui-center mui-title">编辑</h1>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label>职位</label>
                  <input type="text" class="mui-input-clear" v-model="user.info.title">
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--编辑职位结束-->

    <!--编辑邮箱地址开始-->
    <div id="account_email" class="mui-page">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <button type="button" class="mui-left mui-action-back mui-btn  mui-btn-link mui-btn-nav mui-pull-left">
          <span class="mui-icon mui-icon-left-nav"></span>个人信息
        </button>
        <h1 class="mui-center mui-title">编辑</h1>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label>邮箱</label>
                  <input type="text" class="mui-input-clear" v-model="user.info.email">
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--编辑邮箱地址结束-->
  </div>

</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken} from '../../utils/request';
  import localEvent from '../../stores/localStorage';
  import popPickerComponent from '../../components/picker/poppicker.vue';
  import "../../js/mui.view";

  export default {
    data: () => ({
      user: {
        info: {},
        jobs: [],
        edus: {},
        projects: {},
        trains: {}
      },
      gender_object: [
        "保密",
        "男",
        "女"
      ],
      loading: true,
      loading_gif: loading_gif
    }),
    created () {
      addAccessToken().post(createAPI(`profile/info`), {},
        {
          validateStatus: status => status === 200
        }
      )
        .then(response => {

          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            this.$router.go(-1);
          }

          this.user = response.data.data;
          this.loading = 0;
        })
        .catch(({response: {message = '网络状况堪忧'} = {}}) => {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: data.message,
              time: 2000,
              status: false
            });
          });
        })
    },
    components: {
      popPickerComponent
    },
    computed: {
      genderName: function () {
        return this.gender_object[this.user.info.gender];
      }
    },
    methods: {
      submitInfo: function () {
        var data = this.user.info;
        addAccessToken().post(createAPI(`profile/update`), data,
          {
            validateStatus: status => status === 200
          }
        )
          .then(response => {

            var code = response.data.code;
            if (code !== 1000) {
              mui.alert(response.data.message);
              return;
            }
            mui.toast('保存成功');

          })
          .catch(({response: {message = '网络状况堪忧'} = {}}) => {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: data.message,
                time: 2000,
                status: false
              });
            });
          })
      }
    },
    mounted () {
      mui.init();
      //初始化单页view
      var viewApi = mui('#app_account_info').view({
        defaultPage: '#setting'
      });

      //初始化单页的区域滚动
      mui('.mui-scroll-wrapper').scroll();

      var view = viewApi.view;
      (function($) {
        //处理view的后退与webview后退
        var oldBack = $.back;
        $.back = function() {
          if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
            viewApi.back();
          } else { //执行webview后退
            oldBack();
          }
        };
        //监听页面切换事件方案1,通过view元素监听所有页面切换事件，目前提供pageBeforeShow|pageShow|pageBeforeBack|pageBack四种事件(before事件为动画开始前触发)
        //第一个参数为事件名称，第二个参数为事件回调，其中e.detail.page为当前页面的html对象
        view.addEventListener('pageBeforeShow', function(e) {
          //				console.log(e.detail.page.id + ' beforeShow');
        });
        view.addEventListener('pageShow', function(e) {
          //				console.log(e.detail.page.id + ' show');
        });
        view.addEventListener('pageBeforeBack', function(e) {
          //				console.log(e.detail.page.id + ' beforeBack');
        });
        view.addEventListener('pageBack', function(e) {
          //				console.log(e.detail.page.id + ' back');
        });
      })(mui);
      //更换头像
      mui(".mui-table-view-cell").on("tap", "#head", function(e) {
        if(mui.os.plus){
          var a = [{
            title: "拍照"
          }, {
            title: "从手机相册选择"
          }];
          plus.nativeUI.actionSheet({
            title: "修改头像",
            cancel: "取消",
            buttons: a
          }, function(b) {
            switch (b.index) {
              case 0:
                break;
              case 1:
                getImage();
                break;
              case 2:
                galleryImg();
                break;
              default:
                break
            }
          })
        }

      });

      function getImage() {
        var c = plus.camera.getCamera();
        c.captureImage(function(e) {
          plus.io.resolveLocalFileSystemURL(e, function(entry) {
            var s = entry.toLocalURL() + "?version=" + new Date().getTime();
            console.log(s);
            document.getElementById("head-img").src = s;
            document.getElementById("head-img1").src = s;
            //变更大图预览的src
            //目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
            document.querySelector("#__mui-imageview__group .mui-slider-item img").src = s + "?version=" + new Date().getTime();;;
          }, function(e) {
            console.log("读取拍照文件错误：" + e.message);
          });
        }, function(s) {
          console.log("error" + s);
        }, {
          filename: "_doc/head.jpg"
        })
      }

      function galleryImg() {
        plus.gallery.pick(function(a) {
          plus.io.resolveLocalFileSystemURL(a, function(entry) {
            plus.io.resolveLocalFileSystemURL("_doc/", function(root) {
              root.getFile("head.jpg", {}, function(file) {
                //文件已存在
                file.remove(function() {
                  console.log("file remove success");
                  entry.copyTo(root, 'head.jpg', function(e) {
                      var e = e.fullPath + "?version=" + new Date().getTime();
                      document.getElementById("head-img").src = e;
                      document.getElementById("head-img1").src = e;
                      //变更大图预览的src
                      //目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
                      document.querySelector("#__mui-imageview__group .mui-slider-item img").src = e + "?version=" + new Date().getTime();;
                    },
                    function(e) {
                      console.log('copy image fail:' + e.message);
                    });
                }, function() {
                  console.log("delete image fail:" + e.message);
                });
              }, function() {
                //文件不存在
                entry.copyTo(root, 'head.jpg', function(e) {
                    var path = e.fullPath + "?version=" + new Date().getTime();
                    document.getElementById("head-img").src = path;
                    document.getElementById("head-img1").src = path;
                    //变更大图预览的src
                    //目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
                    document.querySelector("#__mui-imageview__group .mui-slider-item img").src = path;
                  },
                  function(e) {
                    console.log('copy image fail:' + e.message);
                  });
              });
            }, function(e) {
              console.log("get _www folder fail");
            })
          }, function(e) {
            console.log("读取拍照文件错误：" + e.message);
          });
        }, function(a) {}, {
          filter: "image"
        })
      };

      document.getElementById("head-img1").addEventListener('tap', function(e) {
        e.stopPropagation();
      });

      //普通示例
      var userPicker = new mui.PopPicker();

      userPicker.setData([
        {
        value: '0',
        text: '保密'
        },
        {
        value: '1',
        text: '男'
        },
        {
        value: '2',
        text: '女'
        }
      ]);
      var showUserPickerButton = document.getElementById('showUserPicker');
      var userResult = document.getElementById('userResult');
      showUserPickerButton.addEventListener('tap', event => {
        userPicker.show(items => {
          this.user.info.gender = items[0].value;
          //返回 false 可以阻止选择框的关闭
          //return false;
        });
      }, false);
      userPicker.pickers[0].setSelectedValue(this.user.info.gender,200);

    }
  }
</script>
<style scoped>
  .mui-views,
  .mui-view,
  .mui-pages,
  .mui-page,
  .mui-page-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: #efeff4;
  }
  .mui-pages {
    top: 46px;
    height: auto;
  }
  .mui-scroll-wrapper,
  .mui-scroll {
    background-color: #efeff4;
  }
  .mui-page.mui-transitioning {
    -webkit-transition: -webkit-transform 300ms ease;
    transition: transform 300ms ease;
  }
  .mui-page-left {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  .mui-ios .mui-page-left {
    -webkit-transform: translate3d(-20%, 0, 0);
    transform: translate3d(-20%, 0, 0);
  }
  .mui-navbar {
    position: fixed;
    right: 0;
    left: 0;
    z-index: 10;
    height: 44px;
    background-color: #f7f7f8;
  }
  .mui-navbar .mui-bar {
    position: absolute;
    background: transparent;
    text-align: center;
  }
  .mui-android .mui-navbar-inner.mui-navbar-left {
    opacity: 0;
  }
  .mui-ios .mui-navbar-left .mui-left,
  .mui-ios .mui-navbar-left .mui-center,
  .mui-ios .mui-navbar-left .mui-right {
    opacity: 0;
  }
  .mui-navbar .mui-btn-nav {
    -webkit-transition: none;
    transition: none;
    -webkit-transition-duration: .0s;
    transition-duration: .0s;
  }
  .mui-navbar .mui-bar .mui-title {
    display: inline-block;
    width: auto;
  }
  .mui-page-shadow {
    position: absolute;
    right: 100%;
    top: 0;
    width: 16px;
    height: 100%;
    z-index: -1;
    content: '';
  }
  .mui-page-shadow {
    background: -webkit-linear-gradient(left, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, .01) 50%, rgba(0, 0, 0, .2) 100%);
    background: linear-gradient(to right, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, .01) 50%, rgba(0, 0, 0, .2) 100%);
  }
  .mui-navbar-inner.mui-transitioning,
  .mui-navbar-inner .mui-transitioning {
    -webkit-transition: opacity 300ms ease, -webkit-transform 300ms ease;
    transition: opacity 300ms ease, transform 300ms ease;
  }
  .mui-page {
    display: none;
  }
  .mui-pages .mui-page {
    display: block;
  }
  .mui-page .mui-table-view:first-child {
    margin-top: 15px;
  }
  .mui-page .mui-table-view:last-child {
    margin-bottom: 30px;
  }
  .mui-table-view {
    margin-top: 20px;
  }

  .mui-table-view span.mui-pull-right {
    color: #999;
  }
  .mui-table-view-divider {
    background-color: #efeff4;
    font-size: 14px;
  }
  .mui-table-view-divider:before,
  .mui-table-view-divider:after {
    height: 0;
  }
  .head {
    height: 40px;
  }
  #head {
    line-height: 40px;
  }
  .head-img {
    width: 40px;
    height: 40px;
  }
  #head-img1 {
    position: absolute;
    bottom: 10px;
    right: 40px;
    width: 40px;
    height: 40px;
  }
  .update {
    font-style: normal;
    color: #999999;
    margin-right: -25px;
    font-size: 15px
  }
  .mui-fullscreen {
    position: fixed;
    z-index: 20;
    background-color: #000;
  }
  .mui-ios .mui-navbar .mui-bar .mui-title {
    position: static;
  }
  .account-setting-field {
    position: absolute;
    right: 40px;
  }
</style>
