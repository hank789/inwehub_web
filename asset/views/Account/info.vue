<template>
  <div>
    <!--页面主结构开始-->
    <div id="app_account_info" class="mui-views" v-show="!loading">
      <div class="mui-view">
        <div class="mui-navbar">
        </div>
        <div class="mui-pages">
        </div>
      </div>
    </div>
    <div class="mui-content loading" v-show="loading">
      <div class="loading">
        <img :src="loading_gif"/>
      </div>
    </div>
    <!--页面主结构结束-->
    <!--单页面开始-->
    <div id="setting" class="mui-page">
      <!--页面标题栏开始-->
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="$router.go(-1)"></a>
        <h1 class="mui-center mui-title">我的档案</h1>
        <a @tap.stop.prevent="submitInfo" class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
      </div>
      <!--页面标题栏结束-->
      <!--页面主内容区开始-->
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">

            <div class="mui-table-view">
              <div class="mui-table-view-cell personCard">

              <div class="title">添加职业照片更真实</div>
              <span class="mui-icon fa fa-hand-o-right"></span>
              <div class="titleSub">个人信息完善度<span>85%</span></div>

              <div class="avatar">
                <div class="avatarInner" id="head">
                  <img  class="head-img mui-action-preview" id="head-img1" :src="user.info.avatar_url">
                </div>
              </div>
              </div>
            </div>

            <div class="account_item_title">
              基本资料
            </div>
            <ul class="mui-table-view mui-table-view-chevron">
              <li class="mui-table-view-cell">
                <a href="#account_name" class="mui-navigate-right">用户姓名<span class="mui-pull-right account-setting-field" v-text="user.info.name"></span></a>
              </li>
              <li class="mui-table-view-cell">
                <a id="showUserPicker" class="mui-navigate-right">性别<span class="mui-pull-right account-setting-field" id="user_gender" v-text="genderName"></span></a>
              </li>
              <li class="mui-table-view-cell">
                <a href="#account_company" class="mui-navigate-right">当前公司<span class="mui-pull-right account-setting-field" v-text="user.info.company"></span></a>
              </li>
              <li class="mui-table-view-cell">
                <a href="#account_title" class="mui-navigate-right">当前职位<span class="mui-pull-right account-setting-field" v-text="user.info.title"></span></a>
              </li>
              <li class="mui-table-view-cell">
                <a id="showCityPicker" class="mui-navigate-right">所在省市<span class="mui-pull-right account-setting-field" id="user_province_city"></span></a>
              </li>
              <li class="mui-table-view-cell">
                <a href="#account_address_detail" class="mui-navigate-right">详细地址<span class="mui-pull-right account-setting-field" v-text="user.info.address_detail"></span></a>
              </li>
              <li class="mui-table-view-cell">
                <a class="mui-navigate">手机号<span class="mui-pull-right account-setting-field" v-text="user.info.mobile"></span></a>
              </li>
              <li class="mui-table-view-cell">
                <a href="#account_email" class="mui-navigate-right">邮箱地址<span class="mui-pull-right account-setting-field" v-text="user.info.email"></span></a>
              </li>
              <li class="mui-table-view-cell">
                <a href="#account_description" class="mui-navigate-right">个人签名<span class="mui-pull-right account-setting-field mui-ellipsis" v-text="user.info.description"></span></a>
              </li>
            </ul>
            <div class="account_item_title">
              工作经历<a href="#account_add_job" class="mui-pull-right"><span class="iplus mui-icon fa  fa-plus"></span></a>
            </div>
            <ul class="mui-table-view mui-table-view-chevron" v-show="user.jobs.length == 0">
              <li class="mui-table-view-cell no-empty">请维护工作经历</li>
            </ul>
            <ul class="mui-table-view mui-table-view-chevron">
              <li v-for="job in user.jobs" class="mui-table-view-cell">
                <a @tap.stop.prevent="initNewItem(job,'job')" class="mui-navigate-right">
                  {{ job.company }}
                  <p class='mui-ellipsis'>{{ job.title }} | {{ job.begin_time }} ~ {{ job.end_time }}</p>
                </a>
              </li>
            </ul>
            <div class="account_item_title">
              项目经历<a href="#account_add_project" class="mui-pull-right"><span class="iplus mui-icon fa  fa-plus"></span></a>
            </div>
            <ul class="mui-table-view mui-table-view-chevron" v-show="user.projects.length == 0">
              <li class="mui-table-view-cell no-empty">请维护项目经历</li>
            </ul>
            <ul class="mui-table-view mui-table-view-chevron">
              <li v-for="project in user.projects" class="mui-table-view-cell">
                <a @tap.stop.prevent="initNewItem(project,'project')" class="mui-navigate-right">
                  {{ project.project_name }}
                  <p class='mui-ellipsis'>{{ project.begin_time }} ~ {{ project.end_time }} | {{ project.title }}</p>
                </a>
              </li>
            </ul>
            <div class="account_item_title">
              教育经历<a href="#account_add_edu" class="mui-pull-right"><span class="iplus mui-icon fa  fa-plus"></span></a>
            </div>
            <ul class="mui-table-view mui-table-view-chevron" v-show="user.edus.length == 0">
              <li class="mui-table-view-cell no-empty">请维护教育经历</li>
            </ul>
            <ul class="mui-table-view mui-table-view-chevron">
              <li v-for="edu in user.edus" class="mui-table-view-cell">
                <a @tap.stop.prevent="initNewItem(edu,'edu')" class="mui-navigate-right">
                  {{ edu.school }}
                  <p class='mui-ellipsis'>{{ edu.begin_time }} ~ {{ edu.end_time }} | {{ edu.major }} | {{ edu.degree }}</p>
                </a>
              </li>
            </ul>
            <div class="account_item_title">
              培训认证<a href="#account_add_train" class="mui-pull-right"><span class="iplus mui-icon fa  fa-plus"></span></a>
            </div>
            <ul class="mui-table-view mui-table-view-chevron" v-show="user.trains.length == 0">
              <li class="mui-table-view-cell no-empty">请维护培训经历</li>
            </ul>
            <ul class="mui-table-view mui-table-view-chevron">
              <li v-for="train in user.trains" class="mui-table-view-cell">
                <a @tap.stop.prevent="initNewItem(train,'train')" class="mui-navigate-right">
                  {{ train.agency }}
                  <p class='mui-ellipsis'>{{ train.get_time }} | {{ train.certificate }}</p>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!--页面主内容区结束-->
    </div>
    <!--单页面结束-->


    <!--添加工作经历开始-->
    <div id="account_add_job" class="mui-page mui-pageSub">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="muiViewBack()"></a>
        <h1 class="mui-center mui-title">工作经历</h1>
        <a @tap.stop.prevent="addOrUpdateAccountItem('job')" class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">公司</label>
                  <input type="text" class="mui-input-clear" v-model="newItem.company" placeholder="必填">
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">职位</label>
                  <input type="text" class="mui-input-clear" v-model="newItem.title" placeholder="必填">
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row" @tap.stop.prevent="initDate(1)">
                  <label class="mui-navigate-right">开始时间</label><label class="mui-pull-right account-setting-field" v-text="newItem.begin_time"></label>
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row" @tap.stop.prevent="initDate(2)">
                  <label class="mui-navigate-right">结束时间</label><label class="mui-pull-right account-setting-field" v-text="newItem.end_time"></label>
                </div>
              </li>
              <li class="mui-table-view-cell">


              </li>
            </ul>
            <div class="account_item_title">
              工作经历详情描述
            </div>
            <div class="textarea-wrapper">
              <textarea v-model.trim="newItem.description" rows="5" class="mui-input-clear" placeholder="描述"></textarea>
              <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
            </div>
            <div class="deleteWrapper" v-show="newItem.id">
                <button type="button" class="mui-btn mui-btn-primary" @tap.stop.prevent="deleteAccountItem('job')">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--添加工作经历结束-->

    <!--添加项目经历开始-->
    <div id="account_add_project" class="mui-page mui-pageSub">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="muiViewBack()"></a>
        <h1 class="mui-center mui-title">项目经历</h1>
        <a @tap.stop.prevent="addOrUpdateAccountItem('project')" class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">公司</label>
                  <input type="text" class="mui-input-clear" v-model="newItem.company" placeholder="必填">
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">职位</label>
                  <input type="text" class="mui-input-clear" v-model="newItem.title" placeholder="必填">
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row" @tap.stop.prevent="initDate(1)">
                  <label class="mui-navigate-right">开始时间</label><label class="mui-pull-right account-setting-field" v-text="newItem.begin_time"></label>
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row" @tap.stop.prevent="initDate(2)">
                  <label class="mui-navigate-right">结束时间</label><label class="mui-pull-right account-setting-field" v-text="newItem.end_time"></label>
                </div>
              </li>

            </ul>
            <div class="account_item_title">
              项目经历详情描述
            </div>
            <div class="textarea-wrapper">
              <textarea v-model.trim="newItem.description" rows="5" class="mui-input-clear" placeholder="描述"></textarea>
              <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
            </div>
            <div class="deleteWrapper" v-show="newItem.id">
              <button type="button" class="mui-btn mui-btn-primary" @tap.stop.prevent="deleteAccountItem('job')">删除</button>
            </div>


          </div>
        </div>
      </div>
    </div>
    <!--添加项目经历结束-->

    <!--添加教育经历开始-->
    <div id="account_add_edu" class="mui-page mui-pageSub">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="muiViewBack()"></a>
        <h1 class="mui-center mui-title">教育经历</h1>
        <a @tap.stop.prevent="addOrUpdateAccountItem('edu')" class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">学校</label>
                  <input type="text" class="mui-input-clear" v-model="newItem.school" placeholder="必填">
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">专业</label>
                  <input type="text" class="mui-input-clear" v-model="newItem.major" placeholder="必填">
                </div>
              </li>
              <li class="mui-table-view-cell mui-input-row">
                <div id="showDegreePicker" class="mui-navigate-right"><label>学历</label><label class="mui-pull-right account-setting-field" id="edu_degree" v-text="newItem.degree"></label></div>
              </li>

              <li class="mui-table-view-cell mui-input-row">
                <div class="mui-input-row" @tap.stop.prevent="initDate(1)">
                  <label class="mui-navigate-right">开始时间</label><label class="mui-pull-right account-setting-field" v-text="newItem.begin_time"></label>
                </div>
              </li>
              <li class="mui-table-view-cell mui-input-row">
                <div class="mui-input-row" @tap.stop.prevent="initDate(2)">
                  <label class="mui-navigate-right">结束时间</label><label class="mui-pull-right account-setting-field" v-text="newItem.end_time"></label>
                </div>
              </li>
            </ul>


            <div class="account_item_title">
              教育经历详情描述
            </div>
            <div class="textarea-wrapper">
              <textarea v-model.trim="newItem.description" rows="5" class="mui-input-clear" placeholder="描述"></textarea>
              <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
            </div>
            <div class="deleteWrapper" v-show="newItem.id">
              <button type="button" class="mui-btn mui-btn-primary" @tap.stop.prevent="deleteAccountItem('edu')">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--添加教育经历结束-->

    <!--添加培训经历开始-->
    <div id="account_add_train" class="mui-page mui-pageSub">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="muiViewBack()"></a>
        <h1 class="mui-center mui-title">培训经历</h1>
        <a @tap.stop.prevent="addOrUpdateAccountItem('train')" class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">公司</label>
                  <input type="text" class="mui-input-clear" v-model="newItem.company" placeholder="必填">
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">职位</label>
                  <input type="text" class="mui-input-clear" v-model="newItem.title" placeholder="必填">
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row" @tap.stop.prevent="initDate(1)">
                  <label class="mui-navigate-right">开始时间</label><label class="mui-pull-right account-setting-field" v-text="newItem.begin_time"></label>
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row" @tap.stop.prevent="initDate(2)">
                  <label class="mui-navigate-right">结束时间</label><label class="mui-pull-right account-setting-field" v-text="newItem.end_time"></label>
                </div>
              </li>
            </ul>
            <div class="account_item_title">
              培训经历详情描述
            </div>
            <div class="textarea-wrapper">
              <textarea v-model.trim="newItem.description" rows="5" class="mui-input-clear" placeholder="描述"></textarea>
              <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
            </div>
            <div class="deleteWrapper" v-show="newItem.id">
              <button type="button" class="mui-btn mui-btn-primary" @tap.stop.prevent="deleteAccountItem('job')">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--添加培训经历结束-->

    <!--编辑姓名开始-->
    <div id="account_name" class="mui-page mui-pageSub">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-center mui-title">编辑</h1>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">姓名</label>
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
    <div id="account_company" class="mui-page mui-pageSub">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-center mui-title">编辑</h1>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">公司</label>
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
    <div id="account_title" class="mui-page mui-pageSub">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-center mui-title">编辑</h1>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">职位</label>
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
    <div id="account_email" class="mui-page mui-pageSub">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-center mui-title">编辑</h1>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">邮箱</label>
                  <input type="text" class="mui-input-clear" v-model="user.info.email">
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--编辑邮箱地址结束-->

    <!--编辑详细地址开始-->
    <div id="account_address_detail" class="mui-page mui-pageSub">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-center mui-title">编辑</h1>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label>详细地址</label>
                  <input type="text" class="mui-input-clear" v-model="user.info.address_detail">
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--编辑详细地址结束-->

    <!--编辑个人签名开始-->
    <div id="account_description" class="mui-page mui-pageSub">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-center mui-title">个人签名</h1>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <textarea v-model.trim="user.info.description" rows="5" class="mui-input-clear" placeholder="个人签名"></textarea>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--编辑个人签名结束-->
  </div>

</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {apiRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';
  import popPickerComponent from '../../components/picker/poppicker.vue';
  import "../../js/mui.view";
  import cityData from '../../components/city/city.data';
  import ACCOUNT_API from '../../api/account';
  import dPickerComponent from '../../components/picker/date-picker.vue';
  import { updateUserInfoCache } from '../../utils/user';


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
        'description': '',
        'degree': ''
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
      apiRequest(`profile/info`,{}).then(response_data => {
        if (response_data !== false){
          this.user = response_data;
          this.loading = 0;
        } else {
          this.$router.go(-1);
        }
      });
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
    watch: {
      loading: function(val, oldVal) {
        if(val === 0){
          this.userPicker.pickers[0].setSelectedValue(this.user.info.gender);
          this.cityPicker.pickers[0].setSelectedValue(this.user.info.province);
          this.cityPicker.pickers[1].setSelectedValue(this.user.info.city);
          let cityPickerSelectedProvince = this.cityPicker.pickers[0].getSelectedText();
          let cityPickerSelectedCity = this.cityPicker.pickers[1].getSelectedText();
          document.getElementById('user_province_city').innerText= cityPickerSelectedProvince + " " + cityPickerSelectedCity;
          //this.initAvatarImgPreview();
        }
      }
    },
    methods: {
      toClip(path) {
        var t = this;
        plus.zip.compressImage({
            src: path,
            dst: "_doc/c.jpg",
            overwrite: true,
            quality: 20
          },
          function (event) {
            var newurl = plus.io.convertLocalFileSystemURL(event.target);
            plus.io.resolveLocalFileSystemURL(newurl, function (entry) {
              t.localUrl = entry.toRemoteURL();
              localEvent.setLocalItem('avatar', {url:t.localUrl, path:entry.toLocalURL()});
              t.$router.push('/header');
            });
          }, function (error) {
            alert("Compress error!" + error.message);
          });
      },
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
      emptyNewItem: function () {
        this.newItem = {
          'begin_time': '',
          'end_time': '',
          'description': '',
          'degree': ''
        };
      },
      muiViewBack: function () {
        this.emptyNewItem();
        this.muiView.back();
      },
      initDate:function(objType){
        let currentDate = new Date();
        let that=this;
        let param={
          "type":"month",
          "beginYear": "1990",
          "endYear": currentDate.getFullYear()
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
        apiRequest(`profile/update`,data).then(res => {
          if (res !== false) {
            mui.toast('保存成功');
            updateUserInfoCache(data);
          }
        });
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
        apiRequest(url, data).then(res => {
          if (res !== false) {
            var isUpdate = data.id ? true : false;
            this.newItem.id = res.id;
            let objectItem = this.newItem;
            switch (res.type) {
              case 'job':
                if (isUpdate) {
                  this.removeArrByItemId(this.user.jobs,objectItem.id);
                }
                this.user.jobs.push(objectItem);
                this.user.jobs.sort(this.sortArrByBeginTime);
                break;
              case 'edu':
                if (isUpdate) {
                  this.removeArrByItemId(this.user.edus,objectItem.id);
                }
                this.user.edus.push(objectItem);
                this.user.edus.sort(this.sortArrByBeginTime);
                break;
              case 'train':
                if (isUpdate) {
                  this.removeArrByItemId(this.user.trains,objectItem.id);
                }
                this.user.trains.push(objectItem);
                this.user.trains.sort(this.sortArrByBeginTime);
                break;
              case 'project':
                if (isUpdate) {
                  this.removeArrByItemId(this.user.projects,objectItem.id);
                }
                this.user.projects.push(objectItem);
                this.user.projects.sort(this.sortArrByBeginTime);
                break;
            }
            mui.toast('保存成功');
            this.emptyNewItem();
            this.muiView.back();
          }
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
            apiRequest(url, data).then(res => {
              if (res !== false){
                let objectItem = this.newItem;
                switch (res.type) {
                  case 'job':
                    this.removeArrByItemId(this.user.jobs,objectItem.id);
                    break;
                  case 'edu':
                    this.removeArrByItemId(this.user.edus,objectItem.id);
                    break;
                  case 'train':
                    this.removeArrByItemId(this.user.trains,objectItem.id);
                    break;
                  case 'project':
                    this.removeArrByItemId(this.user.projects,objectItem.id);
                    break;
                }
                mui.toast('删除成功');
                this.emptyNewItem();
                this.muiView.back();
              }
            });
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
      },
      sortArrByBeginTime: function (a, b) {
        return a.begin_time < b.begin_time;
      },
      initAvatarImgPreview: function() {
        var imgs = document.querySelectorAll("img.mui-action-preview");
        imgs = mui.slice.call(imgs);
        if (imgs && imgs.length > 0) {
          var slider = document.createElement("div");
          slider.setAttribute("id", "__mui-imageview__");
          slider.classList.add("mui-slider");
          slider.classList.add("mui-fullscreen");
          slider.style.di = "position: fixed;z-index: 20;background-color: #000;display: none";
          slider.addEventListener("tap", function() {
            slider.style = "position: fixed;z-index: 20;background-color: #000;display: none";
          });
          slider.addEventListener("touchmove", function(event) {
            event.preventDefault();
          })
          var slider_group = document.createElement("div");
          slider_group.setAttribute("id", "__mui-imageview__group");
          slider_group.classList.add("mui-slider-group");
          imgs.forEach((value, index, array) => {
            //给图片添加点击事件，触发预览显示；
            value.addEventListener('tap', function() {
              slider.style = "position: fixed;z-index: 20;background-color: #000;display: block";
              _slider.refresh();
              _slider.gotoItem(index, 0);
            })
            var item = document.createElement("div");
            item.classList.add("mui-slider-item");
            var a = document.createElement("a");
            var img = document.createElement("img");
            img.setAttribute("src", this.user.info.avatar_url);
            a.appendChild(img)
            item.appendChild(a);
            slider_group.appendChild(item);
          });
          slider.appendChild(slider_group);
          document.body.appendChild(slider);
          var _slider = mui(slider).slider();
        }
      }
    },
    mounted () {
      mui.init({
        swipeBack: true //启用右滑关闭功能
      });
      mui('.mui-scroll-wrapper').scroll();
      //初始化单页view
      var viewApi = mui('#app_account_info').view({
        defaultPage: '#setting'
      });

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
      mui(".mui-table-view-cell").on("tap", "#head", (e) => {
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
          }, (b) => {
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
          t.toClip(e);
          /*
          plus.io.resolveLocalFileSystemURL(e, function(entry) {
            var s = entry.toLocalURL() + "?version=" + new Date().getTime();
            console.log(s);
            this.user.info.avatar_url = s;
            //变更大图预览的src
            //目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
            document.querySelector("#__mui-imageview__group .mui-slider-item img").src = s + "?version=" + new Date().getTime();;;
          }, function(e) {
            console.log("读取拍照文件错误：" + e.message);
          });
          */

        }, function(s) {
          console.log("error" + s);
        }, {
          filename: "_doc/head.jpg"
        })
      }

      var t = this;
      function galleryImg() {

        plus.gallery.pick((a) => {
          t.toClip(a);
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

      //学历
      var degreePicker = new mui.PopPicker();

      degreePicker.setData([
        {
          value: '大专',
          text: '大专'
        },
        {
          value: '本科',
          text: '本科'
        },
        {
          value: '硕士',
          text: '硕士'
        },
        {
          value: '博士',
          text: '博士'
        },
        {
          value: '其它',
          text: '其它'
        }
      ]);
      var showDegreePickerButton = document.getElementById('showDegreePicker');
      showDegreePickerButton.addEventListener('tap', event => {
        degreePicker.show(items => {
          this.newItem.degree = items[0].value;
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
  .mui-fullscreen {
    position: fixed;
    z-index: 20;
    background-color: #000;
  }
  .mui-scroll-wrapper,
  .mui-scroll {
    background-color: #efeff4;
  }
  .mui-page.mui-transitioning {
    -webkit-transition: -webkit-transform 300ms ease;
    transition: transform 300ms ease;
  }
  .account_item_title{
    padding: 5px;
    color: #a6a6a6;
    font-size: 12px;
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


  .mui-table-view-cell .mui-navigate-right,
  .mui-table-view-cell .mui-navigate
  {
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

  .mui-ios .mui-navbar .mui-bar .mui-title {
    position: static;
  }
  .account-setting-field {
    position: absolute;
    text-align: right;
    width: 200px;
    right: 40px;
    color: #3f3f3f;
  }
  .mui-input-row textarea {
    border: none !important;
  }

  .avatar{
    z-index: 9;
    color: #ffffff;
    position: absolute;
    height: 110px;
    width: 110px;
    right:30px;
    top:20px;
    font-size: 20px;
    text-align: center;
    border-radius: 50%;
  }

  .avatar .avatarInner{
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

  .personCard{
    margin-top:15px;
    position:relative;
    width:100%;
    padding-right:0px;
    height:154px;
    background: #fff;
    font-size:14px;
    color:#555;
    font-weight: bold;
  }

  .personCard .avatar{
    position: absolute;
  }

  .personCard .mui-icon{
    font-size:24px;
    position: absolute;
    left:160px;
    top:30px;
  }
  .personCard .title{
      margin-top:25px;
  }
  .personCard .titleSub{
    margin-top:25px;
  }

  .personCard .titleSub span{
    color:#3f51b5;
    font-size:22px;
    margin-left:15px;
  }
  .mui-pageSub .mui-table-view-cell {
    padding:0;
  }

  .textarea-wrapper {
    padding:2px;
    height:100%;
    position: relative;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 4px;
    font-size:12px;
    bottom: 10px;
    color: #b0b0b0;
  }


  .textarea-wrapper textarea {
     border-radius: 5px;
     margin:0;
  }
  .deleteWrapper{
    text-align: right;
    padding:10px;
  }

  .mui-bar .save{
    font-size:14px;
  }

  .no-empty{
    color:#999;
  }

  .iplus{
      color:#007aff;;
    font-size:16px;
    margin-right:10px;
  }
</style>
