<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">附近企业</h1>
    </header>
    <div class="mui-content">
      <!--搜索框-->
     <div class="searchContainer">
       <p>
         <svg class="icon" aria-hidden="true">
           <use xlink:href="#icon-sousuo"></use>
         </svg>
         <input type="text" placeholder="输入公司名称" v-model="searchText"/>
         <span v-if="isShow"  @tap.stop.prevent="empty()">
           <svg class="icon" aria-hidden="true">
             <use xlink:href="#icon-guanbi"></use>
           </svg>
         </span>
       </p>
     </div>
      <!--申请添加-->
      <div class="apply" v-if="applyIsShow">
        <p>搜不到？</p>
        <p @tap.stop.prevent="Obtain()">申请添加 </p>
        <i class="bot"></i>
      </div>
      <!--搜索列表-->
      <RefreshList
        v-model="list"
        v-if="dataList"
        :api="'company/nearbySearch'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        :isShowUpToRefreshDescription="false"
        class="listWrapper">
          <ul>
            <li  v-for="(item, index) in list" @tap.stop.prevent="$router.pushPlus('/companyDetails/' + item.id)" >
              <div class="container-image">
                 <img :src="item.logo"/>
              </div>
              <div class="container-info">
                <p>{{item.name}}</p>
                <p class="mui-ellipsis">
                  <span  v-for="(tags, index) in item.tags"> {{tags}} <i></i></span>
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
  import { getGeoPosition } from '../../utils/plus'
  import RefreshList from '../../components/refresh/List.vue'

  export default {
    data () {
      return {
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
        dataList: null
      }
    },
    components: {
      RefreshList
    },
    created () {
      getGeoPosition((position) => {
        this.longt = position.longt
        this.lat = position.lat
      })
    },
    methods: {
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
        if (newValue) {
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
//      this.list = []
//      this.$nextTick(() => {
//
//      })
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
  height:45px;
  padding: 0 4%;
  line-height: 45px;
  position: relative;
  }
  .apply p:nth-of-type(1){
    float: left;
    font-size:14px;
    color:#03aef9;
  }
  .apply p:nth-of-type(2){
    float: right;
    width:86px;
    height:27px;
    border-radius: 50px;
    border:1px solid #03aef9;
    font-size:14px;
    color:#03aef9;
    text-align: center;
    line-height: 25px;
    margin-top: 9px;
  }
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

</style>
