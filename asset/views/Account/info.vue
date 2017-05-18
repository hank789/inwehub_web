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
      </div>
      <!--页面标题栏结束-->
      <!--页面主内容区开始-->
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper" id="infoWrapper">
          <div class="mui-scroll">

            <div class="mui-table-view" id="head" @tap.stop.prevent="changeAvatar">
              <div class="mui-table-view-cell personCard">

                <div class="title">添加职业照片更真实</div>
                <span class="mui-icon fa fa-hand-o-right"></span>
                <div class="titleSub">个人信息完善度<span>{{ user.info.account_info_complete_percent }}%</span></div>

                <div class="avatar">
                  <div class="avatarInner">
                    <img class="head-img mui-action-preview" :src="user.info.avatar_url">
                  </div>
                </div>
              </div>
            </div>

            <div class="account_item_title">
              基本资料



            </div>
            <ul class="mui-table-view mui-table-view-chevron">
              <li class="mui-table-view-cell">
                <a href="#account_name" class="mui-navigate-right">用户姓名<span
                  class="mui-pull-right account-setting-field">{{ user.info.name ? user.info.name : '必填' }}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a @tap.stop.prevent="selectSex" class="mui-navigate-right">用户性别<span
                  class="mui-pull-right account-setting-field">{{ genderName ? genderName : '请选择'}}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a href="#account_company" class="mui-navigate-right">当前公司<span
                  class="mui-pull-right account-setting-field">{{ user.info.company ? user.info.company : '必填' }}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a href="#account_title" class="mui-navigate-right">当前职位<span
                  class="mui-pull-right account-setting-field">{{ user.info.title ? user.info.title : '必填'}}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a href="#page_industry_tags" @tap="changeIndustryTagsOwner('user')"
                   class="mui-navigate-right">行业领域<span
                  class="mui-pull-right account-setting-field mui-ellipsis">{{ userIndustryTagsNames ? userIndustryTagsNames : '可多选'
                  }}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a @tap.stop.prevent="selectWorkerCity(true)" class="mui-navigate-right">工作地区<span
                  class="mui-pull-right account-setting-field">{{ work_city?work_city:'请选择' }}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a href="#account_address_detail" class="mui-navigate-right">详细地址<span
                  class="mui-pull-right account-setting-field">{{ user.info.address_detail ? user.info.address_detail : '必填'}}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a class="mui-navigate">联系手机<span
                  class="mui-pull-right account-setting-field">{{ user.info.mobile ? user.info.mobile : '必填'
                  }}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a href="#account_email" class="mui-navigate-right">电子邮箱<span
                  class="mui-pull-right account-setting-field">{{ user.info.email ? user.info.email : '必填'}}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a @tap.stop.prevent="initBirthday" class="mui-navigate-right">出生日期<span
                  class="mui-pull-right account-setting-field">{{user.info.birthday ? user.info.birthday : '请选择'}}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a class="mui-navigate-right" @tap.stop.prevent="selectHomeCity">家乡地区<span class="mui-pull-right account-setting-field">请选择</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a href="#account_description" class="mui-navigate-right">个人签名<span
                  class="mui-pull-right account-setting-field mui-ellipsis">{{user.info.description ? user.info.description : '请填写'}}</span></a>
              </li>
            </ul>
            <div class="account_item_title">
              工作经历<a @tap.stop.prevent="$router.push('/my/info/job/0')" class="mui-pull-right"><span class="iplus mui-icon fa  fa-plus"></span></a>
            </div>
            <ul class="mui-table-view mui-table-view-chevron" v-show="user.jobs.length == 0">
              <li class="mui-table-view-cell no-empty">请维护工作经历</li>
            </ul>
            <ul class="mui-table-view mui-table-view-chevron">
              <li v-for="job in user.jobs" class="mui-table-view-cell">
                <a  @tap.stop.prevent="$router.push('/my/info/job/' + job.id)" class="mui-navigate-right">
                  {{ job.company }}
                  <p class='mui-ellipsis'>{{ job.title }} | {{ job.begin_time }} ~ {{ job.end_time }}</p>
                </a>
              </li>
            </ul>
            <div class="account_item_title">
              项目经历<a @tap.stop.prevent="$router.push('/my/info/project/0')" class="mui-pull-right"><span class="iplus mui-icon fa  fa-plus"></span></a>
            </div>
            <ul class="mui-table-view mui-table-view-chevron" v-show="user.projects.length == 0">
              <li class="mui-table-view-cell no-empty">请维护项目经历</li>
            </ul>
            <ul class="mui-table-view mui-table-view-chevron">
              <li v-for="project in user.projects" class="mui-table-view-cell">
                <a @tap.stop.prevent="$router.push('/my/info/project/'+project.id)" class="mui-navigate-right">
                  {{ project.project_name }}
                  <p class='mui-ellipsis'>{{ project.begin_time }} ~ {{ project.end_time }} | {{ project.title }}</p>
                </a>
              </li>
            </ul>
            <div class="account_item_title">
              教育经历<a @tap.stop.prevent="$router.push('/my/info/edu/0')" class="mui-pull-right"><span class="iplus mui-icon fa  fa-plus"></span></a>
            </div>
            <ul class="mui-table-view mui-table-view-chevron" v-show="user.edus.length == 0">
              <li class="mui-table-view-cell no-empty">请维护教育经历</li>
            </ul>
            <ul class="mui-table-view mui-table-view-chevron">
              <li v-for="edu in user.edus" class="mui-table-view-cell">
                <a @tap.stop.prevent="$router.push('/my/info/edu/'+edu.id)" class="mui-navigate-right">
                  {{ edu.school }}
                  <p class='mui-ellipsis'>{{ edu.begin_time }} ~ {{ edu.end_time }} | {{ edu.major }} | {{ edu.degree
                  }}</p>
                </a>
              </li>
            </ul>
            <div class="account_item_title">
              培训认证<a @tap.stop.prevent="$router.push('/my/info/train/0')" class="mui-pull-right"><span
              class="iplus mui-icon fa  fa-plus"></span></a>
            </div>
            <ul class="mui-table-view mui-table-view-chevron" v-show="user.trains.length == 0">
              <li class="mui-table-view-cell no-empty">请维护培训认证经历</li>
            </ul>
            <ul class="mui-table-view mui-table-view-chevron">
              <li v-for="train in user.trains" class="mui-table-view-cell">
                <a @tap.stop.prevent="$router.push('/my/info/train/'+train.id)" class="mui-navigate-right">
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

    <!--行业领域模板开始-->
    <div id="page_industry_tags" class="mui-modal mui-pageSub">
      <div class="mui-scroll-wrapper">
        <div class="mui-scroll">
          <!--这里放置真实显示的DOM内容-->
          <industry-tags-indexed-list :tag_type="3" :selected="newItem.industry_tags" :back_id="page_industry_tags_id"
                                      :object_type="object_type" v-on:selectedIndustryTags="selectedIndustryTags">

          </industry-tags-indexed-list>
        </div>
      </div>
    </div>
    <!--行业领域模板结束-->


    <!--编辑姓名开始-->
    <div id="account_name" class="mui-page mui-pageSub">
      <div class="mui-navbar-inner mui-bar mui-bar-nav">
        <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left" @tap.stop.prevent="muiViewBack">取消</a>
        <h1 class="mui-center mui-title">编辑</h1>
        <a @tap.stop.prevent="submitInfo('name')" class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">姓名</label>
                  <input type="text"  placeholder="必填" v-model.trim="user.info.name">
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
        <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left" @tap.stop.prevent="muiViewBack">取消</a>
        <h1 class="mui-center mui-title">编辑</h1>
        <a @tap.stop.prevent="submitInfo('company')" class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">公司</label>
                  <input type="text"  v-model.trim="user.info.company">
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
        <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left" @tap.stop.prevent="muiViewBack">取消</a>
        <h1 class="mui-center mui-title">编辑</h1>
        <a @tap.stop.prevent="submitInfo('title')" class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">当前职位</label>
                  <input type="text"  v-model.trim="user.info.title">
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
        <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left" @tap.stop.prevent="muiViewBack">取消</a>
        <h1 class="mui-center mui-title">编辑</h1>
        <a @tap.stop.prevent="submitInfo('email')" class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">电子邮箱</label>
                  <input type="text"  v-model.trim="user.info.email">
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
        <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left" @tap.stop.prevent="muiViewBack">取消</a>
        <h1 class="mui-center mui-title">编辑</h1>
        <a @tap.stop.prevent="submitInfo('address_detail')"
           class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label>详细地址</label>
                  <input type="text"  v-model.trim="user.info.address_detail">
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
        <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left" @tap.stop.prevent="muiViewBack">取消</a>
        <h1 class="mui-center mui-title">个人签名</h1>
        <a @tap.stop.prevent="submitInfo('description')" class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
      </div>
      <div class="mui-page-content">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <textarea v-model.trim="user.info.description" rows="5"
                            placeholder="个人签名"></textarea>
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
  import {NOTICE, USERS_APPEND} from '../../stores/types';
  import {apiRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';
  import popPickerComponent from '../../components/picker/poppicker.vue';
  import "../../js/mui.view";
  import cityData from '../../components/city/city.data';
  import ACCOUNT_API from '../../api/account';
  import dPickerComponent from '../../components/picker/date-picker.vue';
  import {updateUserInfoCache, getUserInfo} from '../../utils/user';
  import industryTagsIndexedList from '../Tags/industryTagsIndexedlist.vue';

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
          address_detail:'',
          email:'',
          birthday:'',
          description:'',
          industry_tags:[],
        },
        jobs: [],
        edus: [],
        projects: [],
        trains: []
      },
      newItem: {
        'begin_time': '',
        'end_time': '',
        'description': '',
        'degree': '',
        'certificate': '',
        'agency': '',
        'get_time': '',
        'project_name': '',
        'customer_name': '',
        'industry_tags': [],
        'product_tags': []
      },
      userInfoBmp: '',
      newItemChange: '',
      gender_object: [
        "保密",
        "男",
        "女"
      ],
      loading: true,
      loading_gif: loading_gif,
      cityPicker: null,
      muiView: {},
      descMaxLength: 2000,
      page_industry_tags_id: 'page_industry_tags',
      page_product_tags_id: 'page_product_tags',
      work_city:'',
      object_type: 'user'
    }),
    created () {

      this.getUserInfo();

      /*
       apiRequest(`profile/info`,{}).then(response_data => {
       if (response_data !== false){
       this.user = response_data;
       this.loading = 0;
       } else {
       this.$router.go(-1);
       }
       });
       */
    },
    components: {
      popPickerComponent,
      dPickerComponent,
      cityData,
      industryTagsIndexedList
    },
    computed: {
      genderName: function () {
        return this.gender_object[this.user.info.gender];
      },
      userIndustryTagsNames() {
        if (this.user.info.industry_tags) {
          return this.user.info.industry_tags.join();
        } else {
          return '';
        }
      },
      infoIndustryTagsNames() {
        if (this.newItem.industry_tags && this.newItem.industry_tags.length) {
          return this.newItem.industry_tags.join();
        } else {
          return '';
        }
      }
    },
    watch: {
    },
    methods: {
      selectHomeCity(){
          mui.alert('此功能暂不可用');
      },
      selectSex(){

        var userPicker = new mui.PopPicker();

        userPicker.setData([
          {
            value: '1',
            text: '男'
          },
          {
            value: '2',
            text: '女'
          }
        ]);
        userPicker.pickers[0].setSelectedValue(this.user.info.gender);


        userPicker.show(items => {
          this.user.info.gender = items[0].value;
          this.submitInfo();
        });
      },
      selectWorkerCity(isShow){
        if (!this.cityPicker) {
          var cityPicker = new mui.PopPicker({
            layer: 2
          });
          cityPicker.setData(cityData);
          this.cityPicker = cityPicker;

          if (this.user.info) {
            this.cityPicker.pickers[0].setSelectedValue(this.user.info.province, 0, () => {
              this.cityPicker.pickers[1].setSelectedValue(this.user.info.city, 0, () => {
                let cityPickerSelectedProvince = this.cityPicker.pickers[0].getSelectedText();
                let cityPickerSelectedCity = this.cityPicker.pickers[1].getSelectedText();
                this.work_city = cityPickerSelectedProvince + " " + cityPickerSelectedCity;
              });
            });
          }
          return;
        }

        if (!isShow) {
            return;
        }

        this.cityPicker.show(items => {
          this.user.info.province = items[0].value;
          this.user.info.city = items[1].value;
          this.work_city = items[0].text + " " + items[1].text;
          this.newItemChange = '';
          this.submitInfo();
        });
      }
      ,
      getUserInfo()
      {

        this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
          cb(user);

          var newJobs = [];
          for(var i in user.jobs) {
            var info = user.jobs[i];
            var id = info.id;
            newJobs[id] = info;
          }
          localEvent.setLocalItem('jobs', newJobs);


          var newProjects = [];
          for(var i in user.projects) {
            var info = user.projects[i];
            var id = info.id;
            newProjects[id] = info;
          }
          localEvent.setLocalItem('projects', newProjects);


          var newEdus = [];
          for(var i in user.edus) {
            var info = user.edus[i];
            var id = info.id;
            newEdus[id] = info;
          }
          localEvent.setLocalItem('edus', newEdus);


          var newTrains = [];
          for(var i in user.trains) {
            var info = user.trains[i];
            var id = info.id;
            newTrains[id] = info;
          }
          localEvent.setLocalItem('trains', newTrains);



          this.user = user;
          this.loading = 0;

          this.selectWorkerCity(false);

        }));
      }
      ,
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
      }
      ,
      changeIndustryTagsOwner(owner)
      {
        this.object_type = owner;
        if (owner === 'user') {
          this.newItem.industry_tags = this.user.info.industry_tags;
        }
      }
      ,
      selectedIndustryTags(tags, object_type)
      {
        switch (object_type) {
          case 'user':
            this.user.info.industry_tags = tags;
            this.userInfoBmp = '';
            this.submitInfo();
            break;
          default:
            this.newItem.industry_tags = tags;
            break;
        }
      }
      ,
      selectedProductTags(tags, object_type)
      {
        this.newItem.product_tags = tags;
      },
      muiViewBack: function () {
        if (this.userInfoBmp !== '') {
          this.user.info = JSON.parse(this.userInfoBmp);
        }

        this.muiView.back();
      }
      ,
      initDate: function (objType) {
        let currentDate = new Date();

        var toNow = false;

        if (objType === 2) {
          toNow = true;
        }

        let param = {
          "type": "month",
          "beginYear": "1990",
          "endYear": currentDate.getFullYear(),
          "toNow": toNow
        };

        let picker = new mui.DtPicker(param);
        picker.show((rs) => {

          rs.text = rs.text === '至今-至今' ? '至今' : rs.text;

          switch (objType) {
            case 1 :
              this.newItem.begin_time = rs.text;
              break;
            case 2:
              this.newItem.end_time = rs.text;
              break;
            case 3:
              this.newItem.get_time = rs.text;
              break;
          }
        });
      }
      ,
      initBirthday: function () {
        let currentDate = new Date();
        let param = {
          "type": "date",
          "beginYear": "1900",
          "endYear": currentDate.getFullYear()
        };
        let picker = new mui.DtPicker(param);
        picker.show((rs) => {
          this.user.info.birthday = rs.text;
          this.submitInfo();
        });
      }
      ,
      submitInfo: function (type) {

        switch (type) {
          case 'name':
            if (!this.user.info.name) {
              mui.toast('请填写姓名');
              return false;
            }
            break;
          case 'company':
            if (!this.user.info.company) {
              mui.toast('请填写公司名称');
              return false;
            }
            break;
          case 'title':
            if (!this.user.info.title) {
              mui.toast('请填写当前职位');
              return false;
            }
            break;
          case 'address_detail':
            if (!this.user.info.address_detail) {
              mui.toast('请填写详细地址');
              return false;
            }
            break;
          case 'email':
            if (!this.user.info.email) {
              mui.toast('请填写电子邮箱');
              return false;
            }
            break;
          case 'description':
            if (!this.user.info.description) {
              mui.toast('请填写个人签名');
              return false;
            }
            break;
        }

        var data = this.user.info;
        apiRequest(`profile/update`, data).then(res => {
          if (res !== false) {
            mui.toast('保存成功');
            this.userInfoBmp = '';
            this.muiViewBack();
          }
        });
      }
      ,
      removeArrByItemId: function (arr, id) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id == id) {
            arr.splice(i, 1);
            break;
          }
        }
      }
      ,
      sortArrByBeginTime: function (a, b) {
        return a.begin_time < b.begin_time;
      },
      initViewApi:function(){
        //初始化单页view
        var viewApi = mui('#app_account_info').view({
          defaultPage: '#setting'
        });

        var view = viewApi.view;
        var t = this;
        (function ($) {
          //处理view的后退与webview后退
          var oldBack = $.back;
          $.back = function () {
            if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
              viewApi.back();
            } else { //执行webview后退
              oldBack();
            }
          };
          //监听页面切换事件方案1,通过view元素监听所有页面切换事件，目前提供pageBeforeShow|pageShow|pageBeforeBack|pageBack四种事件(before事件为动画开始前触发)
          //第一个参数为事件名称，第二个参数为事件回调，其中e.detail.page为当前页面的html对象
          view.addEventListener('pageBeforeShow', function (e) {
            //console.log(e);
          });
          view.addEventListener('pageShow', function (e) {
            t.newItemChange = JSON.stringify(t.newItem);
            t.userInfoBmp = JSON.stringify(t.user.info);
          });
          view.addEventListener('pageBeforeBack', function (e) {


          });
          view.addEventListener('pageBack', function (e) {
          });
        })(mui);
        this.muiView = viewApi;
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
      galleryImg:function(){
        plus.gallery.pick((a) => {
          this.toClip(a);
        }, function (a) {
        }, {
          filter: "image"
        })
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
      }
    },
    beforeRouteEnter (to, from, next) {
        if (from.path === '/my') {
          localEvent.setLocalItem('infoLast', {});
        }
        next();
    },
    mounted () {
      mui('.mui-scroll-wrapper').scroll();

      this.initViewApi();

      mui('.mui-scroll-wrapper').on('scrollend', '.mui-scroll', function(event){
        var lastY = event.detail.lastY;
        localEvent.setLocalItem('infoLast', {lastY:lastY})
      });

      var infoLast = localEvent.getLocalItem('infoLast');
      if (mui.os.plus) {
        mui.plusReady(function () {
          if (infoLast) {
             var lastY = infoLast.lastY;
          }
          mui('#infoWrapper').pullRefresh().scrollTo(0,lastY,0)
        });
      } else {
        if (infoLast) {
          var lastY = infoLast.lastY;
        }
        mui('#infoWrapper').pullRefresh().scrollTo(0,lastY,0)
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

  .account_item_title {
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
    background-color: #f7f7f8;
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
  .mui-table-view-cell .mui-navigate {
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
    height: 32px;
    color: #3f3f3f;
    padding-right: 0;
  }

  .mui-input-row label{
    padding-right:0;
  }

  .mui-input-row textarea {
    border: none !important;
  }

  .mui-input-row input {
    text-align: right;
    padding-right: 40px;
  }

  .mui-input-row a {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    line-height: 1.1;
    float: left;
    width: 35%;
    padding: 11px 15px;
  }

  .avatar {
    z-index: 9;
    color: #ffffff;
    position: absolute;
    height: 110px;
    width: 110px;
    right: 30px;
    top: 20px;
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

  .personCard {
    margin-top: 15px;
    position: relative;
    width: 100%;
    padding-right: 0px;
    height: 154px;
    background: #fff;
    font-size: 14px;
    color: #555;
    font-weight: bold;
  }

  .personCard .avatar {
    position: absolute;
  }

  .personCard .mui-icon {
    font-size: 24px;
    position: absolute;
    left: 160px;
    top: 30px;
  }

  .personCard .title {
    margin-top: 25px;
  }

  .personCard .titleSub {
    margin-top: 25px;
  }

  .personCard .titleSub span {
    color: #3f51b5;
    font-size: 22px;
    margin-left: 15px;
  }

  .mui-pageSub .mui-table-view-cell {
    padding: 0;
  }

  .textarea-wrapper {
    margin: 0 5px;
    height: 100%;
    position: relative;
    border-radius: 5px;
    border: 1px solid #bbbbbb;
    background: #fff;
    padding-bottom: 20px;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 4px;
    font-size: 12px;
    bottom: 2px;
    color: #b0b0b0;
  }

  .textarea-wrapper textarea {
    border: none;
    margin: 0;
    padding-bottom: 0;
  }

  .deleteWrapper {
    text-align: right;
    padding: 10px;
  }

  .mui-bar .save {
    font-size: 14px;
  }

  .no-empty {
    color: #999;
  }

  .iplus {
    color: #007aff;;
    font-size: 16px;
    vertical-align: text-top;
    margin-right: 10px;
  }

  .emptyFields {
    color: #999;
  }

</style>
