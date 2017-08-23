<template>

  <div>
    <header class="mui-bar mui-bar-nav">
    	  <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">阅读发现</h1>
    </header>

    <div class="mui-content"  >
    	<div class="mui-scroll-wrapper" id="pullrefresh">
    
    <div class="container"  v-if="nothing == 1">
		<svg class="icon" aria-hidden="true">
			<use xlink:href="#icon-zanwushuju"></use>
		</svg>
		<p>暂时还没有数据呀～</p>
	</div>

    		
    		
    		
    		
    <div class="mui-scroll" v-show="nothing == 0">
   	  <ul>
   	  	<li v-for="item in list" @tap.stop.prevent="$router.pushPlus('/discover?url=' + item.data.url)">
   	  		<img :src="item.data.avatar" />  
   	  		<div class="message" v-if="item.read_at == null"></div>
   	  		<p>
   	  			<span class="mui-ellipsis">{{item.data.title}}</span>
   	  			<span class="mui-ellipsis">{{item.data.body}}</span>
   	  			<span class="mui-ellipsis" v-if="item.data.extra_body">{{item.data.extra_body}}</span>
   	  		</p>
   	  		<div class="reader_time">{{item.created_at}}</div>
   	  		<i class="bot"></i>
   	  	</li>
   	  	
   	  </ul>
   	 
   </div>
   </div>
   </div>
   
    
  <div id="statusBarStyle" background="#fff"   bgColor="#fff" mode="dark"></div>
  </div>
</template>

<script>
	import {createAPI, addAccessToken, postRequest} from '../../utils/request';
	const Readbar = {
		data: () => ({
			list:"",
			data:"",
		    loading: true
			
		}),
		created() {
			
		},
		computed: {
	      //动态计算当前的页数；
	      page () {
	        var length = this.list.length;
	        if (length) {
	          return this.list[length - 1].id;
	        }
	        return 0;
	      },
	      //有无数据；
	      nothing () {
	       	 if (this.loading) {
	            return -1;
	         }
	        return this.list.length ? 0 : 1;
	      },
	
	    },
		methods: {
			 //下拉刷新;
		      pulldownRefresh() {
		        setTimeout(() => {
		          this.getPrevList();
		        },1000);
		      },
		      //下拉刷新请求的数据；
	       getPrevList(){
	        postRequest(`notification/readhub_list`, {}).then(response => {
	          var code = response.data.code;
	          //如果请求不成功提示信息 并且返回上一页；
	          if (code !== 1000) {
	            mui.alert(response.data.message);
	            mui.back();
	          }
	          //请求成功的操作
	          response.data.data ={
			  "status": true,
			  "code": 1000,
			  "message": "操作成功",
			   "data":{
			   "current_page":1,//当前页
			   "per_page":10,//每页条数
			   "from": 1,//起始位置
			   "to": 10,//结束位置  
	            "data":[
	            {
		        "id": "f54c537e-f186-4338-8311-aab7870f8ac4",
		        "type": "App\\Notifications\\Readhub\\SubmissionReplied",
		        "data": {
		            "url": "/discover",//通知跳转链接
		            "avatar": "https://intervapp-test.oss-cn-zhangjiakou.aliyuncs.com/media/251/user_origin_15.png",
		            "title": "laoguo回复了文章",//通知标题
		            "body": "测试自写内容辅导费",//通知内容
		            "extra_body": "",//额外内容，为空就不显示
		        },
		        "read_at": 1,//是否已读,null表示未读
		        "created_at": "2017-04-20 12:24:25",//创建时间
		       },
		       {
		        "id": "f54c537e-f186-4338-8311-aab7870f8ac4",
		        "type": "App\\Notifications\\Readhub\\SubmissionReplied",
		        "data": {
		            "url": "/discover",//通知跳转链接
		            "avatar": "https://intervapp-test.oss-cn-zhangjiakou.aliyuncs.com/media/239/user_origin_7.jpg",
		            "title": "郭大红回复",//通知标题
		            "body": "前十四章节已经介绍了如何用django来建立一前十四章节已经介绍了如何用django来建立一前十四章节已经介绍了如何用django来建立一",//通知内容
		            "extra_body": "原文:呵呵哒呵呵哒呵呵哒呵呵哒呵呵哒呵呵哒呵呵哒呵呵哒",//额外内容，为空就不显示
		        },
		        "read_at": null,//是否已读,null表示未读
		        "created_at": "2017-04-20 12:24:25",//创建时间
		       },
		       {
		        "id": "f54c537e-f186-4338-8311-aab7870f8ac4",
		        "type": "App\\Notifications\\Readhub\\SubmissionReplied",
		        "data": {
		            "url": "/discover",//通知跳转链接
		            "avatar": "https://intervapp-test.oss-cn-zhangjiakou.aliyuncs.com/media/247/user_origin_14.png",
		            "title": "laoguo回复了文章",//通知标题
		            "body": "测试自写内容辅导费",//通知内容
		            "extra_body": "原文:呵呵哒",//额外内容，为空就不显示
		        },
		        "read_at": 0,//是否已读,null表示未读
		        "created_at": "2017-04-20 12:24:25",//创建时间
		       }
	          ]}};
	          if (response.data.data) {
	            this.list = response.data.data.data.data;
	            this.data = response.data.data.data;
	              console.log(this.data);
	          }
	          this.loading = 0;
	          mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	        });
	      },
		      pullupRefresh() {
		        setTimeout(() => {
		          this.getNextList();
		        },1000);
		      },
		      getNextList() {
		        postRequest("notification/readhub_list", {page:this.page}).then(response => {
		          var code = response.data.code;
		          if (code !== 1000) {
		            mui.alert(response.data.message);
		            mui.back();
		          }
		        
		       //请求成功的操作
	          response.data.data ={
			  "status": true,
			  "code": 1000,
			  "message": "操作成功",
			   "data":{
			   "current_page":1,//当前页
			   "per_page":10,//每页条数
			   "from": 1,//起始位置
			   "to": 10,//结束位置  
	            "data":[
	             {
		        "id": "f54c537e-f186-4338-8311-aab7870f8ac4",
		        "type": "App\\Notifications\\Readhub\\SubmissionReplied",
		        "data": {
		            "url": "/discover",//通知跳转链接
		            "avatar": "https://intervapp-test.oss-cn-zhangjiakou.aliyuncs.com/media/251/user_origin_15.png",
		            "title": "laoguo回复了文章",//通知标题
		            "body": "测试自写内容辅导费",//通知内容
		            "extra_body": "",//额外内容，为空就不显示
		        },
		        "read_at": 1,//是否已读,null表示未读
		        "created_at": "2017-04-20 12:24:25",//创建时间
		       },
		       {
		        "id": "f54c537e-f186-4338-8311-aab7870f8ac4",
		        "type": "App\\Notifications\\Readhub\\SubmissionReplied",
		        "data": {
		            "url": "/discover",//通知跳转链接
		            "avatar": "https://intervapp-test.oss-cn-zhangjiakou.aliyuncs.com/media/239/user_origin_7.jpg",
		            "title": "郭大红回复",//通知标题
		            "body": "前十四章节已经介绍了如何用django来建立一前十四章节已经介绍了如何用django来建立一前十四章节已经介绍了如何用django来建立一",//通知内容
		            "extra_body": "原文:呵呵哒呵呵哒呵呵哒呵呵哒呵呵哒呵呵哒呵呵哒呵呵哒",//额外内容，为空就不显示
		        },
		        "read_at": null,//是否已读,null表示未读
		        "created_at": "2017-04-20 12:24:25",//创建时间
		       },
		       {
		        "id": "f54c537e-f186-4338-8311-aab7870f8ac4",
		        "type": "App\\Notifications\\Readhub\\SubmissionReplied",
		        "data": {
		            "url": "/discover",//通知跳转链接
		            "avatar": "https://intervapp-test.oss-cn-zhangjiakou.aliyuncs.com/media/247/user_origin_14.png",
		            "title": "laoguo回复了文章",//通知标题
		            "body": "测试自写内容辅导费",//通知内容
		            "extra_body": "原文:呵呵哒",//额外内容，为空就不显示
		        },
		        "read_at": 0,//是否已读,null表示未读
		        "created_at": "2017-04-20 12:24:25",//创建时间
		       }
	            
	          ]}};
		
		
		
		          if (response.data.data.length > 0) {
		            //给请求的数据重新赋值；刷新最新的数据；
		            this.list = response.data.data.data.data;
	                this.data = response.data.data.data;
		          }
		
		          this.loading = 0;
		
		          mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
		
		        });
		      }
	      
		 },
		mounted() {
			//请求数据；
        mui.init({
        pullRefresh: {
          container: '#pullrefresh',
          down: {
            contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: this.pulldownRefresh
          },
          up: {
            contentrefresh: '正在加载...',
            contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: this.getNextList
          }
        }
      });

      //加载页面请求一次；
      this.getPrevList();
	}
		
}
export default Readbar; 
</script>


<style scoped>
.bot {
		position: absolute;
		right: 16px;
		bottom: 0;
		left: 16px;
		height: 1px;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: rgb(220, 220, 220);
	}
/*清掉自带样式*/
div,p,span,i,img,ul,li,a{
	margin: 0;
	padding: 0;
	list-style: none;
	font-style: normal;
}
/*滚动区域*/
.mui-wechat #pullrefresh {
    margin-top: 0px;
}
#pullrefresh {
    margin-top: 45px;
}
/*主体部分样式*/

ul li{
	position: relative;
	padding: 10px 16px 0px 16px;
	overflow: hidden;
}
ul li img{
	width: 12%;
	height: 12%;
	border-radius: 50%;
	float: left;
}
ul li p{
	margin-left: 2%;
	width: 86%;
	float: left;
}
ul li p span{
	display: block;
	margin-bottom: 7px;
	width: 100%;
	
}

ul li p span:nth-of-type(1){
	max-width:160px;
	font-size: 16px;
	color: #444444;
}
ul li p span:nth-of-type(2){
	font-size: 14px;
	color: #444444;

}
ul li p span:nth-of-type(3){
	font-size: 12px;
	color:#808080;

}

.message{
	width: 7px;
	height: 7px;
	background: #f03c69;
	border-radius: 50%;
	position: absolute;
	left: 14%; 
	top: 9%;
}
.reader_time{
	font-size: 12px;
	color: #b4b4b6;
	position: absolute;
	top: 10px;
	right: 16px;

}



/*无数据的样式 */
.container {
		position: absolute;
		top: 40%;
		left: 36%;
	}

	.container svg {
		font-size: 60px;
		margin-left: 23px;
		margin-bottom: 8px;
	}

	.container p {

		font-size: 12px;
		color: #c8c8c8;
	}
</style>
