<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-if="uuid == this.$route.params.id">关注我的</h1>
      <h1 class="mui-title" v-else>关注Ta的</h1>
    </header>
    <div class="mui-content absolute">
      <div class="mui-scroll-wrapper task-list" id="pullrefresh">
        <div class="mui-scroll">

          <div class="container" v-if="!this.list.length && !loading">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zanwushuju"></use>
            </svg>
            <p>暂时还没有数据呀～</p>
          </div>

          <ul class="my-focus">
            <li class="my-focus-item" v-for="(item, index) in list">
              <img :src="item.user_avatar_url"
                   @tap.stop.prevent="$router.pushPlus('/share/resume?id=' + item.uuid + '&goback=1')"/>
              <div  @tap.stop.prevent="$router.pushPlus('/share/resume?id=' + item.uuid + '&goback=1')">
                <p>
                  <span class="mui-ellipsis">{{item.user_name}}</span>
                  <svg class="icon" aria-hidden="true" v-if="item.is_expert =='1'">
                    <use xlink:href="#icon-zhuanjiabiaoji"></use>
                  </svg>
                </p>
                <p class="mui-ellipsis">{{item.description}}</p>
              </div>
              <p class="follows" @tap.stop.prevent="collectProfessor(item.uuid,index)" v-if="!item.is_following">
                关注Ta</p>
              <p class="follows bgblue" @tap.stop.prevent="collectProfessor(item.uuid,index)" v-else>已关注</p>
              <i class="bot"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import { postRequest } from '../../utils/request'
  import localEvent from '../../stores/localStorage'
  const currentUser = localEvent.getLocalItem('UserInfo')

  export default {
    data () {
      return {
        list: [],
        loading: 1,
        tip: '',
        uuid: currentUser.uuid
      }
    },
    methods: {
      initData () {
        this.pulldownRefresh()
      },
      pulldownRefresh () {
        setTimeout(() => {
          this.getPrevList()
        }, 1000)
      },
      pullupRefresh () {
        setTimeout(() => {
          this.getNextList()
        }, 1000)
      },
      getPrevList () {
        postRequest('follow_my/users', {
          uuid: this.$route.params.id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data.length > 0) {
            this.list = response.data.data
          }
          this.loading = 0
          window.mui('#pullrefresh').pullRefresh().endPulldownToRefresh() // refresh completed
        })
      },
      getNextList () {
        postRequest('follow_my/users', {
          bottom_id: this.bottomId,
          uuid: this.$route.params.id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data.length > 0) {
            this.list = this.list.concat(response.data.data)
          }
          this.loading = 0
          window.mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
        })
      },
      collectProfessor (id, index) {
        postRequest(`follow/user`, {
          id: id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          console.log(this.list[index].is_following)
          this.list[index].is_following = !this.list[index].is_following
          window.mui.toast(response.data.data.tip)
        })
      }
    },
    computed: {
      nothing () {
        if (this.tip === '关注成功') {
          return 1
        }
        return 0
      },
      bottomId () {
        var length = this.list.length
        if (length) {
          return this.list[length - 1].id
        }
        return 0
      }
    },
    created () {
      // showInwehubWebview();
    },
    mounted () {
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-collect')
        this.initData()
      })
      window.mui.init({
        pullRefresh: {
          container: '#pullrefresh',
          down: {
            callback: this.pulldownRefresh
          },
          up: {
            contentdown: '下拉可以刷新',
            contentover: '释放立即刷新',
            contentrefresh: '正在刷新...',
            callback: this.pullupRefresh
          }
        }
      })
      this.getPrevList()
      console.error()
    }
  }
</script>

<style scoped>
  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  p {
    margin: 0;
    padding: 0;
  }

  .mui-content {
    background: #FFFFFF;
  }

  .my-focus {
    margin: 0;
    padding: 0;
    list-style: none;
    padding-left: 17px;
    padding-right: 17px;
  }

  .my-focus-item {
    width: 100%;
    height: 63px;
    list-style: none;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
  }

  .my-focus-item img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    margin-right: 8px;
    float: left;
  }

  .my-focus-item div {
    float: left;
    width: 60%;
  }

  /*关注和取消*/

  .my-focus-item .follows {
    position: absolute;
    width: 62px;
    height: 27px;
    border: 1px solid #03aef9;
    border-radius: 50px;
    text-align: center;
    line-height: 27px;
    right: 0;
    top: 18px;
    font-size: 14px;
    color: #03aef9;
  }

  .my-focus-item .bgblue {
    background: #03aef9;
    color: #FFFFFF;
  }

  .my-focus-item div p:nth-of-type(1) span {
    display: inline-block;
    max-width: 126px;
    height: 20px;
    overflow: hidden;
    font-family: "PingFangSC";
    font-size: 14px;
    color: #565656;
  }

  .my-focus-item div p:nth-of-type(1) svg {
    font-size: 20px;
    margin-bottom: 2px;
    color: #3c95f9;
  }

  .my-focus-item div p:nth-of-type(2){
    width: 100%;
    height: 14px;
    font-size: 13px;
    color: #b4b4b6;
    line-height: 13px;
  }



  .container {
    position: absolute;
    top: 500%;
    left: 36%;
  }

  .container svg {
    font-size: 60px;
    margin-left: 23px;
    margin-bottom: 8px;
  }

  .container p {
    font-family: "PingFangSC";
    font-size: 12px;
    color: #c8c8c8;
  }

  .descriptionText {
    width:60%;
    font-size: 13px;
    color: #b4b4b6;
  }
</style>
