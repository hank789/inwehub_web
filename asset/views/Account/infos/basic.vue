<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="muiViewBack2"></a>
      <h1 class="mui-title">我的档案</h1>
    </header>

      <div class="mui-content">
            <ul class="mui-table-view mui-table-view-chevron">
              <li class="mui-table-view-cell">
                <a @tap.stop.prevent="$router.push('/my/info/basic/name')" class="mui-navigate-right">用户姓名<span
                  class="mui-pull-right account-setting-field mui-ellipsis">{{ user.info.name ? user.info.name : '必填' }}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a @tap.stop.prevent="selectSex" class="mui-navigate-right">用户性别<span
                  class="mui-pull-right account-setting-field mui-ellipsis">{{ genderName ? genderName : '请选择'}}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a @tap.stop.prevent="$router.push('/my/info/basic/company')" class="mui-navigate-right">当前公司<span
                  class="mui-pull-right account-setting-field mui-ellipsis">{{ user.info.company ? user.info.company : '必填' }}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a @tap.stop.prevent="$router.push('/my/info/basic/position')" class="mui-navigate-right">当前职位<span
                  class="mui-pull-right account-setting-field mui-ellipsis">{{ user.info.title ? user.info.title : '必填'}}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a href="#page_industry_tags" @tap="changeIndustryTagsOwner('user')"
                   class="mui-navigate-right">行业领域<span
                  class="mui-pull-right account-setting-field mui-ellipsis">{{ userIndustryTagsNames ? userIndustryTagsNames : '可多选'
                  }}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a @tap.stop.prevent="selectWorkerCity(true)" class="mui-navigate-right">工作地区<span
                  class="mui-pull-right account-setting-field mui-ellipsis">{{ work_city !== ' '?work_city:'请选择' }}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a @tap.stop.prevent="$router.push('/my/info/basic/address')" class="mui-navigate-right">详细地址<span
                  class="mui-pull-right account-setting-field mui-ellipsis">{{ user.info.address_detail ? user.info.address_detail : '必填'}}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a class="mui-navigate">联系手机<span
                  class="mui-pull-right account-setting-field mui-ellipsis">{{ user.info.mobile ? user.info.mobile : '必填'
                  }}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a @tap.stop.prevent="$router.push('/my/info/basic/email')" class="mui-navigate-right">电子邮箱<span
                  class="mui-pull-right account-setting-field mui-ellipsis">{{ user.info.email ? user.info.email : '必填'}}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a @tap.stop.prevent="initBirthday" class="mui-navigate-right">出生日期<span
                  class="mui-pull-right account-setting-field mui-ellipsis">{{user.info.birthday ? user.info.birthday : '请选择'}}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a class="mui-navigate-right" @tap.stop.prevent="selectHomeCity">家乡地区<span class="mui-pull-right account-setting-field mui-ellipsis">{{ home_city !== ' '?home_city:'请选择' }}</span></a>
              </li>
              <li class="mui-table-view-cell">
                <a @tap.stop.prevent="$router.push('/my/info/basic/description')" class="mui-navigate-right">个人签名<span
                  class="mui-pull-right account-setting-field mui-ellipsis">{{user.info.description ? user.info.description : '请填写'}}</span></a>
              </li>
            </ul>
        </div>

    <div id="page_industry_tags" class="mui-modal mui-pageSub">

          <!--这里放置真实显示的DOM内容-->
          <industry-tags-indexed-list :tag_type="3" :selected="newItem.industry_tags" :back_id="page_industry_tags_id"
                                      :object_type="object_type" v-on:selectedIndustryTags="selectedIndustryTags">

          </industry-tags-indexed-list>
    </div>

  </div>

</template>

<script>
  import {NOTICE, USERS_APPEND} from '../../../stores/types';
  import {apiRequest} from '../../../utils/request';
  import localEvent from '../../../stores/localStorage';
  import popPickerComponent from '../../../components/picker/poppicker.vue';
  import "../../../js/mui.view";
  import cityData from '../../../components/city/city.data';
  import ACCOUNT_API from '../../../api/account';
  import dPickerComponent from '../../../components/picker/date-picker.vue';
  import {updateUserInfoCache, getUserInfo} from '../../../utils/user';
  import industryTagsIndexedList from '../../Tags/industryTagsIndexedlist.vue';

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
      loading: false,
      cityPicker: null,
      muiView: {},
      descMaxLength: 2000,
      page_industry_tags_id: 'page_industry_tags',
      page_product_tags_id: 'page_product_tags',
      work_city:'',
      home_city:'',
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
          var newValue = [];
          for (var i in this.user.info.industry_tags) {
            newValue.push(this.user.info.industry_tags[i].text);
          }
          return newValue.join();
        } else {
          return '';
        }
      },
      userIndustryTagsCodes(){
        var newValue = [];
        for (var i in this.user.info.industry_tags) {
          if (typeof(this.user.info.industry_tags[i]) === 'object') {
            newValue.push(this.user.info.industry_tags[i].value);
          } else {
            newValue.push(this.user.info.industry_tags[i]);
          }
        }
        return newValue;
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
      fixSelect:function(){
        setTimeout(() => {
          mui.trigger(mui('.mui-indexed-list-item')[0],'tap');
          mui.trigger(mui('.mui-indexed-list-item')[0],'tap');
        }, 200)
      },
      selectHomeCity(){
        var cityPicker = new mui.PopPicker({
          layer: 2
        });
        cityPicker.setData(cityData);

        if (this.user.info) {
          cityPicker.pickers[0].setSelectedValue(this.user.info.hometown_province.key, 0, () => {
            cityPicker.pickers[1].setSelectedValue(this.user.info.hometown_city.key, 0, () => {
            });
          });
        }

        cityPicker.show(items => {
          this.user.info.hometown_province = items[0].value;
          this.user.info.hometown_city = items[1].value;
          this.home_city = items[0].text + " " + items[1].text;
          this.newItemChange = '';
          this.submitInfo();
          cityPicker.dispose();
        });
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
          userPicker.dispose();
        });
      },
      selectWorkerCity(isShow){

        var cityPicker = new mui.PopPicker({
          layer: 2
        });
        cityPicker.setData(cityData);

        if (this.user.info) {
          cityPicker.pickers[0].setSelectedValue(this.user.info.province.key, 0, () => {
            cityPicker.pickers[1].setSelectedValue(this.user.info.city.key, 0, () => {
              let cityPickerSelectedProvince = cityPicker.pickers[0].getSelectedText();
              let cityPickerSelectedCity = cityPicker.pickers[1].getSelectedText();
            });
          });
        }

        cityPicker.show(items => {
          this.user.info.province = items[0].value;
          this.user.info.city = items[1].value;
          this.work_city = items[0].text + " " + items[1].text;
          this.newItemChange = '';
          this.submitInfo();

          cityPicker.dispose();
        });
      },
      getUserInfo()
      {

        var userInfo = localEvent.getLocalItem('UserInfoReal');
        if (userInfo) {
          this.work_city = userInfo.info.province.name + ' ' + userInfo.info.city.name;
          this.home_city = userInfo.info.hometown_province.name + ' ' + userInfo.info.hometown_city.name;

          this.user = userInfo;
          this.loading = 0;
        }

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

          this.work_city = user.info.province.name + ' ' + user.info.city.name;
          this.home_city = user.info.hometown_province.name + ' ' + user.info.hometown_city.name;

          this.user = user;
          this.loading = 0;

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
        this.fixSelect();
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
      muiViewBack2: function () {
        mui.back();
      },
      muiViewBack: function () {
        if (this.userInfoBmp !== '') {
          this.user.info = JSON.parse(this.userInfoBmp);
        }
        //mui.back();
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
          "beginYear": "1970",
          "endYear": currentDate.getFullYear(),
          "toNow": toNow,
          "value": "1990-07-01"
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
        var value = '1990-07-01';
        if (this.user.info.birthday) {
           value = this.user.info.birthday;
        }
        let currentDate = new Date();
        let param = {
          "type": "date",
          "beginYear": "1950",
          "endYear": currentDate.getFullYear(),
          "value":value
        };
        let picker = new mui.DtPicker(param);

        picker.show((rs) => {
          this.user.info.birthday = rs.text;
          this.submitInfo();
          picker.dispose();
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
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!re.test(this.user.info.email)){
              mui.toast('电子邮箱格式错误');
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

        var json = JSON.stringify(this.user.info);
        var data = JSON.parse(json);
        if (typeof(data.city) === 'object') {
            data.city = data.city.key;
        }
        if (typeof(data.province) === 'object') {
          data.province = data.province.key;
        }

        if (typeof(data.hometown_city) === 'object') {
          data.hometown_city = data.hometown_city.key;
        }
        if (typeof(data.hometown_province) === 'object') {
          data.hometown_province = data.hometown_province.key;
        }

        data.industry_tags = this.userIndustryTagsCodes;


        apiRequest(`profile/update`, data).then(res => {
          if (res !== false) {
            mui.toast('保存成功');
            this.userInfoBmp = '';
            this.muiViewBack();
            this.getUserInfo();
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
    beforeRouteLeave(to, from, next) {
      var popDiv = document.querySelector('.mui-dtpicker');
      if (popDiv) {
        document.body.removeChild(popDiv);
      }


      popDiv = document.querySelector('.mui-poppicker');
      if (popDiv) {
        document.body.removeChild(popDiv);
      }

      next();
    }
  }
</script>
<style scoped>
  .account_item_title {
    padding: 5px;
    color: #a6a6a6;
    font-size: 12px;
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
    margin-top: 0;
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

  .titleSubSub{
    font-size:12px;
    color:#999;
  }

  .mui-content > .mui-table-view:first-child{
    margin-top:0;
  }
</style>
