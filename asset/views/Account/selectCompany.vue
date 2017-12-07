<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">企业</h1>
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
        <p @tap.stop.prevent="submitInfo()">确定</p>
      </div>
      <!--搜索列表-->
      <RefreshList
        v-model="list"
        v-if="dataList != null"
        :api="'company/nearbySearch'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        :isShowUpToRefreshDescription="false"
        class="listWrapper">
        <ul>
          <li  v-for="(item, index) in list" @tap.stop.prevent="submit(item.name)">
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
  import { getGeoPosition } from '../../utils/allPlatform'
  import RefreshList from '../../components/refresh/List.vue'
  import localEvent from '../../stores/localStorage'
  const currentUser = localEvent.getLocalItem('UserInfo')

  export default {
    data () {
      return {
        id: currentUser.user_id,
        list: [],
        searchText: '',
        loading: 1,
        isShow: false,
        coords: '',
        longt: '',
        lat: '',
        page: 1,
        value: '',
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
        this.dataList = {
          longitude: position.longt,
          latitude: position.lat
        }
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
      //  点击清空输入框
      empty () {
        this.searchText = ''
      },
//      保存输入框的公司名称
      submitInfo () {
        if (!this.value) {
          window.mui.toast('请填写公司名称')
          return
        }
        if (this.value.length < 2) {
          window.mui.toast('公司名称至少两个字符')
          return
        }
//        保存输入框的名称；
        if (!this.$route.query.from) {
          window.mui.back()
          return false
        } else if (this.$route.query.from === 'basic') {
          postRequest('company/applyAddData', {
            name: this.value
          }).then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.alert(response.data.message)
              window.mui.back()
              return
            }
            window.mui.toast(response.data.data.tips)
            window.mui.back()
            this.loading = 0
          })
        } else {
          localEvent.setLocalItem(this.$route.query.from + '_company' + this.id, this.value)
          window.mui.back()
        }
      },
      // 保存搜素的公司名称
      submit (name) {
        if (this.$route.query.from === 'basic') {
          postRequest('profile/update', {
            company: name
          }).then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.alert(response.data.message)
              window.mui.back()
              return
            }
            window.mui.toast('保存成功')
            window.mui.back()
            this.loading = 0
          })
        } else {
          localEvent.setLocalItem(this.$route.query.from + '_company' + this.id, name)
          window.mui.back()
        }
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
        }
      }
    },
    mounted () {
//      console.error(currentUser)
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
    display: flex;
    flex-direction: row;
    justify-content:space-between
  }
  .searchContainer p:nth-of-type(1){
    width:71%;
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
  .searchContainer p:nth-of-type(2){
    width:17%;
    height:34px;
    background:#03aef9;
    border-radius:50px;
    text-align: center;
    line-height: 34px;
    font-size:14px;
    color: #FFFFFF;
    margin-right: 4%;
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
    top:54px;
  }

</style>
