<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">企业详情</h1>
    </header>

  <div class="mui-content">
      <RefreshList
        v-model="list"
        :api="'company/dataPeople'"
        :pageMode="true"
        :prevOtherData="{page: 1,id:this.id}"
        :nextOtherData="{id:this.id}"
        :autoShowEmpty="false"
        class="listWrapper">
        <div class="companyDetail" >
          <div class="gray"></div>
          <div class="company_image">
            <img :src="datailList.logo" />
          </div>
          <ul class="information">
            <li>距离我< {{datailList.distance_format}}</li>
            <li>{{datailList.name}}</li>
            <li>
              <span v-for="(item, index) in datailList.tags" @tap.stop.prevent="toTagDetail(item)">{{item}} <i></i></span>
            </li>
            <li>{{datailList.address_detail}}</li>
          </ul>
        </div>
        <div class="Relevant_title">
          相关人员
          <i class="bott"></i>
        </div>
          <!-- 相关人员-->
          <div class="Relevant">
            <ul class="Relevant_list">
              <li  v-for="(item, index) in list">
                <div class="Relevant_avatar">
                  <img  :src="item.avatar" @tap.stop.prevent="toAvatar(item.uuid)"/>
                  <svg class="icon" aria-hidden="true" v-if="item.is_expert">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </div>
                <div class="Relevant_detail">
                  <p class="mui-ellipsis">
                     {{item.name}}
                     <span>{{item.level}}</span>
                    （{{item.status_info}}）
                  </p>
                  <p class="mui-ellipsis">{{item.description}}</p>
                </div>
                <div class="Relevant_follow" v-if="item.is_followed" @tap.stop.prevent="collectProfessor(item)">
                  已关注
                </div>
                <div class="Relevant_empty" v-else @tap.stop.prevent="collectProfessor(item)">
                  关注Ta
                </div>
                <i class="bot"></i>
              </li>

            </ul>
          </div>
      </RefreshList>
  <!--/my/info-->
    <button @tap.stop.prevent="$router.pushPlus('/my/info')">我也是相关人员</button>
  </div>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import { getGeoPosition } from '../../utils/allPlatform'
  import RefreshList from '../../components/refresh/List.vue'
  import { getLocalUserInfo } from '../../utils/user'
  import userAbility from '../../utils/userAbility'

  const currentUser = getLocalUserInfo()
  export default {
    data () {
      return {
        user_id: currentUser.user_id,
        datailList: '',
        longt: '',
        lat: '',
        id: '',
        list: [],
        distance: ''
      }
    },
    components: {
      RefreshList
    },
    created () {
      this.id = this.$route.params.id
      getGeoPosition((position) => {
        this.longt = position.longt
        this.lat = position.lat
        this.companyInfo()
      }, () => {
        window.mui.toast('获取当前位置失败')
      })
    },
    methods: {
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      refreshPageData () {
        this.id = this.$route.params.id
        this.companyInfo()
      },
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
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
      // 获取企业信息；
      companyInfo () {
        var data = {
          id: this.id,
          page: this.page,
          longitude: this.longt,
          latitude: this.lat
        }
        postRequest('company/dataInfo', data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data) {
            this.datailList = response.data.data
          }
//          console.error(response.data.data)
          this.loading = 0
        })
      },
      collectProfessor (item) {
        if (item.id === this.user_id) {
          window.mui.toast('不能关注自己')
        } else {
          postRequest('follow/user',
            {id: item.id}
          ).then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.alert(response.data.message)
              window.mui.back()
              return
            }
            item.is_followed = !item.is_followed
            window.mui.toast(response.data.data.tip)
            this.loading = 0
          })
        }
      }
    },
    watch: {
      '$route': 'refreshPageData'
    },
    mounted () {
//      this.companyInfo()
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
  }
  .mui-content{
    background: #ffffff;
  }

  .bot {
    position: absolute;
    right:  0;
    bottom: 0;
    left:  0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .bott {
    position: absolute;
    right: 4%;
    bottom: 0;
    left: 4%;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  /*公司的详情部分*/
.companyDetail{
  width:100%;
  overflow: hidden;
  background:#ececee;
  position: relative;
  padding-bottom: 0.64rem;
}
.gray{
  width:100%;
  height:0.373rem;
  background:#ececee;
}
.companyDetail .company_image{
  width:2.453rem;
  height:2.453rem;
  position: absolute;
  left:0;
  right:0;
  top:0rem;
  margin: auto;
}
.companyDetail .company_image img{
  width:100%;
  height:100%;
  border-radius: 0.106rem;
}
.information{
  width:100%;
  overflow: hidden;
  padding-top: 0.346rem;
}
.information li:nth-of-type(1){
  text-align: right;
  font-size:0.32rem;
  color:#808080;
  margin-right: 0.4rem;
}
.information li:nth-of-type(2){
  text-align: center;
  font-size:0.426rem;
  color:#444444;
  margin-top:1.626rem;
}
.information li:nth-of-type(3){
  text-align: center;
  font-size:0.373rem;
  color:#808080;
  margin-top:0.213rem;
  padding: 0 0.4rem;
  display: flex;
  flex-direction: row;
  align-items:center;
  justify-content: center;
  flex-wrap:wrap;
}
.information li:nth-of-type(3) span {
  height:0.56rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap:wrap;
}
.information li:nth-of-type(3) span i{
  display: inline-block;
  width:0.026rem;
  height:0.346rem;
  background: #dcdcdc;
  margin: 0 0.16rem;
}
  .information li:nth-of-type(3) span:nth-last-child(1) i{
    display: none;
  }
.information li:nth-of-type(4){
  text-align: center;
  font-size:0.32rem;
  color:#808080;
  margin-top:0.053rem;
}
  /*相关人员*/
  .Relevant{
    width:100%;
    padding: 0 4%;
    overflow: hidden;
  }
  .Relevant_title{
    width:100%;
    height:1.2rem;
    position: relative;
    font-size:0.426rem;
    color:#444444;
    line-height: 1.2rem;
    padding: 0 4%;
  }
  .Relevant_list{
    width:100%;
    overflow: hidden;
  }
  .Relevant_list li{
    width:100%;
    height:1.706rem;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items:center;
    flex-wrap:nowrap;
  }
  .Relevant_avatar{
    width:1.173rem;
    height:1.173rem;
    border-radius: 50%;
    float: left;
    position: relative;
  }
  .Relevant_avatar img{
    width:100%;
    height:100%;
    border-radius: 50%;
  }
  .Relevant_avatar svg{
   position: absolute;
    font-size:0.453rem;
    bottom: 0;
    right:-0.053rem;
  }
  /*详细的信息*/
  .Relevant_detail{
    /*width:65%;*/
    height:100%;
    margin-left: 0.186rem;
  }
  .Relevant_detail p:nth-of-type(1){
    font-size:0.373rem;
    color:#565656;
    margin-top: 0.32rem;
    display: flex;
    flex-direction: row;
    align-items:center;
  }
  .Relevant_detail p:nth-of-type(1) span{
      width:0.426rem;
      height:0.4rem;
      background: url("../../statics/images/rank.png") no-repeat;
      background-size: 100% 100%;
      color:#FFFFFF;
      font-size:0.266rem;
      line-height: 0.346rem;
      margin-left: 0.08rem;
      display: flex;
      flex-direction: row;
      justify-content:center;
  }
  .Relevant_detail p:nth-of-type(2){
    font-size:0.346rem;
    color:#b4b4b6;
    width:90%;
  }
  /*关注*/
  .Relevant_follow{
    width: 1.706rem;
    height: 0.72rem;
    background: #dcdcdc;
    color: #b4b4b6;
    line-height:0.72rem;
    border-radius: 1.333rem;
    text-align: center;
    font-size: 0.373rem;
  }
  .Relevant_empty{
    width: 1.706rem;
    height: 0.72rem;
    background: #03aef9;
    color:#ffffff;
    line-height:0.72rem;
    border-radius: 1.333rem;
    text-align: center;
    font-size: 0.373rem;
  }
  button{
    width:100%;
    height:1.226rem;
    font-size:0.453rem;
    color: #FFFFFF;
    text-align: center;
    background:#03aef9;
    border-radius: 0;
    position: fixed;
    bottom: 0;
    z-index: 999;
    border:none;
  }
  .listWrapper{
    bottom: 1.226rem;
  }
  /*适配*/
  @media (min-width:320px) {
    .Relevant_detail {
      width:57%;
    }
  }
  @media (min-width:375px) {
    .Relevant_detail {
      width:66%;
    }
  }
  @media (min-width:414px) {
    .Relevant_detail {
      width:70%;
    }
  }

</style>
