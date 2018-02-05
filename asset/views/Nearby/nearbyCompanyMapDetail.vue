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
          <p >附近的公司</p>
        </div>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.replace('/nearbyCompany')">
          <use xlink:href="#icon-shaixuan"></use>
        </svg>
      </div>
      <div class="map">
        <div id="allmap"></div>
      </div>
      <ul  :style="'bottom:'+ bot +'%'">
        <div class="userArea" @tap.stop.prevent="change">共有<a>{{total}}</a>家相关公司在当前区域 <i></i></div>
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10"  class="container">
              <li v-for="item in list" @tap.stop.prevent="judge(item)">
                <div class="container-image">
                  <img :src="item.logo"/>
                </div>
                <div class="container-info">
                  <p>{{item.address_province}}</p>
                  <p class="mui-ellipsis">
                    <span v-for="tag in item.tags"> {{tag}} <i></i></span>
                  </p>
                  <p><span>{{item.address_province}}</span> <span>< {{item.distance_format}}m</span></p>
                </div>
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
  import userAbility from '../../utils/userAbility'
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
      change () {
        this.bot === -52 ? this.bot = 0 : this.bot = -52
      },
      // 获取数据
      getData () {
        postRequest('company/nearbySearch', {
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
    top: 56px;
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
    height: 1px;
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
    height:56px;
    font-size: 15px;
    color: #3c3e44;
    text-align: center;
    line-height: 56px;
    position: relative;
  }
  .userArea:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }
  .userArea i{
    display: block;
    width:34px;
    height:2px;
    background: #808080;
    position: absolute;
    top:10px;
    left:0;
    right:0;
    margin: auto;
  }


  ul{
    width: 100%;
    overflow: hidden;
    z-index: 10;
    position: absolute;
    background: #ffffff;
    height: 60%;
  }
  ul li{
    width:100%;
    height:89px;
    padding: 0 4%;
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


</style>
