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
          <input type="text" placeholder="输入公司名称"  v-model.trim="searchText"/>
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
        address: ''
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
      })
    },
    methods: {
     // 保存位置名称
      addAddress (address) {
        if (this.$route.query.from === 'discover') {
          var from = this.$route.query.from
          localEvent.setLocalItem(from + '_Address' + this.id, address)
          this.$router.push('/discover/add')
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
        if (newValue) {
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
    position: absolute;
    top:0;
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
    /*justify-content:space-between;*/
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
  .apply{
    width:100%;
    height:44px;
    padding: 0 4%;
    line-height: 44px;
    position: absolute;
    top:54px;
  }
  .apply p:nth-of-type(1){
    float: left;
    font-size:14px;
    color:#235280;
  }
  ul{
    width:100%;
    padding: 0 4%;
    overflow: hidden;
  }
  ul li{
    width:100%;
    height:59px;
    padding: 9px 0 12px;
    position: relative;
  }
  ul li p:nth-of-type(1){
    font-size:14px;
    color: #444444;
  }
  ul li p:nth-of-type(2){
    font-size:12px;
    color: #808080;
  }
  /*选中的颜色*/
  ul li p.blue{
    color: #03aef9;
  }
  .listWrapper{
    top:99px;
  }

</style>
