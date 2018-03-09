<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">所在位置</h1>
    </header>
    <div class="mui-content">
      <!--搜索框-->
      <div class="searchContainer">
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <input type="text" placeholder="搜索附近位置"  v-model.trim="searchText"/>
          <span v-if="isShow"  @tap.stop.prevent="empty()">
           <svg class="icon" aria-hidden="true">
             <use xlink:href="#icon-guanbi"></use>
           </svg>
         </span>
        </p>
      </div>
      <!--申请添加-->
      <div class="apply" v-if="applyIsShow">
        <p @tap.stop.prevent="addAddress('不显示位置')">不显示位置</p>
        <i class="bot"></i>
      </div>
      <!--搜索列表 :class="clicked? 'blue-class':'red-class'"-->
      <RefreshList
        v-model="list"
        v-if="dataList != null"
        :api="'location/nearbySearch'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        :isShowUpToRefreshDescription="false"
        class="listWrapper">
        <ul>
          <li  v-for="(item, index) in list" @tap.stop.prevent="addAddress(item.name)">
            <p :class="address === item.name ? 'blue' : ''">{{item.name}}</p>
            <p>{{item.address}}</p>
            <i class="bottom"></i>
          </li>
        </ul>
      </RefreshList>
    </div>
  </div>
</template>


<script>
  import { getGeoPosition } from '../../utils/allPlatform'
  import RefreshList from '../../components/refresh/List.vue'
  import { toSettingSystem } from '../../utils/plus'
  import localEvent from '../../stores/localStorage'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()

  export default {
    data () {
      return {
        id: currentUser.user_id,
        list: [],
        searchText: '',
        loading: 1,
        isShow: false,
        coords: '',
        longt: '121.498981',
        lat: '31.232772',
        value: '',
        applyIsShow: true,
        data: '',
        distance: '',
        dataList: null,
        address: '',
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
      }, () => {
        //  如果获取位置失败
        if (window.mui.os.plus) {
          var btnArray = ['取消', '去设置']
          window.mui.confirm('请在设置中打开定位服务。', '无法启用定位模式', btnArray, (e) => {
            if (e.index === 1) {
              toSettingSystem('LOCATION')
            } else {
              window.mui.back()
            }
          })
        } else {
          window.mui.toast('请开启定位服务。')
        }
      })
    },
    methods: {
     // 保存位置名称
      addAddress (address) {
        if (this.$route.query.from === 'discover') {
          var from = this.$route.query.from
          localEvent.setLocalItem(from + '_Address' + this.id, address)
          window.mui.back()
        } else {
          return false
        }
      },
      //  点击清空输入框
      empty () {
        this.searchText = ''
      },
     // 获取数据 longt: '121.498981',lat: '31.232772',
      getData () {
        if (this.$route.query.from === 'discover') {
          this.address = localEvent.getLocalItem(this.$route.query.from + '_Address' + this.id)
        } else {
          return false
        }
      }
    },
    watch: {
      searchText: function (newValue) {
        if (newValue && this.isLocation) {
          this.value = newValue
          this.dataList = {
            name: newValue,
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
      this.getData()
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
    position: absolute;
    top:0;
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
    /*justify-content:space-between;*/
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
  .searchContainer input::placeholder{
    color: #c8c8c8;
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
  .apply{
    width:100%;
    height:1.173rem;
    padding: 0 4%;
    line-height: 1.173rem;
    position: absolute;
    top:1.44rem;
  }
  .apply p:nth-of-type(1){
    float: left;
    font-size:0.373rem;
    color:#235280;
  }
  ul{
    width:100%;
    padding: 0 4%;
    overflow: hidden;
  }
  ul li{
    width:100%;
    height:1.573rem;
    padding: 0.24rem 0 0.32rem;
    position: relative;
  }
  ul li p:nth-of-type(1){
    font-size:0.373rem;
    color: #444444;
  }
  ul li p:nth-of-type(2){
    font-size:0.32rem;
    color: #808080;
  }
  /*选中的颜色*/
  ul li p.blue{
    color: #03aef9;
  }
  .listWrapper{
    top:2.64rem;
  }

</style>
