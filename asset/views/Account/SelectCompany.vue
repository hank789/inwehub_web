<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back :tapCallback="back"></Back>
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
        :isShowUpToRefreshDescription="true"
        class="listWrapper">
        <ul>
          <li  v-for="(item, index) in list" @tap.stop.prevent="submit(item.name)">
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
  import RefreshList from '../../components/refresh/MescrollList.vue'
  import localEvent from '../../stores/localStorage'
  import { toSettingSystem } from '../../utils/plus'
  import userAbility from '../../utils/userAbility'
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
        searchRule: 1,
        page: 1,
        value: '',
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
      this.searchRule = this.$route.query.from === 'infobasic' ? 2 : 1
      getGeoPosition((position) => {
        this.dataList = {
          longitude: position.longt,
          latitude: position.lat
        }
        this.longt = position.longt
        this.lat = position.lat
      }, () => {
        // 获取权限失败的回调
        if (window.mui.os.plus) {
          var btnArray = ['取消', '去设置']
          window.mui.confirm('请在设置中打开定位服务。', '无法启用定位模式', btnArray, (e) => {
            if (e.index === 1) {
              toSettingSystem('LOCATION')
            }
          })
        } else if (window.mui.os.wechat) {
          window.mui.toast('请开启定位服务。')
        }
      })
    },
    beforeRouteEnter (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
      next(vm => {
        // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
        vm.$refs.RefreshList && vm.$refs.RefreshList.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
      })
    },
    beforeRouteLeave (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
      this.$refs.RefreshList && this.$refs.RefreshList.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
      next()
    },
    methods: {
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      back () {
        this.$router.go(-1)
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
          this.$router.go(-1)
          return false
        } else if (this.$route.query.from === 'infobasic') {
          postRequest('profile/update', {
            company: this.value
          }).then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.alert(response.data.message)
              window.mui.back()
              return
            }
            window.mui.toast('保存成功')
            this.$router.go(-1)
            this.loading = 0
          })
        } else {
          localEvent.setLocalItem(this.$route.query.from + '_company' + this.id, this.value)
          this.$router.go(-1)
        }
      },
      // 保存搜素的公司名称
      submit (name) {
        if (this.$route.query.from === 'infobasic') {
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
            this.$router.go(-1)
            this.loading = 0
          })
        } else {
          localEvent.setLocalItem(this.$route.query.from + '_company' + this.id, name)
          this.$router.go(-1)
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
            latitude: this.lat,
            searchRule: this.searchRule
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
    background:#f3f4f6;
    padding-top: 0.266rem;
    position: absolute;
    top:0;
    display: flex;
    flex-direction: row;
    justify-content:space-between
  }
  .searchContainer p:nth-of-type(1){
    width:71%;
    height:0.906rem;
    background: #FFFFFF;
    border-radius: 1.333rem;
    margin-left: 4%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    /*justify-content:space-between;*/
    align-items:center;
    padding:0 0.32rem;
  }
  .searchContainer p:nth-of-type(2){
    width:17%;
    height:0.906rem;
    background:#03aef9;
    border-radius:1.333rem;
    text-align: center;
    line-height: 0.906rem;
    font-size:0.373rem;
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
    font-size:0.373rem;
    color:#444444;
    float: left;
    margin-left: 0.266rem;
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
    top:1.44rem !important;
  }

</style>
