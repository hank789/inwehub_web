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
          <p>附近公司<i></i></p>
        </div>
          <svg class="icon" aria-hidden="true"  @tap.stop.prevent="$router.replace('/nearbyCompany/MapDetail')">
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
  import { toSettingSystem } from '../../utils/plus'
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
      this.isLocation = true
      getGeoPosition((position) => {
        this.dataList = {
          longitude: position.longt,
          latitude: position.lat
        }
        this.longt = position.longt
        this.lat = position.lat
        if (this.dataList.longitude) {
          localEvent.setLocalItem('location' + this.user_id, this.dataList)
        }
      }, () => {
        if (window.mui.os.plus) {
          var btnArray = ['取消', '去设置']
          window.mui.confirm('请在设置中打开定位服务，以启用地址定位或发现附近的企业和个人。', '无法启用定位模式', btnArray, (e) => {
            if (e.index === 1) {
              toSettingSystem('LOCATION')
            } else {
              window.mui.back()
            }
          })
        } else if (window.mui.os.wechat) {
          window.mui.toast('请开启定位服务，以启用地址定位或发现附近的企业和个人。')
        }
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
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .bottom {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.026rem;
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
    height:1.44rem;
    background:#ffffff;
    padding-top: 0.266rem;
  }
  .searchContainer p{
    width:92%;
    height:0.906rem;
    background: #f3f4f6;
    border-radius: 1.333rem;
    margin-left: 4%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items:center;
    padding:0 0.32rem;
  }
  .searchContainer input{
    width:85%;
    height:100%;
    margin: 0;
    border:none;
    padding: 0;
    padding-left: 0;
    font-size:0.373rem;
    color:#444444;
    float: left;
    margin-left: 0.266rem;
    background: #f3f4f6;
  }
  .searchContainer p svg{
    color:#c8c8c8;
    font-size: 0.453rem;
  }
  .searchContainer span{
    width:0.48rem;
    height:0.48rem;
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
  /*height:1.2rem;*/
  /*padding: 0 4%;*/
  /*line-height: 1.2rem;*/
  /*}*/
  /*.apply p:nth-of-type(1){*/
    /*float: left;*/
    /*font-size:0.373rem;*/
    /*color:#03aef9;*/
  /*}*/
  /*.apply p:nth-of-type(2){*/
    /*float: right;*/
    /*width:2.293rem;*/
    /*height:0.72rem;*/
    /*border-radius: 1.333rem;*/
    /*border:0.026rem solid #03aef9;*/
    /*font-size:0.373rem;*/
    /*color:#03aef9;*/
    /*text-align: center;*/
    /*line-height: 0.666rem;*/
    /*margin-top: 0.24rem;*/
  /*}*/
  ul{
    width:100%;
    padding: 0 4%;
    overflow: hidden;
  }
  ul li{
    width:100%;
    height:2.373rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content:space-between;
    align-items:center;
    position: relative;
  }
  ul li .container-image{
    width:1.12rem;
    height:1.12rem;
  }
  .container-info{
    width: 85%;
    height:100%;
    margin-left: 0.266rem;
  }
  .container-info p:nth-of-type(1){
    font-size:0.426rem;
    color:#444444;
    margin-top: 0.346rem;
  }
  .container-info p:nth-of-type(2){
    font-size:0.373rem;
    color: #808080;
    margin:0.026rem 0;
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
    width:0.026rem;
    height:0.346rem;
    background:#dcdcdc;
    margin: 0 0.133rem;
  }
  .container-info p:nth-of-type(2) span:nth-last-child(1) i{
    display: none;
  }
  .container-info p:nth-of-type(3){
    font-size:0.373rem;
    color: #808080;
    display: flex;
    flex-direction: row;
    justify-content:space-between;
  }

  input::-webkit-input-placeholder { /*WebKit browsers*/
    color:#c8c8c8;
    font-size: 0.373rem;
  }
  .listWrapper{
    top:2.64rem;
  }
 /*导航栏*/
  .menu{
    width: 100%;
    height: 1.2rem;
    background:#fefefe;
    position: relative;
    display: flex;
    align-items: center;
  }
  .menu .switch{
    float: left;
    width:4.173rem;
    height: 100%;
    margin-left:4%;
    overflow: hidden;
    position: relative;
  }
  .menu .switch p{
    display: inline-block;
    line-height: 1.2rem;
    font-size:0.426rem;
    color: #444444;
    float: left;
    text-align: left;
  }
  .menu .switch p:nth-of-type(2){
    display: inline-block;
    tfloat: right;
    margin-left: 0.76rem;
    color: #444444;
    font-weight: 500;
    position: relative;
  }
  .menu .switch p:nth-of-type(2):after {
    position: absolute;
    width:1.706rem;
    bottom: 0;
    left: 50%;
    margin-left: -0.86rem;
    height: 0.053rem;
    z-index: 999;
    content: '';
    background-color: #009FE8;
  }
  .menu svg{
    position: absolute;
    right:3%;
    font-size: 0.666rem;
    color: #444444;
  }
</style>
