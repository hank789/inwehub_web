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
          <p @tap.stop.prevent="$router.replace('/nearbyPeople/MapDetail')">附近的人</p>
          <p @tap.stop.prevent="$router.replace('/nearbyCompany')">附近的公司</p>
        </div>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.replace('/nearbyPeople')">
          <use xlink:href="#icon-shaixuan"></use>
        </svg>
      </div>
      <div class="map">
        <div id="allmap"></div>
      </div>
      <ul  :style="'bottom:'+ bot +'%'" class="cions-list">
        <div class="userArea" @tap.stop.prevent="change">共有<a>{{total}}</a>名用户在当前区域 <i></i></div>
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10"  class="container">
              <li v-for="(item, index) in list" >
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
            </div>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>
<script>
  import { postRequest } from '../../utils/request'
  import localEvent from '../../stores/localStorage'
  import { getLocalUserInfo } from '../../utils/user'
  import { toSettingSystem } from '../../utils/plus'
  import { renderMapList as renderMapListMy } from '../../utils/map'
  const currentUser = getLocalUserInfo()
  export default {
    data () {
      return {
        bot: -52,
        busy: false,
        user_id: currentUser.user_id,
        long: '',
        lat: '',
        list: [],
        page: 1,
        map: null,
        total: 0
      }
    },
    created () {
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
      },
      change () {
        this.bot === -52 ? this.bot = 0 : this.bot = -52
      },
      // 获取数据
      getData () {
        postRequest('location/nearbyUser', {
          page: this.page,
          longitude: this.long,
          latitude: this.lat
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data.data.length > 0) {
            this.renderMapList(response.data.data.data)
            this.list = this.list.concat(response.data.data.data)
            this.total = response.data.data.total
          }

          if (response.data.data.data.length < 10) {
            this.busy = true
          } else {
            this.busy = false
          }
          this.page++
        })
      },
      loadMore () {
        this.busy = true
        this.getData()
      },
      renderMapList (list) {
        renderMapListMy(list, this.map)
      },
      getMap () {
        //   防止安卓获取成功为空
        if (/^[0-9.]+$/.test(this.long) && /^[0-9.]+$/.test(this.lat)) {
          // 百度地图API功能
          var map = new window.BMap.Map('allmap')
          this.map = map
          var point = new window.BMap.Point(this.long, this.lat)
          map.centerAndZoom(point, 15)
        } else {
          var btnArray = ['取消', '去设置']
          window.mui.confirm('请在设置中打开定位服务，以启用地址定位或发现附近的企业和个人。', '无法启用定位模式', btnArray, (e) => {
            if (e.index === 1) {
              toSettingSystem('LOCATION')
            } else {
              window.mui.back()
            }
          })
        }
      }
    },
    mounted () {
      window.mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005
        // flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
      })
      var location = localEvent.getLocalItem('location' + this.user_id)
      // 判断是否有经纬度
      if (location.longitude) {
        this.long = location.longitude
        this.lat = location.latitude
        this.getMap()
      } else {
        // 默认的定位
        this.long = 121.4936901919479
        this.lat = 31.23576356859009
        this.getMap()
        var btnArray = ['取消', '去设置']
        window.mui.confirm('请在设置中打开定位服务，以启用地址定位或发现附近的企业和个人。', '无法启用定位模式', btnArray, (e) => {
          if (e.index === 1) {
            toSettingSystem('LOCATION')
          } else {
            window.mui.back()
          }
        })
      }
    },
    updated () {
    }
  }
</script>

<style scoped>
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
    right: 4%;
    bottom: 0;
    left: 4%;
    height: 0.1rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #ffffff;
    overflow: hidden;
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
  /*地图*/
  .map{
    width:100%;
    height:100%;
    overflow: hidden;
  }
  #allmap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    font-family: "微软雅黑";
  }

  /*列表区域*/
  .userArea{
    width:100%;
    height:5.6rem;
    font-size: 1.5rem;
    color: #3c3e44;
    text-align: center;
    line-height: 5.6rem;
    position: relative;
  }
  .userArea:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.1rem;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }
  .userArea i{
    display: block;
    width:3.4rem;
    height:0.2rem;
    background: #808080;
    position: absolute;
    top:1rem;
    left:0;
    right:0;
    margin: auto;
  }


  ul{
    width: 100%;
    overflow: hidden;
    z-index: 10;
    position: absolute;
    background:#ffffff;
    height: 60%;
  }
  .cions-list li{
    position: relative;
    padding: 0 4%;
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
    margin-top: 18.0.5rem;
    float: right;

  }
  .cions-list li .blue{
    color: #03aef9;
    border: 0.1rem solid #03aef9;
    background: #ffffff;
  }
</style>
