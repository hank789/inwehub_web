<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back :tapCallback="muiViewBack2"></Back>
      <h1 class="mui-title">基本资料</h1>
    </header>

    <div class="mui-content">
      <div class="secrecy">(真实姓名/性别/地址/联系方式/生日) 平台将做保密处理。</div>
      <ul class="muiTableView mui-table-view-chevron">
        <li class="mui-table-view-cell">
          <a @tap.stop.prevent="$router.push('/my/info/basic/name')" class="mui-navigate-right">平台昵称<span
            class="mui-pull-right account-setting-field mui-ellipsis">{{ user.info.name ? user.info.name : '必填'
            }}</span></a>
        </li>
        <li class="mui-table-view-cell">
          <a @tap.stop.prevent="$router.push('/my/info/basic/realname')" class="mui-navigate-right">真实姓名<span
            class="mui-pull-right account-setting-field mui-ellipsis">{{ user.info.realname ? user.info.realname : '必填'
            }}</span></a>
        </li>
        <li class="mui-table-view-cell">
          <a @tap.stop.prevent="selectSex" class="mui-navigate-right">用户性别<span
            class="mui-pull-right account-setting-field mui-ellipsis">{{ genderName ? genderName : '请选择'}}</span></a>
        </li>
        <li class="mui-table-view-cell">
          <a @tap.stop.prevent="$router.push('/selectCompany?from=infobasic')" class="mui-navigate-right">当前公司<span
            class="mui-pull-right account-setting-field mui-ellipsis">{{ user.info.company ? user.info.company : '必填'
            }}</span></a>
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
            class="mui-pull-right account-setting-field mui-ellipsis">{{ work_city !== ' ' ? work_city : '请选择' }}</span></a>
        </li>
        <li class="mui-table-view-cell">
          <a @tap.stop.prevent="$router.push('/my/info/basic/address')" class="mui-navigate-right">详细地址<span
            class="mui-pull-right account-setting-field mui-ellipsis">{{ user.info.address_detail ? user.info.address_detail : '必填'}}</span></a>
        </li>
        <li class="mui-table-view-cell" @tap.stop.prevent="$router.pushPlus('/wechat/bindPhone')">
          <a class="mui-navigate-right mui-navigate">联系手机<span
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
          <a class="mui-navigate-right" @tap.stop.prevent="selectHomeCity">家乡地区<span
            class="mui-pull-right account-setting-field mui-ellipsis">{{ home_city !== ' ' ? home_city : '请选择' }}</span></a>
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
  import { USERS_APPEND } from '../../../stores/types'
  import { apiRequest } from '../../../utils/request'
  import localEvent from '../../../stores/localStorage'
  import popPickerComponent from '../../../components/picker/poppicker.vue'
  import cityData from '../../../components/city/city.data'
  import dPickerComponent from '../../../components/picker/date-picker.vue'
  import { getUserInfo } from '../../../utils/user'
  import industryTagsIndexedList from '../../Tags/IndustryTagsIndexedlist.vue'
  import { selectCityThreeLevel } from '../../../utils/select'

  export default {
    data: () => ({
      user: {
        info: {
          name: '',
          gender: '',
          company: '',
          title: '',
          province: '',
          city: '',
          hometown_city: '',
          hometown_province: '',
          address_detail: '',
          email: '',
          birthday: '',
          description: '',
          realname: '',
          industry_tags: []
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
        '保密',
        '男',
        '女'
      ],
      loading: false,
      cityPicker: null,
      muiView: {},
      descMaxLength: 2000,
      page_industry_tags_id: 'page_industry_tags',
      page_product_tags_id: 'page_product_tags',
      work_city: '',
      home_city: '',
      object_type: 'user'
    }),
    created () {
      // showInwehubWebview();
      this.getUserInfo()
    },
    components: {
      popPickerComponent,
      dPickerComponent,
      cityData,
      industryTagsIndexedList
    },
    computed: {
      genderName: function () {
        return this.gender_object[this.user.info.gender]
      },
      userIndustryTagsNames () {
        if (this.user.info.industry_tags) {
          var newValue = []
          for (var i in this.user.info.industry_tags) {
            newValue.push(this.user.info.industry_tags[i].text)
          }
          return newValue.join()
        } else {
          return ''
        }
      },
      userIndustryTagsCodes () {
        var newValue = []
        for (var i in this.user.info.industry_tags) {
          if (typeof (this.user.info.industry_tags[i]) === 'object') {
            newValue.push(this.user.info.industry_tags[i].value)
          } else {
            newValue.push(this.user.info.industry_tags[i])
          }
        }
        return newValue
      },
      infoIndustryTagsNames () {
        if (this.newItem.industry_tags && this.newItem.industry_tags.length) {
          return this.newItem.industry_tags.join()
        } else {
          return ''
        }
      }
    },
    watch: {},
    methods: {
      refreshPageData () {
        this.getUserInfo()
      },
      fixSelect: function () {
        setTimeout(() => {
          window.mui.trigger(window.mui('.mui-indexed-list-item')[0], 'tap')
          window.mui.trigger(window.mui('.mui-indexed-list-item')[0], 'tap')
        }, 200)
      },
      selectHomeCity () {
        var cityPicker = new window.mui.PopPicker({
          layer: 2
        })
        cityPicker.setData(cityData)

        if (this.user.info) {
          cityPicker.pickers[0].setSelectedValue(this.user.info.hometown_province.key, 0, () => {
            cityPicker.pickers[1].setSelectedValue(this.user.info.hometown_city.key, 0, () => {
            })
          })
        }

        cityPicker.show(items => {
          this.user.info.hometown_province = items[0].value
          this.user.info.hometown_city = items[1].value
          this.home_city = items[0].text + ' ' + items[1].text
          this.newItemChange = ''
          this.submitInfo()
          cityPicker.dispose()
        })
      },
      selectSex () {
        var userPicker = new window.mui.PopPicker()

        userPicker.setData([
          {
            value: '1',
            text: '男'
          },
          {
            value: '2',
            text: '女'
          }
        ])
        userPicker.pickers[0].setSelectedValue(this.user.info.gender)

        userPicker.show(items => {
          this.user.info.gender = items[0].value
          this.submitInfo()
          userPicker.dispose()
        })
      },
      selectWorkerCity (isShow) {
//        var cityPicker = new window.mui.PopPicker({
//          layer: 2
//        })
//        cityPicker.setData(cityData)
//
//        if (this.user.info) {
//          cityPicker.pickers[0].setSelectedValue(this.user.info.province.key, 0, () => {
//            cityPicker.pickers[1].setSelectedValue(this.user.info.city.key, 0, () => {
//              // let cityPickerSelectedProvince = cityPicker.pickers[0].getSelectedText();
//              // let cityPickerSelectedCity = cityPicker.pickers[1].getSelectedText();
//            })
//          })
//        }
//
//        cityPicker.show(items => {
//          this.user.info.province = items[0].value
//          this.user.info.city = items[1].value
//          this.work_city = items[0].text + ' ' + items[1].text
//          this.newItemChange = ''
//          this.submitInfo()
//
//          cityPicker.dispose()
//        })
        var newCityData = [
          {
            value: '1',
            text: '中国',
            children: cityData
          },
          {
            value: '2',
            text: '海外',
            children: []
          }
        ]

        var defaultValues = null
        // 三联组件
        selectCityThreeLevel(defaultValues, newCityData, (items) => {
          var obj = {
            value: items[2].value ? items[2].value : items[0].value,
            text: items[2].text ? items[1].text + ' ' + items[2].text : items[0].text
          }
          if (obj.value === '2') {
            window.mui.prompt('输入海外地点', '', ' ', ['确定', '取消'], (e) => {
              if (e.index === 0) {
                if (e.value) {
                  obj = {
                    value: e.value,
                    text: e.value
                  }
                  console.log(items)
                  console.log(e.value)
                  this.user.info.province = {
                    key: items[0].text,
                    name: items[0].text
                  }
                  this.user.info.city = {
                    key: e.value,
                    name: e.value
                  }
                  this.work_city = e.value
                  this.newItemChange = ''
                  this.submitInfo()
                }
              }
            }, 'div')
          } else {
            this.user.info.province = {
              key: items[1].value,
              name: items[1].text
            }
            this.user.info.city = {
              key: items[2].value,
              name: items[2].text
            }
            this.work_city = obj.text
            this.newItemChange = ''
            this.submitInfo()
          }
        })
      },
      getUserInfo () {
        this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
          cb(user)

          if (user.info.province.name) {
            this.work_city = user.info.province.name + ' ' + user.info.city.name
          }
          if (user.info.hometown_province.name) {
            this.home_city = user.info.hometown_province.name + ' ' + user.info.hometown_city.name
          }

          this.user = user
          this.loading = 0
        }))
      },
      toClip (path) {
        var t = this
        window.plus.zip.compressImage({
          src: path,
          dst: '_doc/c.jpg',
          overwrite: true,
          quality: 20
        },
          function (event) {
            var newurl = window.plus.io.convertLocalFileSystemURL(event.target)
            if (window.mui.os.ios) {
              newurl = 'file://' + newurl
            }

            window.plus.io.resolveLocalFileSystemURL(newurl, function (entry) {
              t.localUrl = entry.toRemoteURL()
              localEvent.setLocalItem('avatar', {url: t.localUrl, path: entry.toLocalURL()})
              t.$router.push('/header')
            }, function (error) {
              alert(error.message)
            })
          }, function (error) {
            alert('Compress error!' + error.message)
          })
      },
      changeIndustryTagsOwner (owner) {
        this.fixSelect()
        this.object_type = owner
        if (owner === 'user') {
          this.newItem.industry_tags = this.user.info.industry_tags
        }
      },
      selectedIndustryTags (tags, objectType) {
        switch (objectType) {
          case 'user':
            this.user.info.industry_tags = tags
            this.userInfoBmp = ''
            this.submitInfo()
            break
          default:
            this.newItem.industry_tags = tags
            break
        }
      },
      selectedProductTags (tags, objectType) {
        this.newItem.product_tags = tags
      },
      muiViewBack2: function () {
        window.mui.back()
      },
      muiViewBack: function () {
        if (this.userInfoBmp !== '') {
          this.user.info = JSON.parse(this.userInfoBmp)
        }
      },
      initDate: function (objType) {
        let currentDate = new Date()

        var toNow = false

        if (objType === 2) {
          toNow = true
        }

        let param = {
          'type': 'month',
          'beginYear': '1970',
          'endYear': currentDate.getFullYear(),
          'toNow': toNow,
          'value': '1990-07-01'
        }

        let picker = new window.mui.DtPicker(param)
        picker.show((rs) => {
          rs.text = rs.text === '至今-至今' ? '至今' : rs.text

          switch (objType) {
            case 1 :
              this.newItem.begin_time = rs.text
              break
            case 2:
              this.newItem.end_time = rs.text
              break
            case 3:
              this.newItem.get_time = rs.text
              break
          }
        })
      },
      initBirthday: function () {
        var value = '1990-07-01'
        if (this.user.info.birthday) {
          value = this.user.info.birthday
        }
        let currentDate = new Date()
        let param = {
          'type': 'date',
          'beginYear': '1950',
          'endYear': currentDate.getFullYear(),
          'value': value
        }
        let picker = new window.mui.DtPicker(param)

        picker.show((rs) => {
          this.user.info.birthday = rs.text
          this.submitInfo()
          picker.dispose()
        })
      },
      submitInfo: function (type) {
        switch (type) {
          case 'name':
            if (!this.user.info.name) {
              window.mui.toast('请填写平台昵称')
              return false
            }
            break
          case 'realname':
            if (!this.user.info.realname) {
              window.mui.toast('请填写真实姓名')
              return false
            }
            break
          case 'company':
            if (!this.user.info.company) {
              window.mui.toast('请填写公司名称')
              return false
            }
            break
          case 'title':
            if (!this.user.info.title) {
              window.mui.toast('请填写当前职位')
              return false
            }
            break
          case 'address_detail':
            if (!this.user.info.address_detail) {
              window.mui.toast('请填写详细地址')
              return false
            }
            break
          case 'email':
            if (!this.user.info.email) {
              window.mui.toast('请填写电子邮箱')
              return false
            }
            var re = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (!re.test(this.user.info.email)) {
              window.mui.toast('电子邮箱格式错误')
              return false
            }
            break
          case 'description':
            if (!this.user.info.description) {
              window.mui.toast('请填写个人签名')
              return false
            }
            break
        }

        var json = JSON.stringify(this.user.info)
        var data = JSON.parse(json)
        if (typeof (data.city) === 'object') {
          data.city = data.city.key
        }
        if (typeof (data.province) === 'object') {
          data.province = data.province.key
        }

        if (typeof (data.hometown_city) === 'object') {
          data.hometown_city = data.hometown_city.key
        }
        if (typeof (data.hometown_province) === 'object') {
          data.hometown_province = data.hometown_province.key
        }

        data.industry_tags = this.userIndustryTagsCodes

        apiRequest(`profile/update`, data).then(res => {
          if (res !== false) {
            window.mui.toast('保存成功')
            this.userInfoBmp = ''
            this.muiViewBack()
            this.getUserInfo()
          }
        })
      },
      removeArrByItemId: function (arr, id) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id === id) {
            arr.splice(i, 1)
            break
          }
        }
      },
      sortArrByBeginTime: function (a, b) {
        return a.begin_time < b.begin_time
      },
      getImage: function () {
        var t = this
        var c = window.plus.camera.getCamera()
        c.captureImage(function (e) {
          t.toClip(e)
        }, function (s) {
          console.log('error' + s)
        }, {
          filename: '_doc/head.jpg'
        })
      },
      galleryImg: function () {
        window.plus.gallery.pick((a) => {
          this.toClip(a)
        }, function (a) {
        }, {
          filter: 'image'
        })
      },
      changeAvatar: function () {
        if (window.mui.os.plus) {
          var a = [{
            title: '拍照'
          }, {
            title: '从手机相册选择'
          }]
          window.plus.nativeUI.actionSheet({
            title: '修改头像',
            cancel: '取消',
            buttons: a
          }, (b) => {
            switch (b.index) {
              case 0:
                break
              case 1:
                this.getImage()
                break
              case 2:
                this.galleryImg()
                break
              default:
                break
            }
          })
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      if (from.path === '/my') {
        localEvent.setLocalItem('infoLast', {})
      }
      next()
    },
    mounted () {
      console.log(this.user.info.realname + 'realname')
    },
    beforeRouteLeave (to, from, next) {
      var popDiv = document.querySelector('.mui-dtpicker')
      if (popDiv) {
        document.body.removeChild(popDiv)
      }

      popDiv = document.querySelector('.mui-poppicker')
      if (popDiv) {
        document.body.removeChild(popDiv)
      }

      next()
    }
  }
</script>
<style scoped lang="less">
  .secrecy {
    height: 0.906rem;
    line-height: 0.906rem;
    color: #B4B4B6;
    font-size: 0.32rem;
    background: #F3F4F6;
    padding-left: 0.426rem;
  }
  .muiTableView {
    position: relative;
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;
    list-style: none;
    background-color: #fff;
  }
  .account_item_title {
    padding: 0.133rem;
    color: #a6a6a6;
    font-size: 0.32rem;
  }

  .mui-navbar {
    position: fixed;
    right: 0;
    left: 0;
    z-index: 10;
    height: 1.173rem;
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
    width: 0.426rem;
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
    margin-bottom: 0.8rem;
  }

  .mui-table-view-cell .mui-navigate-right,
  .mui-table-view-cell .mui-navigate {
    color: #999;
  }

  .mui-table-view-divider {
    background-color: #efeff4;
    font-size: 0.373rem;
  }

  .mui-table-view-divider:before,
  .mui-table-view-divider:after {
    height: 0;
  }

  .head {
    height: 1.066rem;
  }

  .mui-ios .mui-navbar .mui-bar .mui-title {
    position: static;
  }

  .account-setting-field {
    position: absolute;
    text-align: right;
    width: 5.333rem;
    right: 1.066rem;
    height: 0.853rem;
    color: #3f3f3f;
    padding-right: 0;
  }

  .mui-input-row label {
    padding-right: 0;
  }

  .mui-input-row textarea {
    border: none !important;
  }

  .mui-input-row input {
    text-align: right;
    padding-right: 1.066rem;
  }

  .mui-input-row a {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    line-height: 1.1;
    float: left;
    width: 35%;
    padding: 0.293rem 0.4rem;
  }

  .avatar {
    z-index: 9;
    color: #ffffff;
    position: absolute;
    height: 2.933rem;
    width: 2.933rem;
    right: 0.8rem;
    top: 0.533rem;
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

  .personCard {
    margin-top: 0.4rem;
    position: relative;
    width: 100%;
    padding-right: 0rem;
    height: 4.106rem;
    background: #fff;
    font-size: 0.373rem;
    color: #555;
    font-weight: bold;
  }

  .personCard .avatar {
    position: absolute;
  }

  .personCard .mui-icon {
    font-size: 0.64rem;
    position: absolute;
    left: 4.266rem;
    top: 0.8rem;
  }

  .personCard .title {
    margin-top: 0.666rem;
  }

  .personCard .titleSub {
    margin-top: 0.666rem;
  }

  .personCard .titleSub span {
    color: #3f51b5;
    font-size: 0.586rem;
    margin-left: 0.4rem;
  }

  .mui-pageSub .mui-table-view-cell {
    padding: 0;
  }

  .textarea-wrapper {
    margin: 0 0.133rem;
    height: 100%;
    position: relative;
    border-radius: 0.133rem;
    border: 0.026rem solid #bbbbbb;
    background: #fff;
    padding-bottom: 0.533rem;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 0.106rem;
    font-size: 0.32rem;
    bottom: 0.053rem;
    color: #b0b0b0;
  }

  .textarea-wrapper textarea {
    border: none;
    margin: 0;
    padding-bottom: 0;
  }

  .deleteWrapper {
    text-align: right;
    padding: 0.266rem;
  }

  .mui-bar .save {
    font-size: 0.373rem;
  }

  .no-empty {
    color: #999;
  }

  .iplus {
    color: #007aff;;
    font-size: 0.426rem;
    vertical-align: text-top;
    margin-right: 0.266rem;
  }

  .emptyFields {
    color: #999;
  }

  .titleSubSub {
    font-size: 0.32rem;
    color: #999;
  }

  .mui-content > .mui-table-view:first-child {
    margin-top: 0;
  }
</style>
