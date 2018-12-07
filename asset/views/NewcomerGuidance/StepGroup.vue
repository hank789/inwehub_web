<template>
  <div>
    <div style="background: #f3f4f6"></div>
    <div class="mui-content">
      <div class="invitation-title">
        <div class="next-step" @tap.stop.prevent="submit()">下一步</div>
        <div class="invitation-text">
          <p>开启InweHub之旅</p>
          <p>加入您感兴趣的圈子</p>
        </div>
      </div>

      <div class="container-list-group">
        <template v-for="(item, index) in list">
          <div class="list-item-group" @tap.stop.prevent="toDetail(item)">
            <div class="ligL">
              <img :src="item.logo"/>
            </div>
            <div class="ligC">
              <div class="ligC1">{{item.name.length > 10 ? item.name.substr(0, 10) + '...' : item.name }}</div>
              <div class="ligCM text-line-1">{{item.description}}</div>
              <div class="ligC2">{{item.subscribers}}人气 {{item.articles}}分享</div>
            </div>
            <div class="ligR">
              <div class="component-button-pill-fixed disable" v-if="item.is_joined !== -1">已加入</div>
              <div class="component-button-pill-fixed" v-else @tap.stop.prevent="joinGroup(item)">加入</div>
            </div>
          </div>
          <div class="line-river-after line-river-after-short" v-if="index !== list.length -1"></div>
        </template>
      </div>

    </div>

    <div id="statusBarStyle" mode="dark"></div>
  </div>
</template>
<script>
  import { postRequest } from '../../utils/request'
  import localEvent from '../../stores/localStorage'
  import { needRefresh } from '../../utils/plus'

  export default {
    data: () => ({
      list: [],
      page: 1,
      loading: 1
    }),
    created () {
      this.getData()
    },
    computed: {},
    components: {},
    methods: {
      toDetail (item) {
        this.$router.pushPlus('/group/detail/' + item.id)
      },
      joinGroup (item) {
        postRequest(`group/join`, {id: item.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          if (item.is_joined !== 1) {
            item.is_joined = 1
          }
        })
      },
      close () {
        var UserInfo = localEvent.getLocalItem('UserInfo')
        localEvent.setLocalItem('num' + UserInfo.phone, {value: 1})
        if (this.$route.query.from === 'feed') {
          needRefresh()
          this.$router.pushPlus('/discover?refresh=1')
        } else if (this.$route.query.from === 'group') {
          needRefresh()
          this.$router.pushPlus('/groups?refresh=1')
        } else {
          this.$router.pushPlus('/my')
        }
      },
      submit () {
        this.$router.replace('/userGuide/steptwo?from=' + this.$route.query.from)
      },
      getData () {
        postRequest('group/recommend', {
          page: 1,
          perPage: 100,
          type: 2
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.list = response.data.data.data
          this.loading = 0
        })
      }
    },
    mounted () {}
  }

</script>
<style scoped>
  ul,
  li,
  p,
  span,
  a,
  i {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #FFFFFF;
  }
  /*邀请的头部*/
  .invitation-title{
    width:100%;
    height:3.52rem;
    background: #f3f4f6;
    padding: 0 0.453rem;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .invitation-title svg{
    color: #b4b4b6;
    font-size: 0.666rem;
    position: absolute;
    left:0.453rem;
    top:0.533rem;
  }
  .invitation-title .next-step{
    width:2rem;
    /*height:0.906rem;*/
    line-height: 0.533rem;
    padding: 0.186rem 0;
    border: 0.026rem solid #03aef9;
    border-radius: 1.333rem;
    font-size:0.373rem;
    color:#03aef9;
    position: absolute;
    right:0.453rem;
    top:0.426rem;
  }
  .invitation-title .invitation-text{
    position: absolute;
    top:1.573rem;
    text-align: left;
    display: flex;
    flex-direction: column;
  }
  .invitation-text p:nth-of-type(1){
    font-size:0.373rem;
    color: #808080;
  }
  .invitation-text p:nth-of-type(2){
    font-size:0.533rem;
    color: #323232;
  }
  /*tag*/
.tag-title{
  font-size:0.346rem;
  color: #808080;
  margin:0.533rem 0 0 4%;

}
  ul{
    width:92%;
    margin-left: 1.5%;
  }
  ul li{
    float: left;
    border:0.026rem solid #dcdcdc;
    font-size: 0.373rem;
    color: #444444;
    border-radius: 0.106rem;
    padding: 0.133rem 0.266rem;
    margin: 0.24rem 0 0 0.266rem;
  }
  ul li.bg-blue{
    background: #03aef9;
    border:0.026rem solid #03aef9;
    color: #FFFFFF;
  }

</style>
