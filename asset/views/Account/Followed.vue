<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title" v-if="uuid === this.$route.params.uuid">我的关注</h1>
      <h1 class="mui-title" v-else>Ta的关注</h1>
    </header>
    <div class="mui-content absolute">
      <RefreshList
        v-model="list"
        :api="'followed/users'"
        :pageMode="true"
        :prevOtherData="{uuid: this.$route.params.uuid}"
        :nextOtherData="{uuid: this.$route.params.uuid}"
        class="listWrapper">
          <ul class="my-focus">
            <li class="my-focus-item" v-for="(item, index) in list">
              <img :src="item.user_avatar_url"
                   @tap.stop.prevent="$router.pushPlus('/share/resume?id=' + item.uuid + '&goback=1', 'list-detail-page')"/>
              <div  @tap.stop.prevent="$router.pushPlus('/share/resume?id=' + item.uuid + '&goback=1', 'list-detail-page')">
                <p>
                  <span class="mui-ellipsis">{{item.user_name}}</span>
                  <svg class="icon" aria-hidden="true" v-if="item.is_expert === '1'">
                    <use xlink:href="#icon-zhuanjiabiaoji"></use>
                  </svg>
                </p>
                <p class="mui-ellipsis">{{item.description}}</p>
              </div>
              <p class="follows" @tap.stop.prevent="collectProfessor(item)" v-if="!item.is_followed">
                关注Ta</p>
              <p class="follows bgblue" @tap.stop.prevent="collectProfessor(item)" v-else>已关注</p>
              <i class="bot"></i>
            </li>
          </ul>
      </RefreshList>
    </div>
  </div>
</template>
<script>
  import RefreshList from '../../components/refresh/MescrollList.vue'
  import { postRequest } from '../../utils/request'
  import { getLocalUuid } from '../../utils/user'

  export default {
    data () {
      return {
        list: [],
        loading: 1,
        tip: '',
        uuid: getLocalUuid()
      }
    },
    components: {
      RefreshList
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
      refreshPageData () {
        this.uuid = getLocalUuid()
      },
      collectProfessor (item) {
        postRequest(`follow/user`, {
          id: item.uuid
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          item.is_followed = !item.is_followed
          window.mui.toast(response.data.data.tip)
        })
      }
    },
    computed: {},
    created () {},
    mounted () {}
  }
</script>

<style scoped>
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
    padding-left: 0.453rem;
    padding-right: 0.453rem;
  }

  .my-focus-item {
    width: 100%;
    height: 1.68rem;
    list-style: none;
    padding-top: 0.266rem;
    padding-bottom: 0.266rem;
    position: relative;
  }

  .my-focus-item img {
    width: 1.173rem;
    height: 1.173rem;
    border-radius: 50%;
    margin-right: 0.213rem;
    float: left;
  }

  .my-focus-item div {
    float: left;
    width: 60%;
  }

  /*关注和取消*/

  .my-focus-item .follows {
    position: absolute;
    width: 1.653rem;
    height: 0.72rem;
    background: #03aef9;
    border-radius: 1.333rem;
    text-align: center;
    line-height: 0.72rem;
    right: 0;
    top: 0.48rem;
    font-size: 0.373rem;
    color: #ffffff;
  }

  .my-focus-item .bgblue {
    background: #dbdbdb;
    color: #b4b4b6;
  }

  .my-focus-item div p:nth-of-type(1) span {
    display: inline-block;
    max-width: 3.36rem;
    height: 0.533rem;
    overflow: hidden;
    font-family: "PingFangSC";
    font-size: 0.373rem;
    color: #565656;
  }

  .my-focus-item div p:nth-of-type(1) svg {
    font-size: 0.533rem;
    margin-bottom: 0.053rem;
    color: #3c95f9;
  }

  .my-focus-item div p:nth-of-type(2){
    width: 100%;
    height: 0.373rem;
    font-size: 0.346rem;
    color: #b4b4b6;
    line-height: 0.346rem;
  }



  .container {
    position: absolute;
    top: 500%;
    left: 36%;
  }

  .container svg {
    font-size: 1.6rem;
    margin-left: 0.613rem;
    margin-bottom: 0.213rem;
  }

  .container p {
    font-family: "PingFangSC";
    font-size: 0.32rem;
    color: #c8c8c8;
  }

  .descriptionText {
    width:60%;
    font-size: 0.346rem;
    color: #b4b4b6;
  }
</style>
