<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">附近发现</h1>
    </header>
    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
         <div class="switch">
           <p @tap.stop.prevent="$router.replace('/nearbyPeople')">附近的人</p>
           <p>附近的公司</p>
         </div>
          <svg class="icon" aria-hidden="true"  @tap.stop.prevent="$router.pushPlus('/nearbyCompany/MapDetail')">
            <use xlink:href="#icon-ditu"></use>
          </svg>
      </div>

      <!--搜索框-->
     <div class="searchContainer">
       <p>
         <svg class="icon" aria-hidden="true">
           <use xlink:href="#icon-sousuo"></use>
         </svg>
         <input type="text" placeholder="输入公司名称"  v-model.trim="searchText"/>
         <span v-if="isShow"  @tap.stop.prevent="empty()">
           <svg class="icon" aria-hidden="true">
             <use xlink:href="#icon-guanbi"></use>
           </svg>
         </span>
       </p>
     </div>
      <!--搜索列表-->
      <RefreshList
        v-if="dataList != null"
        v-model="list"
        :api="'company/nearbySearch'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        class="listWrapper">
          <ul>
            <li  v-for="(item, index) in list" @tap.stop.prevent="judge(item)" >
              <div class="container-image">
                 <img :src="item.logo"/>
              </div>
              <div class="container-info">
                <p>{{item.name}}</p>
                <p class="mui-ellipsis">
                  <span  v-for="(tags, index) in item.tags" @tap.stop.prevent="toTagDetail(tags)"> {{tags}} <i></i></span>
                </p>
                <p><span>{{item.address_province}}</span> <span>< {{item.distance_format}}</span></p>
              </div>
              <i class="bottom"></i>
            </li>
          </ul>
      </RefreshList>
    </div>
  </div>
</template>


<script>
  import { postRequest } from '../../utils/request'
  import { getGeoPosition } from '../../utils/allPlatform'
  import { checkPermission, toSettingSystem } from '../../utils/plus'
  import RefreshList from '../../components/refresh/List.vue'
  import userAbility from '../../utils/userAbility'
  import localEvent from '../../stores/localStorage'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()

  export default {
    data () {
      return {
        user_id: currentUser.user_id,
        list: [],
        searchText: '',
        loading: 1,
        isShow: false,
        coords: '',
        longt: '',
        lat: '',
        page: 1,
        value: '',
        applyIsShow: true,
        data: '',
        distance: '',
        dataList: null,
        isLocation: false
      }
    },
    components: {
      RefreshList
    },
    created () {
//      初始化测试代码
//      longt: 121.4936901919479,
//        lat: 31.23576356859009,
//      测试代码
//      this.dataList = {
//        longitude: 121.4936901919479,
//        latitude: 31.23576356859009
//      }
//      if (this.dataList.longitude) {
//        localEvent.setLocalItem('location' + this.user_id, this.dataList)
//      }

      checkPermission('LOCATION', () => {
        this.isLocation = true
       //  获取权限成功的回调
        getGeoPosition((position) => {
          this.dataList = {
            longitude: position.longt,
            latitude: position.lat
          }
          this.longt = position.longt
          this.lat = position.lat
//          获取到位置进行保存
          if (this.dataList.longitude) {
            localEvent.setLocalItem('location' + this.user_id, this.dataList)
          }
        }, () => {
          // 获取位置失败的回调
          var btnArray = ['取消', '去设置']
          window.mui.confirm('请在设置中打开定位服务，以启用地址定位或发现附近的企业和个人。', '无法启用定位模式', btnArray, (e) => {
            if (e.index === 1) {
              toSettingSystem('LOCATION')
            } else {
              window.mui.back()
            }
          })
        })
      }, () => {
      // 获取权限失败的回调
        var btnArray = ['取消', '去设置']
        window.mui.confirm('请在设置中打开定位服务，以启用地址定位或发现附近的企业和个人。', '无法启用定位模式', btnArray, (e) => {
          if (e.index === 1) {
            toSettingSystem('LOCATION')
          } else {
            window.mui.back()
          }
        })
      //
      })
    },
    methods: {
      judge (item) {
        postRequest(`auth/checkUserLevel`, {
          permission_type: 5
        }).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data) {
            if (response.data.data.is_valid) {
              this.$router.pushPlus('/companyDetails/' + item.id)
            } else {
              userAbility.jumpJudgeGrade(this)
            }
          }
        })
      },
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      getDistance (num) {
        console.log('num:' + num)
        num = parseFloat(num.substring(0, num.length - 1))
        console.log('num:' + num)
        if (num < 1000) {
          return num.toFixed(0) + 'm'
        } else if (num > 1000) {
          return (num / 1000).toFixed(1) + 'km'
        }
      },
     //  弹窗
      Obtain () {
        var that = this
        var btnArray = ['取消', '确定']
        window.mui.prompt('', '公司名称', '输入公司名称', btnArray, function (e) {
          if (e.index === 1) {
            // 申请添加擅长标签；
            if (e.value) {
              that.applyAddData(e.value)
            }
          }
        }, 'div')
      },
      // 申请添加擅长标签；
      applyAddData (text) {
        postRequest('company/applyAddData', {
          name: text
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          window.mui.toast(response.data.data.tips)
          this.loading = 0
        })
      },
      //  点击清空输入框
      empty () {
        this.searchText = ''
      }
    },
    watch: {
      searchText: function (newValue) {
        if (newValue && this.isLocation) {
          this.value = newValue
          this.dataList = {
            name: newValue,
            page: this.page,
            longitude: this.longt,
            latitude: this.lat
          }
          this.isShow = true
        } else {
          this.isShow = false

          this.applyIsShow = true
        }
      }
    },
    mounted () {
    },
    updated () {
    }
  }
</script>

<style scoped="scoped">
  ul,
  li,
  p,
  span,
  a,
  i,
  input{
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .bot {
    position: absolute;
    right: 4%;
    bottom: 0;
    left: 4%;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .bottom {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .mui-content {
    background:#fefefe;
  }
  /*搜索框*/
  .searchContainer{
    width:100%;
    height:54px;
    background:#f3f4f6;
    padding-top: 10px;
  }
  .searchContainer p{
    width:92%;
    height:34px;
    background: #FFFFFF;
    border-radius: 50px;
    margin-left: 4%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items:center;
    padding:0 12px;
  }
  .searchContainer input{
    width:85%;
    height:100%;
    margin: 0;
    border:none;
    padding: 0;
    padding-left: 0;
    font-size:14px;
    color:#444444;
    float: left;
    margin-left: 10px;
  }
  .searchContainer p svg{
    color:#c8c8c8;
    font-size: 17px;
  }
  .searchContainer span{
    width:18px;
    height:18px;
    background: #c8c8c8;
    border-radius: 50%;
    position: relative;
    float:right;
  }
  .searchContainer span svg{
    color: #FFFFFF;
    position: absolute;
    right:0;
    left:0;
    top:0;
    bottom:0;
    margin:auto;
  }
  /*申请添加*/
/*.apply{*/
  /*width:100%;*/
  /*height:45px;*/
  /*padding: 0 4%;*/
  /*line-height: 45px;*/
  /*}*/
  /*.apply p:nth-of-type(1){*/
    /*float: left;*/
    /*font-size:14px;*/
    /*color:#03aef9;*/
  /*}*/
  /*.apply p:nth-of-type(2){*/
    /*float: right;*/
    /*width:86px;*/
    /*height:27px;*/
    /*border-radius: 50px;*/
    /*border:1px solid #03aef9;*/
    /*font-size:14px;*/
    /*color:#03aef9;*/
    /*text-align: center;*/
    /*line-height: 25px;*/
    /*margin-top: 9px;*/
  /*}*/
  ul{
    width:100%;
    padding: 0 4%;
    overflow: hidden;
  }
  ul li{
    width:100%;
    height:89px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content:space-between;
    align-items:center;
    position: relative;
  }
  ul li .container-image{
    width:42px;
    height:42px;
  }
  .container-info{
    width: 85%;
    height:100%;
    margin-left: 10px;
  }
  .container-info p:nth-of-type(1){
    font-size:16px;
    color:#444444;
    margin-top: 13px;
  }
  .container-info p:nth-of-type(2){
    font-size:14px;
    color: #808080;
    margin:1px 0;
    display: flex;
    flex-direction: row;
    align-items:center;
  }
  .container-info p:nth-of-type(2) span{
    display: flex;
    flex-direction: row;
    align-items:center;
  }
  .container-info p:nth-of-type(2) span i{
    display: inline-block;
    width:1px;
    height:13px;
    background:#dcdcdc;
    margin: 0 5px;
  }
  .container-info p:nth-of-type(2) span:nth-last-child(1) i{
    display: none;
  }
  .container-info p:nth-of-type(3){
    font-size:14px;
    color: #808080;
    display: flex;
    flex-direction: row;
    justify-content:space-between;
  }

  input::-webkit-input-placeholder { /*WebKit browsers*/
    color:#c8c8c8;
    font-size: 14px;
  }
  .listWrapper{
    top:99px;
  }
 /*导航栏*/
  .menu{
    width: 100%;
    height:50px;
    background:#3c3e44;
    position: relative;
  }
  .menu .switch{
    width:210px;
    height:34px;
    border:1px solid #808080;
    border-radius: 50px;
    position: absolute;
    left: 0;
    right:0;
    margin: auto;
  }
  .menu .switch p{
    width:50%;
    height:100%;
    font-size: 14px;
    color: #fefefe;
    float: left;
    text-align: center;
    line-height: 34px;
  }
  .menu .switch p:nth-of-type(2){
    background:#808080;
    border-radius: 0 50px 50px 0;
  }
  .menu svg{
    position: absolute;
    right:3%;
    font-size: 25px;
    color: #fefefe;
  }
</style>
