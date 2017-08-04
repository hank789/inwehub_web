<template>
  <nav class="mui-bar mui-bar-tab footer-bar" v-show='showBottom'>

    <div class="mui-tab-item mui-active" v-if="isHome">
      <svg class="icon oneIcon" aria-hidden="true">
        <use xlink:href="#icon-shouye-hover"></use>
      </svg>
    </div>

    <div class="mui-tab-item" @tap.stop.prevent="$router.push('/home')" v-else>
      <svg class="icon oneIcon" aria-hidden="true">
        <use xlink:href="#icon-shouye"></use>
      </svg>
    </div>

    <div class="mui-tab-item mui-active" @tap.stop.prevent="$router.push('/task')" v-if="isAsk">
      <svg class="icon twoIcon" aria-hidden="true">
        <use xlink:href="#icon-xiaoxi-hover"></use>
      </svg>
      <span class="mui-badge" v-if="taskCount">{{ taskCount }}</span>
    </div>


    <div class="mui-tab-item taskWrapper" @tap.stop.prevent="$router.push('/task')" v-else>
      <svg class="icon twoIcon" aria-hidden="true">
        <use xlink:href="#icon-xiaoxi"></use>
      </svg>
      <span class="mui-badge" v-if="taskCount">{{ taskCount }}</span>
    </div>


    <div class="askWrapper">
      <div class="askPlus" @tap.stop.prevent="$router.push('/ask')"><div class="askImgBg"></div><div class="askImg"></div></div>
      <div class="title">提问</div>
    </div>



    <div class="mui-tab-item mui-active" @tap.stop.prevent="$router.pushPlus('/discover',true,'none')" v-if="isDiscover">
      <svg class="icon threeIcon" aria-hidden="true">
        <use xlink:href="#icon-faxian-hover"></use>
      </svg>
    </div>

    <div class="mui-tab-item" @tap.stop.prevent="$router.pushPlus('/discover',true,'none')" v-else>
      <svg class="icon threeIcon" aria-hidden="true">
        <use xlink:href="#icon-faxian"></use>
      </svg>
    </div>


    <div class="mui-tab-item mui-active" @tap.stop.prevent="$router.pushPlus('/my',true,'none')" v-if="isMy">
      <svg class="icon fourIcon" aria-hidden="true">
        <use xlink:href="#icon-wode-hover"></use>
      </svg>
    </div>

    <div class="mui-tab-item" @tap.stop.prevent="$router.pushPlus('/my',true,'none')" v-else>
      <svg class="icon fourIcon" aria-hidden="true">
        <use xlink:href="#icon-wode"></use>
      </svg>
    </div>



  </nav>
</template>


<script type="text/javascript">
  import {createAPI, addAccessToken, postRequest} from '../utils/request';
  import localEvent from '../stores/localStorage';

  export default {
    data () {
      return {
        isHome: false,
        isAsk: false,
        isMy: false,
        showBottom: true,
        isDiscover: false,
        taskCount: 0
      }
    },
    props: {
    },
    mounted () {
      window.addEventListener('refreshData', (e)=>{
        //执行刷新
        if (this.showBottom) {
          console.log('refresh-app');
          this.getCount();
        }
      });

      window.addEventListener('refreshTaskCount', (e)=>{
        //执行刷新
        if (this.showBottom) {
          console.log('refresh-task-count');

          var taskCount = localEvent.getLocalItem('taskCount');
          if (taskCount.value) {
            this.taskCount = taskCount.value;
          }
        }
      });
    },
    methods:{
      onCountChange(count){
        this.taskCount = count;

        mui.plusReady(function () {

          localEvent.setLocalItem('taskCount', {
            value:count,
          });

          var webv = plus.webview.getWebviewById('index.html#/task');
          if (webv) {
            mui.fire(webv, 'refreshTaskCount');
          }


          webv = plus.webview.getWebviewById('index.html#/home');
          if (webv) {
            mui.fire(webv, 'refreshTaskCount');
          }

          webv = plus.webview.getWebviewById('index.html#/discover');
          if (webv) {
            mui.fire(webv, 'refreshTaskCount');
          }

          webv = plus.webview.getWebviewById('index.html#/my');
          if (webv) {
            mui.fire(webv, 'refreshTaskCount');
          }
        });
      },
      getCount(){
        let UserLoginInfo = localEvent.getLocalItem('UserLoginInfo');
        if (!UserLoginInfo.token) {
          return;
        }

        postRequest(`notification/count`, {}, false).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }
          var taskCount = response.data.data.todo_tasks;
          this.onCountChange(taskCount);
        });
      },
      changeNav(path, fullPath)
      {
        var curPath = path == '' ? 'home' : path;
        this.isHome = this.isAsk = this.isMy = this.isDiscover = false;
        this.showBottom = true;
        mui.each(mui(".mui-tab-item"), function (index, item) {
          item.className = "mui-tab-item";
        });


        switch (fullPath) {
          case '/home':
            this.isHome = true;
            break;
          case '/my':
            this.isMy = true;
            break;
          case '/task':
            this.isAsk = true;
            break;
          case '/discover':
            this.isDiscover = true;
            break;
          default:
            this.showBottom = false;
        }

        if (this.showBottom) {
          this.getCount();
        }
      },


    },
    watch: {
      $route(to) {
        var tmpArr = to.path.split('/');
        var curPath = tmpArr[1] == '' ? 'home' : tmpArr[1];
        this.changeNav(curPath, this.$route.path);
      }
    },
    created(){
      var tmpArr = this.$route.path.split('/')
      var curPath = tmpArr[1] == '' ? 'home' : tmpArr[1];
      this.changeNav(curPath, this.$route.path);
    }
  }
</script>
<style scoped>
  .footer-bar {
    background-color: #f3f4f6;
    box-shadow: none;
  }

  .footer-bar .mui-tab-item .mui-icon{
    width:26px;
    height:26px;
  }


  .footer-bar .mui-tab-item {
    position: relative;
  }

  .footer-bar .mui-active div {
    position: absolute;
    width: 100%;
    bottom: 5px;
  }

  .footer-bar .mui-active .myicon-point-hover {
    width: 3px;
    height: 3px;
    top: 4px;
  }

 .oneIcon{
  font-size:23px;
 }

.twoIcon{
  position: relative;
}
  .twoIcon{
    font-size:23px;
  }
  .twoIcon~.mui-badge{
    position: absolute;
    display: inline-block;
     background: #fa4975;
     color:#fff;
     padding:0px 3px;
    min-width:15px;
    min-height:15px;
    border-radius: 15px;
    line-height: 15px;
  }


  .threeIcon{
    font-size:27px;
  }

  .fourIcon{
    font-size:24px;
  }

  .askWrapper{
    position: relative;
    display: table-cell;
    width:1%;
    text-align: center;
  }

  .askWrapper .askPlus{
    position: relative;
    top:-24px;
    width:100%;
    text-align: center;
    border-radius: 53px;
  }

  .askWrapper .askPlus .askImg{
    position: absolute;
    top:6px;
    left:50%;
    margin-left:-20px;
    width:40px;
    height:40px;
    background: url("../statics/images/home_ask_btn@2x.png") no-repeat;
    background-size: contain;
  }

  .askWrapper .askPlus .askImgBg{
    position: absolute;
    left:50%;
    margin-left:-26.5px;
    width:53px;
    height:53px;
    background:#f3f4f6;
    border-radius: 53px;
  }

  .askWrapper .title{
    position: absolute;
    width:100%;
    bottom:5px;
    color:#808080;
    font-size:12px;
    text-align: center;
  }

  .mui-bar-tab .mui-tab-item.mui-active:before{
    position: absolute;
    content: '';
    background: #03aef9;
    width: 4px;
    height: 4px;
    bottom: 8px;
    left: 50%;
    margin-left: -2px;
    border-radius: 2px;
  }

  .taskWrapper{
    z-index: 777;
  }
</style>

