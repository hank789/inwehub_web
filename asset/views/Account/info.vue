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
                    <p class='mui-ellipsis' v-show="user.info.title"><b>{{ user.info.title }}</b></p>
                  </div>
                </a>
              </li>
            </ul>
            <h5 class="mui-content-padded">工作经历</h5><a href="#account_add_job" class="mui-navigate-right">添加</a>
            <ul class="mui-table-view mui-table-view-chevron">
              <li v-for="job in user.jobs" class="mui-table-view-cell">
                <a @click="initNewItem(job,'job')" class="mui-navigate-right">
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
                <a id="showCityPicker" class="mui-navigate-right">所在省市<span class="mui-pull-right account-setting-field" id="user_province_city"></span></a>
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

    <!--添加工作经历开始-->
    <div id="account_add_job" class="mui-page">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <button type="button" @click="muiViewBack()" class="mui-left mui-btn  mui-btn-link mui-btn-nav mui-pull-left">
          <span class="mui-icon mui-icon-left-nav"></span>个人信息
        </button>
        <h1 class="mui-center mui-title">工作经历</h1>
        <button type="button" @tap.stop.prevent="addOrUpdateAccountItem('job')" class="mui-left mui-btn mui-btn-nav mui-pull-right">
          保存
        </button>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label>公司</label>
                  <input type="text" class="mui-input-clear" v-model="newItem.company" placeholder="必填">
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label>职位</label>
                  <input type="text" class="mui-input-clear" v-model="newItem.title" placeholder="必填">
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate-right">开始时间</label><label @tap.stop.prevent="initDate(1)" class="mui-pull-right account-setting-field" v-text="newItem.begin_time"></label>
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate-right">结束时间</label><label @tap.stop.prevent="initDate(2)" class="mui-pull-right account-setting-field" v-text="newItem.end_time"></label>
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="textarea-wrapper">
                  <textarea v-model.trim="newItem.description" class=".mui-input-speech" placeholder="描述"></textarea>
                  <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
                </div>
              </li>
            </ul>
            <ul class="mui-table-view" v-show="newItem.id">
              <li class="mui-table-view-cell" style="text-align: center;">
                <a @tap.stop.prevent="deleteAccountItem('job')">删除</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--添加工作经历结束-->


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
  import cityData from '../../components/city/city.data';
  import ACCOUNT_API from '../../api/account';
  import dPickerComponent from '../../components/picker/date-picker.vue';

  export default {
    data: () => ({
      user: {
        info: {},
        jobs: [],
        edus: [],
        projects: [],
        trains: []
      },
      newItem: {
        'begin_time': '',
        'end_time': '',
        'description': ''
      },
      gender_object: [
        "保密",
        "男",
        "女"
      ],
      loading: true,
      loading_gif: loading_gif,
      userPicker: {},
      cityPicker: {},
      muiView: {},
      descMaxLength: 2000
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
      popPickerComponent,
      dPickerComponent,
      cityData
    },
    computed: {
      genderName: function () {
        return this.gender_object[this.user.info.gender];
      },
      descLength() {
        if(this.newItem.description)
          return this.newItem.description.length;
        else return 0;
      }
    },
    updated: function() {
      this.userPicker.pickers[0].setSelectedValue(this.user.info.gender);
      this.cityPicker.pickers[0].setSelectedValue(this.user.info.province);
      this.cityPicker.pickers[1].setSelectedValue(this.user.info.city);
      let cityPickerSelectedProvince = this.cityPicker.pickers[0].getSelectedText();
      let cityPickerSelectedCity = this.cityPicker.pickers[1].getSelectedText();
      document.getElementById('user_province_city').innerText= cityPickerSelectedProvince + " " + cityPickerSelectedCity;
    },
    methods: {
      initNewItem: function (newItem, objType) {
        this.newItem = newItem;
        var toUrl;
        switch (objType) {
          case 'job':
            toUrl = '#account_add_job';
            break;
          case 'edu':
            toUrl = '#account_add_edu';
            break;
          case 'project':
            toUrl = '#account_add_project';
            break;
          case 'train':
            toUrl = '#account_add_train';
            break;
          default:
            break;
        }
        this.muiView.go(toUrl);
      },
      muiViewBack: function () {
        this.newItem = {
          'begin_time': '',
          'end_time': '',
          'description': ''
        };
        this.muiView.back();
      },
      initDate:function(objType){
        let that=this;
        let param={
          "type":"date",
          "beginYear": "1990"
        };
        let picker = new mui.DtPicker(param);
        picker.show((rs) => {
          switch (objType) {
            case 1 :
              this.newItem.begin_time = rs.text;
              break;
            case 2:
              this.newItem.end_time = rs.text;
              break;
          }
        });
      },
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
      },
      addOrUpdateAccountItem: function (oType) {
        var url;
        var data = this.newItem;
        switch (oType) {
          case 'job' :
            if (data.id) {
              url = ACCOUNT_API.UPDATE_ACCOUNT_JOB;
            } else {
              url = ACCOUNT_API.ADD_ACCOUNT_JOB;
            }
            break;
          case 'edu' :
            if (data.id) {
              url = ACCOUNT_API.UPDATE_ACCOUNT_EDU;
            } else {
              url = ACCOUNT_API.ADD_ACCOUNT_EDU;
            }
            break;
          case 'project' :
            if (data.id) {
              url = ACCOUNT_API.UPDATE_ACCOUNT_PROJECT;
            } else {
              url = ACCOUNT_API.ADD_ACCOUNT_PROJECT;
            }
            break;
          case 'train' :
            if (data.id) {
              url = ACCOUNT_API.UPDATE_ACCOUNT_TRAIN;
            } else {
              url = ACCOUNT_API.ADD_ACCOUNT_TRAIN;
            }
            break;
          default:
            break;
        }
        addAccessToken().post(createAPI(url), data,
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
            var type = response.data.data.type;
            var id = response.data.data.id;
            this.newItem.id = id;
            let objectItem = this.newItem;
            switch (type) {
              case 'job':
                this.user.jobs.push(objectItem);
                break;
              case 'edu':
                this.user.edus.push(objectItem);
                break;
              case 'train':
                this.user.trains.push(objectItem);
                break;
              case 'project':
                this.user.projects.push(objectItem);
                break;
            }
            this.newItem = {};
            mui.toast('保存成功');
            this.muiView.back();
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
      deleteAccountItem: function (oType) {
        var btnArray = ['否', '是'];
        mui.confirm('确认要删除？', '删除', btnArray, e => {
          if (e.index == 1) {
            //  确认
            var url;
            var data = this.newItem;
            switch (oType) {
              case 'job' :
                if (data.id) {
                  url = ACCOUNT_API.DELETE_ACCOUNT_JOB;
                } else {
                  url = ACCOUNT_API.ADD_ACCOUNT_JOB;
                }
                break;
              case 'edu' :
                if (data.id) {
                  url = ACCOUNT_API.DELETE_ACCOUNT_EDU;
                } else {
                  url = ACCOUNT_API.ADD_ACCOUNT_EDU;
                }
                break;
              case 'project' :
                if (data.id) {
                  url = ACCOUNT_API.DELETE_ACCOUNT_PROJECT;
                } else {
                  url = ACCOUNT_API.ADD_ACCOUNT_PROJECT;
                }
                break;
              case 'train' :
                if (data.id) {
                  url = ACCOUNT_API.DELETE_ACCOUNT_TRAIN;
                } else {
                  url = ACCOUNT_API.ADD_ACCOUNT_TRAIN;
                }
                break;
              default:
                break;
            }
            addAccessToken().post(createAPI(url), data,
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
                var type = response.data.data.type;
                let objectItem = this.newItem;
                switch (type) {
                  case 'job':
                    this.removeArrByItemId(this.user.jobs,objectItem.id);
                    break;
                  case 'edu':
                    this.removeArrByItemId(this.user.edus,objectItem.id);
                    break;
                  case 'train':
                    this.user.trains.unshift(objectItem);
                    break;
                  case 'project':
                    this.user.projects.unshift(objectItem);
                    break;
                }
                this.newItem = {};
                mui.toast('删除成功');
                this.muiView.back();
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
          } else {

          }
        })
      },
      removeArrByItemId: function (arr, id) {
        for(var i=0; i<arr.length; i++) {
          if(arr[i].id == id) {
            arr.splice(i, 1);
            break;
          }
        }
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
          				//console.log(e);
        });
        view.addEventListener('pageShow', function(e) {
          				//console.log(e.detail.page.id + ' show');
        });
        view.addEventListener('pageBeforeBack', function(e) {
          				//console.log(e.detail.page.id + ' beforeBack');
        });
        view.addEventListener('pageBack', function(e) {
          				//console.log(e.detail.page.id + ' back');
        });
      })(mui);
      this.muiView = viewApi;
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
      showUserPickerButton.addEventListener('tap', event => {
        userPicker.show(items => {
          this.user.info.gender = items[0].value;
          //返回 false 可以阻止选择框的关闭
          //return false;
        });
      }, false);

      //级联示例
      var cityPicker = new mui.PopPicker({
        layer: 2
      });
      cityPicker.setData(cityData);
      var showCityPickerButton = document.getElementById('showCityPicker');
      var cityResult = document.getElementById('user_province_city');
      showCityPickerButton.addEventListener('tap', event => {
        cityPicker.show(items => {
          this.user.info.province = items[0].value;
          this.user.info.city = items[1].value;
          cityResult.innerText = items[0].text + " " + items[1].text;
          console.log(items);
          //返回 false 可以阻止选择框的关闭
          //return false;
        });
      }, false);

      this.userPicker = userPicker;
      this.cityPicker = cityPicker;

      if(this.user.info) {
        this.userPicker.pickers[0].setSelectedValue(this.user.info.gender);
        this.cityPicker.pickers[0].setSelectedValue(this.user.info.province);
        this.cityPicker.pickers[1].setSelectedValue(this.user.info.city);
      }
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
