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
          <p>附近的人</p>
          <p @tap.stop.prevent="$router.replace('/nearbyCompany')">附近的公司</p>
        </div>
        <svg class="icon" aria-hidden="true"  @tap.stop.prevent="$router.pushPlus('/nearbyPeople/MapDetail')">
          <use xlink:href="#icon-ditu"></use>
        </svg>
      </div>
      <!--搜索列表-->
      <RefreshList
        v-if="dataList != null"
        v-model="list"
        :api="'location/nearbyUser'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        :isShowUpToRefreshDescription="false"
        class="listWrapper">
          <ul class="cions-list">
            <li v-for="(item, index) in list">
              <div class="cions-avatar" @tap.stop.prevent="toAvatar(item.uuid)">
                <img :src="item.avatar" />
                <svg class="icon" aria-hidden="true" v-if="item.is_expert">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </div>
              <div class="detail">
                <p>{{item.name}}<i>（< {{item.distance}}m）</i></p>
                <p class="mui-ellipsis">{{item.description}}</p>
              </div>
              <div class="fouce " :class="item.is_followed ? 'blue' : ''" @tap.stop.prevent="collectProfessor(item.uuid, index)">{{item.is_followed ? '已互关' : '关注Ta' }}</div>
              <i class="bot"></i>
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
        loading: 1,
        longt: '',
        lat: '',
        page: 1,
        dataList: null,
      }
    },
    components: {
      RefreshList
    },
    created () {
//      初始化的测试代码
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
       //  获取权限成功的回调
        getGeoPosition((position) => {
          this.dataList = {
            longitude: position.longt,
            latitude: position.lat
          }
          this.longt = position.longt
          this.lat = position.lat
         //  获取到位置进行保存
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
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume/' + uuid + '?goback=1' + '&time=' + (new Date().getTime()))
      },
      // 点击关注；
      collectProfessor (uuid, index) {
        postRequest(`follow/user`, {
          id: uuid
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          if (response.data.data.type === 'unfollow') {
            this.list[index].is_followed = 0
          } else {
            this.list[index].is_followed = 1
          }
          window.mui.toast(response.data.data.tip)
        })
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
    font-style: normal;
  }
  .mui-scroll-wrapper {
    position: absolute;
    z-index: 2;
    top: 56px;
    bottom: 0;
    left: 0;
    overflow: hidden;
    width: 100%;
  }
  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #ffffff;
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
  .menu .switch p:nth-of-type(1){
    background:#808080;
    border-radius: 50px  0  0 50px;
  }
  .menu svg{
    position: absolute;
    right:3%;
    font-size: 25px;
    color: #fefefe;
  }
  /*列表区域*/
  .cions-list{
    width:100%;
    overflow: hidden;
    padding: 0 4%;
  }
  .cions-list li{
    position: relative;
    height:64px;
  }
  .cions-list li div{
    float: left;
  }
  .cions-list li .cions-avatar{
    position: relative;
    width:44px;
    height:44px;
    border-radius:50%;
    background: #cccccc;
    margin-top: 10px;
  }
  .cions-list li .cions-avatar img{
    width:44px;
    height:44px;
    border-radius:50%;
  }
  .cions-list li .cions-avatar svg{
    position: absolute;
    font-size: 20px;
    right: -5px;
    bottom: -2px;
  }
  .cions-list li .detail{
    width:60%;
    overflow: hidden;
    margin-top: 14px;
    font-size:14px;
    color: #444444;
    margin-left: 8px;
  }
  .cions-list li .detail p:nth-of-type(1) i{
    font-size:12px;
    color: #808080;
  }
  .cions-list li .detail p:nth-of-type(2){
    font-size:12px;
    color: #b4b4b6;
    margin-top: -2px;
  }
  .cions-list li .fouce{
    width:61px;
    height:27px;
    background: #03aef9;
    border-radius: 50px;
    text-align: center;
    line-height: 27px;
    font-size:14px;
    color: #ffffff;
    margin-top: 18.5px;
    float: right;

  }
  .cions-list li .blue{
    color: #03aef9;
    border: 1px solid #03aef9;
    background: #ffffff;
  }
  .listWrapper{
    top:50px;
  }
</style>
