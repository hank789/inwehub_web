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
        <svg class="icon" aria-hidden="true"  @tap.stop.prevent="$router.replace('/nearbyPeople/MapDetail')">
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
                <p>{{item.name}}<i>（< {{item.distance_format}}m）</i></p>
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
  import { toSettingSystem } from '../../utils/plus'
  import RefreshList from '../../components/refresh/List.vue'
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
        dataList: null
      }
    },
    components: {
      RefreshList
    },
    created () {
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
    top: 5.6rem;
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
    height: 0.1rem;
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
    height:5rem;
    background:#3c3e44;
    position: relative;
    display: flex;
    align-items: center;
  }
  .menu .switch{
    width:21rem;
    height:3.4rem;
    border:0.1rem solid #808080;
    border-radius: 5rem;
    position: absolute;
    left: 0;
    right:0;
    margin: auto;
  }
  .menu .switch p{
    width:50%;
    height:100%;
    font-size: 1.4rem;
    color: #fefefe;
    float: left;
    text-align: center;
    line-height: 3.4rem;
  }
  .menu .switch p:nth-of-type(1){
    background:#808080;
    border-radius: 5rem  0  0 5rem;
  }
  .menu svg{
    position: absolute;
    right:3%;
    font-size: 2.5rem;
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
    height:6.4rem;
  }
  .cions-list li div{
    float: left;
  }
  .cions-list li .cions-avatar{
    position: relative;
    width:4.4rem;
    height:4.4rem;
    border-radius:50%;
    background: #cccccc;
    margin-top: 1rem;
  }
  .cions-list li .cions-avatar img{
    width:4.4rem;
    height:4.4rem;
    border-radius:50%;
  }
  .cions-list li .cions-avatar svg{
    position: absolute;
    font-size: 2rem;
    right: -0.5rem;
    bottom: -0.2rem;
  }
  .cions-list li .detail{
    width:60%;
    overflow: hidden;
    margin-top: 1.4rem;
    font-size:1.4rem;
    color: #444444;
    margin-left: 0.8rem;
  }
  .cions-list li .detail p:nth-of-type(1) i{
    font-size:1.2rem;
    color: #808080;
  }
  .cions-list li .detail p:nth-of-type(2){
    font-size:1.2rem;
    color: #b4b4b6;
    margin-top: -0.2rem;
  }
  .cions-list li .fouce{
    width:6.1rem;
    height:2.7rem;
    background: #03aef9;
    border-radius: 5rem;
    text-align: center;
    line-height: 2.7rem;
    font-size:1.4rem;
    color: #ffffff;
    margin-top: 1.85rem;
    float: right;

  }
  .cions-list li .blue{
    color: #03aef9;
    border: 0.1rem solid #03aef9;
    background: #ffffff;
  }
  .listWrapper{
    top:5rem;
  }
</style>
