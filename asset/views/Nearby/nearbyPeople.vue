<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">附近发现</h1>
    </header>
    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
        <p>附近的人</p>
        <p @tap.stop.prevent="$router.replace('/nearbyCompany')">附近公司</p>
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
        :isShowUpToRefreshDescription="true"
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
                <p>{{item.name}}<i>（< {{item.distance_format}}）</i></p>
                <p class="mui-ellipsis">{{item.description}}</p>
              </div>
              <div class="fouce " :class="item.is_followed ? 'blue' : ''" @tap.stop.prevent="collectProfessor(item.uuid, index)">{{item.is_followed ? '已关注' : '关注Ta' }}</div>
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
    top: 1.493rem;
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
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #ffffff;
  }
  /*导航栏*/
  /*导航栏*/
  .menu{
    width: 100%;
    height: 1.2rem;
    background:#fefefe;
    position: relative;
    padding-left: 4%;
  }
  .menu  p{
    display: inline-block;
    line-height: 1.2rem;
    font-size:0.426rem;
    color: #444444;
    text-align: left;
  }
  .menu  p:nth-of-type(1){
    display: inline-block;
    color: #444444;
    font-weight: 500;
    position: relative;
  }
  .menu  p:nth-of-type(1):after {
    position: absolute;
    width:1.706rem;
    bottom: 0;
    left: 0;
    height: 0.053rem;
    z-index: 999;
    content: '';
    background-color: #009FE8;
  }
  .menu  p:nth-of-type(2){
    margin-left: 0.8rem;
  }
  .menu svg{
    position: absolute;
    right:3%;
    font-size: 0.666rem;
    color: #444444;
  }
  /*列表区域*/
  .cions-list{
    width:100%;
    overflow: hidden;
    padding: 0 4%;
  }
  .cions-list li{
    position: relative;
    height:1.706rem;
  }
  .cions-list li div{
    float: left;
  }
  .cions-list li .cions-avatar{
    position: relative;
    width:1.173rem;
    height:1.173rem;
    border-radius:50%;
    background: #cccccc;
    margin-top: 0.266rem;
  }
  .cions-list li .cions-avatar img{
    width:1.173rem;
    height:1.173rem;
    border-radius:50%;
  }
  .cions-list li .cions-avatar svg{
    position: absolute;
    font-size: 0.533rem;
    right: -0.133rem;
    bottom: -0.053rem;
  }
  .cions-list li .detail{
    width:60%;
    overflow: hidden;
    margin-top: 0.373rem;
    font-size:0.373rem;
    color: #444444;
    margin-left: 0.213rem;
  }
  .cions-list li .detail p:nth-of-type(1) i{
    font-size:0.32rem;
    color: #808080;
  }
  .cions-list li .detail p:nth-of-type(2){
    font-size:0.32rem;
    color: #b4b4b6;
    margin-top: -0.053rem;
  }
  .cions-list li .fouce{
    width:1.626rem;
    height:0.72rem;
    background: #03aef9;
    border-radius: 1.333rem;
    text-align: center;
    line-height: 0.72rem;
    font-size:0.373rem;
    color: #ffffff;
    margin-top: 0.493rem;
    float: right;

  }
  .cions-list li .blue{
    color: #b4b4b6;
    background: #dcdcdc;
  }
  .listWrapper{
    top:1.333rem;
  }
</style>
