<template>
  <div>
  <ShortTcutComponent ref="short"></ShortTcutComponent>
  <nav class="mui-bar mui-bar-tab footer-bar" v-show='showBottom'>

    <div class="mui-tab-item mui-active" v-if="isHome">
      <svg class="icon oneIcon" aria-hidden="true">
        <use xlink:href="#icon-shouye-hover"></use>
      </svg>
    </div>

    <div class="mui-tab-item" @tap.stop.prevent="$router.push('/home')" v-else>
      <svg class="icon oneIcon" aria-hidden="true">
        <use xlink:href="#icon-shouye1"></use>
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
        <use xlink:href="#icon-xiaoxi1"></use>
      </svg>
      <span class="mui-badge" v-if="taskCount">{{ taskCount }}</span>
    </div>


    <div class="askWrapper">
      <div class="askPlus"  @tap.stop.prevent="show()"><div class="askImgBg"></div><div class="askImg"></div></div>
    </div>



    <div class="mui-tab-item mui-active" @tap.stop.prevent="$router.push('/discover')" v-if="isDiscover">
      <svg class="icon threeIcon" aria-hidden="true">
        <use xlink:href="#icon-faxian-hover"></use>
      </svg>
    </div>

    <div class="mui-tab-item" @tap.stop.prevent="$router.push('/discover')" v-else>
      <svg class="icon threeIcon" aria-hidden="true">
        <use xlink:href="#icon-faxian1"></use>
      </svg>
    </div>


    <div class="mui-tab-item mui-active" @tap.stop.prevent="$router.push('/my')" v-if="isMy">
      <svg class="icon fourIcon" aria-hidden="true">
        <use xlink:href="#icon-wode-hover"></use>
      </svg>
    </div>

    <div class="mui-tab-item" @tap.stop.prevent="$router.push('/my')" v-else>
      <svg class="icon fourIcon" aria-hidden="true">
        <use xlink:href="#icon-wode1"></use>
      </svg>
    </div>

  </nav>
  
  
   <Share
      ref="ShareBtn"
      :title="shareoption.shareTitle"
      :link="shareoption.shareUrl"
      :content="shareoption.shareContent"
      :imageUrl="shareoption.shareImg"
      :thumbUrl="shareoption.shareImg"
      :hideShareBtn="true"
    ></Share>
  </div>
</template>


<script type="text/javascript">
  import {createAPI, addAccessToken, postRequest} from '../utils/request';
  import localEvent from '../stores/localStorage';
  import {setAppBadgeNumber} from '../utils/notice';
  import { alertMajorReplySuccess,alertMajorAskSuccess,perfectCard,readhubCommenSuccess,expertcertification,alertAskCommunityInteractiveAnswer,alertAskCommunityQuestioningSuccess} from '../utils/dialogList';
  import ShortTcutComponent from '../components/ShortTcut.vue';
  import Share from '../components/Share.vue';
  

  export default {
    data () {
      return {
        isHome: false,
        isAsk: false,
        isMy: false,
        showBottom: true,
        isDiscover: false,
        taskCount: 0,
        shareoption:{
        	   shareUrl: '',
	       shareImg: '',
	       shareContent: '',
	       shareTitle: '',
	       id:""
        },
        ask: {
        answers: [],
        question: {created_at: '', description: ''},
        feedback: {
          rate_star: 0
        },
        timeline: []
      },
      }
    },
    props: {
    },
    mounted () {
    	  this.shareoption.shareImg = 'https://cdn.inwehub.com/system/whiteLogo@2x.png';
    	  //this.$refs.short.show();
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
    	getDetail(successCallback = () => {
               }){

        postRequest(`question/info`, {id: this.shareoption.id}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.toast(response.data.message);
            this.$router.pushPlus('/task', '', true, 'pop-in', 'hide', true);
            return;
          }
          this.ask = response.data.data;

          this.loading = 0;

         
          this.shareoption.shareTitle = '问答|' +  this.ask.question.description;

          var currentUrl = '/askCommunity/interaction/answers/' + this.id;
          this.shareoption.shareUrl = process.env.API_ROOT + 'wechat/oauth?redirect=' + currentUrl;

          var answerNum = this.ask.question.answer_num;

          var followNum = this.ask.question.follow_num;

          this.shareoption.shareContent = '已有' + answerNum  + '个回答、' + followNum + '个关注，点击前往查看详情或参与回答互动';

          successCallback();

        });
      },
    	share(){
         this.$refs.ShareBtn.share();
      },
    	  show(){
    	  	this.$refs.short.show();
    	  },
      listen() {
        var currentUser = localEvent.getLocalItem('UserInfo');
        if (currentUser.user_id && Echo){
          console.log('listen notification');
          // 监听通知事件
          Echo.channel('notification.user.' + currentUser.user_id)
            .notification((notification) => {
              switch (notification.type) {
                case 'App\\Notifications\\AuthenticationUpdated':
                // 专家认证有新的通知;
                    console.log(notification.body);
                    
                   
          
                    break;
              }
              switch (notification.notification_type) {
                case 1:
                    // 通知公告有新的通知
                    break;
                case 2:
                    // 资金有新的通知
                    break;
                case 3:
                    // 任务有新的通知
                    break;
                case 4:
                    // 阅读发现有新的通知
                    break;
                case 5:
                  // 积分变动通知
                  console.log(notification);
                 
                  
                  //notification.add_coins   增加的贡献值
                  //notification.add_credits  增加的成长值
                  switch (notification.integral_action){
                    case 'community_ask':
                        //互动提问
                        //成长值；
                        var ask_coins = notification.add_coins;
                        //贡献alertAskCommunityInteractiveAnswer值；
                        var ask_credits = notification.add_credits;
                        //id
                         var id = notification.source_id;
                           //请求数据；
						  postRequest(`question/info`, {id:id}).then(response => {
								var code = response.data.code;
								if(code !== 1000) {
									mui.alert(response.data.message);
									mui.back();
									return;
								}
						      var ask = response.data.data.question;
						       alertAskCommunityQuestioningSuccess(this,ask_coins,ask_credits,ask); 
						      
						  });         
                        break;
                    case 'community_answer':
                       //互动回答
                       //成长值；
                        var answer_coins = notification.add_coins;
                        //贡献值；
                        var answer_credits = notification.add_credits;
                        //id
                        this.shareoption.id = notification.source_id;
                        this.getDetail();
                        alertAskCommunityInteractiveAnswer(this,answer_coins,answer_credits);  
                        break;
                      case 'expert_valid':
                          //专家认证；
	                      //成长值；
	                      var expert_credits = notification.add_credits;
	                     //贡献值；
	                     var expert_coins = notification.add_coins;
	                     expertcertification(this,expert_credits,expert_coins);
                        break; 
                        case 'readhub_new_comment':
                          //阅读的评论；
	                      //成长值；
	                      var readhub_comment_credits = notification.add_credits;
//	                       readhubCommenSuccess(this,readhub_comment_credits);
                        break; 
                       case 'user_info_complete':
                          //简历完善；
	                      //成长值；
	                      var info_complete_credits = notification.add_credits;
	                      perfectCard(this,info_complete_credits);
                        break;  
                      case 'ask':
                      //成长值；
                        var major_ask_coins = notification.add_coins;
                        //贡献值；
                        var major_ask_credits = notification.add_credits;
                         alertMajorAskSuccess(this,major_ask_credits,major_ask_coins);
                      
                       break; 
                       case 'answer':
                      //成长值；
                        var major_answer_coins = notification.add_coins;
                        //贡献值；
                        var major_answer_credits = notification.add_credits;
                        //id
                        this.shareoption.id = notification.source_id;
                        //修改
                          this.shareoption.shareTitle = '专家回答|' +  this.ask.question.description;

				          var currentUrl = '/askCommunity/major/' + this.id;
				          this.shareoption.shareUrl = process.env.API_ROOT + 'wechat/oauth?redirect=' + currentUrl;
				
				          var answername = this.ask.question.user_name;
				
				
				          this.shareoption.shareContent = '专家' + answername  + '的回答，' + '点击前往围观互动';
                        
                          this.getDetail();
                          alertMajorReplySuccess(this,major_answer_credits,major_answer_coins);
                      
                       break; 
                        case 'rate_answer':
                      //成长值；
                        var major_comment_coins = notification.add_coins;
                        //贡献值；
                        var major_comment_credits = notification.add_credits;
                        //id
                        this.shareoption.id = notification.source_id;
                        //修改
                          this.shareoption.shareTitle = '专家回答|' +  this.ask.question.description;

				          var currentUrl = '/askCommunity/major/' + this.id;
				          this.shareoption.shareUrl = process.env.API_ROOT + 'wechat/oauth?redirect=' + currentUrl;
				
				          var answername = this.ask.question.user_name;
				
				
				          this.shareoption.shareContent = '专家' + answername  + '的回答，' + '点击前往围观互动';
                        
                          this.getDetail();
                          alertMajorReplySuccess(this,major_comment_credits,major_comment_coins);
                      
                       break; 
                    case 'first_ask':
                        //首次提问rate_answer
                        break;
                        default:
                           mui.toast(notification.title + " " + notification.body);
                        
                  }
                  break;
              }
            });
        }
      },
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
          setAppBadgeNumber(taskCount);
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
          case '/inform':
            this.isAsk = true;
            break;
          default:
            this.showBottom = false;
        }

        if (this.showBottom) {
          this.getCount();
        }
      },


    },
    components: {
      ShortTcutComponent,
      Share
    },
    watch: {
      $route(to) {
        var tmpArr = to.path.split('/');
        var curPath = tmpArr[1] == '' ? 'home' : tmpArr[1];
        this.changeNav(curPath, this.$route.path);
      }
    },
    created(){
      this.listen();
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
    top:1px;
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

    background-size: 35px 35px;
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

