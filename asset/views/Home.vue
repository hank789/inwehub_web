<template>
  <div>


    <header>
          <span>InweHub</span>
    </header>

    <div class="mui-content" v-show="!loading"> 
      <!--首页轮播-->
       <div id="slider" class="mui-slider" v-if="notices.length">
        <div class="mui-slider-group mui-slider-loop">
          <!-- 额外增加的一个节点(循环轮播：第一个节点是最后一张轮播) -->
          <div class="mui-slider-item mui-slider-item-duplicate" v-if="notices[notices.length-1]">
            <a href="#">
              <img :src="notices[notices.length-1].img_url">
            </a>
          </div>


          <div class="mui-slider-item" v-for="(notice, index) in notices">
            <a  @tap.stop.prevent="goLink(notice.url)" target="_blank">
              <img :src="notice.img_url">
            </a>
          </div>

          <!-- 额外增加的一个节点(循环轮播：最后一个节点是第一张轮播) -->
          <div class="mui-slider-item mui-slider-item-duplicate" v-if="notices[0]">
            <a href="#">
              <img :src="notices[0].img_url">
            </a>
          </div>
        </div>
        <div class="mui-slider-indicator">
          <div :class="{'mui-indicator':true, 'mui-active':index==0}" v-for="(notice, index) in notices"></div>
        </div>
      </div>
      <!--专业问答 和 成为专家-->
      <div class="home-expert">
      	 <p>
      	 	<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-zhuanyewenda"></use>
			</svg>
      	 	<span>专业问答</span>
      	 	
      	 </p>
      	 <p>
      	 	<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-chengweizhuanjia"></use>
			</svg>
      	 	<span>成为专家</span>	
      	 </p>
      </div>
     
      <!--
      	首页的特惠时间； 点击跳入特惠的详情；
      -->
      <div class="freeAskWrapper" @tap.stop.prevent="$router.pushPlus('/activity/ask?couponExpireAtTime='+couponExpireAtTime)">
        <div class="freeAsk mui-navigate-right">
          <div class="icon"></div>
          <div class="text">你的首问1元特惠还剩<div v-html="couponExpireAtText"></div></div>
        </div>
      </div>
       <!--人物推荐-->
      <div class="home-recommend">
      	<div class="home-card">
      	    <img src="../statics/images/bg_login.png" />
      	    <span>
      	      	郭大红
      	      	<svg class="icon" aria-hidden="true">
				  <use xlink:href="#icon-zhuanjiabiaoji"></use>
				</svg>
      	    </span>
      	    <span>高级品牌助理</span>
      	    <span>查看</span>
      	    <p>
      	    	  <svg class="icon" aria-hidden="true">
				  <use xlink:href="#icon-nianfendise"></use>
			  </svg>
			  <i>12年</i>
      	    </p>
      	</div>
      	<div class="home-card">
      	    <img src="../statics/images/bg_login.png" />
      	    <span>
      	      	郭大红
      	      	<svg class="icon" aria-hidden="true">
				  <use xlink:href="#icon-zhuanjiabiaoji"></use>
				</svg>
      	    </span>
      	    <span>高级品牌助理</span>
      	    <span>查看</span>
      	</div>
      	
     
      </div>
  <!--向你推荐 -->
  <div class="home-reading">
  	  <div class="reader-upper">
  	  	<span>向你推荐</span>
  	  	<span>更多阅读</span>
  	  	<i class="bot"></i>
  	  </div>
  	  <ul>
  	  	<li>
  	  	   <img src="../statics/images/bg_login.png" />
  	  	   <div>
  	  	   	  <p class="mui-ellipsis">大咖在此，SAP物料账里SAP物料SAP物料的弯弯绕</p>
  	  	   	  <p class="mui-ellipsis">自己懒得提问，只想看看SAP物料SAP物料别人的问题</p>
  	  	   	  <p class="mui-ellipsis">作者：严威</p>
  	  	   	  <p class="mui-ellipsis">
  	  	   	  	<span class="home-time">2017/2/14 13:20</span>
  	  	   	  	<span class="home-laud">
  	  	   	  		<svg class="icon" aria-hidden="true">
					  <use xlink:href="#icon-dianzan"></use>
					</svg>
					 <i>10</i>
  	  	   	  	</span>
  	  	   	  </p>
  	  	   </div>
  	  	    <i class="bot"></i>
  	  	</li>
  	  	<li>
  	  	   <img src="../statics/images/bg_login.png" />
  	  	   <div>
  	  	   	  <p class="mui-ellipsis">大咖在此，SAP物料账里SAP物料SAP物料的弯弯绕</p>
  	  	   	  <p class="mui-ellipsis">自己懒得提问，只想看看SAP物料SAP物料别人的问题</p>
  	  	   	  <p class="mui-ellipsis">作者：严威</p>
  	  	   	  <p class="mui-ellipsis">
  	  	   	  	<span class="home-time">2017/2/14 13:20</span>
  	  	   	  	<span class="home-laud">
  	  	   	  		<svg class="icon" aria-hidden="true">
					  <use xlink:href="#icon-dianzan"></use>
					</svg>
					 <i>10</i>
  	  	   	  	</span>
  	  	   	  </p>
  	  	   </div>
  	  	    <i class="bot"></i>
  	  	</li><li>
  	  	   <img src="../statics/images/bg_login.png" />
  	  	   <div>
  	  	   	  <p class="mui-ellipsis">大咖在此，SAP物料账里SAP物料SAP物料的弯弯绕</p>
  	  	   	  <p class="mui-ellipsis">自己懒得提问，只想看看SAP物料SAP物料别人的问题</p>
  	  	   	  <p class="mui-ellipsis">作者：严威</p>
  	  	   	  <p class="mui-ellipsis">
  	  	   	  	<span class="home-time">2017/2/14 13:20</span>
  	  	   	  	<span class="home-laud">
  	  	   	  		<svg class="icon" aria-hidden="true">
					  <use xlink:href="#icon-dianzan"></use>
					</svg>
					 <i>10</i>
  	  	   	  	</span>
  	  	   	  </p>
  	  	   </div>
  	  	    <i class="bot"></i>
  	  	</li>
  	  	<li>
  	  	   <img src="../statics/images/bg_login.png" />
  	  	   <div>
  	  	   	  <p class="mui-ellipsis">大咖在此，SAP物料账里SAP物料SAP物料的弯弯绕</p>
  	  	   	  <p class="mui-ellipsis">自己懒得提问，只想看看SAP物料SAP物料别人的问题</p>
  	  	   	  <p class="mui-ellipsis">作者：严威</p>
  	  	   	  <p class="mui-ellipsis">
  	  	   	  	<span class="home-time">2017/2/14 13:20</span>
  	  	   	  	<span class="home-laud">
  	  	   	  		<svg class="icon" aria-hidden="true">
					  <use xlink:href="#icon-dianzan"></use>
					</svg>
					 <i>10</i>
  	  	   	  	</span>
  	  	   	  </p>
  	  	   </div>
  	  	    <i class="bot"></i>
  	  	</li>
  	  	<li>
  	  	   <img src="../statics/images/bg_login.png" />
  	  	   <div>
  	  	   	  <p class="mui-ellipsis">大咖在此，SAP物料账里SAP物料SAP物料的弯弯绕</p>
  	  	   	  <p class="mui-ellipsis">自己懒得提问，只想看看SAP物料SAP物料别人的问题</p>
  	  	   	  <p class="mui-ellipsis">作者：严威</p>
  	  	   	  <p class="mui-ellipsis">
  	  	   	  	<span class="home-time">2017/2/14 13:20</span>
  	  	   	  	<span class="home-laud">
  	  	   	  		<svg class="icon" aria-hidden="true">
					  <use xlink:href="#icon-dianzan"></use>
					</svg>
					 <i>10</i>
  	  	   	  	</span>
  	  	   	  </p>
  	  	   </div>
  	  	    <i class="bot"></i>
  	  	</li>
  	  </ul>
  </div>
       
  <div class="home-bot">
  	  你已经到达我的底线
  </div>
      


      

     
      
    </div>
  </div>

</template>
<script>

  import {NOTICE, ASK_INFO, ASK_TYPE_SELECT} from '../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../utils/request';
  import {apiRequest} from '../utils/request';
  import {TimeEndText} from '../utils/time';


  const Home = {
    data: () => ({
      recommend_expert_name:'',
      recommend_expert_description:'',
      recommend_expert_uuid:'',
      recommend_expert_uid:'',
      recommend_expert_avatar_url:'',
      recommend_qa:[],
      recommend_expert_is_followed:0,
      firstAsk:false,
      couponExpireAtTime:'',
      notices:[],
      currentTime:parseInt((new Date()).getTime() / 1000),
      loading: true,
      timeAutoEndTimeOut:false,
    }),
    created () {

    },
    activated: function () {
      document.body.style.backgroundColor = '#fff';
      this.getData();
    },
    mounted(){
      showInwehubWebview();
      document.body.style.backgroundColor = '#fff';


    },
    beforeRouteLeave(to, from, next) {
      document.body.style.backgroundColor = '#efeff4';
      next();
    },
    computed: {


    	  //首页倒计时；
      couponExpireAtText(){
          if (this.couponExpireAtTime) {
              return TimeEndText(this.currentTime, this.couponExpireAtTime);
          }
      }
    },
    methods: {
      goLink:function(url){
          if (/http/.test(url)) {
            if (mui.os.plus) {
              mui.openWindow({
                url: 'index.html#/webview/article',
                id: url,
                preload: false,//一定要为false
                createNew:false,
                show: {
                  autoShow: true,
                  aniShow: 'pop-in'
                },
                styles: {
                  popGesture: 'hide'
                },
                waiting: {
                  autoShow: false
                }
              });
            } else {
                window.location.href=url;
            }
          } else {
              this.$router.pushPlus(url);
          }
      },
      closeFreeAskSuccessTemplate:function(){
        var FreeTemplate = document.getElementById('freeAskSuccessTemplate');
        FreeTemplate.style.display = 'none';

        if (mui('.mui-backdrop')[0]) {
          document.body.removeChild(mui('.mui-backdrop')[0]);
        }
      },
      closeFreeAskTemplate:function(){
        var FreeTemplate = document.getElementById('freeAskTemplate');
        FreeTemplate.style.display = 'none';

        if (mui('.mui-backdrop')[0]) {
          document.body.removeChild(mui('.mui-backdrop')[0]);
        }
      },
      getFreeAsk:function(){
        postRequest(`activity/getCoupon`, {'coupon_type':1}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }
          this.getData();
          this.showFreeAskGetSuccess();
        });
      },
      showFreeAskGet:function(){
          var FreeTemplate = document.getElementById('freeAskTemplate');
          FreeTemplate.style.display = 'block';
          var mask = mui.createMask(() => {
            FreeTemplate.style.display = 'none';
          });
          mask.show();//显示遮罩
      },
      showFreeAskGetSuccess:function(){
        this.closeFreeAskTemplate();

        var FreeTemplate = document.getElementById('freeAskSuccessTemplate');
        FreeTemplate.style.display = 'block';
        var mask = mui.createMask(() => {
          FreeTemplate.style.display = 'none';
        });
        mask.show();//显示遮罩
      },
      shareProfessor:function(){
          mui.alert("我们还暂时不建议您分享！");
      },
      collectProfessor:function(){

        postRequest(`follow/user`, {id:this.recommend_expert_uid}).then(response => {
            var code = response.data.code;
            if (code !== 1000) {
              mui.alert(response.data.message);
              return;
            }
            this.recommend_expert_is_followed = !this.recommend_expert_is_followed;
            mui.toast(response.data.data.tip);
        });

      },
      goRecommand: function () {
      //点击推荐专家时，跳转新页面；
        this.expertNav(); 　
        this.$router.push('/expert/recommend')
      },
      goExpert: function () {
        this.expertNav();
        this.$router.push('/expert')
      },
      toggleMenu(){
        mui('.mui-off-canvas-wrap').offCanvas('toggle');
      },
      //当是webapp时调用遮罩层；
      expertNav: function () {
        //如果是os或者plus 调用系统方法；
        if (mui.os.plus) {
          var a = [{
            title: "推荐专家"
          }];
          //调用系统的选择按钮；
          plus.nativeUI.actionSheet({
          	//两个参数；
            cancel: "取消",
            buttons: a
          }, (b) => {
            switch (b.index) {
            	//b.index   参数索引值；
              case 0:
              //关闭选择按钮；
                  break;
              case 1:
              //跳转到推荐专家页面；
                this.$router.pushPlus('/expert/recommend');
                break;
            }
          })
        } else {
        	  // 如果不是调用自己写的方法；
          mui('#expert').popover('toggle');
        }
      },

      timeAutoEnd:function(){
        if (this.timeAutoEndTimeOut) {
            clearTimeout(this.timeAutoEndTimeOut);
        }
        this.timeAutoEndTimeOut = setTimeout(() => {
          this.currentTime = parseInt((new Date()).getTime() / 1000);
          this.timeAutoEnd();
        }, 1000);
      },
      //请求的数据；
      getData: function () {
        var t = this;
        apiRequest(`home`, {}, false).then(response_data => {
          if (response_data === false) {
            return;
          }
          t.recommend_expert_name = response_data.recommend_expert_name;
          t.recommend_expert_description = response_data.recommend_expert_description;
          t.recommend_expert_uuid = response_data.recommend_expert_uuid;
          t.recommend_expert_uid = response_data.recommend_expert_uid;
          t.recommend_expert_avatar_url = response_data.recommend_expert_avatar_url;
          t.recommend_qa = response_data.recommend_qa;
          t.recommend_expert_is_followed = response_data.recommend_expert_is_followed;
          t.firstAsk = response_data.first_ask_ac.show_first_ask_coupon;
          var couponExpireAt = response_data.first_ask_ac.coupon_expire_at;

          if (couponExpireAt) {
             t.couponExpireAtTime = Date.parse(couponExpireAt.replace(/-/g, "/")) / 1000;
             t.timeAutoEnd();
          } else {
             t.couponExpireAtTime = null;
          }

          t.notices = response_data.notices;
          t.loading = 0;
          if (t.firstAsk) {
              t.showFreeAskGet();
          }


          if (t.notices.length) {
            setTimeout(function(){
              var slider = mui("#slider");
              slider.slider({
                interval: 5000
              });
            }, 100);
          }
        });
      },
      getAsks: function () {
        this.getData();
        this.loopAsk = true;
        setTimeout(() => {
          this.loopAsk = false;
        }, 2000)
      }
    }
  };
  export default Home;
</script>

<style scoped>
  /*2.0版本css样式*/
.mui-content{
	overflow-y: auto;
}
 div,span,p,ul,li,i,a{
 	margin: 0;
 	padding: 0;
 	list-style: none;
 }
 
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
 
 
 /*头部样式*/
 header{
    width:100;
	height:44px;
	background: #f3f4f6;
	text-align: center;
	line-height: 44px;
	
 }
 header span{
 	font-family: "PingFangSC";
	font-size: 18px;
	color: #323232;
	font-weight: 600;
 }
/*轮播样式*/	
#slider img{
    height: 136px;
    width: 100%;
  }
/*专业问答 和 成为专家 */
 .home-expert{
    width: 100%;
    height: 70px;
  }
.home-expert p{
	float: left;
	width: 44.5%;
	height: 50px;
	background: #FFFFFF;
	border-radius:4px;
	margin-top: 10px;
	padding-top: 15px;	
}	


.home-expert p:nth-of-type(1){
 margin-left: 4%;	
}

.home-expert p:nth-of-type(2){
   margin-left: 3%;		
}	

.home-expert p svg{
	font-size: 21px;
	margin-left: 38px;
	margin-bottom: -3px;
	
}
    
.home-expert p span{
	font-family: "PingFangSC";
	font-size: 13px;
	color: #444444;
	margin-left: 6px;
}	
	
	
/*一元特惠*/	
  .freeAskWrapper{
    position: relative;
    height:48px;
    
  }
  
  .freeAsk{
    position: absolute;
    left:15px;
    right:15px;
     }
  
  .freeAsk .icon{
    position: absolute;
    width:35px;
    left:-8px;
    top:-5px;
    height:48px;
    display: inline-block;
    background-image: url("../statics/images/icon_xiaoha@2x.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
  .freeAsk .text{
     background: #dcdcdc;
     border:1px #dcdcdc solid;
     border-radius: 50px;
     font-size:14px;
     line-height: 14px;
     color:#323232;
     padding:13px 0px 13px 35px;

  }

  .freeAsk .text div{
    display: inline-block;
  }

  .freeAskGet{
    position: fixed;
    top:50%;
    margin-top:-181px;
    left:10px;
    right:10px;
    background: url("../statics/images/freeAskGet@2x.png") no-repeat center;
    background-size:contain;
    height:262px;
    z-index: 999;
  }	
/*人物推荐*/
.home-recommend{
	width: 100%;
	height: 170px;
	background: #FFFFFF;
	margin-top: 5px;
	text-align: center;
	margin-bottom: 10px;
}
.home-recommend div:nth-of-type(1){
   margin-left:0px;	
}
.home-card{
	width: 114px;
	height: 148px;
	background: #ececee;
	margin-top: 11px;
	float: left;
	margin-left: 10px;	
	position: relative;
}
.home-card img{
	width:50px;
	height: 50px;
	display: block;
	border-radius: 50%;
	margin-top: 10px;
	margin-left: 32px;
} 

.home-card span{
	display: block;
} 
.home-card span:nth-of-type(1){
	font-family: "PingFangSC";
	font-size:14px;
	font-weight: 600;
	color:#444444;
	margin-top: 6px;
}
.home-card span:nth-of-type(1) svg{
	font-size: 20px;
	color: #03aef9;
	margin-bottom: -2px;
	margin-left: -3px;
	
}
.home-card span:nth-of-type(2){
	font-family: "PingFangSC";
	font-size: 12px;
	color: #444444;
}
.home-card span:nth-of-type(3){
	width: 70%;
	height:24px;
	border-radius: 50px;
	border:0.5px solid #03aef9;
	margin-left: 15%;
	margin-top: 6px;
	font-family: "PingFangSC";
	font-size: 14px;
	text-align: center;
	color:#03aef9;
}

.home-card p{
	position: absolute;
	top: -4px;
	right:-1px;
}
.home-card p svg{
	font-size: 30px;
	color:rgb( 180,180,182);

}
.home-card p i{
position: absolute;
top:2px;
right: 3px;
font-family: "PingFangSC";
font-size:10px;
color: #ffffff;
font-style: normal;

}


/*向你推荐*/
.home-reading{
	width: 100%;
	background: #FFFFFF;
}
.reader-upper{
	width: 90%;
	height: 50px;
	margin-left: 5%;
	position: relative;
}

.reader-upper span:nth-of-type(1){
  float: left;
  line-height: 50px;
  font-family: "PingFangSC";
  font-size: 16px;
  color: #444444;
}
.reader-upper span:nth-of-type(2){
  float: right;
  line-height: 50px;
  font-family: "PingFangSC";
  font-size: 13px;
  color: #03aef9;
}

.home-reading ul{
 width: 100%;
}
.home-reading ul li{
  width: 90%;
  height: 125px;
  margin-left: 5%;
  position: relative; 
}
.home-reading ul li:last-child{
   position: static;
}
.home-reading ul li img{
	width: 35%;
	height: 80px;
    float: left;
    margin-top:21px;
    border-radius: 4px;
}
.home-reading ul li div{
    float: left;
    width: 63%;
    margin-left: 2%;
    margin-top: 21px;
	
}

.home-reading ul li div p:nth-of-type(1){
	font-family:"PingFangSC";
	font-size: 14px;
	color: #444444;
}
.home-reading ul li div p:nth-of-type(2){
	font-family: "PingFangSC";
	font-size: 12px;
	color: #808080;
}
.home-reading ul li div p:nth-of-type(3){
	font-family: "PingFangSC";
	font-size:12px;
	color: #808080;
}
.home-time{
  float: left;	
  font-family: "PingFangSC";
  font-size: 12px;
  color: #b4b4b6;
}
.home-laud{
 float: right;
}
.home-laud>svg{
	font-size: 17px;
	Color: #b4b4b6;
}
.home-laud>i{
	font-size:20px;
	font-family: "PingFangSC";
	font-size: 13px;
	color: #03aef9;
    font-style: normal;
}
.home-bot{
	width: 100%;
	height: 140px;
    background: #FFFFFF;
    font-family: "PingFangSC";
	font-size: 14px;
	text-align: center;
	color: #c8c8c8;
}
</style>

